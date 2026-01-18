import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { crewService } from '../services/authService'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import './PageStyles.css'

function Crews() {
  const { canEdit, canDelete } = useAuth()
  const [crews, setCrews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedCrew, setSelectedCrew] = useState(null)
  const [crewMembers, setCrewMembers] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [addForm, setAddForm] = useState({
    crewId: '',
    crewName: '',
    crewType: 'cabin'
  })

  useEffect(() => {
    loadCrews()
  }, [page])

  const loadCrews = async () => {
    setLoading(true)
    try {
      const data = await crewService.getCrews(page, 20)
      setCrews(data.crews || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalItems || 0)
    } catch (error) {
      console.error('Failed to load crews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = async (crew) => {
    setSelectedCrew(crew)
    try {
      const data = await crewService.getCrew(crew.crewId)
      setCrewMembers(data.members || [])
    } catch (error) {
      console.error('Failed to load crew members:', error)
      setCrewMembers([])
    }
  }

  const handleEdit = (crew) => {
    setEditForm({
      crewName: crew.crewName || '',
      crewType: crew.crewType || 'cabin'
    })
    setSelectedCrew(crew)
    setShowEditModal(true)
  }

  const handleSave = async () => {
    try {
      await crewService.updateCrew(selectedCrew.crewId, editForm)
      setShowEditModal(false)
      setSelectedCrew(null)
      loadCrews()
    } catch (error) {
      console.error('Failed to update crew:', error)
      alert('Failed to update crew')
    }
  }

  const handleAdd = async () => {
    try {
      const crewData = {
        ...addForm,
        crewId: parseInt(addForm.crewId) || 0
      }
      await crewService.createCrew(crewData)
      setShowAddModal(false)
      setAddForm({
        crewId: '',
        crewName: '',
        crewType: 'cabin'
      })
      loadCrews()
    } catch (error) {
      console.error('Failed to add crew:', error)
      alert('Failed to add crew')
    }
  }

  const handleDelete = async (crew) => {
    if (!window.confirm(`Are you sure you want to delete crew "${crew.crewName}"?`)) {
      return
    }
    try {
      await crewService.deleteCrew(crew.crewId)
      setSelectedCrew(null)
      loadCrews()
    } catch (error) {
      console.error('Failed to delete crew:', error)
      alert('Failed to delete crew. Make sure there are no crew members assigned.')
    }
  }

  const getTypeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'cockpit':
        return 'status-admin'
      case 'cabin':
        return 'status-manager'
      default:
        return 'status-pending'
    }
  }

  const columns = [
    { key: 'crewId', label: 'ID', width: '80px' },
    { key: 'crewName', label: 'Name', width: '200px' },
    { 
      key: 'crewType', 
      label: 'Type', 
      width: '120px',
      render: (val) => (
        <span className={`status-badge ${getTypeClass(val)}`}>
          {val || 'Unknown'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      render: (_, crew) => (
        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
          {canEdit() && (
            <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(crew)}>
              Edit
            </button>
          )}
          {canDelete() && (
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(crew)}>
              Delete
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Crews</h1>
          <p>{totalItems.toLocaleString()} crews total</p>
        </div>
        {canEdit() && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Crew</button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={crews} 
        loading={loading}
        onRowClick={handleRowClick}
      />

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* View Details Modal */}
      {selectedCrew && !showEditModal && (
        <div className="modal-overlay" onClick={() => setSelectedCrew(null)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crew Details</h2>
              <button className="close-btn" onClick={() => setSelectedCrew(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Crew ID</label>
                  <span>{selectedCrew.crewId}</span>
                </div>
                <div className="detail-item">
                  <label>Name</label>
                  <span>{selectedCrew.crewName}</span>
                </div>
                <div className="detail-item">
                  <label>Type</label>
                  <span className={`status-badge ${getTypeClass(selectedCrew.crewType)}`}>
                    {selectedCrew.crewType}
                  </span>
                </div>
              </div>
              
              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Crew Members ({crewMembers.length})</h3>
              {crewMembers.length > 0 ? (
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crewMembers.map(member => (
                      <tr key={member.crewMemberId}>
                        <td>{member.crewMemberId}</td>
                        <td>{member.firstName} {member.lastName}</td>
                        <td>{member.role}</td>
                        <td>
                          <span className={`status-badge ${member.status === 'active' ? 'status-active' : 'status-pending'}`}>
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No crew members assigned</p>
              )}
            </div>
            <div className="modal-footer">
              {canEdit() && (
                <button className="btn btn-secondary" onClick={() => handleEdit(selectedCrew)}>Edit</button>
              )}
              {canDelete() && (
                <button className="btn btn-danger" onClick={() => handleDelete(selectedCrew)}>Delete</button>
              )}
              <button className="btn" onClick={() => setSelectedCrew(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Crew</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Crew Name</label>
                  <input
                    type="text"
                    value={editForm.crewName}
                    onChange={(e) => setEditForm({...editForm, crewName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Crew Type</label>
                  <select
                    value={editForm.crewType}
                    onChange={(e) => setEditForm({...editForm, crewType: e.target.value})}
                  >
                    <option value="cabin">Cabin Crew</option>
                    <option value="cockpit">Cockpit Crew</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              <button className="btn" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Crew</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Crew ID *</label>
                  <input
                    type="number"
                    value={addForm.crewId}
                    onChange={(e) => setAddForm({...addForm, crewId: e.target.value})}
                    placeholder="Unique crew ID"
                  />
                </div>
                <div className="form-group">
                  <label>Crew Name</label>
                  <input
                    type="text"
                    value={addForm.crewName}
                    onChange={(e) => setAddForm({...addForm, crewName: e.target.value})}
                    placeholder="e.g., Alpha Team"
                  />
                </div>
                <div className="form-group">
                  <label>Crew Type</label>
                  <select
                    value={addForm.crewType}
                    onChange={(e) => setAddForm({...addForm, crewType: e.target.value})}
                  >
                    <option value="cabin">Cabin Crew</option>
                    <option value="cockpit">Cockpit Crew</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleAdd}>Add Crew</button>
              <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Crews
