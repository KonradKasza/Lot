import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { airportService } from '../services/authService'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import './PageStyles.css'

function Airports() {
  const { canEdit, canDelete, isAdmin } = useAuth()
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedAirport, setSelectedAirport] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadAirports()
  }, [page])

  const loadAirports = async () => {
    setLoading(true)
    try {
      const data = await airportService.getAirports(page, 20, search)
      setAirports(data.airports || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalItems || 0)
    } catch (error) {
      console.error('Failed to load airports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    loadAirports()
  }

  const handleAdd = () => {
    setEditForm({
      airportId: '',
      airportName: '',
      city: '',
      country: '',
      state: '',
      latitude: '',
      longitude: ''
    })
    setShowAddModal(true)
  }

  const handleEdit = (airport) => {
    setEditForm({
      airportId: airport.airportId || '',
      airportName: airport.airportName || '',
      city: airport.city || '',
      country: airport.country || '',
      state: airport.state || '',
      latitude: airport.latitude || '',
      longitude: airport.longitude || ''
    })
    setSelectedAirport(airport)
    setShowEditModal(true)
  }

  const handleSaveNew = async () => {
    try {
      await airportService.createAirport(editForm)
      setShowAddModal(false)
      loadAirports()
    } catch (error) {
      console.error('Failed to create airport:', error)
      alert('Failed to create airport')
    }
  }

  const handleSave = async () => {
    try {
      await airportService.updateAirport(selectedAirport.airportId, editForm)
      setShowEditModal(false)
      setSelectedAirport(null)
      loadAirports()
    } catch (error) {
      console.error('Failed to update airport:', error)
      alert('Failed to update airport')
    }
  }

  const handleDelete = async (airport) => {
    if (!window.confirm(`Are you sure you want to delete ${airport.airportName} (${airport.airportId})?`)) {
      return
    }
    try {
      await airportService.deleteAirport(airport.airportId)
      loadAirports()
    } catch (error) {
      console.error('Failed to delete airport:', error)
      alert('Failed to delete airport')
    }
  }

  const columns = [
    { key: 'airportId', label: 'Code', width: '80px' },
    { key: 'airportName', label: 'Airport Name', width: '200px' },
    { key: 'city', label: 'City', width: '120px' },
    { key: 'country', label: 'Country', width: '120px' },
    { key: 'state', label: 'State', width: '100px' },
    { 
      key: 'latitude', 
      label: 'Lat', 
      width: '80px',
      render: (val) => val ? Number(val).toFixed(2) : '-'
    },
    { 
      key: 'longitude', 
      label: 'Long', 
      width: '80px',
      render: (val) => val ? Number(val).toFixed(2) : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      render: (_, airport) => (
        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
          {canEdit() && (
            <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(airport)}>
              Edit
            </button>
          )}
          {canDelete() && (
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(airport)}>
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
          <h1>Airports</h1>
          <p>{totalItems.toLocaleString()} airports total</p>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={handleAdd}>+ Add Airport</button>
        )}
      </div>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      <DataTable 
        columns={columns} 
        data={airports} 
        loading={loading}
        onRowClick={setSelectedAirport}
      />

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* View Details Modal */}
      {selectedAirport && !showEditModal && (
        <div className="modal-overlay" onClick={() => setSelectedAirport(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Airport Details</h2>
              <button className="close-btn" onClick={() => setSelectedAirport(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Airport Code</label>
                  <span className="code-badge">{selectedAirport.airportId}</span>
                </div>
                <div className="detail-item">
                  <label>Airport Name</label>
                  <span>{selectedAirport.airportName}</span>
                </div>
                <div className="detail-item">
                  <label>City</label>
                  <span>{selectedAirport.city}</span>
                </div>
                <div className="detail-item">
                  <label>Country</label>
                  <span>{selectedAirport.country}</span>
                </div>
                <div className="detail-item">
                  <label>State</label>
                  <span>{selectedAirport.state || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Coordinates</label>
                  <span>{selectedAirport.latitude ? Number(selectedAirport.latitude).toFixed(4) : '-'}, {selectedAirport.longitude ? Number(selectedAirport.longitude).toFixed(4) : '-'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {canEdit() && (
                <button className="btn btn-secondary" onClick={() => handleEdit(selectedAirport)}>
                  Edit
                </button>
              )}
              {canDelete() && (
                <button className="btn btn-danger" onClick={() => handleDelete(selectedAirport)}>
                  Delete
                </button>
              )}
              <button className="btn" onClick={() => setSelectedAirport(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Airport</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Airport Code</label>
                  <input
                    type="text"
                    value={editForm.airportId}
                    disabled
                    className="disabled"
                  />
                </div>
                <div className="form-group">
                  <label>Airport Name</label>
                  <input
                    type="text"
                    value={editForm.airportName}
                    onChange={(e) => setEditForm({...editForm, airportName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={editForm.latitude}
                      onChange={(e) => setEditForm({...editForm, latitude: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={editForm.longitude}
                      onChange={(e) => setEditForm({...editForm, longitude: parseFloat(e.target.value)})}
                    />
                  </div>
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
              <h2>Add New Airport</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Airport Code *</label>
                  <input
                    type="text"
                    value={editForm.airportId}
                    onChange={(e) => setEditForm({...editForm, airportId: e.target.value.toUpperCase()})}
                    maxLength={5}
                    placeholder="e.g., WAW"
                  />
                </div>
                <div className="form-group">
                  <label>Airport Name *</label>
                  <input
                    type="text"
                    value={editForm.airportName}
                    onChange={(e) => setEditForm({...editForm, airportName: e.target.value})}
                    placeholder="e.g., Warsaw Chopin Airport"
                  />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                    placeholder="e.g., Warsaw"
                  />
                </div>
                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                    placeholder="e.g., Poland"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={editForm.latitude}
                      onChange={(e) => setEditForm({...editForm, latitude: parseFloat(e.target.value)})}
                      placeholder="52.1657"
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={editForm.longitude}
                      onChange={(e) => setEditForm({...editForm, longitude: parseFloat(e.target.value)})}
                      placeholder="20.9671"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSaveNew}>Create Airport</button>
              <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Airports
