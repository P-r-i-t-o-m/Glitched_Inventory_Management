import { Link } from 'react-router-dom';
import { Package, AlertTriangle, TrendingUp, BarChart4, ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/initialData';

const DashboardCard = ({ title, value, icon, color, onClick }: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}) => {
  return (
    <div 
      className={`card p-6 flex items-center cursor-pointer hover:shadow-lg transition-all duration-200`}
      onClick={onClick}
    >
      <div className={`rounded-full p-3 ${color} mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-[var(--neutral-500)]">{title}</h3>
        <p className="text-2xl font-semibold text-[var(--neutral-800)]">{value}</p>
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Category Distribution</h2>
        <Link to="/products" className="text-[var(--primary-500)] hover:text-[var(--primary-700)] text-sm flex items-center">
          View All <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
      <div className="space-y-4">
        {categories.map(category => {
          const count = getCategoryCount(category);
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[var(--neutral-700)]">{category}</span>
                <span className="text-sm font-medium text-[var(--neutral-700)]">{count}</span>
              </div>
              <div className="h-2 bg-[var(--neutral-200)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--primary-500)] rounded-full" 
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Low Stock Alerts</h2>
        <Link to="/products" className="text-[var(--primary-500)] hover:text-[var(--primary-700)] text-sm flex items-center">
          View All <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
      
      {lowStockProducts.length > 0 ? (
        <div className="space-y-3">
          {lowStockProducts.slice(0, 5).map(product => (
            <div key={product.id} className="flex items-center p-3 bg-[var(--neutral-50)] rounded-md border border-[var(--neutral-200)]">
              <div className="rounded-full bg-[var(--error-100)] p-2 mr-3">
                <AlertTriangle size={16} className="text-[var(--error-600)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--neutral-800)] truncate">{product.name}</p>
                <div className="flex items-center text-xs text-[var(--neutral-600)]">
                  <span className="font-medium">Qty: {product.quantity}</span>
                  <span className="mx-1">&bull;</span>
                  <span className="text-[var(--error-600)]">Below threshold ({product.threshold})</span>
                </div>
              </div>
            </div>
          ))}
          
          {lowStockProducts.length > 5 && (
            <p className="text-sm text-center text-[var(--neutral-500)]">
              + {lowStockProducts.length - 5} more items
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-[var(--neutral-500)]">
          <p>No low stock items</p>
        </div>
      )}
    </div>
  );
};

const RecentProducts = () => {
  const { products } = useProducts();
  
  // Sort products by creation date (newest first) and take the first 5
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--neutral-800)]">Recent Products</h2>
        <Link to="/products" className="text-[var(--primary-500)] hover:text-[var(--primary-700)] text-sm flex items-center">
          View All <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--neutral-200)]">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">Product</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">Category</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">Price</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--neutral-200)]">
            {recentProducts.map(product => (
              <tr key={product.id} className="hover:bg-[var(--neutral-50)]">
                <td className="px-3 py-2 whitespace-nowrap text-sm text-[var(--neutral-800)]">{product.name}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-[var(--neutral-600)]">{product.category}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-[var(--neutral-800)]">৳{product.price.toLocaleString()}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.quantity <= product.threshold 
                      ? 'bg-[var(--error-100)] text-[var(--error-800)]' 
                      : 'bg-[var(--success-100)] text-[var(--success-800)]'
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

const Dashboard = () => {
  const { products, getProductStats, getLowStockProducts } = useProducts();
  const { totalProducts, totalValue, categoryCounts } = getProductStats();
  const lowStockProducts = getLowStockProducts();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Products"
          value={totalProducts}
          icon={<Package size={24} className="text-[var(--primary-500)]" />}
          color="bg-[var(--primary-50)]"
        />
        <DashboardCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={<AlertTriangle size={24} className="text-[var(--warning-500)]" />}
          color="bg-[var(--warning-50)]"
        />
        <DashboardCard
          title="Inventory Value"
          value={`৳${totalValue.toLocaleString()}`}
          icon={<TrendingUp size={24} className="text-[var(--success-500)]" />}
          color="bg-[var(--success-50)]"
        />
        <DashboardCard
          title="Categories"
          value={categories.length}
          icon={<BarChart4 size={24} className="text-[var(--accent-500)]" />}
          color="bg-[var(--accent-50)]"
        />
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
      </div>
    </div>
  );
};

export default Dashboard;