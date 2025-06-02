import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialSales, initialProducts, Sale } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import toast from 'react-hot-toast';

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'soldAt' | 'soldBy'>) => void;
  getSalesByDateRange: (startDate: string, endDate: string) => Sale[];
  getSalesByProduct: (productId: string) => Sale[];
  getSalesStats: () => {
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    topSellingProducts: Array<{
      productId: string;
      name: string;
      totalQuantity: number;
      totalRevenue: number;
    }>;
  };
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const { currentUser } = useAuth();
  const { products, updateProduct } = useProducts();

  useEffect(() => {
    const storedSales = localStorage.getItem('sales');
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    } else {
      setSales(initialSales);
      localStorage.setItem('sales', JSON.stringify(initialSales));
    }
  }, []);

  const saveSales = (updatedSales: Sale[]) => {
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'soldAt' | 'soldBy'>) => {
    // Check if user is authorized
    if (!currentUser) {
      toast.error('You must be logged in to record a sale');
      return;
    }

    // Check if product exists and has enough stock
    const product = products.find(p => p.id === sale.productId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (product.quantity < sale.quantity) {
      toast.error('Not enough stock available');
      return;
    }

    // Create new sale record
    const newSale: Sale = {
      id: uuidv4(),
      ...sale,
      soldBy: currentUser.id,
      soldAt: new Date().toISOString()
    };

    // Update product quantity
    updateProduct(product.id, {
      quantity: product.quantity - sale.quantity
    });

    // Save sale
    const updatedSales = [...sales, newSale];
    saveSales(updatedSales);
    toast.success('Sale recorded successfully');
  };

  const getSalesByDateRange = (startDate: string, endDate: string) => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.soldAt);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  };

  const getSalesByProduct = (productId: string) => {
    return sales.filter(sale => sale.productId === productId);
  };

  const getSalesStats = () => {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const averageOrderValue = totalRevenue / totalSales || 0;

    // Calculate top selling products
    const productSales = sales.reduce((acc, sale) => {
      const existing = acc.find(p => p.productId === sale.productId);
      if (existing) {
        existing.totalQuantity += sale.quantity;
        existing.totalRevenue += sale.totalPrice;
      } else {
        const product = products.find(p => p.id === sale.productId);
        if (product) {
          acc.push({
            productId: sale.productId,
            name: product.name,
            totalQuantity: sale.quantity,
            totalRevenue: sale.totalPrice
          });
        }
      }
      return acc;
    }, [] as Array<{
      productId: string;
      name: string;
      totalQuantity: number;
      totalRevenue: number;
    }>);

    const topSellingProducts = productSales
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    return {
      totalSales,
      totalRevenue,
      averageOrderValue,
      topSellingProducts
    };
  };

  return (
    <SalesContext.Provider value={{
      sales,
      addSale,
      getSalesByDateRange,
      getSalesByProduct,
      getSalesStats
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};