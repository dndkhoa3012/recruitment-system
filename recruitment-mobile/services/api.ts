import axios from 'axios';
import { API_URL } from '@/constants/Config';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getJobs = async () => {
    try {
        const response = await api.get('/jobs');
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const getJobDetail = async (id: number | string) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching job ${id}:`, error);
        throw error;
    }
};

export const applyForJob = async (formData: FormData) => {
    try {
        const response = await api.post('/candidates', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error applying for job:', error);
        throw error;
    }
};

export const createJob = async (jobData: any) => {
    try {
        const response = await api.post('/jobs', jobData);
        return response.data;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

export const updateJob = async (id: number | string, jobData: any) => {
    try {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    } catch (error) {
        console.error(`Error updating job ${id}:`, error);
        throw error;
    }
};

export const deleteJob = async (id: number | string) => {
    try {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting job ${id}:`, error);
        throw error;
    }
};

// Category APIs
export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const createCategory = async (categoryData: any) => {
    try {
        const response = await api.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (id: number | string, categoryData: any) => {
    try {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        throw error;
    }
};

export const deleteCategory = async (id: number | string) => {
    try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
        throw error;
    }
};

// Candidate APIs
export const getCandidates = async (params?: { status?: string; jobId?: string; search?: string }) => {
    try {
        const response = await api.get('/candidates', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching candidates:', error);
        throw error;
    }
};

export const getCandidateDetail = async (id: number | string) => {
    try {
        const response = await api.get(`/candidates/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching candidate ${id}:`, error);
        throw error;
    }
};

export const updateCandidate = async (id: number | string, data: any) => {
    try {
        const response = await api.put(`/candidates/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating candidate ${id}:`, error);
        throw error;
    }
};

export const deleteCandidate = async (id: number | string) => {
    try {
        const response = await api.delete(`/candidates/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting candidate ${id}:`, error);
        throw error;
    }
};

export default api;
