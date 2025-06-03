import { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown,
  Check,
  PackageOpen,
  ShoppingCart
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useSuppliers } from '../context/SupplierContext';
import { categories } from '../data/initialData';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  supplier: string;
  price: number;
  quantity: number;
  threshold: number;
  imageUrl?: string;
}

interface SortConfig {
  key: 'name' | 'category' | 'price' | 'quantity';
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  search: string;
  category: string;
  stockStatus: '' | 'in-stock' | 'out-of-stock' | 'low-stock';
}

// Previous content remains exactly the same until the form section in Add/Edit Product Modal

// Inside both Add and Edit Product modals, after the existing form fields:
<div className="border-t border-[var(--neutral-200)] mt-6 pt-6">
  <h3 className="text-lg font-medium text-[var(--neutral-800)] mb-4">Record Sale</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label htmlFor="quantity-sold" className="form-label">
        Quantity to Sell *
      </label>
      <input
        id="quantity-sold"
        name="quantitySold"
        type="number"
        min="1"
        max={product.quantity}
        className="form-input"
        required
      />
    </div>
    
    <div>
      <label htmlFor="customer-name" className="form-label">
        Customer Name *
      </label>
      <input
        id="customer-name"
        name="customerName"
        type="text"
        className="form-input"
        required
      />
    </div>
    
    <div>
      <label htmlFor="customer-phone" className="form-label">
        Customer Phone *
      </label>
      <input
        id="customer-phone"
        name="customerPhone"
        type="tel"
        className="form-input"
        placeholder="+8801XXXXXXXXX"
        required
      />
    </div>
    
    <div>
      <label htmlFor="customer-email" className="form-label">
        Customer Email *
      </label>
      <input
        id="customer-email"
        name="customerEmail"
        type="email"
        className="form-input"
        required
      />
    </div>
    
    <div className="md:col-span-2">
      <label htmlFor="customer-address" className="form-label">
        Customer Address *
      </label>
      <textarea
        id="customer-address"
        name="customerAddress"
        className="form-input"
        rows={3}
        required
      />
    </div>
  </div>
  
  <div className="flex justify-end mt-6">
    <button
      type="submit"
      className="btn btn-primary"
      onClick={handleSale}
    >
      <ShoppingCart size={18} className="mr-2" />
      Record Sale
    </button>
  </div>
</div>

// Add this function to handle sales
const handleSale = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!currentUser) {
    toast.error('You must be logged in to record a sale');
    return;
  }
  
  if (currentUser.role === 'admin' || currentUser.role === 'manager') {
    toast.error('Only staff members can record sales');
    return;
  }
  
  const formData = new FormData(e.target as HTMLFormElement);
  const quantitySold = parseInt(formData.get('quantitySold') as string);
  const customerName = formData.get('customerName') as string;
  const customerPhone = formData.get('customerPhone') as string;
  const customerEmail = formData.get('customerEmail') as string;
  const customerAddress = formData.get('customerAddress') as string;
  
  if (quantitySold > product.quantity) {
    toast.error('Not enough stock available');
    return;
  }
  
  try {
    await addSale(
      product.id,
      quantitySold,
      product.price,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress
    );
    
    // Reset form
    (e.target as HTMLFormElement).reset();
    toast.success('Sale recorded successfully');
  } catch (error) {
    toast.error('Failed to record sale');
  }
};

// Rest of the component remains exactly the same

export default ProductsPage;

export default ProductsPage