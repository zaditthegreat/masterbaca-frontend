import apiClient from './apiClient';

export const bookService = {
    /**
     * Upload a new book via AI
     * @param {File} image - Cover book photo
     * @param {number} qty - Physical stock quantity
     * @returns {Promise}
     */
    uploadBook: async (image, qty) => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('qty', qty.toString());

        const response = await apiClient.post('/books/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Get all books
     * @returns {Promise}
     */
    getBooks: async () => {
        const response = await apiClient.get('/books');
        return response.data;
    },

    /**
     * Get book details by id
     * @param {string|number} id
     * @returns {Promise}
     */
    getBookById: async (id) => {
        const response = await apiClient.get(`/books/${id}`);
        return response.data;
    },

    /**
     * Update book data
     * @param {string|number} id
     * @param {Object} data
     * @returns {Promise}
     */
    updateBook: async (id, data) => {
        const response = await apiClient.put(`/books/${id}`, data);
        return response.data;
    },

    /**
     * Delete a book
     * @param {string|number} id
     * @returns {Promise}
     */
    deleteBook: async (id) => {
        const response = await apiClient.delete(`/books/${id}`);
        return response.data;
    }
};
