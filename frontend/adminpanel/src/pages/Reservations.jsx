import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { reservationService } from '../services/authService'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import './PageStyles.css'

function Reservations() {
  const { canEdit, canDelete } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadReservations()
  }, [page])

  const loadReservations = async () => {
    setLoading(true)
    try {
      const data = await reservationService.getReservations(page, 20, { search })
      setReservations(data.reservations || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalItems || 0)
    } catch (error) {
      console.error('Failed to load reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    loadReservations()
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'status-active'
      case 'cancelled':
        return 'status-cancelled'
      case 'pending':
        return 'status-pending'
      default:
        return 'status-completed'
    }
  }

  const columns = [
    { key: 'reservationId', label: 'ID', width: '60px' },
    { key: 'reservationCode', label: 'Code', width: '90px' },
    { key: 'flightId', label: 'Flight', width: '70px' },
    { key: 'accountId', label: 'Account', width: '100px', 
      render: (val) => val ? val.substring(0, 10) + '...' : '-' 
    },
    { key: 'seat', label: 'Seat', width: '60px' },
    { 
      key: 'totalPrice', 
      label: 'Price', 
      width: '90px',
      render: (val) => val ? `$${Number(val).toFixed(2)}` : '-'
    },
    { key: 'creationDate', label: 'Created', width: '100px' },
    { 
      key: 'reservationStatus', 
      label: 'Status', 
      width: '100px',
      render: (val) => (
        <span className={`status-badge ${getStatusClass(val)}`}>
          {val || 'Unknown'}
        </span>
      )
    },
    { key: 'ticketNumber', label: 'Ticket #', width: '120px' },
  ]

  const handleCancel = async () => {
    if (!selectedReservation || !canEdit()) return
    if (!confirm('Are you sure you want to cancel this reservation?')) return
    
    try {
      await reservationService.cancelReservation(selectedReservation.reservationId)
      loadReservations()
      setSelectedReservation(null)
    } catch (error) {
      alert('Failed to cancel reservation')
    }
  }

  const handleDelete = async () => {
    if (!selectedReservation || !canDelete()) return
    if (!confirm('Are you sure you want to permanently delete this reservation?')) return
    
    try {
      await reservationService.deleteReservation(selectedReservation.reservationId)
      loadReservations()
      setSelectedReservation(null)
    } catch (error) {
      alert('Failed to delete reservation')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Reservations</h1>
          <p>{totalItems.toLocaleString()} reservations total</p>
        </div>
      </div>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by reservation code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      <DataTable 
        columns={columns} 
        data={reservations} 
        loading={loading}
        onRowClick={setSelectedReservation}
      />

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {selectedReservation && (
        <div className="modal-overlay" onClick={() => setSelectedReservation(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reservation Details</h2>
              <button className="close-btn" onClick={() => setSelectedReservation(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Reservation ID</label>
                  <span>{selectedReservation.reservationId}</span>
                </div>
                <div className="detail-item">
                  <label>Reservation Code</label>
                  <span>{selectedReservation.reservationCode}</span>
                </div>
                <div className="detail-item">
                  <label>Flight ID</label>
                  <span>{selectedReservation.flightId}</span>
                </div>
                <div className="detail-item">
                  <label>Account ID</label>
                  <span>{selectedReservation.accountId}</span>
                </div>
                <div className="detail-item">
                  <label>Seat</label>
                  <span>{selectedReservation.seat}</span>
                </div>
                <div className="detail-item">
                  <label>Fare ID</label>
                  <span>{selectedReservation.fareId}</span>
                </div>
                <div className="detail-item">
                  <label>Total Price</label>
                  <span>${Number(selectedReservation.totalPrice).toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span className={`status-badge ${getStatusClass(selectedReservation.reservationStatus)}`}>
                    {selectedReservation.reservationStatus}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Ticket Number</label>
                  <span>{selectedReservation.ticketNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Ticket Status</label>
                  <span>{selectedReservation.ticketStatus}</span>
                </div>
                <div className="detail-item">
                  <label>Luggage</label>
                  <span>{selectedReservation.luggage}</span>
                </div>
                <div className="detail-item">
                  <label>Created</label>
                  <span>{selectedReservation.creationDate}</span>
                </div>
                <div className="detail-item">
                  <label>Modified</label>
                  <span>{selectedReservation.modificationDate}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {canEdit() && selectedReservation.reservationStatus !== 'Cancelled' && (
                <button className="btn btn-danger" onClick={handleCancel}>Cancel Reservation</button>
              )}
              {canDelete() && (
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              )}
              <button className="btn" onClick={() => setSelectedReservation(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reservations
