export type WorkflowStage = 'Intake' | 'Photography' | 'Editing' | 'Payment' | 'Delivery' | 'Closed';
export type UserRole = 'admin' | 'employee';
export type LeadStatus = 'New Lead' | 'Contacted' | 'Quoted' | 'Followed Up' | 'Lost';
export type JobType = 'Wedding' | 'Portrait' | 'Corporate' | 'Family' | 'Event' | 'Other';

export interface Lead {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  type: JobType;
  shootDate: string;
  status: LeadStatus;
  nextTask: string;
  notes: string;
  createdAt: string;
  referredBy?: string;
  events?: { name: string; date: string }[];
}

export interface Job {
  id: string;
  leadId?: string;
  clientId?: string;
  name: string;
  type: JobType;
  shootDate: string;
  workflowProgress: number; // 0-100
  nextTask: string;
  notes: string;
  createdAt: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Client {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  referredBy?: string;
  history: string[]; // IDs of previous sessions
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  accountNumber: string;
  ifsc: string;
  branchName: string;
  joiningDate: string;
  salary: string;
  currentSalary: string;
  email?: string;
  password?: string;
}

export interface Freelancer {
  id: string;
  name: string;
  role: string;
  contactNumber: string;
  accountNumber?: string;
  ifsc?: string;
  branchName?: string;
}

export interface FreelancerPayment {
  id: string;
  freelancerId: string;
  sessionId: string;
  eventName: string;
  eventDate: string;
  amount: number;
  status: 'Pending' | 'Paid';
  paymentDate?: string;
}

export interface ClientPayment {
  id: string;
  sessionId: string;
  amount: number;
  date: string;
  method?: string;
  notes?: string;
}

export interface ClientEquipment {
  id: string;
  sessionId: string;
  itemName: string;
  receivedDate: string;
  isReturned: boolean;
  notes?: string;
}

export type ExpenseCategory = 'Rent' | 'Electricity' | 'WiFi' | 'Water' | 'Maintenance' | 'Equipment' | 'Other';
export type EquipmentCategory = 'CAMERA' | 'LENS' | 'LIGHTING' | 'AUDIO' | 'ACCESSORY' | 'OTHER';
export type EquipmentCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
export type EquipmentStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'LOST';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  condition: EquipmentCondition;
  status: EquipmentStatus;
  notes?: string;
}

export interface EditingStatus {
  photos: boolean;
  videos: boolean;
}

export interface ProjectEvent {
  name: string;
  date: string;
  dataSizeGB?: number;
  services?: string[];
}

export interface Session {
  id: string;
  clientId: string;
  events: ProjectEvent[];
  quotation: string; // Flexible text box
  grandTotal: number;
  stage: WorkflowStage;
  editingStatus: EditingStatus;
  isPaid: boolean;
  isDelivered: boolean;
  payments: ClientPayment[];
  clientEquipment: ClientEquipment[];
}

export interface AppState {
  clients: Client[];
  employees: Employee[];
  freelancers: Freelancer[];
  freelancerPayments: FreelancerPayment[];
  sessions: Session[];
  expenses: Expense[];
  equipment: Equipment[];
  user: User | null;
}
