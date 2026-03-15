import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Client, Employee, Session, AppState, User, Lead, Job, Freelancer, FreelancerPayment, ClientPayment, ClientEquipment, Expense, Equipment, Gallery, GalleryImage } from '../types';
import { api } from '../api';

interface AppContextType extends AppState {
    addClient: (client: Client) => void;
    updateClient: (id: string, updates: Partial<Client>) => void;
    deleteClient: (id: string) => void;
    addEmployee: (employee: Employee) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;
    createSession: (session: Session) => void;
    updateSession: (id: string, updates: Partial<Session>) => void;
    deleteSession: (id: string) => void;
    addClientPayment: (payment: ClientPayment) => void;
    deleteClientPayment: (id: string) => void;
    addClientEquipment: (equipment: ClientEquipment) => void;
    updateClientEquipment: (id: string, updates: Partial<ClientEquipment>) => void;
    deleteClientEquipment: (id: string) => void;
    login: (email: string, password?: string) => Promise<boolean>;
    logout: () => void;
    generateCredentials: (employeeId: string) => { email: string; password: string };
    resetCredentials: (employeeId: string) => string;
    leads: Lead[];
    addLead: (lead: Lead) => void;
    updateLead: (id: string, updates: Partial<Lead>) => void;
    deleteLead: (id: string) => void;
    jobs: Job[];
    addJob: (job: Job) => void;
    updateJob: (id: string, updates: Partial<Job>) => void;
    deleteJob: (id: string) => void;
    freelancers: Freelancer[];
    addFreelancer: (freelancer: Freelancer) => void;
    updateFreelancer: (id: string, updates: Partial<Freelancer>) => void;
    deleteFreelancer: (id: string) => void;
    freelancerPayments: FreelancerPayment[];
    addFreelancerPayment: (payment: FreelancerPayment) => void;
    updateFreelancerPayment: (id: string, updates: Partial<FreelancerPayment>) => void;
    deleteFreelancerPayment: (id: string) => void;
    expenses: Expense[];
    addExpense: (expense: Expense) => void;
    deleteExpense: (id: string) => void;
    equipment: Equipment[];
    addEquipment: (equipment: Equipment) => void;
    updateEquipment: (id: string, updates: Partial<Equipment>) => void;
    deleteEquipment: (id: string) => void;
    galleries: Gallery[];
    createGallery: (gallery: Omit<Gallery, 'id' | 'createdAt' | 'images'>) => void;
    updateGallery: (id: string, updates: Partial<Gallery>) => void;
    deleteGallery: (id: string) => void;
    addImagesToGallery: (galleryId: string, imageUrls: string[]) => void;
    toggleImageSelection: (imageId: string) => void;
    deleteImage: (imageId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('sf_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [leads, setLeads] = useState<Lead[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [freelancerPayments, setFreelancerPayments] = useState<FreelancerPayment[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [galleries, setGalleries] = useState<Gallery[]>([]);

    useEffect(() => {
        // Fetch all data from backend on mount
        const loadState = async () => {
            try {
                const results = await Promise.allSettled([
                    api.get<Client[]>('/clients'),
                    api.get<Employee[]>('/employees'),
                    api.get<Session[]>('/sessions'),
                    api.get<Lead[]>('/leads'),
                    api.get<Job[]>('/jobs'),
                    api.get<Freelancer[]>('/freelancers'),
                    api.get<FreelancerPayment[]>('/freelancer-payments'),
                    api.get<Expense[]>('/expenses'),
                    api.get<Equipment[]>('/equipment'),
                    api.get<Gallery[]>('/galleries')
                ]);

                if (results[0].status === 'fulfilled') setClients(results[0].value);
                if (results[1].status === 'fulfilled') setEmployees(results[1].value);
                if (results[2].status === 'fulfilled') setSessions(results[2].value);
                if (results[3].status === 'fulfilled') setLeads(results[3].value);
                if (results[4].status === 'fulfilled') setJobs(results[4].value);
                if (results[5].status === 'fulfilled') setFreelancers(results[5].value);
                if (results[6].status === 'fulfilled') setFreelancerPayments(results[6].value);
                if (results[7].status === 'fulfilled') setExpenses(results[7].value);
                if (results[8].status === 'fulfilled') setEquipment(results[8].value);
                if (results[9].status === 'fulfilled') setGalleries(results[9].value);

                // Log any rejections for debugging
                results.forEach((res, index) => {
                    if (res.status === 'rejected') {
                        console.error(`API endpoint at index ${index} failed:`, res.reason);
                    }
                });
            } catch (err) {
                console.error("Critical failure during initial state load:", err);
            }
        };
        loadState();
    }, []);

    useEffect(() => { localStorage.setItem('sf_user', JSON.stringify(user)); }, [user]);

    const addClient = (client: Client) => {
        setClients(prev => [...prev, client]);
        api.post('/clients', client).catch(err => {
            console.error("Failed to add client:", err);
            setClients(prev => prev.filter(c => c.id !== client.id));
            alert("Failed to save client. Please check your connection.");
        });
    };
    const updateClient = (id: string, updates: Partial<Client>) => {
        const original = clients.find(c => c.id === id);
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        api.put(`/clients/${id}`, updates).catch(err => {
            console.error("Failed to update client:", err);
            if (original) setClients(prev => prev.map(c => c.id === id ? original : c));
            alert("Failed to update client.");
        });
    };
    const deleteClient = (id: string) => {
        const original = clients.find(c => c.id === id);
        setClients(prev => prev.filter(c => c.id !== id));
        api.delete(`/clients/${id}`).catch(err => {
            console.error("Failed to delete client:", err);
            if (original) setClients(prev => [...prev, original]);
            alert("Failed to delete client.");
        });
    };

    const addEmployee = (employee: Employee) => {
        setEmployees(prev => [...prev, employee]);
        api.post('/employees', employee).catch(err => {
            console.error("Failed to add employee:", err);
            setEmployees(prev => prev.filter(e => e.id !== employee.id));
            alert("Failed to add employee.");
        });
    };
    const updateEmployee = (id: string, updates: Partial<Employee>) => {
        const original = employees.find(e => e.id === id);
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
        api.put(`/employees/${id}`, updates).catch(err => {
            console.error("Failed to update employee:", err);
            if (original) setEmployees(prev => prev.map(e => e.id === id ? original : e));
            alert("Failed to update employee.");
        });
    };
    const deleteEmployee = (id: string) => {
        const original = employees.find(e => e.id === id);
        setEmployees(prev => prev.filter(e => e.id !== id));
        api.delete(`/employees/${id}`).catch(err => {
            console.error("Failed to delete employee:", err);
            if (original) setEmployees(prev => [...prev, original]);
            alert("Failed to delete employee.");
        });
    };

    const createSession = (session: Session) => {
        setSessions(prev => [...prev, session]);
        api.post('/sessions', session).catch(err => {
            console.error("Failed to create session:", err);
            setSessions(prev => prev.filter(s => s.id !== session.id));
            alert("Failed to create session.");
        });
    };
    const updateSession = (id: string, updates: Partial<Session>) => {
        const original = sessions.find(s => s.id === id);
        setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
        api.put(`/sessions/${id}`, updates).catch(err => {
            console.error("Failed to update session:", err);
            if (original) setSessions(prev => prev.map(s => s.id === id ? original : s));
            alert("Failed to update session.");
        });
    };
    const deleteSession = (id: string) => {
        const original = sessions.find(s => s.id === id);
        setSessions(prev => prev.filter(s => s.id !== id));
        api.delete(`/sessions/${id}`).catch(err => {
            console.error("Failed to delete session:", err);
            if (original) setSessions(prev => [...prev, original]);
            alert("Failed to delete session.");
        });
    };

    const addClientPayment = (payment: ClientPayment) => {
        setSessions(prev => prev.map(s => {
            if (s.id === payment.sessionId) {
                return { ...s, payments: [...(s.payments || []), payment] };
            }
            return s;
        }));
        api.post('/client-payments', payment).catch(console.error);
    };

    const deleteClientPayment = (id: string) => {
        setSessions(prev => prev.map(s => {
            if (s.payments && s.payments.some(p => p.id === id)) {
                return { ...s, payments: s.payments.filter(p => p.id !== id) };
            }
            return s;
        }));
        api.delete(`/client-payments/${id}`).catch(console.error);
    };

    const addClientEquipment = (equipment: ClientEquipment) => {
        setSessions(prev => prev.map(s => {
            if (s.id === equipment.sessionId) {
                return { ...s, clientEquipment: [...(s.clientEquipment || []), equipment] };
            }
            return s;
        }));
        api.post('/client-equipment', equipment).catch(console.error);
    };

    const updateClientEquipment = (id: string, updates: Partial<ClientEquipment>) => {
        setSessions(prev => prev.map(s => {
            if (s.clientEquipment && s.clientEquipment.some(e => e.id === id)) {
                return {
                    ...s,
                    clientEquipment: s.clientEquipment.map(e => e.id === id ? { ...e, ...updates } : e)
                };
            }
            return s;
        }));
        api.put(`/client-equipment/${id}`, updates).catch(console.error);
    };

    const deleteClientEquipment = (id: string) => {
        setSessions(prev => prev.map(s => {
            if (s.clientEquipment && s.clientEquipment.some(e => e.id === id)) {
                return { ...s, clientEquipment: s.clientEquipment.filter(e => e.id !== id) };
            }
            return s;
        }));
        api.delete(`/client-equipment/${id}`).catch(console.error);
    };

    const login = async (email: string, password?: string): Promise<boolean> => {
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPassword = (password || '').trim();

        try {
            const data = await api.post<any>('/auth/login', { 
                email: cleanEmail, 
                password: cleanPassword 
            });
            
            if (data && data.id) {
                setUser({
                    id: data.id,
                    name: data.name,
                    email: data.email || cleanEmail,
                    role: data.role || 'employee',
                    permissions: data.permissions || []
                });
                return true;
            }
        } catch (err) {
            console.error("Login failed:", err);
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sf_user');
    };

    const generateCredentials = (employeeId: string) => {
        const password = Math.random().toString(36).substr(2, 8).toUpperCase();
        
        // Find employee in current closure to get the name
        const currentEmployee = employees.find(e => e.id === employeeId);
        if (!currentEmployee) throw new Error('Employee not found');

        const email = `${currentEmployee.name.trim().toLowerCase().replace(/\s+/g, '.')}@kranthi.com`;

        // Use functional update to guarantee we don't overwrite with stale state
        setEmployees(prev => {
            const exists = prev.find(e => e.id === employeeId);
            if (!exists) return prev;
            return prev.map(e => e.id === employeeId ? { ...e, email, password } : e);
        });

        // Persist credentials to the backend so they are available upon login
        api.put(`/employees/${employeeId}`, { email, password }).catch(err => {
            console.error("Failed to persist new credentials to server:", err);
            alert("Failed to save generated credentials to server.");
        });

        return { email, password };
    };

    const resetCredentials = (employeeId: string) => {
        const password = Math.random().toString(36).substr(2, 8).toUpperCase();
        setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, password } : e));
        
        // Persist credentials to the backend so they are available upon login
        api.put(`/employees/${employeeId}`, { password }).catch(err => {
            console.error("Failed to persist reset credentials to server:", err);
            alert("Failed to save reset credentials to server.");
        });

        return password;
    };

