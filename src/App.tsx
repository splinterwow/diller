
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

// Layout
import DashboardLayout from "@/layouts/DashboardLayout";

// Superadmin pages
import SuperAdminDashboard from "@/pages/superadmin/Dashboard";
import SubscriptionPage from "@/pages/superadmin/Subscription";
import PaymentsPage from "@/pages/superadmin/Payments";
import UsersPage from "@/pages/superadmin/Users";
import SuperAdminSettings from "@/pages/superadmin/Settings";
import SuperAdminReports from "@/pages/superadmin/Reports";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import ProductsPage from "@/pages/admin/Products";
import DealersPage from "@/pages/admin/Dealers";
import StoresPage from "@/pages/admin/Stores";
import WarehousePage from "@/pages/admin/Warehouse";
import ReturnsPage from "@/pages/admin/Returns";
import TrashPage from "@/pages/admin/Trash";
import AdminReports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/Settings";
import InvoicesPage from "@/pages/admin/Invoices";
import OrdersPage from "@/pages/admin/Orders";

// Warehouse pages
import WarehouseDashboard from "@/pages/warehouse/Dashboard";
import InventoryPage from "@/pages/warehouse/Inventory";
import WarehouseDeliveries from "@/pages/warehouse/Deliveries";
import WarehouseReturns from "@/pages/warehouse/Returns";
import WarehouseTrash from "@/pages/warehouse/Trash";
import WarehouseReports from "@/pages/warehouse/Reports";
import WarehouseSettings from "@/pages/warehouse/Settings";

// Dealer pages
import DealerDashboard from "@/pages/dealer/Dashboard";
import DealerProducts from "@/pages/dealer/Products";
import DealerStores from "@/pages/dealer/Stores";
import DealerAgents from "@/pages/dealer/Agents";
import DealerOrders from "@/pages/dealer/Orders";
import DealerReturns from "@/pages/dealer/Returns";
import DealerInvoices from "@/pages/dealer/Invoices";
import DealerReports from "@/pages/dealer/Reports";
import DealerSettings from "@/pages/dealer/Settings";

// Agent pages
import AgentDashboard from "@/pages/agent/Dashboard";
import AgentDeliveries from "@/pages/agent/Deliveries";
import AgentReports from "@/pages/agent/Reports";
import AgentSettings from "@/pages/agent/Settings";

// Store pages
import StoreDashboard from "@/pages/store/Dashboard";
import StoreOrders from "@/pages/store/Orders";
import StoreReturns from "@/pages/store/Returns";
import StoreReports from "@/pages/store/Reports";
import StoreSettings from "@/pages/store/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Route */}
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  
                  {/* Superadmin Routes */}
                  <Route path="/superadmin" element={
                    <ProtectedRoute requiredRole="superadmin">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<SuperAdminDashboard />} />
                    <Route path="subscription" element={<SubscriptionPage />} />
                    <Route path="payments" element={<PaymentsPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="reports" element={<SuperAdminReports />} />
                    <Route path="settings" element={<SuperAdminSettings />} />
                  </Route>
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="dealers" element={<DealersPage />} />
                    <Route path="stores" element={<StoresPage />} />
                    <Route path="warehouse" element={<WarehousePage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="returns" element={<ReturnsPage />} />
                    <Route path="trash" element={<TrashPage />} />
                    <Route path="invoices" element={<InvoicesPage />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                  
                  {/* Warehouse Routes */}
                  <Route path="/warehouse" element={
                    <ProtectedRoute requiredRole="warehouse">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<WarehouseDashboard />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="deliveries" element={<WarehouseDeliveries />} />
                    <Route path="returns" element={<WarehouseReturns />} />
                    <Route path="trash" element={<WarehouseTrash />} />
                    <Route path="reports" element={<WarehouseReports />} />
                    <Route path="settings" element={<WarehouseSettings />} />
                  </Route>
                  
                  {/* Dealer Routes */}
                  <Route path="/dealer" element={
                    <ProtectedRoute requiredRole="dealer">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<DealerDashboard />} />
                    <Route path="products" element={<DealerProducts />} />
                    <Route path="stores" element={<DealerStores />} />
                    <Route path="agents" element={<DealerAgents />} />
                    <Route path="orders" element={<DealerOrders />} />
                    <Route path="returns" element={<DealerReturns />} />
                    <Route path="invoices" element={<DealerInvoices />} />
                    <Route path="reports" element={<DealerReports />} />
                    <Route path="settings" element={<DealerSettings />} />
                  </Route>
                  
                  {/* Agent Routes */}
                  <Route path="/agent" element={
                    <ProtectedRoute requiredRole="agent">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<AgentDashboard />} />
                    <Route path="deliveries" element={<AgentDeliveries />} />
                    <Route path="reports" element={<AgentReports />} />
                    <Route path="settings" element={<AgentSettings />} />
                  </Route>
                  
                  {/* Store Routes */}
                  <Route path="/store" element={
                    <ProtectedRoute requiredRole="store">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<StoreDashboard />} />
                    <Route path="orders" element={<StoreOrders />} />
                    <Route path="returns" element={<StoreReturns />} />
                    <Route path="reports" element={<StoreReports />} />
                    <Route path="settings" element={<StoreSettings />} />
                  </Route>
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
