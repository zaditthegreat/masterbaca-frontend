import apiClient from './apiClient';

export const assessmentService = {
    /**
     * Mark book reading summary as finished for a group
     * @param {string|number} groupId 
     * @returns {Promise}
     */
    finishReading: async (groupId) => {
        const response = await apiClient.post(`/groups/${groupId}/finish`);
        return response.data;
    },

    /**
     * Private interactive chat with AI for assessment
     * @param {string|number} groupId 
     * @param {Object} data 
     * @returns {Promise}
     */
    interactAssessment: async (groupId, data) => {
        const response = await apiClient.post(`/groups/${groupId}/interact`, data);
        return response.data;
    }
};