    const addLead = (lead: Lead) => {
        setLeads(prev => [...prev, lead]);
        api.post('/leads', lead).catch(err => {
            console.error("Failed to add lead:", err);
            setLeads(prev => prev.filter(l => l.id !== lead.id));
            alert("Failed to add lead.");
        });
    };
    const updateLead = (id: string, updates: Partial<Lead>) => {
        const original = leads.find(l => l.id === id);
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
        api.put(`/leads/${id}`, updates).catch(err => {
            console.error("Failed to update lead:", err);
            if (original) setLeads(prev => prev.map(l => l.id === id ? original : l));
            alert("Failed to update lead.");
        });
    };
    const deleteLead = (id: string) => {
        const original = leads.find(l => l.id === id);
        setLeads(prev => prev.filter(l => l.id !== id));
        api.delete(`/leads/${id}`).catch(err => {
            console.error("Failed to delete lead:", err);
            if (original) setLeads(prev => [...prev, original]);
            alert("Failed to delete lead.");
        });
    };

    const addJob = (job: Job) => {
        setJobs(prev => [...prev, job]);
        api.post('/jobs', job).catch(err => {
            console.error("Failed to add job:", err);
            setJobs(prev => prev.filter(j => j.id !== job.id));
            alert("Failed to add job.");
        });
    };
    const updateJob = (id: string, updates: Partial<Job>) => {
        const original = jobs.find(j => j.id === id);
        setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
        api.put(`/jobs/${id}`, updates).catch(err => {
            console.error("Failed to update job:", err);
            if (original) setJobs(prev => prev.map(j => j.id === id ? original : j));
            alert("Failed to update job.");
        });
    };
    const deleteJob = (id: string) => {
        const original = jobs.find(j => j.id === id);
        setJobs(prev => prev.filter(j => j.id !== id));
        api.delete(`/jobs/${id}`).catch(err => {
            console.error("Failed to delete job:", err);
            if (original) setJobs(prev => [...prev, original]);
            alert("Failed to delete job.");
        });
    };

