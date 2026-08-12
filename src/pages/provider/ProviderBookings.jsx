import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { bookings as allBookings } from '../../data/mockData';
import BookingCard from '../../components/customer/BookingCard';
import { EmptyState } from '../../components/common/LoadingSpinner';

const tabs = ['all', 'upcoming', 'ongoing', 'completed', 'cancelled'];

const ProviderBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookingList, setBookingList] = useState(allBookings);

  const filtered = activeTab === 'all'
    ? bookingList
    : bookingList.filter(b => {
        if (activeTab === 'upcoming') return b.status === 'upcoming' || b.status === 'confirmed';
        return b.status === activeTab;
      });

  const handleCancel = (id) => {
    setBookingList(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    toast.success('Booking cancelled');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your service bookings</p>
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
            <BookingCard key={booking.id} booking={booking} index={i} onCancel={handleCancel} />
          ))
        ) : (
          <EmptyState icon="📋" title="No bookings" description="No bookings match the selected filter." />
        )}
      </div>
    </div>
  );
};

export default ProviderBookings;
