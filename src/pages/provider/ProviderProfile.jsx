import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaClock, FaRupeeSign, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { reviews } from '../../data/mockData';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProviderProfile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [selectedServices, setSelectedServices] = useState(['Electrician']);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: user?.name, email: user?.email, phone: user?.phone, hourlyRate: '300', experience: '8', city: user?.city },
  });

  const serviceOptions = ['Electrician', 'Plumber', 'Cleaning', 'Carpenter', 'AC Service', 'Painter', 'Appliance Repair'];

  const toggleDay = (d) => setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleService = (s) => setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const onSubmit = (data) => {
    updateUser(data);
    setEditing(false);
    toast.success('Profile updated!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your provider profile and settings</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group">
            <img src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} alt="" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/30" />
            <button className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <FaCamera className="text-white text-lg" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-primary-200 text-sm">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start">
              <span className="badge bg-white/20 text-white">⭐ 4.8 (127)</span>
              <span className="badge bg-white/20 text-white">🔧 8 yrs</span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="sm:ml-auto bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
              <input {...register('name')} disabled={!editing} className="input-field disabled:bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
              <input {...register('email')} disabled={!editing} className="input-field disabled:bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
              <input {...register('phone')} disabled={!editing} className="input-field disabled:bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">City</label>
              <input {...register('city')} disabled={!editing} className="input-field disabled:bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Hourly Rate (₹)</label>
              <input type="number" {...register('hourlyRate')} disabled={!editing} className="input-field disabled:bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Experience (years)</label>
              <input type="number" {...register('experience')} disabled={!editing} className="input-field disabled:bg-gray-50" />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Services Offered</label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((s) => (
                <button
                  key={s} type="button"
                  onClick={() => editing && toggleService(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                            ${selectedServices.includes(s)
                              ? 'bg-primary-50 border-primary-300 text-primary-600'
                              : 'bg-gray-50 border-gray-200 text-gray-500'
                            } ${!editing ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {selectedServices.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Available Days</label>
            <div className="flex gap-2">
              {days.map((d) => (
                <button
                  key={d} type="button"
                  onClick={() => editing && toggleDay(d)}
                  className={`w-11 h-11 rounded-xl text-xs font-semibold transition-all
                            ${selectedDays.includes(d)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-400'
                            } ${!editing ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => { setEditing(false); reset(); }} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-primary flex items-center gap-2"><FaSave /> Save Changes</button>
            </div>
          )}
        </form>
      </motion.div>

      {/* Reviews */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaStar className="text-secondary-500" /> Recent Reviews</h3>
        <div className="space-y-4">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <img src={r.customerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{r.customerName}</h4>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} className={`text-xs ${i < r.rating ? 'text-secondary-500' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderProfile;
