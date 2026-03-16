import apiClient from './apiClient';

export const chatService = {
    /**
     * Get list of groups the current user is participating in
     */
    getMyGroups: async () => {
        const response = await apiClient.get('/my-groups');
        return response.data;
    },

    /**
     * Get detailed information about a specific group
     */
    getGroupDetail: async (groupId) => {
        const response = await apiClient.get(`/groups/${groupId}`);
        return response.data;
    },

    /**
     * Get chat messages for a group
     * This also serves as a heartbeat for synchronization
     */
    getMessages: async (groupId) => {
        const response = await apiClient.get(`/chat/${groupId}`);
        return response.data;
    },

    /**
     * Send a message to a group
     */
    sendMessage: async (groupId, content) => {
        const response = await apiClient.post('/chat/send', {
            readingGroupId: groupId,
            content
        });
        return response.data;
    },

    /**
     * Mark the group summary/discussion as finished for the current user
     */
    finishSummary: async (groupId) => {
        const response = await apiClient.post(`/groups/${groupId}/finish`);
        return response.data;
    },

    /**
     * Interact with AI for individual assessment
     */
    interactAssessment: async (groupId, conversation) => {
        const response = await apiClient.post(`/groups/${groupId}/interact`, {
            conversation
        });
        return response.data;
    }
};

export default chatService;
