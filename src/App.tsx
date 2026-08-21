import StudioAuthPortal from './components/admin/StudioAuthPortal';
import AdminDashboard from './components/admin/AdminDashboard';
import InvitationView from './components/InvitationView';
import { useWeddingData } from './context/WeddingDataContext';

export default function App() {
  const { viewMode, isAuthenticated } = useWeddingData();

  // In Admin / Studio Management Mode
  if (viewMode === 'admin') {
    // If not yet authenticated, show the login & registration portal
    if (!isAuthenticated) {
      return <StudioAuthPortal />;
    }
    // After login, show the complete Studio Management dashboard
    return <AdminDashboard />;
  }

  // Otherwise, show the interactive wedding invitation experience
  return <InvitationView />;
}
