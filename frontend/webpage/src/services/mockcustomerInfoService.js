// Mock customer info service

const mockDatabase = {
    // Sample customer data by email
    customers: {
        'user@example.com': {
            email: 'user@example.com',
            first_name: 'John',
            last_name: 'Doe',
            gender: 'Male',
            age: 28,
            phone_number: '+1-555-0123',
            id_number: 'ID123456789',
        },
        'test@example.com': {
            email: 'test@example.com',
            first_name: 'Jane',
            last_name: 'Smith',
            gender: 'Female',
            age: 32,
            phone_number: '+1-555-0456',
            id_number: 'ID987654321',
        },
    },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get customer info by email
 * @param {string} email - Customer's email address
 * @returns {Promise<Object>} Customer information
 */
export async function getCustomerInfo(email) {
    await delay(300);

    // Try to find existing customer in database
    if (mockDatabase.customers[email]) {
        return {
            success: true,
            customer: mockDatabase.customers[email],
            message: 'Customer info retrieved successfully',
        };
    }

    // If not found, create a new customer with empty fields
    const newCustomer = {
        email: email,
        first_name: '',
        last_name: '',
        gender: '',
        age: '',
        phone_number: '',
        id_number: '',
    };

    // Store the new customer
    mockDatabase.customers[email] = newCustomer;

    return {
        success: true,
        customer: newCustomer,
        message: 'New customer profile created',
    };
}

/**
 * Update customer info
 * @param {string} email - Customer's email address
 * @param {Object} updatedData - Updated customer information
 * @returns {Promise<Object>} Updated customer information
 */
export async function updateCustomerInfo(email, updatedData) {
    await delay(400);

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'gender', 'age', 'phone_number', 'id_number'];
    const missingFields = requiredFields.filter(field => !updatedData[field] || updatedData[field].toString().trim() === '');

    if (missingFields.length > 0) {
        return {
            success: false,
            error: `Missing required fields: ${missingFields.join(', ')}`,
        };
    }

    // Validate age is a positive number
    const age = parseInt(updatedData.age, 10);
    if (isNaN(age) || age < 1 || age > 150) {
        return {
            success: false,
            error: 'Age must be a valid number between 1 and 150',
        };
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[+\d\s\-()]+$/;
    if (!phoneRegex.test(updatedData.phone_number)) {
        return {
            success: false,
            error: 'Phone number format is invalid',
        };
    }

    // Validate ID number is not empty
    if (!updatedData.id_number || updatedData.id_number.toString().trim() === '') {
        return {
            success: false,
            error: 'ID number is required',
        };
    }

    // Update customer in database
    const updatedCustomer = {
        email: email,
        ...updatedData,
        age: age, // Store as number
        updated_at: new Date().toISOString(),
    };

    mockDatabase.customers[email] = updatedCustomer;

    return {
        success: true,
        customer: updatedCustomer,
        message: 'Customer info updated successfully',
    };
}

/**
 * Delete customer account
 * @param {string} email - Customer's email address
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteCustomerAccount(email) {
    await delay(300);

    if (mockDatabase.customers[email]) {
        delete mockDatabase.customers[email];
        return {
            success: true,
            message: 'Customer account deleted successfully',
        };
    }

    return {
        success: false,
        error: 'Customer not found',
    };
}

export default {
    getCustomerInfo,
    updateCustomerInfo,
    deleteCustomerAccount,
};
