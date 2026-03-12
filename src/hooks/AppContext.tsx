import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Client, Employee, Session, AppState, User, Lead, Job, Freelancer, FreelancerPayment, Expense, Equipment } from '../types';
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
    login: (email: string, password?: string) => boolean;
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

    useEffect(() => {
        // Fetch all data from backend on mount
        const loadState = async () => {
            try {
                const [clientsData, employeesData, sessionsData, leadsData, jobsData, freelancersData, paymentsData, expensesData, eqData] = await Promise.all([
                    api.get<Client[]>('/clients'),
                    api.get<Employee[]>('/employees'),
                    api.get<Session[]>('/sessions'),
                    api.get<Lead[]>('/leads'),
                    api.get<Job[]>('/jobs'),
                    api.get<Freelancer[]>('/freelancers'),
                    api.get<FreelancerPayment[]>('/freelancer-payments'),
                    api.get<Expense[]>('/expenses'),
                    api.get<Equipment[]>('/equipment')
                ]);
                
                setClients(clientsData);
                setEmployees(employeesData);
                setSessions(sessionsData);
                setLeads(leadsData);
                setJobs(jobsData);
                setFreelancers(freelancersData);
                setFreelancerPayments(paymentsData);
                setExpenses(expensesData);
                setEquipment(eqData);
            } catch (err) {
                console.error("Failed to load initial state from API:", err);
            }
        };
        loadState();
    }, []);

    useEffect(() => { localStorage.setItem('sf_user', JSON.stringify(user)); }, [user]);

    const addClient = (client: Client) => {
        setClients(prev => [...prev, client]);
        api.post('/clients', client).catch(console.error);
    };
    const updateClient = (id: string, updates: Partial<Client>) => {
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        api.put(`/clients/${id}`, updates).catch(console.error);
    };
    const deleteClient = (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id));
        api.delete(`/clients/${id}`).catch(console.error);
    };

    const addEmployee = (employee: Employee) => {
        setEmployees(prev => [...prev, employee]);
        api.post('/employees', employee).catch(console.error);
    };
    const updateEmployee = (id: string, updates: Partial<Employee>) => {
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
        api.put(`/employees/${id}`, updates).catch(console.error);
    };
    const deleteEmployee = (id: string) => {
        setEmployees(prev => prev.filter(e => e.id !== id));
        api.delete(`/employees/${id}`).catch(console.error);
    };

    const createSession = (session: Session) => {
        setSessions(prev => [...prev, session]);
        api.post('/sessions', session).catch(console.error);
    };
    const updateSession = (id: string, updates: Partial<Session>) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
        api.put(`/sessions/${id}`, updates).catch(console.error);
    };
    const deleteSession = (id: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        api.delete(`/sessions/${id}`).catch(console.error);
    };

    const login = (email: string, password?: string): boolean => {
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPassword = (password || '').trim();

        // Admin hardcoded logic
        if (cleanEmail === 'admin@kranthi.com' && cleanPassword === 'admin123') {
            setUser({
                id: 'admin-001',
                name: 'Admin User',
                email: cleanEmail,
                role: 'admin'
            });
            return true;
        }

        // Search in employees
        const employee = employees.find(e => {
            if (!e.email || !e.password) return false;
            return e.email.trim().toLowerCase() === cleanEmail && 
                   e.password.trim().toLowerCase() === cleanPassword.toLowerCase();
        });
        
        if (employee) {
            setUser({
                id: employee.id,
                name: employee.name,
                email: employee.email!,
                role: 'employee'
            });
            return true;
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

        return { email, password };
    };

    const resetCredentials = (employeeId: string) => {
        const password = Math.random().toString(36).substr(2, 8).toUpperCase();
        setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, password } : e));
        return password;
    };

    const addLead = (lead: Lead) => {
        setLeads(prev => [...prev, lead]);
        api.post('/leads', lead).catch(console.error);
    };
    const updateLead = (id: string, updates: Partial<Lead>) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
        api.put(`/leads/${id}`, updates).catch(console.error);
    };
    const deleteLead = (id: string) => {
        setLeads(prev => prev.filter(l => l.id !== id));
        api.delete(`/leads/${id}`).catch(console.error);
    };

    const addJob = (job: Job) => {
        setJobs(prev => [...prev, job]);
        api.post('/jobs', job).catch(console.error);
    };
    const updateJob = (id: string, updates: Partial<Job>) => {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
        api.put(`/jobs/${id}`, updates).catch(console.error);
    };
    const deleteJob = (id: string) => {
        setJobs(prev => prev.filter(j => j.id !== id));
        api.delete(`/jobs/${id}`).catch(console.error);
    };

    const addFreelancer = (freelancer: Freelancer) => {
        setFreelancers(prev => [...prev, freelancer]);
        api.post('/freelancers', freelancer).catch(console.error);
    };
    const updateFreelancer = (id: string, updates: Partial<Freelancer>) => {
        setFreelancers(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
        api.put(`/freelancers/${id}`, updates).catch(console.error);
    };
    const deleteFreelancer = (id: string) => {
        setFreelancers(prev => prev.filter(f => f.id !== id));
        api.delete(`/freelancers/${id}`).catch(console.error);
    };

    const addFreelancerPayment = (payment: FreelancerPayment) => {
        setFreelancerPayments(prev => [...prev, payment]);
        api.post('/freelancer-payments', payment).catch(console.error);
    };
    const updateFreelancerPayment = (id: string, updates: Partial<FreelancerPayment>) => {
        setFreelancerPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        api.put(`/freelancer-payments/${id}`, updates).catch(console.error);
    };
    const deleteFreelancerPayment = (id: string) => {
        setFreelancerPayments(prev => prev.filter(p => p.id !== id));
        api.delete(`/freelancer-payments/${id}`).catch(console.error);
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
            createSession, updateSession, deleteSession,
            login, logout, generateCredentials, resetCredentials,
            leads, addLead, updateLead, deleteLead,
            jobs, addJob, updateJob, deleteJob,
            freelancers, addFreelancer, updateFreelancer, deleteFreelancer,
            freelancerPayments, addFreelancerPayment, updateFreelancerPayment, deleteFreelancerPayment,
            expenses, addExpense, deleteExpense,
            equipment, addEquipment, updateEquipment, deleteEquipment
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
