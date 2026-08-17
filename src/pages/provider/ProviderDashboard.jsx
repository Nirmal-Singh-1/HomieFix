import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaBell, FaChartLine, FaStar, FaClock, FaCheckCircle } from 'react-icons/fa';
import { mockApi } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import EarningCard from '../../components/provider/EarningCard';
import BookingRequestCard from '../../components/provider/BookingRequestCard';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState([]);

  useEffect(() => {
    const loadActiveBookings = async () => {
      try {
        const response = await mockApi.getBookings();
        setActiveBookings(
          response.bookings.filter(b => b.status === 'confirmed' || b.status === 'upcoming')
        );
      } catch (e) {
        console.error('Failed to load active bookings', e);
      }
    };
    loadActiveBookings();
  }, []);

  const handleAccept = async (id) => {
    try {
      await mockApi.updateBookingStatus(id, 'confirmed');
      setActiveBookings(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async (id) => {
    try {
      await mockApi.updateBookingStatus(id, 'cancelled');
      setActiveBookings(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      toast.error('Failed to reject booking');
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your services today</p>
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
    </div>
  );
};

export default ProviderDashboard;
