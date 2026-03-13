// Hardcoded for production to guarantee connection since Render and Vercel are struggling with proxy rewrites
const API_URL = 'https://studioflow-api.onrender.com/api';

export const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error(`API GET Error: ${response.statusText}`);
        return response.json();
    },
    post: async <T>(endpoint: string, data: any): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`API POST Error: ${response.statusText}`);
        return response.json();
    },
    put: async <T>(endpoint: string, data: any): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`API PUT Error: ${response.statusText}`);
        return response.json();
    },
    delete: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`API DELETE Error: ${response.statusText}`);
        return response.json();
    }
};