    const addFreelancer = (freelancer: Freelancer) => {
        setFreelancers(prev => [...prev, freelancer]);
        api.post('/freelancers', freelancer).catch(err => {
            console.error("Failed to add freelancer:", err);
            setFreelancers(prev => prev.filter(f => f.id !== freelancer.id));
            alert("Failed to add freelancer.");
        });
    };
    const updateFreelancer = (id: string, updates: Partial<Freelancer>) => {
        const original = freelancers.find(f => f.id === id);
        setFreelancers(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
        api.put(`/freelancers/${id}`, updates).catch(err => {
            console.error("Failed to update freelancer:", err);
            if (original) setFreelancers(prev => prev.map(f => f.id === id ? original : f));
            alert("Failed to update freelancer.");
        });
    };
    const deleteFreelancer = (id: string) => {
        const original = freelancers.find(f => f.id === id);
        setFreelancers(prev => prev.filter(f => f.id !== id));
        api.delete(`/freelancers/${id}`).catch(err => {
            console.error("Failed to delete freelancer:", err);
            if (original) setFreelancers(prev => [...prev, original]);
            alert("Failed to delete freelancer.");
        });
    };

    const addFreelancerPayment = (payment: FreelancerPayment) => {
        setFreelancerPayments(prev => [...prev, payment]);
        api.post('/freelancer-payments', payment).catch(err => {
            console.error("Failed to add freelancer payment:", err);
            setFreelancerPayments(prev => prev.filter(p => p.id !== payment.id));
            alert("Failed to add freelancer payment.");
        });
    };
    const updateFreelancerPayment = (id: string, updates: Partial<FreelancerPayment>) => {
        const original = freelancerPayments.find(p => p.id === id);
        setFreelancerPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        api.put(`/freelancer-payments/${id}`, updates).catch(err => {
            console.error("Failed to update freelancer payment:", err);
            if (original) setFreelancerPayments(prev => prev.map(p => p.id === id ? original : p));
            alert("Failed to update freelancer payment.");
        });
    };
    const deleteFreelancerPayment = (id: string) => {
        const original = freelancerPayments.find(p => p.id === id);
        setFreelancerPayments(prev => prev.filter(p => p.id !== id));
        api.delete(`/freelancer-payments/${id}`).catch(err => {
            console.error("Failed to delete freelancer payment:", err);
            if (original) setFreelancerPayments(prev => [...prev, original]);
            alert("Failed to delete freelancer payment.");
        });
    };

    const addExpense = (expense: Expense) => {
        setExpenses(prev => [...prev, expense]);
        api.post('/expenses', expense).catch(console.error);
    };
    const deleteExpense = (id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
        api.delete(`/expenses/${id}`).catch(console.error);
    };

    const addEquipment = (eq: Equipment) => {
        setEquipment(prev => [...prev, eq]);
        api.post('/equipment', eq).catch(console.error);
    };
    const updateEquipment = (id: string, updates: Partial<Equipment>) => {
        setEquipment(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
        api.put(`/equipment/${id}`, updates).catch(console.error);
    };
    const deleteEquipment = (id: string) => {
        setEquipment(prev => prev.filter(e => e.id !== id));
        api.delete(`/equipment/${id}`).catch(console.error);
    };

    return (
        <AppContext.Provider value={{
            clients, employees, sessions, user,
            addClient, updateClient, deleteClient,
            addEmployee, updateEmployee, deleteEmployee,
            createSession, updateSession, deleteSession, addClientPayment, deleteClientPayment,
            addClientEquipment, updateClientEquipment, deleteClientEquipment,
            login, logout, generateCredentials, resetCredentials,
            leads, addLead, updateLead, deleteLead,
            jobs, addJob, updateJob, deleteJob,
            freelancers, addFreelancer, updateFreelancer, deleteFreelancer,
            freelancerPayments, addFreelancerPayment, updateFreelancerPayment, deleteFreelancerPayment,
            expenses, addExpense, deleteExpense,
            equipment, addEquipment, updateEquipment, deleteEquipment,
            galleries,
            createGallery: (g) => {
                const newG = { ...g, id: Math.random().toString(36).substr(2, 9).toUpperCase(), createdAt: new Date().toISOString(), images: [] };
                setGalleries(prev => [...prev, newG]);
                api.post('/galleries', g).catch(console.error);
            },
            updateGallery: (id, updates) => {
                setGalleries(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
                api.put(`/galleries/${id}`, updates).catch(console.error);
            },
            deleteGallery: (id) => {
                setGalleries(prev => prev.filter(g => g.id !== id));
                api.delete(`/galleries/${id}`).catch(console.error);
            },
            addImagesToGallery: async (galleryId, urls) => {
                const resp = await api.post<GalleryImage[]>(`/galleries/${galleryId}/images`, urls.map(url => ({ url })));
                setGalleries(prev => prev.map(g => g.id === galleryId ? { ...g, images: [...g.images, ...resp] } : g));
            },
            toggleImageSelection: (imageId) => {
                setGalleries(prev => prev.map(g => ({
                    ...g,
                    images: g.images.map((img: GalleryImage) => img.id === imageId ? { ...img, isSelected: !img.isSelected } : img)
                })));
                api.put(`/gallery-images/${imageId}/toggle`, {}).catch(console.error);
            },
            deleteImage: (imageId) => {
                setGalleries(prev => prev.map(g => ({
                    ...g,
                    images: g.images.filter((img: GalleryImage) => img.id !== imageId)
                })));
                api.delete(`/gallery-images/${imageId}`).catch(console.error);
            }
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
