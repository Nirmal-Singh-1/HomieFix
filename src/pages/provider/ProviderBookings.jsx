import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheck, FaTimes, FaPlay, FaCheckDouble } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { mockApi } from '../../data/mockData';
import { EmptyState } from '../../components/common/LoadingSpinner';

const tabs = ['all', 'upcoming', 'ongoing', 'completed', 'cancelled'];

const statusColors = {
  upcoming: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  ongoing: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const ProviderBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await mockApi.getBookings();
        setBookingList(response.bookings);
      } catch (e) {
        toast.error('Failed to load bookings from server');
      }
    };
    loadBookings();
  }, []);

  const filtered = activeTab === 'all'
    ? bookingList
    : bookingList.filter(b => {
        if (activeTab === 'upcoming') return b.status === 'upcoming' || b.status === 'confirmed';
        return b.status === activeTab;
      });

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await mockApi.updateBookingStatus(id, newStatus);
      setBookingList(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (e) {
      toast.error('Failed to update booking status on server');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and track your service jobs</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap
                      ${activeTab === tab ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-xl flex-shrink-0">
                  🔧
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.serviceName}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Customer: {booking.customerName}</p>
                    </div>
                    <span className={`badge ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <FaCalendarAlt className="text-gray-400 text-xs" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaClock className="text-gray-400 text-xs" />
                      {booking.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-gray-400 text-xs" />
                      {booking.address}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                    <span className="text-lg font-bold text-gray-900">₹{booking.total}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{booking.paymentMethod}</span>

                    <div className="flex gap-2 ml-auto">
                      {booking.status === 'upcoming' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                            className="text-sm font-semibold text-white px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <FaCheck className="text-xs" /> Accept Job
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                          >
                            <FaTimes className="text-xs" /> Reject
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'ongoing')}
                          className="text-sm font-semibold text-white px-3 py-1.5 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FaPlay className="text-xs" /> Start Service
                        </button>
                      )}
                      {booking.status === 'ongoing' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          className="text-sm font-semibold text-white px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FaCheckDouble className="text-xs" /> Complete Job
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <EmptyState icon="📋" title="No bookings" description="No bookings match the selected filter." />
        )}
      </div>
    </div>
  );
};

export default ProviderBookings;
