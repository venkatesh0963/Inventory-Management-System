import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter, FiDownload, FiUpload } from 'react-icons/fi';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState('newest');

  const categories = [
    'Electronics', 'Grocery', 'Furniture', 'Clothing',
    'Stationery', 'Sports', 'Health', 'Home Appliances', 'Other'
  ];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products?keyword=${keyword}&category=${category}&supplier=${supplier}&stock=${stockStatus}&pageNumber=${page}&sort=${sort}`);
      setProducts(data.products);
      setPages(data.pages);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [keyword, category, supplier, stockStatus, page, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/csv/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      toast.loading('Importing data...', { id: 'import' });
      await api.post('/csv/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Products imported successfully', { id: 'import' });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to import data', { id: 'import' });
    }
  };

  const getStockBadge = (quantity) => {
    if (quantity === 0) return <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">Out of Stock</span>;
    if (quantity <= 10) return <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium rounded-full">Low Stock</span>;
    return <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">In Stock</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory</h1>
        <div className="flex items-center gap-2">
          <label className="btn-secondary flex items-center gap-2 cursor-pointer">
            <FiUpload />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <FiDownload />
            <span className="hidden sm:inline">Export</span>
          </button>
          <Link to="/products/add" className="btn-primary flex items-center gap-2">
            <FiPlus />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, category, supplier..." 
              className="input-field pl-10"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-2 items-center">
            <FiFilter className="text-slate-400 hidden md:block" />
            <select className="input-field max-w-[150px]" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input-field max-w-[150px]" value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
              <option value="">All Stock</option>
              <option value="In">In Stock</option>
              <option value="Low">Low Stock</option>
              <option value="Out">Out of Stock</option>
            </select>
            <select className="input-field max-w-[150px]" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="price_asc">Price Low to High</option>
              <option value="price_desc">Price High to Low</option>
              <option value="qty_asc">Quantity Low to High</option>
              <option value="qty_desc">Quantity High to Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-dark-border text-slate-500 dark:text-slate-400 text-sm">
                <th className="py-3 px-4 font-medium">Product Name</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Supplier</th>
                <th className="py-3 px-4 font-medium">Price</th>
                <th className="py-3 px-4 font-medium">Qty</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10">
                    <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr 
                    key={product._id} 
                    className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${product.quantity <= 10 ? 'bg-orange-50/30 dark:bg-orange-900/10' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{product.productName}</p>
                        <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{product.category}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{product.supplier}</td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{product.quantity}</td>
                    <td className="py-3 px-4">{getStockBadge(product.quantity)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/products/${product._id}`} className="p-2 text-slate-400 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30">
                          <FiEye />
                        </Link>
                        <Link to={`/products/edit/${product._id}`} className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30">
                          <FiEdit2 />
                        </Link>
                        <button onClick={() => deleteHandler(product._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {[...Array(pages).keys()].map(x => (
              <button
                key={x + 1}
                onClick={() => setPage(x + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === x + 1 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
