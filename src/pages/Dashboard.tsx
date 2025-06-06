import { Link } from 'react-router-dom';
import { Package, AlertTriangle, TrendingUp, BarChart4, ArrowRight, DollarSign, ShoppingBag, Sparkles, Activity } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useUsers } from '../context/UserContext';
import { categories } from '../data/initialData';
import { useSales } from '../context/SalesContext';
import { format } from 'date-fns';

const DashboardCard = ({ title, value, icon, color, gradient, onClick }: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  onClick?: () => void;
}) => {
  return (
    <div 
      className={`card p-6 flex items-center cursor-pointer hover-lift hover-glow transition-all duration-300`}
      onClick={onClick}
    >
      <div className={`rounded-xl p-4 ${gradient} mr-4 shadow-lg`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-[var(--neutral-500)] uppercase tracking-wide">{title}</h3>
        <p className="text-2xl font-bold text-[var(--neutral-800)] mt-1">{value}</p>
      </div>
    </div>
  );
};

const CategoryDistribution = () => {
  const { products } = useProducts();
  
  const getCategoryCount = (category: string) => {
    return products.filter(p => p.category === category).length;
  };
  
  const getMaxCategoryCount = () => {
    return Math.max(...categories.map(cat => getCategoryCount(cat)));
  };
  
  const maxCount = getMaxCategoryCount();
  
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-[var(--neutral-800)] flex items-center">
          <BarChart4 size={20} className="mr-2 text-[var(--primary-600)]" />
          Category Distribution
        </h2>
        <Link to="/products" className="text-[var(--primary-600)] hover:text-[var(--primary-800)] text-sm flex items-center font-medium hover-lift transition-all duration-200">
          View All <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
      <div className="space-y-4">
        {categories.map(category => {
          const count = getCategoryCount(category);
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={category} className="group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[var(--neutral-700)]">{category}</span>
                <span className="text-sm font-bold text-[var(--primary-700)]">{count}</span>
              </div>
              <div className="h-3 bg-[var(--neutral-200)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LowStockProducts = () => {
  const { getLowStockProducts } = useProducts();
  const lowStockProducts = getLowStockProducts();
  
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-[var(--neutral-800)] flex items-center">
          <AlertTriangle size={20} className="mr-2 text-[var(--warning-600)]" />
          Low Stock Alerts
        </h2>
        <Link to="/products" className="text-[var(--primary-600)] hover:text-[var(--primary-800)] text-sm flex items-center font-medium hover-lift transition-all duration-200">
          View All <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
      
      {lowStockProducts.length > 0 ? (
        <div className="space-y-3">
          {lowStockProducts.slice(0, 5).map(product => (
            <div key={product.id} className="flex items-center p-4 bg-gradient-to-r from-[var(--warning-50)] to-[var(--error-50)] rounded-xl border border-[var(--warning-200)] hover-lift transition-all duration-200">
              <div className="rounded-full bg-gradient-to-r from-[var(--warning-500)] to-[var(--error-500)] p-2 mr-3 shadow-md">
                <AlertTriangle size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--neutral-800)] truncate">{product.name}</p>
                <div className="flex items-center text-xs text-[var(--neutral-600)] mt-1">
                  <span className="font-medium">Qty: {product.quantity}</span>
                  <span className="mx-2">&bull;</span>
                  <span className="text-[var(--error-600)] font-medium">Below threshold ({product.threshold})</span>
                </div>
              </div>
            </div>
          ))}
          
          {lowStockProducts.length > 5 && (
            <p className="text-sm text-center text-[var(--neutral-500)] font-medium">
              + {lowStockProducts.length - 5} more items
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--success-100)] to-[var(--success-200)] flex items-center justify-center mb-3">
            <Package size={24} className="text-[var(--success-600)]" />
          </div>
          <p className="text-[var(--success-600)] font-semibold">All stock levels are healthy!</p>
        </div>
      )}
    </div>
  );
};

const RecentProducts = () => {
  const { products } = useProducts();
  
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-[var(--neutral-800)] flex items-center">
          <Package size={20} className="mr-2 text-[var(--primary-600)]" />
          Recent Products
        </h2>
        <Link to="/products" className="text-[var(--primary-600)] hover:text-[var(--primary-800)] text-sm flex items-center font-medium hover-lift transition-all duration-200">
          View All <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="table-header">
              <th className="px-3 py-3 text-left text-xs font-bold text-[var(--neutral-600)] uppercase tracking-wider rounded-l-lg">Product</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-[var(--neutral-600)] uppercase tracking-wider">Category</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-[var(--neutral-600)] uppercase tracking-wider">Price</th>
              <th className="px-3 py-3 text-left text-xs font-bold text-[var(--neutral-600)] uppercase tracking-wider rounded-r-lg">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--neutral-200)]">
            {recentProducts.map(product => (
              <tr key={product.id} className="table-row">
                <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-[var(--neutral-800)]">{product.name}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[var(--primary-100)] to-[var(--accent-100)] text-[var(--primary-700)]">
                    {product.category}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-[var(--neutral-800)]">৳{product.price.toLocaleString()}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.quantity <= product.threshold 
                      ? 'bg-gradient-to-r from-[var(--error-100)] to-[var(--error-200)] text-[var(--error-800)]' 
                      : 'bg-gradient-to-r from-[var(--success-100)] to-[var(--success-200)] text-[var(--success-800)]'
                  }`}>
                    {product.quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecentSales = () => {
  const { soldProducts } = useSales();
  const { products } = useProducts();
  const { users } = useUsers();
  
  const recentSoldProducts = [...soldProducts]
    .sort((a, b) => new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime())
    .slice(0, 5);
  
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };
  
  const getSellerName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-[var(--neutral-800)] flex items-center">
          <Activity size={20} className="mr-2 text-[var(--accent-600)]" />
          Recent Sales
        </h2>
        <Link to="/sales" className="text-[var(--primary-600)] hover:text-[var(--primary-800)] text-sm flex items-center font-medium hover-lift transition-all duration-200">
          View All <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
      
      {recentSoldProducts.length > 0 ? (
        <div className="space-y-4">
          {recentSoldProducts.map((sale) => (
            <div key={sale.id} className="border border-[var(--neutral-200)] rounded-xl p-4 hover-lift transition-all duration-200 bg-gradient-to-r from-white to-[var(--primary-25)]">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-[var(--neutral-800)]">{getProductName(sale.productId)}</h3>
                  <p className="text-sm text-[var(--neutral-600)]">
                    Sold by <span className="font-medium text-[var(--primary-700)]">{getSellerName(sale.soldBy)}</span> • {format(new Date(sale.soldAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-[var(--primary-700)] to-[var(--accent-700)] bg-clip-text text-transparent">
                  ৳{sale.totalPrice.toLocaleString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div className="p-3 bg-white/60 rounded-lg">
                  <p className="text-[var(--neutral-500)] font-medium">Customer</p>
                  <p className="font-semibold text-[var(--neutral-700)]">{sale.customerName}</p>
                  <p className="text-[var(--neutral-600)]">{sale.customerPhone}</p>
                </div>
                <div className="p-3 bg-white/60 rounded-lg">
                  <p className="text-[var(--neutral-500)] font-medium">Details</p>
                  <p className="text-[var(--neutral-600)]">Quantity: <span className="font-semibold">{sale.quantity}</span></p>
                  <p className="text-[var(--neutral-600)]">Unit Price: <span className="font-semibold">৳{sale.price.toLocaleString()}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--accent-100)] to-[var(--accent-200)] flex items-center justify-center mb-3">
            <ShoppingBag size={24} className="text-[var(--accent-600)]" />
          </div>
          <p className="text-[var(--neutral-500)] font-medium">No sales recorded yet</p>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { products, getProductStats, getLowStockProducts } = useProducts();
  const { getSalesStats } = useSales();
  const { totalProducts, categoryCounts } = getProductStats();
  const { totalRevenue } = getSalesStats();
  const lowStockProducts = getLowStockProducts();
  
  // Calculate current inventory value (products currently in stock)
  const currentInventoryValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  
  // Calculate total sales value (products sold)
  const totalSalesValue = totalRevenue;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary-700)] to-[var(--accent-700)] bg-clip-text text-transparent flex items-center">
            <Sparkles size={32} className="mr-3 text-[var(--primary-600)]" />
            Dashboard
          </h1>
          <p className="text-[var(--neutral-600)] mt-1 font-medium">Welcome back! Here's what's happening with your inventory.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Products"
          value={totalProducts}
          icon={<Package size={24} />}
          color="text-[var(--primary-500)]"
          gradient="bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)]"
        />
        <DashboardCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={<AlertTriangle size={24} />}
          color="text-[var(--warning-500)]"
          gradient="bg-gradient-to-r from-[var(--warning-500)] to-[var(--error-500)]"
        />
        <DashboardCard
          title="Current Inventory Value"
          value={`৳${currentInventoryValue.toLocaleString()}`}
          icon={<TrendingUp size={24} />}
          color="text-[var(--success-500)]"
          gradient="bg-gradient-to-r from-[var(--success-500)] to-[var(--success-600)]"
        />
        <DashboardCard
          title="Total Sales Value"
          value={`৳${totalSalesValue.toLocaleString()}`}
          icon={<DollarSign size={24} />}
          color="text-[var(--accent-500)]"
          gradient="bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)]"
        />
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 hover-glow">
          <div className="flex items-center mb-6">
            <div className="rounded-xl p-4 bg-gradient-to-r from-[var(--success-500)] to-[var(--success-600)] text-white mr-4 shadow-lg">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--neutral-800)]">Products in Stock</h3>
              <p className="text-sm text-[var(--neutral-600)] font-medium">Current inventory value</p>
            </div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-[var(--success-700)] to-[var(--success-800)] bg-clip-text text-transparent mb-2">
            ৳{currentInventoryValue.toLocaleString()}
          </div>
          <div className="text-sm text-[var(--neutral-600)] font-medium">
            {products.filter(p => p.quantity > 0).length} products with stock
          </div>
        </div>

        <div className="card p-6 hover-glow">
          <div className="flex items-center mb-6">
            <div className="rounded-xl p-4 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] text-white mr-4 shadow-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--neutral-800)]">Products Sold</h3>
              <p className="text-sm text-[var(--neutral-600)] font-medium">Total sales revenue</p>
            </div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-[var(--primary-700)] to-[var(--accent-700)] bg-clip-text text-transparent mb-2">
            ৳{totalSalesValue.toLocaleString()}
          </div>
          <div className="text-sm text-[var(--neutral-600)] font-medium">
            Revenue from all sales
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentProducts />
        </div>
        <div>
          <CategoryDistribution />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <LowStockProducts />
        <RecentSales />
      </div>
    </div>
  );
};

export default Dashboard;