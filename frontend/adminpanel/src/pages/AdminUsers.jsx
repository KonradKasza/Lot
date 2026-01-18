import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminUserService } from '../services/authService'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import './PageStyles.css'

function AdminUsers() {
  const { canDelete, isAdmin, user } = useAuth()
  const [adminUsers, setAdminUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [addForm, setAddForm] = useState({})

  useEffect(() => {
    loadAdminUsers()
  }, [page])

  const loadAdminUsers = async () => {
    setLoading(true)
    try {
      const data = await adminUserService.getAdminUsers(page, 20)
      setAdminUsers(data.adminAccounts || [])
      setTotalPages(data.totalPages || 0)
      setTotalItems(data.totalItems || 0)
    } catch (error) {
      console.error('Failed to load admin users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setAddForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'WORKER'
    })
    setShowAddModal(true)
  }

  const handleEdit = (adminUser) => {
    setEditForm({
      email: adminUser.email || '',
      firstName: adminUser.firstName || '',
      lastName: adminUser.lastName || '',
      role: adminUser.role || 'WORKER'
    })
    setSelectedUser(adminUser)
    setShowEditModal(true)
  }

  const handleSaveNew = async () => {
    if (!addForm.email || !addForm.password) {
      alert('Email and password are required')
      return
    }
    try {
      await adminUserService.createAdminUser(addForm)
      setShowAddModal(false)
      loadAdminUsers()
    } catch (error) {
      console.error('Failed to create admin user:', error)
      alert('Failed to create admin user')
    }
  }

  const handleSave = async () => {
    try {
      await adminUserService.updateAdminUser(selectedUser.adminId, editForm)
      setShowEditModal(false)
      setSelectedUser(null)
      loadAdminUsers()
    } catch (error) {
      console.error('Failed to update admin user:', error)
      alert('Failed to update admin user')
    }
  }

  const handleDelete = async (adminUser) => {
    if (adminUser.email === user?.email) {
      alert('You cannot delete your own account')
      return
    }
    if (!window.confirm(`Are you sure you want to delete admin user ${adminUser.email}?`)) {
      return
    }
    try {
      await adminUserService.deleteAdminUser(adminUser.adminId)
      loadAdminUsers()
    } catch (error) {
      console.error('Failed to delete admin user:', error)
      alert('Failed to delete admin user')
    }
  }

  const getRoleClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'status-admin'
      case 'MANAGER':
        return 'status-manager'
      case 'WORKER':
        return 'status-worker'
      default:
        return 'status-pending'
    }
  }

  const columns = [
    { 
      key: 'adminId', 
      label: 'ID', 
      width: '60px'
    },
    { key: 'email', label: 'Email', width: '200px' },
    { key: 'firstName', label: 'First Name', width: '120px' },
    { key: 'lastName', label: 'Last Name', width: '120px' },
    { 
      key: 'role', 
      label: 'Role', 
      width: '100px',
      render: (val) => (
        <span className={`status-badge ${getRoleClass(val)}`}>
          {val}
        </span>
      )
    },
    { key: 'createdAt', label: 'Created', width: '120px' },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      render: (_, adminUser) => (
        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
          {isAdmin() && (
            <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(adminUser)}>
              Edit
            </button>
          )}
          {canDelete() && adminUser.email !== user?.email && (
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(adminUser)}>
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
          <h1>Admin Users</h1>
          <p>{totalItems.toLocaleString()} admin accounts total</p>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={handleAdd}>+ Add Admin</button>
        )}
      </div>

      <div className="role-legend">
        <span className="legend-item">
          <span className="status-badge status-admin">ADMIN</span>
          Full access, can manage users
        </span>
        <span className="legend-item">
          <span className="status-badge status-manager">MANAGER</span>
          Can edit records
        </span>
        <span className="legend-item">
          <span className="status-badge status-worker">WORKER</span>
          Read-only access
        </span>
      </div>

      <DataTable 
        columns={columns} 
        data={adminUsers} 
        loading={loading}
        onRowClick={setSelectedUser}
      />

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* View Details Modal */}
      {selectedUser && !showEditModal && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Admin User Details</h2>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>ID</label>
                  <span>{selectedUser.adminId}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="detail-item">
                  <label>Name</label>
                  <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                </div>
                <div className="detail-item">
                  <label>Role</label>
                  <span className={`status-badge ${getRoleClass(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Created At</label>
                  <span>{selectedUser.createdAt}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {isAdmin() && (
                <button className="btn btn-secondary" onClick={() => handleEdit(selectedUser)}>
                  Edit
                </button>
              )}
              {canDelete() && selectedUser.email !== user?.email && (
                <button className="btn btn-danger" onClick={() => handleDelete(selectedUser)}>
                  Delete
                </button>
              )}
              <button className="btn" onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Admin User</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    disabled
                    className="disabled"
                  />
                </div>
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
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  >
                    <option value="WORKER">WORKER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
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
              <h2>Add New Admin User</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                    placeholder="admin@lot.com"
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={addForm.password}
                    onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                    placeholder="Min 6 characters"
                  />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={addForm.firstName}
                    onChange={(e) => setAddForm({...addForm, firstName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={addForm.lastName}
                    onChange={(e) => setAddForm({...addForm, lastName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                  >
                    <option value="WORKER">WORKER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSaveNew}>Create Admin</button>
              <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
