const API_URL = 'http://localhost:5000/api';

// Helper function for authenticated API calls
async function fetchWithAuth(url, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_URL}${url}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Car Functions
const cars = {
    getAll: async () => {
        return await fetchWithAuth('/cars');
    },
    getById: async (id) => {
        return await fetchWithAuth(`/cars/${id}`);
    },
    create: async (carData) => {
        return await fetchWithAuth('/cars', 'POST', carData);
    },
    update: async (id, carData) => {
        return await fetchWithAuth(`/cars/${id}`, 'PUT', carData);
    },
    delete: async (id) => {
        return await fetchWithAuth(`/cars/${id}`, 'DELETE');
    }
};

// Rental Functions
const rentals = {
    create: async (rentalData) => {
        return await fetchWithAuth('/rentals', 'POST', rentalData);
    },
    getUserRentals: async () => {
        return await fetchWithAuth('/rentals/myrentals');
    },
    getById: async (id) => {
        return await fetchWithAuth(`/rentals/${id}`);
    },
    updateStatus: async (id, status) => {
        return await fetchWithAuth(`/rentals/${id}/status`, 'PUT', { status });
    },
    getAllAdmin: async () => {
        return await fetchWithAuth('/rentals/admin');
    },
    deleteAdmin: async (id) => {
        return await fetchWithAuth(`/rentals/${id}`, 'DELETE');
    }
};

// User Management Functions (Admin)
const users = {
    getAll: async () => {
        return await fetchWithAuth('/users');
    },
    getById: async (id) => {
        return await fetchWithAuth(`/users/${id}`);
    },
    update: async (id, userData) => {
        return await fetchWithAuth(`/users/${id}`, 'PUT', userData);
    },
    delete: async (id) => {
        return await fetchWithAuth(`/users/${id}`, 'DELETE');
    }
};