import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { customerService } from '../services/authService'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import './PageStyles.css'

function Customers() {
  const { canEdit, canDelete } = useAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [page])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const data = await customerService.getCustomers(page, 20, search)
      setCustomers(data.customers || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalItems || 0)
    } catch (error) {
      console.error('Failed to load customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    loadCustomers()
  }

  const getLoyaltyClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'gold':
        return 'status-gold'
      case 'silver':
        return 'status-silver'
      case 'bronze':
        return 'status-bronze'
      default:
        return 'status-completed'
    }
  }

  const handleDelete = async (customer) => {
    if (!window.confirm(`Are you sure you want to delete customer ${customer.firstName} ${customer.lastName}?`)) {
      return
    }
    try {
      await customerService.deleteCustomer(customer.customerId)
      setSelectedCustomer(null)
      loadCustomers()
    } catch (error) {
      console.error('Failed to delete customer:', error)
      alert('Failed to delete customer')
    }
  }

  const columns = [
    { 
      key: 'customerId', 
      label: 'ID', 
      width: '100px',
      render: (val) => val ? val.substring(0, 10) + '...' : '-'
    },
    { key: 'firstName', label: 'First Name', width: '100px' },
    { key: 'lastName', label: 'Last Name', width: '100px' },
    { key: 'gender', label: 'Gender', width: '80px' },
    { key: 'birthDate', label: 'Birth Date', width: '100px' },
    { key: 'nationality', label: 'Nationality', width: '100px' },
    { key: 'phone', label: 'Phone', width: '120px' },
    { 
      key: 'loyaltyStatus', 
      label: 'Loyalty', 
      width: '90px',
      render: (val) => (
        <span className={`status-badge ${getLoyaltyClass(val)}`}>
          {val || 'Standard'}
        </span>
      )
    },
    { key: 'registrationDate', label: 'Registered', width: '100px' },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>{totalItems.toLocaleString()} customers total</p>
        </div>
      </div>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      <DataTable 
        columns={columns} 
        data={customers} 
        loading={loading}
        onRowClick={setSelectedCustomer}
      />

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Customer Details</h2>
              <button className="close-btn" onClick={() => setSelectedCustomer(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Customer ID</label>
                  <span style={{ wordBreak: 'break-all' }}>{selectedCustomer.customerId}</span>
                </div>
                <div className="detail-item">
                  <label>Name</label>
                  <span>{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                </div>
                <div className="detail-item">
                  <label>Gender</label>
                  <span>{selectedCustomer.gender}</span>
                </div>
                <div className="detail-item">
                  <label>Age</label>
                  <span>{selectedCustomer.age}</span>
                </div>
                <div className="detail-item">
                  <label>Birth Date</label>
                  <span>{selectedCustomer.birthDate}</span>
                </div>
                <div className="detail-item">
                  <label>Nationality</label>
                  <span>{selectedCustomer.nationality}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Document Number</label>
                  <span>{selectedCustomer.documentNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Loyalty Status</label>
                  <span className={`status-badge ${getLoyaltyClass(selectedCustomer.loyaltyStatus)}`}>
                    {selectedCustomer.loyaltyStatus || 'Standard'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Registration Date</label>
                  <span>{selectedCustomer.registrationDate}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {canDelete() && (
                <button className="btn btn-danger" onClick={() => handleDelete(selectedCustomer)}>Delete</button>
              )}
              <button className="btn" onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
