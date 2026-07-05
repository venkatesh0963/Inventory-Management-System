import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiImage } from 'react-icons/fi';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    supplier: '',
    price: '',
    quantity: '',
    sku: '',
    description: '',
    imageUrl: ''
  });

  const categories = [
    'Electronics', 'Grocery', 'Furniture', 'Clothing',
    'Stationery', 'Sports', 'Health', 'Home Appliances', 'Other'
  ];

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await api.get(`/products/${id}`);
          setFormData({
            productName: data.productName,
            category: data.category,
            supplier: data.supplier,
            price: data.price,
            quantity: data.quantity,
            sku: data.sku,
            description: data.description || '',
            imageUrl: data.imageUrl || ''
          });
        } catch (error) {
          toast.error('Failed to load product details');
          navigate('/products');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Product added successfully');
      }
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products" className="p-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition">
          <FiArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Product Name <span className="text-red-500">*</span></label>
              <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="input-field" placeholder="E.g. Wireless Mouse" />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">SKU <span className="text-red-500">*</span></label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} required disabled={isEditMode} className={`input-field ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="E.g. EL-WM-001" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category <span className="text-red-500">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Supplier <span className="text-red-500">*</span></label>
              <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} required className="input-field" placeholder="E.g. TechCorp" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price ($) <span className="text-red-500">*</span></label>
              <input type="number" step="0.01" min="0.01" name="price" value={formData.price} onChange={handleChange} required className="input-field" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity <span className="text-red-500">*</span></label>
              <input type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} required className="input-field" placeholder="0" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
            <div className="flex gap-4 items-start">
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="input-field flex-1" placeholder="https://example.com/image.jpg" />
              {formData.imageUrl ? (
                <div className="w-16 h-16 rounded-lg border border-slate-200 dark:border-dark-border overflow-hidden shrink-0">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=Error'; }} />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                  <FiImage className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input-field resize-none" placeholder="Enter product description..." />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-dark-border">
            <Link to="/products" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><FiSave /> {isEditMode ? 'Update Product' : 'Save Product'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
