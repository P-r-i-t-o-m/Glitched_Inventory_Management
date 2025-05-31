import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  X, 
  Check, 
  Shield, 
  UserCircle,
  Users as UsersIcon,
  CalendarDays
} from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
}

const UsersPage = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { currentUser } = useAuth();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'staff',
    avatar: ''
  });
  
  const canEdit = currentUser?.role === 'admin';
  
  // Filter users
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      avatar: ''
    });
  };
  
  // Open edit modal
  const handleEdit = (id: string) => {
    if (!canEdit) {
      toast.error('Only admin can edit users');
      return;
    }
    
    const user = users.find(u => u.id === id);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || ''
      });
      setSelectedUser(id);
      setShowEditModal(true);
    }
  };
  
  // Open delete modal
  const handleDelete = (id: string) => {
    if (!canEdit) {
      toast.error('Only admin can delete users');
      return;
    }
    
    // Don't allow deleting yourself
    if (id === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    
    setSelectedUser(id);
    setShowDeleteModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      toast.error('Only admin can add or edit users');
      return;
    }
    
    if (showAddModal) {
      // Add new user
      addUser(formData);
      setShowAddModal(false);
    } else if (showEditModal && selectedUser) {
      // Update existing user
      updateUser(selectedUser, formData);
      setShowEditModal(false);
    }
    
    resetFormData();
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!canEdit) {
      toast.error('Only admin can delete users');
      return;
    }
    
    if (selectedUser) {
      deleteUser(selectedUser);
      setShowDeleteModal(false);
    }
  };
  
  // Get role badge style
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-[var(--primary-100)] text-[var(--primary-800)]';
      case 'manager':
        return 'bg-[var(--accent-100)] text-[var(--accent-800)]';
      default:
        return 'bg-[var(--neutral-100)] text-[var(--neutral-800)]';
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Users</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
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
          
          {canEdit && (
            <button
              className="btn btn-primary flex items-center"
              onClick={() => {
                resetFormData();
                setShowAddModal(true);
              }}
            >
              <Plus size={18} className="mr-2" />
              Add User
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="card p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-[var(--neutral-200)] flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-[var(--primary-100)] text-[var(--primary-700)] text-xl font-semibold">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-[var(--neutral-800)]">{user.name}</h3>
                <p className="text-sm text-[var(--neutral-500)]">{user.email}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
            
            <div className="border-t border-[var(--neutral-200)] pt-4">
              <div className="flex items-center text-sm text-[var(--neutral-600)] mb-2">
                <Shield size={16} className="mr-2" />
                <span>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
              </div>
              
              <div className="flex items-center text-sm text-[var(--neutral-600)] mb-2">
                <CalendarDays size={16} className="mr-2" />
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              
              {user.lastLogin && (
                <div className="flex items-center text-sm text-[var(--neutral-600)]">
                  <UserCircle size={16} className="mr-2" />
                  <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {canEdit && (
              <div className="border-t border-[var(--neutral-200)] mt-4 pt-4 flex justify-end">
                <button
                  className="text-[var(--primary-600)] hover:text-[var(--primary-800)] mr-3"
                  onClick={() => handleEdit(user.id)}
                >
                  <Edit size={18} />
                </button>
                
                {/* Don't allow deleting self */}
                {user.id !== currentUser?.id && (
                  <button
                    className="text-[var(--error-600)] hover:text-[var(--error-800)]"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--neutral-200)] p-8 text-center">
          <UsersIcon size={48} className="mx-auto text-[var(--neutral-400)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--neutral-700)] mb-2">No users found</h3>
          <p className="text-[var(--neutral-500)]">
            No users match your search criteria. Try adjusting your search or add a new user.
          </p>
        </div>
      )}
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md animate-slide-in-bottom">
            <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">Add New User</h2>
              <button
                className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setShowAddModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="form-label">
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="avatar" className="form-label">
                    Avatar URL (Optional)
                  </label>
                  <input
                    id="avatar"
                    name="avatar"
                    type="text"
                    className="form-input"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
              
              <div className="mt-6 border-t border-[var(--neutral-200)] pt-4 text-sm text-[var(--neutral-500)]">
                <p>Note: Default password will be set to "password". User can change it later.</p>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Plus size={18} className="mr-2" />
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md animate-slide-in-bottom">
            <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">Edit User</h2>
              <button
                className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setShowEditModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-email" className="form-label">
                    Email *
                  </label>
                  <input
                    id="edit-email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-role" className="form-label">
                    Role *
                  </label>
                  <select
                    id="edit-role"
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    disabled={selectedUser === currentUser?.id} // Can't change own role
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                  {selectedUser === currentUser?.id && (
                    <p className="text-xs text-[var(--error-500)] mt-1">You cannot change your own role</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="edit-avatar" className="form-label">
                    Avatar URL (Optional)
                  </label>
                  <input
                    id="edit-avatar"
                    name="avatar"
                    type="text"
                    className="form-input"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Check size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md animate-slide-in-bottom">
            <div className="px-6 py-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--neutral-800)]">Confirm Delete</h2>
              <button
                className="text-[var(--neutral-500)] hover:text-[var(--neutral-700)]"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center text-[var(--error-500)] mb-4">
                <div className="rounded-full bg-[var(--error-100)] p-3">
                  <Trash2 size={24} />
                </div>
              </div>
              
              <p className="text-center text-[var(--neutral-700)] mb-4">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;