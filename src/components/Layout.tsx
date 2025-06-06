import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  FileBarChart, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut,
  ChevronDown,
  ShoppingCart,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

const BottomNav = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'staff';

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'manager', 'staff'] },
    { name: 'Products', path: '/products', icon: <Package size={20} />, roles: ['admin', 'manager', 'staff'] },
    { name: 'Sales', path: '/sales', icon: <ShoppingCart size={20} />, roles: ['admin', 'manager', 'staff'] },
    { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} />, roles: ['admin', 'manager'] },
    { name: 'Reports', path: '/reports', icon: <FileBarChart size={20} />, roles: ['admin', 'manager'] },
    { name: 'Users', path: '/users', icon: <Users size={20} />, roles: ['admin'] },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['admin'] }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/30 z-50 backdrop-blur-md">
      <div className="flex justify-around items-center h-16 px-4">
        {filteredNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === item.path
                ? 'text-[var(--primary-700)] bg-gradient-to-t from-[var(--primary-100)] to-[var(--primary-50)] shadow-md'
                : 'text-[var(--neutral-600)] hover:text-[var(--primary-600)]'
            }`}
          >
            <div className={`transition-transform duration-200 ${location.pathname === item.path ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className="text-xs mt-1 font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

const Header = () => {
  const { getLowStockProducts } = useProducts();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser } = useAuth();
  
  const lowStockProducts = getLowStockProducts();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-white/30 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <div className="mint-gradient text-white font-bold text-xl h-10 w-10 rounded-xl flex items-center justify-center shadow-lg hover-lift">
            <Sparkles size={20} />
          </div>
          <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-[var(--primary-700)] to-[var(--accent-700)] bg-clip-text text-transparent">
            Glitched Technologies
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="p-2 text-[var(--neutral-600)] hover:text-[var(--primary-700)] hover:bg-[var(--primary-50)] rounded-full transition-all duration-200 hover-lift"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {lowStockProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-[var(--error-500)] to-[var(--error-600)] text-white text-xs flex items-center justify-center font-semibold animate-pulse-gentle">
                  {lowStockProducts.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 modal-content rounded-xl border border-white/30 py-1 z-50 animate-slide-in-bottom cool-shadow">
                <div className="px-4 py-3 border-b border-[var(--neutral-200)]">
                  <h3 className="text-sm font-semibold text-[var(--neutral-800)] flex items-center">
                    <Bell size={16} className="mr-2 text-[var(--primary-600)]" />
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                      <div key={product.id} className="px-4 py-3 hover:bg-[var(--primary-25)] transition-colors duration-200">
                        <div className="text-sm text-[var(--error-600)] font-medium">
                          Low stock alert: {product.name}
                        </div>
                        <div className="text-xs text-[var(--neutral-500)] mt-1">
                          Current quantity: {product.quantity} (below threshold of {product.threshold})
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-sm text-[var(--neutral-600)] text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[var(--success-100)] flex items-center justify-center">
                        <Bell size={20} className="text-[var(--success-600)]" />
                      </div>
                      No low stock alerts
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              className="flex items-center text-[var(--neutral-600)] hover:text-[var(--primary-700)] transition-all duration-200 hover-lift"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[var(--primary-400)] to-[var(--accent-400)] flex items-center justify-center text-white font-semibold shadow-md">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <ChevronDown size={16} className="ml-1" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 modal-content rounded-xl border border-white/30 py-1 z-50 animate-slide-in-bottom cool-shadow">
                <div className="px-4 py-3 border-b border-[var(--neutral-200)]">
                  <p className="text-sm font-semibold text-[var(--neutral-800)]">{currentUser?.name}</p>
                  <p className="text-xs text-[var(--neutral-500)]">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-[var(--primary-100)] to-[var(--accent-100)] text-[var(--primary-700)]">
                    {currentUser?.role}
                  </span>
                </div>
                <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-[var(--neutral-700)] hover:bg-[var(--primary-25)] transition-colors duration-200">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-[var(--error-600)] hover:bg-[var(--error-25)] transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const Layout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden gradient-bg">
      <Header />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Layout;