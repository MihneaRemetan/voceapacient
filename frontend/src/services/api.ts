import axios from 'axios';

export interface AuthResponse {
    token: string;
    user: User;
}

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // NU șterge token-ul la login/register
    if (
        status === 401 &&
        !url.includes('login') &&
        !url.includes('register')
    ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }


    return Promise.reject(error);
  }
);

export interface User {
    id: number;
    email: string;
    name?: string;
    county?: string;
    showRealName: boolean;
    isAdmin: boolean;
    createdAt: string;
}

export interface Post {
    id: number;
    title?: string;
    body: string;
    unitName: string;
    locality: string;
    county: string;
    incidentDate?: string;
    displayName: string;
    createdAt: string;
    status?: string;
    replyCount?: number;
    attachmentCount?: number;
    attachments?: Attachment[];
    replies?: Reply[];
}

export interface Attachment {
    id: number;
    file_path: string;
    created_at: string;
}

export interface Reply {
    id: number;
    body: string;
    displayName: string;
    created_at: string;
}

// Auth
export const authApi = {
    register: (data: {
        email: string;
        password: string;
        name?: string;
        county?: string;
    }) => api.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),

    getCurrentUser: () => api.get<User>('/auth/me'),
};

// Users
export const userApi = {
    getProfile: () => api.get<User>('/users/profile'),

    updateProfile: (data: {
        name?: string;
        county?: string;
        showRealName?: boolean;
    }) => api.put('/users/profile', data),
};

// Posts
export const postsApi = {
    createPost: (formData: FormData) =>
        api.post('/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    getPosts: (params?: {
        county?: string;
        unitName?: string;
        limit?: number;
        offset?: number;
    }) => api.get<{ posts: Post[] }>('/posts', { params }),

    getPostById: (id: number) => api.get<Post>(`/posts/${id}`),
};

// Replies
export const repliesApi = {
    createReply: (postId: number, data: { body: string; useRealName: boolean }) =>
        api.post(`/posts/${postId}/replies`, data),

    getReplies: (postId: number) =>
        api.get<{ replies: Reply[] }>(`/posts/${postId}/replies`),
};

// Admin
export const adminApi = {
    getPendingPosts: () => api.get<{ posts: Post[] }>('/admin/posts/pending'),

    getPostForEdit: (id: number) => api.get<Post>(`/admin/posts/${id}`),

    approvePost: (id: number) => api.put(`/admin/posts/${id}/approve`),

    rejectPost: (id: number) => api.put(`/admin/posts/${id}/reject`),

    updatePost: (id: number, data: {
        title?: string;
        body: string;
        unitName: string;
        locality: string;
        county: string;
        incidentDate?: string;
    }) => api.put(`/admin/posts/${id}`, data),

    addAttachment: (id: number, formData: FormData) =>
        api.post(`/admin/posts/${id}/attachments`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    deleteAttachment: (postId: number, attachmentId: number) =>
        api.delete(`/admin/posts/${postId}/attachments/${attachmentId}`),

    deletePost: (id: number) => api.delete(`/admin/posts/${id}`),
};

export default api;
