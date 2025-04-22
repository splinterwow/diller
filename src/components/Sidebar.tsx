
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Store, 
  Users, 
  Database, 
  BarChart3, 
  Settings, 
  Truck,
  ReceiptText,
  RotateCcw,
  Trash2,
  ShoppingCart,
  CreditCard,
  UserCog,
  BookUser
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  title: string;
  label?: string;
  icon: React.ElementType;
  path: string;
  variant: 'default' | 'ghost';
}

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getSidebarItems = (): NavItem[] => {
    if (!user) return [];

    // Define navigation items based on user role
    switch (user.role) {
      case 'superadmin':
        return [
          {
            title: t('dashboard'),
            icon: LayoutDashboard,
            path: '/superadmin',
            variant: 'default',
          },
          {
            title: t('subscription'),
            icon: CreditCard,
            path: '/superadmin/subscription',
            variant: 'ghost',
          },
          {
            title: t('payments'),
            icon: ReceiptText,
            path: '/superadmin/payments',
            variant: 'ghost',
          },
          {
            title: t('users'),
            icon: Users,
            path: '/superadmin/users',
            variant: 'ghost',
          },
          {
            title: t('reports'),
            icon: BarChart3,
            path: '/superadmin/reports',
            variant: 'ghost',
          },
          {
            title: t('settings'),
            icon: Settings,
            path: '/superadmin/settings',
            variant: 'ghost',
          },
        ];
      case 'admin':
        return [
          {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: '/admin',
            variant: 'default',
          },
          {
            title: "Mahsulotlar",
            icon: Package,
            path: '/admin/products',
            variant: 'ghost',
          },
          {
            title: "Dillerlar",
            icon: Users,
            path: '/admin/dealers',
            variant: 'ghost',
          },
          {
            title: "Do'konlar",
            icon: Store,
            path: '/admin/stores',
            variant: 'ghost',
          },
          {
            title: "Ombor",
            icon: Database,
            path: '/admin/warehouse',
            variant: 'ghost',
          },
          {
            title: "Buyurtmalar",
            icon: ShoppingCart,
            path: '/admin/orders',
            variant: 'ghost',
          },
          {
            title: "Hisob-fakturalar",
            icon: ReceiptText,
            path: '/admin/invoices',
            variant: 'ghost',
          },
          {
            title: "Qaytarishlar",
            icon: RotateCcw,
            path: '/admin/returns',
            variant: 'ghost',
          },
          {
            title: "Axlat",
            icon: Trash2,
            path: '/admin/trash',
            variant: 'ghost',
          },
          {
            title: "Hisobotlar",
            icon: BarChart3,
            path: '/admin/reports',
            variant: 'ghost',
          },
          {
            title: "Sozlamalar",
            icon: Settings,
            path: '/admin/settings',
            variant: 'ghost',
          },
        ];
      case 'warehouse':
        return [
          {
            title: t('dashboard'),
            icon: LayoutDashboard,
            path: '/warehouse',
            variant: 'default',
          },
          {
            title: t('inventory'),
            icon: Package,
            path: '/warehouse/inventory',
            variant: 'ghost',
          },
          {
            title: t('deliveries'),
            icon: Truck,
            path: '/warehouse/deliveries',
            variant: 'ghost',
          },
          {
            title: t('returns'),
            icon: RotateCcw,
            path: '/warehouse/returns',
            variant: 'ghost',
          },
          {
            title: t('trash'),
            icon: Trash2,
            path: '/warehouse/trash',
            variant: 'ghost',
          },
          {
            title: t('reports'),
            icon: BarChart3,
            path: '/warehouse/reports',
            variant: 'ghost',
          },
          {
            title: t('settings'),
            icon: Settings,
            path: '/warehouse/settings',
            variant: 'ghost',
          },
        ];
      case 'dealer':
        return [
          {
            title: t('dashboard'),
            icon: LayoutDashboard,
            path: '/dealer',
            variant: 'default',
          },
          {
            title: t('products'),
            icon: Package,
            path: '/dealer/products',
            variant: 'ghost',
          },
          {
            title: t('stores'),
            icon: Store,
            path: '/dealer/stores',
            variant: 'ghost',
          },
          {
            title: t('agents'),
            icon: UserCog,
            path: '/dealer/agents',
            variant: 'ghost',
          },
          {
            title: t('orders'),
            icon: ShoppingCart,
            path: '/dealer/orders',
            variant: 'ghost',
          },
          {
            title: t('returns'),
            icon: RotateCcw,
            path: '/dealer/returns',
            variant: 'ghost',
          },
          {
            title: t('invoices'),
            icon: ReceiptText,
            path: '/dealer/invoices',
            variant: 'ghost',
          },
          {
            title: t('reports'),
            icon: BarChart3,
            path: '/dealer/reports',
            variant: 'ghost',
          },
          {
            title: t('settings'),
            icon: Settings,
            path: '/dealer/settings',
            variant: 'ghost',
          },
        ];
      case 'agent':
        return [
          {
            title: t('dashboard'),
            icon: LayoutDashboard,
            path: '/agent',
            variant: 'default',
          },
          {
            title: t('deliveries'),
            icon: Truck,
            path: '/agent/deliveries',
            variant: 'ghost',
          },
          {
            title: t('reports'),
            icon: BarChart3,
            path: '/agent/reports',
            variant: 'ghost',
          },
          {
            title: t('settings'),
            icon: Settings,
            path: '/agent/settings',
            variant: 'ghost',
          },
        ];
      case 'store':
        return [
          {
            title: t('dashboard'),
            icon: LayoutDashboard,
            path: '/store',
            variant: 'default',
          },
          {
            title: t('orders'),
            icon: ShoppingCart,
            path: '/store/orders',
            variant: 'ghost',
          },
          {
            title: t('returns'),
            icon: RotateCcw,
            path: '/store/returns',
            variant: 'ghost',
          },
          {
            title: t('reports'),
            icon: BarChart3,
            path: '/store/reports',
            variant: 'ghost',
          },
          {
            title: t('settings'),
            icon: Settings,
            path: '/store/settings',
            variant: 'ghost',
          },
        ];
      default:
        return [];
    }
  };

  const items = getSidebarItems();

  return (
    <div 
      className={cn(
        "flex flex-col bg-background dark:bg-slate-900 border-r p-2 transition-all duration-300 h-screen",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b mb-2">
        <Link to={`/${user?.role}`} className="flex items-center">
          {!isCollapsed ? (
            <h1 className="text-xl font-bold text-primary">CDDiller</h1>
          ) : (
            <h1 className="text-xl font-bold text-primary">CD</h1>
          )}
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 px-2">
          {items.map((item, index) => (
            <Button
              key={index}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className={cn(
                "justify-start h-10",
                isCollapsed && "justify-center px-2"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
              {!isCollapsed && <span>{item.title}</span>}
              {item.label && !isCollapsed && (
                <span className="ml-auto text-xs">{item.label}</span>
              )}
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t h-14 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
