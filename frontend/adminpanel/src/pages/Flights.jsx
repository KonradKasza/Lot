import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { flightService } from '../services/authService'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import './PageStyles.css'

function Flights() {
  const { t } = useTranslation()
  const { canEdit, canDelete } = useAuth()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [addForm, setAddForm] = useState({
    flightId: '',
    flightNumber: '',
    flightDate: '',
    startAirport: '',
    endAirport: '',
    scheduledDeparture: 0,
    scheduledArrival: 0,
    dystans: 0,
    samolotId: '',
    zalogaId: null
  })

  useEffect(() => {
    loadFlights()
  }, [page])

  const loadFlights = async () => {
    setLoading(true)
    try {
      const data = await flightService.getFlights(page, 20)
      setFlights(data.flights || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalItems || 0)
    } catch (error) {
      console.error('Failed to load flights:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (minutes) => {
    if (minutes === null || minutes === undefined) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  const parseTime = (timeStr) => {
    if (!timeStr) return 0
    const [hours, mins] = timeStr.split(':').map(Number)
    return hours * 60 + mins
  }

  const toTimeInput = (minutes) => {
    if (!minutes && minutes !== 0) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  const handleEdit = (flight) => {
    setEditForm({
      flightNumber: flight.flightNumber || '',
      flightDate: flight.flightDate || '',
      startAirport: flight.startAirport || '',
      endAirport: flight.endAirport || '',
      scheduledDeparture: flight.scheduledDeparture || 0,
      scheduledArrival: flight.scheduledArrival || 0,
      actualDeparture: flight.actualDeparture || null,
      actualArrival: flight.actualArrival || null,
      dystans: flight.dystans || 0,
      samolotId: flight.samolotId || '',
      zalogaId: flight.zalogaId || null,
      cancellationStatus: flight.cancellationStatus || 0
    })
    setSelectedFlight(flight)
    setShowEditModal(true)
  }

  const handleSave = async () => {
    try {
      await flightService.updateFlight(selectedFlight.flightId, editForm)
      setShowEditModal(false)
      setSelectedFlight(null)
      loadFlights()
    } catch (error) {
      console.error('Failed to update flight:', error)
      alert('Failed to update flight')
    }
  }

  const handleAdd = async () => {
    try {
      const flightData = {
        ...addForm,
        flightId: parseInt(addForm.flightId) || Date.now(),
        flightNumber: parseInt(addForm.flightNumber) || 0
      }
      await flightService.createFlight(flightData)
      setShowAddModal(false)
      setAddForm({
        flightId: '',
        flightNumber: '',
        flightDate: '',
        startAirport: '',
        endAirport: '',
        scheduledDeparture: 0,
        scheduledArrival: 0,
        dystans: 0,
        samolotId: '',
        zalogaId: null
      })
      loadFlights()
    } catch (error) {
      console.error('Failed to add flight:', error)
      alert(t('common.errorOccurred'))
    }
  }

  const handleDelete = async (flight) => {
    if (!window.confirm(t('common.confirmDelete'))) {
      return
    }
    try {
      await flightService.deleteFlight(flight.flightId)
      setSelectedFlight(null)
      loadFlights()
    } catch (error) {
      console.error('Failed to delete flight:', error)
      alert(t('common.errorOccurred'))
    }
  }

  const columns = [
    { key: 'flightId', label: 'ID', width: '60px' },
    { key: 'flightNumber', label: t('flights.flightNumber'), width: '80px' },
    { key: 'flightDate', label: t('flights.departureTime').split(' ')[0], width: '100px' },
    { key: 'startAirport', label: t('flights.origin'), width: '70px' },
    { key: 'endAirport', label: t('flights.destination'), width: '70px' },
    { 
      key: 'scheduledDeparture', 
      label: t('flights.departure'), 
      width: '90px',
      render: (val) => formatTime(val)
    },
    { 
      key: 'scheduledArrival', 
      label: t('flights.arrival'), 
      width: '90px',
      render: (val) => formatTime(val)
    },
    { 
      key: 'cancellationStatus', 
      label: t('flights.status'), 
      width: '100px',
      render: (val) => (
        <span className={`status-badge ${val === 0 ? 'status-active' : 'status-cancelled'}`}>
          {val === 0 ? t('flights.statuses.SCHEDULED') : t('flights.statuses.CANCELLED')}
        </span>
      )
    },
    { 
      key: 'samolotId', 
      label: t('flights.airplane'), 
      width: '100px',
      render: (val) => val ? val.substring(0, 8) + '...' : '-'
    },
    {
      key: 'actions',
      label: t('common.actions'),
      width: '150px',
      render: (_, flight) => (
        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
          {canEdit() && (
            <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(flight)}>
              {t('common.edit')}
            </button>
          )}
          {canDelete() && (
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(flight)}>
              {t('common.delete')}
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
          <h1>{t('flights.title')}</h1>
          <p>{totalItems.toLocaleString()} {t('common.results')}</p>
        </div>
        {canEdit() && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ {t('flights.addFlight')}</button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={flights} 
        loading={loading}
        onRowClick={setSelectedFlight}
      />

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* View Details Modal */}
      {selectedFlight && !showEditModal && (
        <div className="modal-overlay" onClick={() => setSelectedFlight(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Flight Details</h2>
              <button className="close-btn" onClick={() => setSelectedFlight(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Flight ID</label>
                  <span>{selectedFlight.flightId}</span>
                </div>
                <div className="detail-item">
                  <label>Flight Number</label>
                  <span>LO{selectedFlight.flightNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <span>{selectedFlight.flightDate}</span>
                </div>
                <div className="detail-item">
                  <label>Route</label>
                  <span>{selectedFlight.startAirport} → {selectedFlight.endAirport}</span>
                </div>
                <div className="detail-item">
                  <label>Scheduled Departure</label>
                  <span>{formatTime(selectedFlight.scheduledDeparture)}</span>
                </div>
                <div className="detail-item">
                  <label>Scheduled Arrival</label>
                  <span>{formatTime(selectedFlight.scheduledArrival)}</span>
                </div>
                <div className="detail-item">
                  <label>Actual Departure</label>
                  <span>{formatTime(selectedFlight.actualDeparture)}</span>
                </div>
                <div className="detail-item">
                  <label>Actual Arrival</label>
                  <span>{formatTime(selectedFlight.actualArrival)}</span>
                </div>
                <div className="detail-item">
                  <label>Distance</label>
                  <span>{selectedFlight.dystans?.toLocaleString()} km</span>
                </div>
                <div className="detail-item">
                  <label>Aircraft</label>
                  <span style={{ wordBreak: 'break-all' }}>{selectedFlight.samolotId}</span>
                </div>
                <div className="detail-item">
                  <label>Crew ID</label>
                  <span>{selectedFlight.zalogaId}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span className={`status-badge ${selectedFlight.cancellationStatus === 0 ? 'status-active' : 'status-cancelled'}`}>
                    {selectedFlight.cancellationStatus === 0 ? 'Active' : 'Cancelled'}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {canEdit() && (
                <button className="btn btn-secondary" onClick={() => handleEdit(selectedFlight)}>Edit</button>
              )}
              {canDelete() && (
                <button className="btn btn-danger" onClick={() => handleDelete(selectedFlight)}>Delete Flight</button>
              )}
              <button className="btn" onClick={() => setSelectedFlight(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Flight LO{selectedFlight.flightNumber}</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Flight Number</label>
                    <input
                      type="number"
                      value={editForm.flightNumber}
                      onChange={(e) => setEditForm({...editForm, flightNumber: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={editForm.flightDate}
                      onChange={(e) => setEditForm({...editForm, flightDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>From Airport (IATA)</label>
                    <input
                      type="text"
                      value={editForm.startAirport}
                      onChange={(e) => setEditForm({...editForm, startAirport: e.target.value.toUpperCase()})}
                      maxLength={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>To Airport (IATA)</label>
                    <input
                      type="text"
                      value={editForm.endAirport}
                      onChange={(e) => setEditForm({...editForm, endAirport: e.target.value.toUpperCase()})}
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Scheduled Departure</label>
                    <input
                      type="time"
                      value={toTimeInput(editForm.scheduledDeparture)}
                      onChange={(e) => setEditForm({...editForm, scheduledDeparture: parseTime(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Scheduled Arrival</label>
                    <input
                      type="time"
                      value={toTimeInput(editForm.scheduledArrival)}
                      onChange={(e) => setEditForm({...editForm, scheduledArrival: parseTime(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Actual Departure</label>
                    <input
                      type="time"
                      value={toTimeInput(editForm.actualDeparture)}
                      onChange={(e) => setEditForm({...editForm, actualDeparture: parseTime(e.target.value) || null})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Actual Arrival</label>
                    <input
                      type="time"
                      value={toTimeInput(editForm.actualArrival)}
                      onChange={(e) => setEditForm({...editForm, actualArrival: parseTime(e.target.value) || null})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Distance (km)</label>
                    <input
                      type="number"
                      value={editForm.dystans}
                      onChange={(e) => setEditForm({...editForm, dystans: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editForm.cancellationStatus}
                      onChange={(e) => setEditForm({...editForm, cancellationStatus: parseInt(e.target.value)})}
                    >
                      <option value={0}>Active</option>
                      <option value={1}>Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Aircraft ID</label>
                    <input
                      type="text"
                      value={editForm.samolotId}
                      onChange={(e) => setEditForm({...editForm, samolotId: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Crew ID</label>
                    <input
                      type="number"
                      value={editForm.zalogaId || ''}
                      onChange={(e) => setEditForm({...editForm, zalogaId: parseInt(e.target.value) || null})}
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
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Flight</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Flight ID *</label>
                    <input
                      type="number"
                      value={addForm.flightId}
                      onChange={(e) => setAddForm({...addForm, flightId: e.target.value})}
                      placeholder="Unique flight ID"
                    />
                  </div>
                  <div className="form-group">
                    <label>Flight Number *</label>
                    <input
                      type="number"
                      value={addForm.flightNumber}
                      onChange={(e) => setAddForm({...addForm, flightNumber: e.target.value})}
                      placeholder="e.g., 1234"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={addForm.flightDate}
                      onChange={(e) => setAddForm({...addForm, flightDate: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Distance (km)</label>
                    <input
                      type="number"
                      value={addForm.dystans}
                      onChange={(e) => setAddForm({...addForm, dystans: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>From Airport (IATA) *</label>
                    <input
                      type="text"
                      value={addForm.startAirport}
                      onChange={(e) => setAddForm({...addForm, startAirport: e.target.value.toUpperCase()})}
                      maxLength={3}
                      placeholder="e.g., WAW"
                    />
                  </div>
                  <div className="form-group">
                    <label>To Airport (IATA) *</label>
                    <input
                      type="text"
                      value={addForm.endAirport}
                      onChange={(e) => setAddForm({...addForm, endAirport: e.target.value.toUpperCase()})}
                      maxLength={3}
                      placeholder="e.g., JFK"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Scheduled Departure</label>
                    <input
                      type="time"
                      value={toTimeInput(addForm.scheduledDeparture)}
                      onChange={(e) => setAddForm({...addForm, scheduledDeparture: parseTime(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Scheduled Arrival</label>
                    <input
                      type="time"
                      value={toTimeInput(addForm.scheduledArrival)}
                      onChange={(e) => setAddForm({...addForm, scheduledArrival: parseTime(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Aircraft ID</label>
                    <input
                      type="text"
                      value={addForm.samolotId}
                      onChange={(e) => setAddForm({...addForm, samolotId: e.target.value})}
                      placeholder="Airplane ID"
                    />
                  </div>
                  <div className="form-group">
                    <label>Crew ID</label>
                    <input
                      type="number"
                      value={addForm.zalogaId || ''}
                      onChange={(e) => setAddForm({...addForm, zalogaId: parseInt(e.target.value) || null})}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleAdd}>Add Flight</button>
              <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Flights
