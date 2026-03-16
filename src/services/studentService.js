import apiClient from './apiClient';

export const studentService = {
    /**
     * Get my profile and onboarding status
     * @returns {Promise}
     */
    getMyProfile: async () => {
        const response = await apiClient.get('/me');
        return response.data;
    },

    /**
     * Upload avatar image
     * @param {File} image
     * @returns {Promise}
     */
    uploadAvatar: async (image) => {
        const formData = new FormData();
        formData.append('image', image);

        const response = await apiClient.post('/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Profile interaction (onboarding)
     * @param {Array<{question: string, answer: string}>} conversation 
     * @returns {Promise}
     */
    interactProfile: async (conversation) => {
        const response = await apiClient.post('/profile/interact', { conversation });
        return response.data;
    },

    /**
     * Get vector recommendation timeline
     * @returns {Promise}
     */
    getTimeline: async () => {
        const response = await apiClient.get('/timeline');
        return response.data;
    },

    /**
     * Swipe a book
     * @param {string|number} bookId 
     * @param {'right'|'left'} direction 
     * @returns {Promise}
     */
    swipeBook: async (bookId, direction) => {
        const response = await apiClient.post('/swipe', { bookId, direction });
        return response.data;
    }
};
