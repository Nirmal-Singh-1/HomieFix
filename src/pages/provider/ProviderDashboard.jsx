import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaBell, FaChartLine, FaStar, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EarningCard from '../../components/provider/EarningCard';
import BookingRequestCard from '../../components/provider/BookingRequestCard';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState([]);
  const [myServices, setMyServices] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bookings', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setActiveBookings(
            data.bookings.filter(b => b.status === 'confirmed' || b.status === 'upcoming')
          );
        }
      } catch (e) {
        console.error('Failed to load active bookings', e);
      }

      try {
        const res = await fetch('http://localhost:5000/api/services/me', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setMyServices(data.services || []);
        }
      } catch (e) {
        console.error('Failed to load services', e);
      }
    };
    loadDashboardData();
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'confirmed' })
      });
      const data = await res.json();
      if (data.success) {
        setActiveBookings(prev => prev.filter(b => b.id !== id));
      } else throw new Error();
    } catch (e) {
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'cancelled' })
      });
      const data = await res.json();
      if (data.success) {
        setActiveBookings(prev => prev.filter(b => b.id !== id));
      } else throw new Error();
    } catch (e) {
      toast.error('Failed to reject booking');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setMyServices(prev => prev.filter(s => s.id !== id));
        toast.success('Service deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete service');
      }
    } catch (e) {
      toast.error('Failed to delete service');
    }
  };

  const recentActivity = [
    { icon: '💰', text: 'You earned ₹450 from booking #HF1024', time: '2 hours ago' },
    { icon: '⭐', text: 'New 5-star review from Ankit Sharma', time: '4 hours ago' },
    { icon: '❌', text: 'Booking #HF1023 was cancelled by customer', time: '6 hours ago' },
    { icon: '✅', text: 'You completed booking #HF1022', time: 'Yesterday' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with your services today</p>
        </div>
        <button 
          onClick={() => window.location.href = '/provider/add-service'}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          <span className="text-lg">+</span> Add New Service
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EarningCard title="Today's Jobs" value="3" subtitle="2 completed, 1 upcoming" icon="📋" color="primary" index={0} />
        <EarningCard title="New Requests" value="2" subtitle="Waiting for your response" icon="🔔" color="secondary" index={1} />
        <EarningCard title="Today's Earnings" value="₹850" subtitle="+₹350 from yesterday" icon="💰" color="success" index={2} />
        <EarningCard title="Rating" value="4.8⭐" subtitle="Based on 127 reviews" icon="⭐" color="info" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaClock className="text-primary-500" /> Upcoming Bookings
          </h2>
          <div className="space-y-4">
            {activeBookings.length > 0 ? (
              activeBookings.map((b, i) => (
                <BookingRequestCard key={b.id} booking={b} index={i} onAccept={handleAccept} onReject={handleReject} />
              ))
            ) : (
              <div className="card p-8 text-center">
                <span className="text-4xl">📭</span>
                <p className="text-gray-500 mt-3">No pending bookings</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaChartLine className="text-primary-500" /> Recent Activity
          </h2>
          <div className="card divide-y divide-gray-50">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3 p-4"
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* My Offered Services */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaBriefcase className="text-primary-500" /> My Offered Services
          </h2>
        </div>
        <div className="card overflow-hidden">
          {myServices.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {myServices.map((service, i) => (
                <div key={service.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={service.image} alt={service.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-xs text-gray-500">{service.category} • ₹{service.price} {service.priceType === 'hourly' ? '/ hr' : ''}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Service"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">You haven't offered any services yet.</p>
              <button onClick={() => window.location.href = '/provider/add-service'} className="text-primary-600 font-semibold text-sm mt-2 hover:underline">
                Add your first service
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderDashboard;
