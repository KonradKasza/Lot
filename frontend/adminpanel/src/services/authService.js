const API_BASE = '/api/admin'

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const authService = {
  async login(emailOrUsername, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password }),
    })
    return response.json()
  },

  async validateToken(token) {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Invalid token')
    return response.json()
  },
}

export const flightService = {
  async getFlights(page = 0, size = 20, filters = {}) {
    const params = new URLSearchParams({ page, size, ...filters })
    const response = await fetch(`${API_BASE}/flights?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getFlight(id) {
    const response = await fetch(`${API_BASE}/flights/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async createFlight(data) {
    const response = await fetch(`${API_BASE}/flights/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create flight')
    return response.json()
  },

  async updateFlight(id, data) {
    const response = await fetch(`${API_BASE}/flights/edit/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update flight')
    return response.json()
  },

  async deleteFlight(id) {
    const response = await fetch(`${API_BASE}/flights/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete flight')
    return response.json()
  },
}

export const reservationService = {
  async getReservations(page = 0, size = 20, filters = {}) {
    const params = new URLSearchParams({ page, size, ...filters })
    const response = await fetch(`${API_BASE}/reservations?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getReservation(id) {
    const response = await fetch(`${API_BASE}/reservations/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async updateReservation(id, data) {
    const response = await fetch(`${API_BASE}/reservations/edit/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async cancelReservation(id) {
    const response = await fetch(`${API_BASE}/reservations/cancel/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to cancel reservation')
    return response.json()
  },

  async deleteReservation(id) {
    const response = await fetch(`${API_BASE}/reservations/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete reservation')
    return response.json()
  },
}

export const customerService = {
  async getCustomers(page = 0, size = 20, search = '') {
    const params = new URLSearchParams({ page, size, ...(search && { search }) })
    const response = await fetch(`${API_BASE}/customers?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getCustomer(id) {
    const response = await fetch(`${API_BASE}/customers/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async updateCustomer(id, data) {
    const response = await fetch(`${API_BASE}/customers/edit/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update customer')
    return response.json()
  },

  async deleteCustomer(id) {
    const response = await fetch(`${API_BASE}/customers/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete customer')
    return response.json()
  },
}

export const airplaneService = {
  async getAirplanes(page = 0, size = 20) {
    const params = new URLSearchParams({ page, size })
    const response = await fetch(`${API_BASE}/airplanes?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async createAirplane(data) {
    const response = await fetch(`${API_BASE}/airplanes/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create airplane')
    return response.json()
  },

  async updateAirplane(id, data) {
    const response = await fetch(`${API_BASE}/airplanes/edit/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update airplane')
    return response.json()
  },

  async deleteAirplane(id) {
    const response = await fetch(`${API_BASE}/airplanes/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete airplane')
    return response.json()
  },
}

export const airportService = {
  async getAirports(page = 0, size = 20) {
    const params = new URLSearchParams({ page, size })
    const response = await fetch(`${API_BASE}/airports?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async createAirport(data) {
    const response = await fetch(`${API_BASE}/airports/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create airport')
    return response.json()
  },

  async updateAirport(id, data) {
    const response = await fetch(`${API_BASE}/airports/edit/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update airport')
    return response.json()
  },

  async deleteAirport(id) {
    const response = await fetch(`${API_BASE}/airports/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete airport')
    return response.json()
  },
}

export const adminUserService = {
  async getAdminUsers(page = 0, size = 20) {
    const params = new URLSearchParams({ page, size })
    const response = await fetch(`${API_BASE}/admins?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async createAdminUser(data) {
    const response = await fetch(`${API_BASE}/admins/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create admin user')
    return response.json()
  },

  async updateAdminUser(id, data) {
    const response = await fetch(`${API_BASE}/admins/edit/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update admin user')
    return response.json()
  },

  async deleteAdminUser(id) {
    const response = await fetch(`${API_BASE}/admins/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete admin user')
    return response.json()
  },
}

export const statsService = {
  async getDashboardStats() {
    const response = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },
}

export const crewService = {
  async getCrews(page = 0, size = 20) {
    const params = new URLSearchParams({ page, size })
    const response = await fetch(`${API_BASE}/crews?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getCrew(id) {
    const response = await fetch(`${API_BASE}/crews/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async createCrew(data) {
    const response = await fetch(`${API_BASE}/crews/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create crew')
    return response.json()
  },

  async updateCrew(id, data) {
    const response = await fetch(`${API_BASE}/crews/edit/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update crew')
    return response.json()
  },

  async deleteCrew(id) {
    const response = await fetch(`${API_BASE}/crews/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete crew')
    return response.json()
  },
}

export const crewMemberService = {
  async getCrewMembers(page = 0, size = 20) {
    const params = new URLSearchParams({ page, size })
    const response = await fetch(`${API_BASE}/crew-members?${params}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async getCrewMember(id) {
    const response = await fetch(`${API_BASE}/crew-members/${id}`, {
      headers: getAuthHeaders(),
    })
    return response.json()
  },

  async createCrewMember(data) {
    const response = await fetch(`${API_BASE}/crew-members/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create crew member')
    return response.json()
  },

  async updateCrewMember(id, data) {
    const response = await fetch(`${API_BASE}/crew-members/edit/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update crew member')
    return response.json()
  },

  async deleteCrewMember(id) {
    const response = await fetch(`${API_BASE}/crew-members/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete crew member')
    return response.json()
  },
}
