import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiEdit2, FiTrash2, FiBox, FiTag, FiTruck, FiDollarSign, FiCalendar } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const deleteHandler = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        navigate('/products');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const getStockBadge = (quantity) => {
    if (quantity === 0) return <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium rounded-full">Out of Stock</span>;
    if (quantity <= 10) return <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-sm font-medium rounded-full">Low Stock ({quantity})</span>;
    return <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium rounded-full">In Stock ({quantity})</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/products" className="p-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition">
            <FiArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Details</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/products/edit/${id}`} className="btn-secondary flex items-center gap-2">
            <FiEdit2 /> Edit
          </Link>
          <button onClick={deleteHandler} className="btn-danger flex items-center gap-2">
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="md:flex">
          {product.imageUrl ? (
            <div className="md:w-1/3 bg-slate-50 dark:bg-slate-800 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-dark-border">
              <img src={product.imageUrl} alt={product.productName} className="max-w-full max-h-64 object-contain rounded-lg shadow-sm" />
            </div>
          ) : (
            <div className="md:w-1/3 bg-slate-50 dark:bg-slate-800 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-dark-border text-slate-400">
              <FiBox className="w-20 h-20 mb-4 opacity-50" />
              <p>No image available</p>
            </div>
          )}
          
          <div className="md:w-2/3 p-6 md:p-8 space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{product.productName}</h2>
                  <p className="text-slate-500 font-mono text-sm">SKU: {product.sku}</p>
                </div>
                <div>
                  {getStockBadge(product.quantity)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                  <FiDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Price</p>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">${product.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
                  <FiTag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Category</p>
                  <p className="font-medium text-slate-900 dark:text-white">{product.category}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
                  <FiTruck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Supplier</p>
                  <p className="font-medium text-slate-900 dark:text-white">{product.supplier}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg shrink-0">
                  <FiCalendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Added On</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Description</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
