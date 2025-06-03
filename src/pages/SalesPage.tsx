import { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Calendar,
  User,
  Package,
  Phone,
  Mail,
  MapPin,
  X,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useSales } from '../context/SalesContext';
import { useProducts } from '../context/ProductContext';
import { useUsers } from '../context/UserContext';
import { format } from 'date-fns';

interface SortConfig {
  key: 'date' | 'product' | 'seller' | 'customer' | 'price';
  direction: 'asc' | 'desc';
}

const SalesPage = () => {
  const { soldProducts } = useSales();
  const { products } = useProducts();
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc'
  });
  
  // Handle sorting
  const handleSort = (key: 'date' | 'product' | 'seller' | 'customer' | 'price') => {
    if (sortConfig.key === key) {
      setSortConfig({
        ...sortConfig,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({ key, direction: 'desc' });
    }
  };
  
  // Get product name from ID
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };
  
  // Get seller name from ID
  const getSellerName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  // Filter and sort sales
  const filteredSales = soldProducts
    .filter(sale => {
      const product = getProductName(sale.productId).toLowerCase();
      const seller = getSellerName(sale.soldBy).toLowerCase();
      const customer = sale.customerName.toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return product.includes(search) ||
             seller.includes(search) ||
             customer.includes(search) ||
             sale.customerPhone.includes(search) ||
             sale.customerEmail.toLowerCase().includes(search);
    })
    .sort((a, b) => {
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      
      switch (sortConfig.key) {
        case 'date':
          return multiplier * (new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime());
        case 'product':
          return multiplier * getProductName(a.productId).localeCompare(getProductName(b.productId));
        case 'seller':
          return multiplier * getSellerName(a.soldBy).localeCompare(getSellerName(b.soldBy));
        case 'customer':
          return multiplier * a.customerName.localeCompare(b.customerName);
        case 'price':
          return multiplier * (a.totalPrice - b.totalPrice);
        default:
          return 0;
      }
    });
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Sales History</h1>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search sales..."
            className="pl-10 pr-4 py-2 w-full border border-[var(--neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:border-[var(--primary-500)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-500)]" size={18} />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
              onClick={() => setSearchTerm('')}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      {filteredSales.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--neutral-200)]">
              <thead className="bg-[var(--neutral-50)]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('date')}
                    >
                      Date & Time
                      {sortConfig.key === 'date' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('product')}
                    >
                      Product
                      {sortConfig.key === 'product' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('seller')}
                    >
                      Sold By
                      {sortConfig.key === 'seller' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('customer')}
                    >
                      Customer
                      {sortConfig.key === 'customer' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('price')}
                    >
                      Price
                      {sortConfig.key === 'price' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="ml-1 text-[var(--neutral-400)]" />
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--neutral-200)]">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[var(--neutral-50)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-[var(--neutral-500)] mr-2" />
                        <div>
                          <div className="text-sm font-medium text-[var(--neutral-800)]">
                            {format(new Date(sale.soldAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-[var(--neutral-500)]">
                            {format(new Date(sale.soldAt), 'HH:mm')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package size={16} className="text-[var(--neutral-500)] mr-2" />
                        <span className="text-sm text-[var(--neutral-800)]">
                          {getProductName(sale.productId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="text-[var(--neutral-500)] mr-2" />
                        <span className="text-sm text-[var(--neutral-800)]">
                          {getSellerName(sale.soldBy)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-[var(--neutral-800)]">
                          {sale.customerName}
                        </div>
                        <div className="flex items-center text-xs text-[var(--neutral-500)]">
                          <Phone size={12} className="mr-1" />
                          {sale.customerPhone}
                        </div>
                        <div className="flex items-center text-xs text-[var(--neutral-500)]">
                          <Mail size={12} className="mr-1" />
                          {sale.customerEmail}
                        </div>
                        <div className="flex items-center text-xs text-[var(--neutral-500)]">
                          <MapPin size={12} className="mr-1" />
                          {sale.customerAddress}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[var(--neutral-800)]">
                        {sale.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[var(--neutral-800)]">
                          ৳{sale.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--neutral-500)]">
                          ৳{sale.price.toLocaleString()} each
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-[var(--neutral-400)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--neutral-700)] mb-2">No sales found</h3>
          <p className="text-[var(--neutral-500)]">
            No sales match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesPage;