import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaSave, FaClock, FaRupeeSign, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LocationModal from '../../components/common/LocationModal';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProviderProfile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [selectedServices, setSelectedServices] = useState(['Electrician']);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { 
      name: user?.name, email: user?.email, phone: user?.phone, hourlyRate: '300', experience: '8', city: user?.city,
      openToCustomRequests: user?.openToCustomRequests || false,
      serviceRadius: user?.serviceRadius || 10
    },
  });

  const serviceOptions = ['Electrician', 'Plumber', 'Cleaning', 'Carpenter', 'AC Service', 'Painter', 'Appliance Repair'];

  const toggleDay = (d) => setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleService = (s) => setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleLocationPicked = (loc) => {
    reset({
      ...user,
      city: loc.city || loc.locality || loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    toast.success(`Location set to ${loc.city || loc.locality || 'Selected location'}`);
  };

  const onSubmit = async (data) => {
    try {
      if (data.latitude && data.longitude) {
        await fetch('http://localhost:5000/api/location/provider', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            city: data.city,
            serviceRadius: Number(data.serviceRadius),
            openToCustomRequests: Boolean(data.openToCustomRequests)
          })
        });
      }
      await updateUser({
        ...data,
        openToCustomRequests: Boolean(data.openToCustomRequests),
        serviceRadius: Number(data.serviceRadius)
      });
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="space-y-6">
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleLocationPicked}
        initialLocation={{
          latitude: user?.address?.latitude || user?.location?.coordinates?.[1] || 29.3803,
          longitude: user?.address?.longitude || user?.location?.coordinates?.[0] || 79.5126,
          formattedAddress: user?.address?.formattedAddress || user?.city || ''
        }}
      />
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
            <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-4xl text-white font-bold ring-4 ring-white/30">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
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

            {/* Custom Requests & Location Radius Settings */}
            <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-purple-900 flex items-center gap-2">📍 Provider Base Location & Service Radius</h4>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FaMapMarkerAlt /> 📍 Select / Auto-Detect Location on Map
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Open to Custom Requests</p>
                  <p className="text-xs text-gray-500">Receive custom request notifications within your operating service radius.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('openToCustomRequests')} disabled={!editing} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 block">Service Radius (km)</label>
                  <input type="number" min="1" max="100" {...register('serviceRadius')} disabled={!editing} className="input-field disabled:bg-gray-50" />
                  <p className="text-[11px] text-gray-500 mt-1">Customers within this radius will discover your services.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 block">Operating City / Base Address</label>
                  <input type="text" {...register('city')} disabled={!editing} className="input-field disabled:bg-gray-50" placeholder="e.g. Haldwani, Uttarakhand" />
                </div>
              </div>

              {/* Current Saved Location Info Badge */}
              <div className="p-3.5 bg-white/90 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                    <span className="font-bold text-purple-950">Pinned Base Location: </span>
                    <span className="font-semibold text-purple-900">{user?.address?.city || user?.city || 'Not set'}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                    Lat: {(user?.address?.latitude || user?.location?.coordinates?.[1] || 29.3803).toFixed(4)}, Lng: {(user?.address?.longitude || user?.location?.coordinates?.[0] || 79.5126).toFixed(4)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) return toast.error('GPS not supported by browser');
                    toast.loading('Detecting current GPS location...', { id: 'gps-profile' });
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        try {
                          const res = await fetch('http://localhost:5000/api/location/reverse-geocode', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ latitude: lat, longitude: lng })
                          });
                          const data = await res.json();
                          
                          // Auto-persist location to backend MongoDB
                          await fetch('http://localhost:5000/api/location/provider', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                              latitude: lat,
                              longitude: lng,
                              city: data.city || data.locality || data.formattedAddress || 'Haldwani',
                              serviceRadius: Number(user?.serviceRadius || 10)
                            })
                          });

                          reset({
                            ...user,
                            city: data.city || data.locality || data.formattedAddress,
                            latitude: lat,
                            longitude: lng,
                          });
                          if (updateUser) updateUser({ ...user, city: data.city || data.locality, location: { coordinates: [lng, lat] } });
                          toast.success(`📍 Auto-pinned location: ${data.city || data.locality || 'GPS Location'}`, { id: 'gps-profile' });
                        } catch (e) {
                          toast.success(`📍 Coordinates pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, { id: 'gps-profile' });
                        }
                      },
                      (err) => toast.error('Could not fetch GPS position', { id: 'gps-profile' })
                    );
                  }}
                  className="px-3 py-2 bg-purple-100 text-purple-800 rounded-xl font-bold hover:bg-purple-200 transition flex items-center justify-center gap-1.5 self-start sm:self-center"
                >
                  ⚡ Auto-Detect & Pin GPS
                </button>
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
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaStar className="text-secondary-500" /> Reviews</h3>
        <p className="text-sm text-gray-500 text-center py-8">No reviews yet. Reviews will appear here once customers rate your service.</p>
      </motion.div>
    </div>
  );
};

export default ProviderProfile;
