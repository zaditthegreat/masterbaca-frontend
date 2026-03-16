import apiClient from './apiClient';

export const authService = {
    /**
     * Register a new user
     * @param {{ name, email, password, role }} data 
     * @returns {Promise}
     */
    register: async (data) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    /**
     * Login an existing user
     * @param {{ email, password }} credentials 
     * @returns {Promise}
     */
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
