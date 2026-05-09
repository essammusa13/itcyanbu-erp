import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import ContactsPage from './components/ContactsPage';
import { ContactProvider } from './context/ContactContext';
import { CalendarProvider } from './context/CalendarContext';
import { EventProvider } from './context/EventContext';
import { SiteProvider } from './context/SiteContext';
import { PipelineProvider } from './context/PipelineContext';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import AuthCallback from './pages/auth/AuthCallback';
import LaunchpadPage from './pages/LaunchpadPage';
import DashboardPage from './pages/DashboardPage';
import ConversationsPage from './pages/ConversationsPage';
import CalendarsPage from './pages/CalendarsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import PaymentsPage from './pages/PaymentsPage';
import SettingsPage from './pages/SettingsPage';
import SitesPage from './pages/SitesPage';
import AiSolutionsPage from './pages/AiSolutionsPage';
import SuppliersServicesPage from './pages/SuppliersServicesPage';
import WebinarPage from './pages/WebinarPage';
import MarketingPage from './pages/MarketingPage';
import AutomationPage from './pages/AutomationPage';
import MembershipsPage from './pages/MembershipsPage';
import ReputationPage from './pages/ReputationPage';
import ReportingPage from './pages/ReportingPage';
import AppMarketplacePage from './pages/AppMarketplacePage';
import AffiliatePortalPage from './pages/AffiliatePortalPage';
import AgencyAnalyticsPage from './pages/AgencyAnalyticsPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import FacebookGroupPage from './pages/FacebookGroupPage';
import { PropertyTourPage } from './pages/Property/PropertyTourPage';
import { Loader2 } from 'lucide-react';
import WorkflowBuilder from './pages/WorkflowBuilder';
import ModernCarriersPage from './pages/ModernCarriersPage';

function App() {
  const [activeModule, setActiveModule] = useState(window.location.search.includes('tour') ? 'Property Tour' : 'Contacts');
  const { user, isSupabaseEnabled, loading } = useAuth();

  console.log('--- System Version v1.2.5 Loaded ---');

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-ghl-blue" size={40} />
      </div>
    );
  }

  const renderModule = () => {
    console.log('App: activeModule is:', activeModule);
    switch (activeModule) {
      case 'Launchpad':
        return <LaunchpadPage />;
      case 'Dashboard':
        return <DashboardPage />;
      case 'Conversations':
        return <ConversationsPage />;
      case 'Calendars':
        return <CalendarsPage />;
      case 'Contacts':
        return <ContactsPage />;
      case 'Opportunities':
        return <OpportunitiesPage />;
      case 'Payments':
        return <PaymentsPage />;
      case 'Settings':
        return <SettingsPage />;
      case 'Sites':
        return <SitesPage />;
      case 'AI Solutions':
        return <AiSolutionsPage />;
      case 'Marketing':
        return <MarketingPage />;
      case 'Automation':
        return <AutomationPage />;
      case 'Memberships':
        return <MembershipsPage />;
      case 'Reputation':
        return <ReputationPage />;
      case 'Reporting':
        return <ReportingPage />;
      case 'App Marketplace':
        return <AppMarketplacePage />;
      case 'Affiliate Portal':
        return <AffiliatePortalPage />;
      case 'Agency Analytics':
        return <AgencyAnalyticsPage />;
      case 'Media Library':
        return <MediaLibraryPage />;
      case 'Facebook Group':
        return <FacebookGroupPage />;
      case 'Suppliers Services':
        return <SuppliersServicesPage />;
      case 'Webinar':
        return <WebinarPage />;
      case 'Property Tour':
        return <PropertyTourPage />;
      case 'Modern Carriers':
        return <ModernCarriersPage />;
      default:
        return <ContactsPage />;
    }
  };

  // Routes for auth pages
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/automation/builder"
        element={
          !user && isSupabaseEnabled ? <Navigate to="/login" replace /> : <WorkflowBuilder />
        }
      />
      <Route
        path="/*"
        element={
          !user && isSupabaseEnabled ? (
            <Navigate to="/login" replace />
          ) : (
            <ContactProvider>
              <CalendarProvider>
                <EventProvider>
                  <SiteProvider>
                    <PipelineProvider>
                      <div className="flex h-screen bg-ghl-bg font-sans text-ghl-text overflow-hidden">
                        <Sidebar
                          activeModule={activeModule}
                          onModuleChange={setActiveModule}
                        />
                        <div className="flex-1 flex flex-col min-w-0 overflow-hidden min-h-0 relative">
                          <Header />
                          <div className="flex-1 flex flex-col overflow-y-auto" key={activeModule}>
                            {renderModule()}
                          </div>
                        </div>
                      </div>
                    </PipelineProvider>
                  </SiteProvider>
                </EventProvider>
              </CalendarProvider>
            </ContactProvider>
          )
        }
      />
    </Routes>
  );
}

export default App;
