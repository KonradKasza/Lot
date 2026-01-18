import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { crewMemberService, crewService } from '../services/authService'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import './PageStyles.css'

function CrewMembers() {
  const { canEdit, canDelete } = useAuth()
  const [crewMembers, setCrewMembers] = useState([])
  const [crews, setCrews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedMember, setSelectedMember] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [addForm, setAddForm] = useState({
    crewMemberId: '',
    crewId: '',
    firstName: '',
    lastName: '',
    role: 'Flight Attendant',
    licenseNumber: '',
    employmentDate: '',
    status: 'active'
  })

  useEffect(() => {
    loadCrewMembers()
    loadCrews()
  }, [page])

  const loadCrewMembers = async () => {
    setLoading(true)
    try {
      const data = await crewMemberService.getCrewMembers(page, 20)
      setCrewMembers(data.crewMembers || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalItems || 0)
    } catch (error) {
      console.error('Failed to load crew members:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCrews = async () => {
    try {
      const data = await crewService.getCrews(0, 100)
      setCrews(data.crews || [])
    } catch (error) {
      console.error('Failed to load crews:', error)
    }
  }

  const handleEdit = (member) => {
    setEditForm({
      crewId: member.crewId || '',
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      role: member.role || 'Flight Attendant',
      licenseNumber: member.licenseNumber || '',
      employmentDate: member.employmentDate || '',
      status: member.status || 'active'
    })
    setSelectedMember(member)
    setShowEditModal(true)
  }

  const handleSave = async () => {
    try {
      await crewMemberService.updateCrewMember(selectedMember.crewMemberId, editForm)
      setShowEditModal(false)
      setSelectedMember(null)
      loadCrewMembers()
    } catch (error) {
      console.error('Failed to update crew member:', error)
      alert('Failed to update crew member')
    }
  }

  const handleAdd = async () => {
    try {
      const memberData = {
        ...addForm,
        crewMemberId: parseInt(addForm.crewMemberId) || 0,
        crewId: parseInt(addForm.crewId) || null
      }
      await crewMemberService.createCrewMember(memberData)
      setShowAddModal(false)
      setAddForm({
        crewMemberId: '',
        crewId: '',
        firstName: '',
        lastName: '',
        role: 'Flight Attendant',
        licenseNumber: '',
        employmentDate: '',
        status: 'active'
      })
      loadCrewMembers()
    } catch (error) {
      console.error('Failed to add crew member:', error)
      alert('Failed to add crew member')
    }
  }

  const handleDelete = async (member) => {
    if (!window.confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
      return
    }
    try {
      await crewMemberService.deleteCrewMember(member.crewMemberId)
      setSelectedMember(null)
      loadCrewMembers()
    } catch (error) {
      console.error('Failed to delete crew member:', error)
      alert('Failed to delete crew member')
    }
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active'
      case 'inactive':
      case 'on_leave':
        return 'status-pending'
      case 'retired':
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  const getRoleClass = (role) => {
    if (role?.toLowerCase().includes('captain') || role?.toLowerCase().includes('pilot')) {
      return 'status-admin'
    }
    if (role?.toLowerCase().includes('officer') || role?.toLowerCase().includes('co-pilot')) {
      return 'status-manager'
    }
    return 'status-worker'
  }

  const columns = [
    { key: 'crewMemberId', label: 'ID', width: '70px' },
    { 
      key: 'name', 
      label: 'Name', 
      width: '180px',
      render: (_, member) => `${member.firstName} ${member.lastName}`
    },
    { key: 'crewId', label: 'Crew ID', width: '80px' },
    { 
      key: 'role', 
      label: 'Role', 
      width: '150px',
      render: (val) => (
        <span className={`status-badge ${getRoleClass(val)}`}>
          {val || 'Unknown'}
        </span>
      )
    },
    { key: 'licenseNumber', label: 'License #', width: '120px' },
    { key: 'employmentDate', label: 'Employed', width: '110px' },
    { 
      key: 'status', 
      label: 'Status', 
      width: '100px',
      render: (val) => (
        <span className={`status-badge ${getStatusClass(val)}`}>
          {val || 'Unknown'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      render: (_, member) => (
        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
          {canEdit() && (
            <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(member)}>
              Edit
            </button>
          )}
          {canDelete() && (
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(member)}>
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
          <h1>Crew Members</h1>
          <p>{totalItems.toLocaleString()} crew members total</p>
        </div>
        {canEdit() && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Crew Member</button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={crewMembers} 
        loading={loading}
        onRowClick={setSelectedMember}
      />

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* View Details Modal */}
      {selectedMember && !showEditModal && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Crew Member Details</h2>
              <button className="close-btn" onClick={() => setSelectedMember(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Member ID</label>
                  <span>{selectedMember.crewMemberId}</span>
                </div>
                <div className="detail-item">
                  <label>Full Name</label>
                  <span>{selectedMember.firstName} {selectedMember.lastName}</span>
                </div>
                <div className="detail-item">
                  <label>Crew ID</label>
                  <span>{selectedMember.crewId}</span>
                </div>
                <div className="detail-item">
                  <label>Role</label>
                  <span className={`status-badge ${getRoleClass(selectedMember.role)}`}>
                    {selectedMember.role}
                  </span>
                </div>
                <div className="detail-item">
                  <label>License Number</label>
                  <span>{selectedMember.licenseNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Employment Date</label>
                  <span>{selectedMember.employmentDate}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span className={`status-badge ${getStatusClass(selectedMember.status)}`}>
                    {selectedMember.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {canEdit() && (
                <button className="btn btn-secondary" onClick={() => handleEdit(selectedMember)}>Edit</button>
              )}
              {canDelete() && (
                <button className="btn btn-danger" onClick={() => handleDelete(selectedMember)}>Delete</button>
              )}
              <button className="btn" onClick={() => setSelectedMember(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Crew Member</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Crew ID</label>
                    <select
                      value={editForm.crewId}
                      onChange={(e) => setEditForm({...editForm, crewId: parseInt(e.target.value) || null})}
                    >
                      <option value="">Select Crew</option>
                      {crews.map(crew => (
                        <option key={crew.crewId} value={crew.crewId}>
                          {crew.crewId} - {crew.crewName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    >
                      <option value="Captain">Captain</option>
                      <option value="First Officer">First Officer</option>
                      <option value="Flight Attendant">Flight Attendant</option>
                      <option value="Purser">Purser</option>
                      <option value="Flight Engineer">Flight Engineer</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>License Number</label>
                    <input
                      type="text"
                      value={editForm.licenseNumber}
                      onChange={(e) => setEditForm({...editForm, licenseNumber: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Employment Date</label>
                    <input
                      type="date"
                      value={editForm.employmentDate}
                      onChange={(e) => setEditForm({...editForm, employmentDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                    <option value="retired">Retired</option>
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
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Crew Member</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Member ID *</label>
                    <input
                      type="number"
                      value={addForm.crewMemberId}
                      onChange={(e) => setAddForm({...addForm, crewMemberId: e.target.value})}
                      placeholder="Unique member ID"
                    />
                  </div>
                  <div className="form-group">
                    <label>Crew</label>
                    <select
                      value={addForm.crewId}
                      onChange={(e) => setAddForm({...addForm, crewId: e.target.value})}
                    >
                      <option value="">Select Crew</option>
                      {crews.map(crew => (
                        <option key={crew.crewId} value={crew.crewId}>
                          {crew.crewId} - {crew.crewName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={addForm.firstName}
                      onChange={(e) => setAddForm({...addForm, firstName: e.target.value})}
                      placeholder="First name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={addForm.lastName}
                      onChange={(e) => setAddForm({...addForm, lastName: e.target.value})}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={addForm.role}
                      onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                    >
                      <option value="Captain">Captain</option>
                      <option value="First Officer">First Officer</option>
                      <option value="Flight Attendant">Flight Attendant</option>
                      <option value="Purser">Purser</option>
                      <option value="Flight Engineer">Flight Engineer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input
                      type="text"
                      value={addForm.licenseNumber}
                      onChange={(e) => setAddForm({...addForm, licenseNumber: e.target.value})}
                      placeholder="e.g., PL-ATPL-12345"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Employment Date</label>
                    <input
                      type="date"
                      value={addForm.employmentDate}
                      onChange={(e) => setAddForm({...addForm, employmentDate: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={addForm.status}
                      onChange={(e) => setAddForm({...addForm, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleAdd}>Add Crew Member</button>
              <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrewMembers
