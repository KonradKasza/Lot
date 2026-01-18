import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { airplaneService } from '../services/authService'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import './PageStyles.css'

function Airplanes() {
  const { canEdit, canDelete } = useAuth()
  const [airplanes, setAirplanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedAirplane, setSelectedAirplane] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [addForm, setAddForm] = useState({
    samolotId: '',
    numerSamolotu: '',
    model: '',
    producent: '',
    liczbaMiejsc: 0,
    rokProdukcji: new Date().getFullYear(),
    statusTechniczny: 'operational'
  })

  useEffect(() => {
    loadAirplanes()
  }, [page])

  const loadAirplanes = async () => {
    setLoading(true)
    try {
      const data = await airplaneService.getAirplanes(page, 20)
      setAirplanes(data.airplanes || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalItems || 0)
    } catch (error) {
      console.error('Failed to load airplanes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (airplane) => {
    setEditForm({
      numerSamolotu: airplane.numerSamolotu || '',
      model: airplane.model || '',
      producent: airplane.producent || '',
      liczbaMiejsc: airplane.liczbaMiejsc || 0,
      rokProdukcji: airplane.rokProdukcji || new Date().getFullYear(),
      statusTechniczny: airplane.statusTechniczny || 'operational'
    })
    setSelectedAirplane(airplane)
    setShowEditModal(true)
  }

  const handleSave = async () => {
    try {
      await airplaneService.updateAirplane(selectedAirplane.samolotId, editForm)
      setShowEditModal(false)
      setSelectedAirplane(null)
      loadAirplanes()
    } catch (error) {
      console.error('Failed to update airplane:', error)
      alert('Failed to update airplane')
    }
  }

  const handleAdd = async () => {
    try {
      await airplaneService.createAirplane(addForm)
      setShowAddModal(false)
      setAddForm({
        samolotId: '',
        numerSamolotu: '',
        model: '',
        producent: '',
        liczbaMiejsc: 0,
        rokProdukcji: new Date().getFullYear(),
        statusTechniczny: 'operational'
      })
      loadAirplanes()
    } catch (error) {
      console.error('Failed to add airplane:', error)
      alert('Failed to add airplane')
    }
  }

  const handleDelete = async (airplane) => {
    if (!window.confirm(`Are you sure you want to delete airplane ${airplane.producent} ${airplane.model}?`)) {
      return
    }
    try {
      await airplaneService.deleteAirplane(airplane.samolotId)
      loadAirplanes()
    } catch (error) {
      console.error('Failed to delete airplane:', error)
      alert('Failed to delete airplane')
    }
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational':
        return 'status-completed'
      case 'maintenance':
        return 'status-pending'
      case 'retired':
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  const columns = [
    { 
      key: 'samolotId', 
      label: 'ID', 
      width: '100px',
      render: (val) => val ? val.substring(0, 10) + '...' : '-'
    },
    { key: 'numerSamolotu', label: 'Registration', width: '100px' },
    { key: 'producent', label: 'Manufacturer', width: '120px' },
    { key: 'model', label: 'Model', width: '100px' },
    { key: 'liczbaMiejsc', label: 'Seats', width: '80px' },
    { key: 'rokProdukcji', label: 'Year', width: '80px' },
    { 
      key: 'statusTechniczny', 
      label: 'Status', 
      width: '110px',
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
      render: (_, airplane) => (
        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
          {canEdit() && (
            <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(airplane)}>
              Edit
            </button>
          )}
          {canDelete() && (
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(airplane)}>
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
          <h1>Airplanes</h1>
          <p>{totalItems.toLocaleString()} airplanes total</p>
        </div>
        {canEdit() && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Airplane</button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={airplanes} 
        loading={loading}
        onRowClick={setSelectedAirplane}
      />

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* View Details Modal */}
      {selectedAirplane && !showEditModal && (
        <div className="modal-overlay" onClick={() => setSelectedAirplane(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Airplane Details</h2>
              <button className="close-btn" onClick={() => setSelectedAirplane(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Airplane ID</label>
                  <span style={{ wordBreak: 'break-all' }}>{selectedAirplane.samolotId}</span>
                </div>
                <div className="detail-item">
                  <label>Registration Number</label>
                  <span>{selectedAirplane.numerSamolotu}</span>
                </div>
                <div className="detail-item">
                  <label>Manufacturer</label>
                  <span>{selectedAirplane.producent}</span>
                </div>
                <div className="detail-item">
                  <label>Model</label>
                  <span>{selectedAirplane.model}</span>
                </div>
                <div className="detail-item">
                  <label>Seating Capacity</label>
                  <span>{selectedAirplane.liczbaMiejsc} passengers</span>
                </div>
                <div className="detail-item">
                  <label>Production Year</label>
                  <span>{selectedAirplane.rokProdukcji}</span>
                </div>
                <div className="detail-item">
                  <label>Technical Status</label>
                  <span className={`status-badge ${getStatusClass(selectedAirplane.statusTechniczny)}`}>
                    {selectedAirplane.statusTechniczny}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {canEdit() && (
                <button className="btn btn-secondary" onClick={() => handleEdit(selectedAirplane)}>
                  Edit
                </button>
              )}
              {canDelete() && (
                <button className="btn btn-danger" onClick={() => handleDelete(selectedAirplane)}>
                  Delete
                </button>
              )}
              <button className="btn" onClick={() => setSelectedAirplane(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Airplane</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    value={editForm.numerSamolotu}
                    onChange={(e) => setEditForm({...editForm, numerSamolotu: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Manufacturer</label>
                  <input
                    type="text"
                    value={editForm.producent}
                    onChange={(e) => setEditForm({...editForm, producent: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    value={editForm.model}
                    onChange={(e) => setEditForm({...editForm, model: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Seating Capacity</label>
                  <input
                    type="number"
                    value={editForm.liczbaMiejsc}
                    onChange={(e) => setEditForm({...editForm, liczbaMiejsc: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Production Year</label>
                  <input
                    type="number"
                    value={editForm.rokProdukcji}
                    onChange={(e) => setEditForm({...editForm, rokProdukcji: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Technical Status</label>
                  <select
                    value={editForm.statusTechniczny}
                    onChange={(e) => setEditForm({...editForm, statusTechniczny: e.target.value})}
                  >
                    <option value="operational">Operational</option>
                    <option value="maintenance">Maintenance</option>
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Airplane</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Airplane ID *</label>
                  <input
                    type="text"
                    value={addForm.samolotId}
                    onChange={(e) => setAddForm({...addForm, samolotId: e.target.value})}
                    placeholder="Unique airplane identifier"
                  />
                </div>
                <div className="form-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    value={addForm.numerSamolotu}
                    onChange={(e) => setAddForm({...addForm, numerSamolotu: e.target.value})}
                    placeholder="e.g., SP-LRA"
                  />
                </div>
                <div className="form-group">
                  <label>Manufacturer</label>
                  <input
                    type="text"
                    value={addForm.producent}
                    onChange={(e) => setAddForm({...addForm, producent: e.target.value})}
                    placeholder="e.g., Boeing, Airbus"
                  />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    value={addForm.model}
                    onChange={(e) => setAddForm({...addForm, model: e.target.value})}
                    placeholder="e.g., 737-800, A320"
                  />
                </div>
                <div className="form-group">
                  <label>Seating Capacity</label>
                  <input
                    type="number"
                    value={addForm.liczbaMiejsc}
                    onChange={(e) => setAddForm({...addForm, liczbaMiejsc: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Production Year</label>
                  <input
                    type="number"
                    value={addForm.rokProdukcji}
                    onChange={(e) => setAddForm({...addForm, rokProdukcji: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Technical Status</label>
                  <select
                    value={addForm.statusTechniczny}
                    onChange={(e) => setAddForm({...addForm, statusTechniczny: e.target.value})}
                  >
                    <option value="operational">Operational</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleAdd}>Add Airplane</button>
              <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Airplanes
