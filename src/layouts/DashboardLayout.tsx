
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/header';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If at root user path, redirect to dashboard
    if (location.pathname === `/${user?.role}`) {
      // Already at the right path
    } else if (location.pathname === '/') {
      // Redirect to the appropriate dashboard based on role
      navigate(`/${user?.role}`);
    }
  }, [location.pathname, user?.role, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex transition-all duration-300 ease-in-out md:relative",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
