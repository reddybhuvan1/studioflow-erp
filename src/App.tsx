import { useState } from 'react';
import { Layout } from './components/Layout';
import { HomeDashboard } from './modules/Dashboard/HomeDashboard';
import { Dashboard as PipelineDashboard } from './modules/Workflow/Dashboard';
import { ClientProfile } from './modules/Profiles/ClientProfile';
import { EmployeeProfile } from './modules/Profiles/EmployeeProfile';
import { SessionCreation } from './modules/Projects/SessionCreation';
import { Leads } from './modules/Leads/Leads';
import { CalendarModule } from './modules/Calendar/Calendar';
import { Freelancers } from './modules/Freelancers/Freelancers';
import { Expenses } from './modules/Expenses/Expenses';
import { FinancialDashboard } from './modules/Financials/FinancialDashboard';
import { InventoryVault } from './modules/Inventory/InventoryVault';
import { useApp, AppProvider } from './hooks/AppContext';
import { Login } from './modules/Auth/Login';
import { GalleryManagement } from './modules/ProjectGalleries/GalleryManagement';
import { ClientGallery } from './modules/ProjectGalleries/ClientGallery';

function AppContent() {
  const { user } = useApp();
  const [currentView, setCurrentView] = useState('Dashboard');

  if (!user) {
    return <Login />;
  }

  // Handle public gallery route separately if we're not using a router (v1 approach)
  // For v2 we'll check path manually if needed, but since we're in a single-page state app
  // let's check if the URL starts with /gallery/
  const path = window.location.pathname;
  if (path.startsWith('/gallery/')) {
    return <ClientGallery />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard': return <HomeDashboard />;
      case 'Production': return <PipelineDashboard onNewProject={() => setCurrentView('Projects')} />;
      case 'Leads': return <Leads />;
      case 'Calendar': return <CalendarModule />;
      case 'Clients': return <ClientProfile />;
      case 'Employees': return <EmployeeProfile />;
      case 'Projects': return <SessionCreation />;
      case 'Freelancers': return <Freelancers />;
      case 'Expenses': return <Expenses />;
      case 'Financials': return <FinancialDashboard />;
      case 'Equipment': return <InventoryVault />;
      case 'Galleries': return <GalleryManagement />;
      default: return <HomeDashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
