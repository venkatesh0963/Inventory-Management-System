import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiBox, FiAlertTriangle, FiList, FiDollarSign, FiArrowUpRight } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/products/summary/dashboard');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Formatting data for chart: Take top 5 categories by inventory value, or just raw recent products if categories are complex
  // Let's create a simple chart of Inventory Value by recent products
  const chartData = stats?.recentProducts?.map(p => ({
    name: p.productName.length > 10 ? p.productName.substring(0, 10) + '...' : p.productName,
    value: p.price * p.quantity,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <Link to="/products/add" className="btn-primary flex items-center gap-2">
          <FiBox /> Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts} 
          icon={<FiBox className="w-6 h-6 text-blue-600" />} 
          bgClass="bg-blue-100 dark:bg-blue-900/30" 
        />
        <StatCard 
          title="Total Categories" 
          value={stats?.totalCategories} 
          icon={<FiList className="w-6 h-6 text-purple-600" />} 
          bgClass="bg-purple-100 dark:bg-purple-900/30" 
        />
        <StatCard 
          title="Low/Out of Stock" 
          value={(stats?.lowStockItems || 0) + (stats?.outOfStockItems || 0)} 
          icon={<FiAlertTriangle className="w-6 h-6 text-orange-600" />} 
          bgClass="bg-orange-100 dark:bg-orange-900/30" 
          alert={(stats?.lowStockItems > 0 || stats?.outOfStockItems > 0)}
        />
        <StatCard 
          title="Total Value" 
          value={`$${(stats?.totalInventoryValue || 0).toLocaleString()}`} 
          icon={<FiDollarSign className="w-6 h-6 text-green-600" />} 
          bgClass="bg-green-100 dark:bg-green-900/30" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Inventory Value (Recent Products)</h2>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(14, 165, 233, 0.1)'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#0ea5e9" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiAlertTriangle className="text-orange-500" /> Action Required
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {stats?.lowStockProductsList?.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProductsList.map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{product.productName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        product.quantity === 0 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {product.quantity} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <FiBox className="w-8 h-8 opacity-50" />
                </div>
                <p>All stock levels look good!</p>
              </div>
            )}
          </div>
          
          {stats?.lowStockProductsList?.length > 0 && (
            <Link to="/products?stock=Low" className="mt-4 flex items-center justify-center gap-1 text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
              View All <FiArrowUpRight />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bgClass, alert }) => (
  <div className="card relative overflow-hidden group hover:border-primary-200 dark:hover:border-primary-900 transition-colors">
    {alert && (
      <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />
    )}
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
