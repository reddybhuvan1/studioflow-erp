import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Auth (Mock for now, returns admin if matches)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@kranthi.com' && password === 'admin123') {
    return res.json({ id: 'admin', name: 'Admin', role: 'admin' });
  }
  const employee = await prisma.employee.findUnique({ where: { email } });
  if (employee && employee.password === password) {
    return res.json(employee);
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Clients
app.get('/api/clients', async (req, res) => {
  const clients = await prisma.client.findMany({ include: { sessions: true } });
  res.json(clients);
});

app.post('/api/clients', async (req: any, res: any) => {
  const { sessions, ...data } = req.body;
  const client = await prisma.client.create({ data });
  res.json(client);
});

app.put('/api/clients/:id', async (req: any, res: any) => {
  const { sessions, ...data } = req.body;
  const client = await prisma.client.update({ where: { id: req.params.id }, data });
  res.json(client);
});

app.delete('/api/clients/:id', async (req: any, res: any) => {
  await prisma.client.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Helper to map UI display strings to Prisma Enums
const toPrismaEnum = (val: string) => val.toUpperCase().replace(/\s+/g, '_');
const fromPrismaEnum = (val: string) => {
  return val.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const mapLeadToUI = (lead: any) => ({
  ...lead,
  type: fromPrismaEnum(lead.type),
  status: fromPrismaEnum(lead.status)
});

// Leads
app.get('/api/leads', async (req, res) => {
  const leads = await prisma.lead.findMany();
  res.json(leads.map(mapLeadToUI));
});

app.post('/api/leads', async (req: any, res: any) => {
  const { jobs, ...rawData } = req.body;
  const data = {
    ...rawData,
    type: toPrismaEnum(rawData.type),
    status: toPrismaEnum(rawData.status)
  };
  const lead = await prisma.lead.create({ data });
  res.json(mapLeadToUI(lead));
});

app.put('/api/leads/:id', async (req: any, res: any) => {
  const { jobs, ...rawData } = req.body;
  const data = {
    ...rawData,
    type: rawData.type ? toPrismaEnum(rawData.type) : undefined,
    status: rawData.status ? toPrismaEnum(rawData.status) : undefined
  };
  const lead = await prisma.lead.update({ where: { id: req.params.id }, data });
  res.json(mapLeadToUI(lead));
});

app.delete('/api/leads/:id', async (req: any, res: any) => {
  await prisma.lead.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

const mapJobToUI = (job: any) => ({
  ...job,
  type: fromPrismaEnum(job.type)
});

// Jobs
app.get('/api/jobs', async (req, res) => {
  const jobs = await prisma.job.findMany();
  res.json(jobs.map(mapJobToUI));
});

app.post('/api/jobs', async (req: any, res: any) => {
  const { lead, ...rawData } = req.body;
  const data = {
    ...rawData,
    type: toPrismaEnum(rawData.type)
  };
  const job = await prisma.job.create({ data });
  res.json(mapJobToUI(job));
});

app.put('/api/jobs/:id', async (req: any, res: any) => {
  const { lead, ...rawData } = req.body;
  const data = {
    ...rawData,
    type: rawData.type ? toPrismaEnum(rawData.type) : undefined
  };
  const job = await prisma.job.update({ where: { id: req.params.id }, data });
  res.json(mapJobToUI(job));
});

app.delete('/api/jobs/:id', async (req: any, res: any) => {
  await prisma.job.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Sessions
app.get('/api/sessions', async (req: any, res: any) => {
  const sessions = await prisma.session.findMany({ include: { client: true, payments: true, clientEquipment: true } });
  res.json(sessions);
});

app.post('/api/sessions', async (req: any, res: any) => {
  const { client, payments, clientEquipment, ...data } = req.body;
  const session = await prisma.session.create({ data });
  res.json(session);
});

app.put('/api/sessions/:id', async (req: any, res: any) => {
  const { client, payments, clientEquipment, ...data } = req.body;
  const session = await prisma.session.update({ where: { id: req.params.id }, data });
  res.json(session);
});

app.delete('/api/sessions/:id', async (req: any, res: any) => {
  await prisma.session.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Freelancers
app.get('/api/freelancers', async (req, res) => {
  const freelancers = await prisma.freelancer.findMany({ include: { payments: true } });
  res.json(freelancers);
});

app.post('/api/freelancers', async (req: any, res: any) => {
  const { payments, ...data } = req.body;
  const f = await prisma.freelancer.create({ data });
  res.json(f);
});

app.put('/api/freelancers/:id', async (req: any, res: any) => {
  const { payments, ...data } = req.body;
  const f = await prisma.freelancer.update({ where: { id: req.params.id }, data });
  res.json(f);
});

app.delete('/api/freelancers/:id', async (req: any, res: any) => {
  await prisma.freelancer.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Expenses
app.get('/api/expenses', async (req, res) => {
  const expenses = await prisma.expense.findMany();
  res.json(expenses);
});

app.post('/api/expenses', async (req, res) => {
  const ex = await prisma.expense.create({ data: req.body });
  res.json(ex);
});

app.delete('/api/expenses/:id', async (req, res) => {
  await prisma.expense.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Employees
app.get('/api/employees', async (req, res) => {
  const emps = await prisma.employee.findMany();
  res.json(emps);
});

app.post('/api/employees', async (req, res) => {
  const emp = await prisma.employee.create({ data: req.body });
  res.json(emp);
});

app.put('/api/employees/:id', async (req, res) => {
  const emp = await prisma.employee.update({ where: { id: req.params.id }, data: req.body });
  res.json(emp);
});

app.delete('/api/employees/:id', async (req, res) => {
  await prisma.employee.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Freelancer Payments
app.get('/api/freelancer-payments', async (req: any, res: any) => {
  const payments = await prisma.freelancerPayment.findMany();
  res.json(payments);
});

app.post('/api/freelancer-payments', async (req: any, res: any) => {
  const { freelancer, ...data } = req.body;
  const payment = await prisma.freelancerPayment.create({ data });
  res.json(payment);
});

app.put('/api/freelancer-payments/:id', async (req: any, res: any) => {
  const { freelancer, ...data } = req.body;
  const payment = await prisma.freelancerPayment.update({ where: { id: req.params.id }, data });
  res.json(payment);
});

app.delete('/api/freelancer-payments/:id', async (req: any, res: any) => {
  await prisma.freelancerPayment.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Client Payments
app.post('/api/client-payments', async (req: any, res: any) => {
  const { session, ...data } = req.body;
  const payment = await prisma.clientPayment.create({ data });
  res.json(payment);
});

app.delete('/api/client-payments/:id', async (req: any, res: any) => {
  await prisma.clientPayment.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Client Equipment
app.post('/api/client-equipment', async (req: any, res: any) => {
  const { session, ...data } = req.body;
  const eq = await prisma.clientEquipment.create({ data });
  res.json(eq);
});

app.put('/api/client-equipment/:id', async (req: any, res: any) => {
  const { session, ...data } = req.body;
  const eq = await prisma.clientEquipment.update({ where: { id: req.params.id }, data });
  res.json(eq);
});

app.delete('/api/client-equipment/:id', async (req: any, res: any) => {
  await prisma.clientEquipment.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Equipment
app.get('/api/equipment', async (req, res) => {
  const eq = await prisma.equipment.findMany();
  res.json(eq);
});

app.post('/api/equipment', async (req, res) => {
  const eq = await prisma.equipment.create({ data: req.body });
  res.json(eq);
});

app.put('/api/equipment/:id', async (req, res) => {
  const eq = await prisma.equipment.update({ where: { id: req.params.id }, data: req.body });
  res.json(eq);
});

app.delete('/api/equipment/:id', async (req, res) => {
  await prisma.equipment.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Galleries
app.get('/api/galleries', async (req, res) => {
  const galleries = await prisma.gallery.findMany({ include: { images: true } });
  res.json(galleries);
});

app.get('/api/galleries/:id', async (req, res) => {
  const gallery = await prisma.gallery.findUnique({
    where: { id: req.params.id },
    include: { images: true }
  });
  if (!gallery) return res.status(404).json({ error: 'Gallery not found' });
  res.json(gallery);
});

app.post('/api/galleries', async (req, res) => {
  const { images, ...data } = req.body;
  const gallery = await prisma.gallery.create({
    data: {
      ...data,
      images: images ? { create: images } : undefined
    },
    include: { images: true }
  });
  res.json(gallery);
});

app.put('/api/galleries/:id', async (req, res) => {
  const { images, ...data } = req.body;
  const gallery = await prisma.gallery.update({
    where: { id: req.params.id },
    data,
    include: { images: true }
  });
  res.json(gallery);
});

app.delete('/api/galleries/:id', async (req, res) => {
  await prisma.gallery.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

app.post('/api/galleries/:id/images', async (req, res) => {
  const images = req.body; // Expecting GalleryImage[]
  const galleryId = req.params.id;
  
  const createdImages = await Promise.all(
    images.map((img: any) => 
      prisma.galleryImage.create({
        data: {
          galleryId,
          url: img.url,
          isSelected: false
        }
      })
    )
  );
  res.json(createdImages);
});

app.put('/api/gallery-images/:id/toggle', async (req, res) => {
  const image = await prisma.galleryImage.findUnique({ where: { id: req.params.id } });
  if (!image) return res.status(404).json({ error: 'Image not found' });
  
  const updated = await prisma.galleryImage.update({
    where: { id: req.params.id },
    data: { isSelected: !image.isSelected }
  });
  res.json(updated);
});

app.delete('/api/gallery-images/:id', async (req, res) => {
  await prisma.galleryImage.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Start
app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
