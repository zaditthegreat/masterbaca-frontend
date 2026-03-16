import apiClient from './apiClient';

export const classService = {
    /**
     * List all classes
     * @returns {Promise}
     */
    getClasses: async () => {
        const response = await apiClient.get('/classes');
        return response.data;
    },

    /**
     * Create a new class
     * @param {Object} data 
     * @returns {Promise}
     */
    createClass: async (data) => {
        const response = await apiClient.post('/classes', data);
        return response.data;
    },

    /**
     * Assign a teacher to a class
     * @param {string|number} classId 
     * @param {string|number} teacherId 
     * @returns {Promise}
     */
    assignTeacher: async (classId, teacherId) => {
        const response = await apiClient.post('/classes/assign-teacher', { classId, teacherId });
        return response.data;
    },

    /**
     * Unassign a teacher from a class
     * @param {string|number} classId 
     * @param {string|number} teacherId 
     * @returns {Promise}
     */
    unassignTeacher: async (classId, teacherId) => {
        const response = await apiClient.post('/classes/unassign-teacher', { classId, teacherId });
        return response.data;
    },

    /**
     * Assign a student to a class
     * @param {string|number} classId 
     * @param {string|number} studentId 
     * @returns {Promise}
     */
    assignStudent: async (classId, studentId) => {
        const response = await apiClient.post('/classes/assign-student', { classId, studentId });
        return response.data;
    }
};
