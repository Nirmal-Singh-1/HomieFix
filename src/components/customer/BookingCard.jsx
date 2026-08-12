import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const statusColors = {
  upcoming: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  ongoing: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  upcoming: 'Upcoming',
  confirmed: 'Confirmed',
  ongoing: 'On-Going',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const BookingCard = ({ booking, index = 0, onCancel, onReview }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Provider Avatar */}
        <img
          src={booking.providerAvatar}
          alt={booking.providerName}
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-2 ring-gray-100"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">{booking.serviceName}</h3>
              <p className="text-sm text-gray-500 mt-0.5">by {booking.providerName}</p>
            </div>
            <span className={`badge ${statusColors[booking.status]}`}>
              {statusLabels[booking.status]}
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
              {booking.address.split(',')[0]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-lg font-bold text-gray-900">₹{booking.total}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-gray-500">{booking.paymentMethod}</span>

            <div className="flex gap-2 ml-auto">
              <Link
                to={`/booking/${booking.id}`}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5
                         border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
              >
                View Details
              </Link>
              {(booking.status === 'upcoming' || booking.status === 'confirmed') && onCancel && (
                <button
                  onClick={() => onCancel(booking.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5
                           border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              {booking.status === 'completed' && onReview && (
                <button
                  onClick={() => onReview(booking.id)}
                  className="text-sm font-medium text-secondary-600 hover:text-secondary-700 px-3 py-1.5
                           border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  Write Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
