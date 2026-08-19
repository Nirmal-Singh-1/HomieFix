import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBriefcase, FaBell, FaChartLine, FaStar, FaClock, FaMapMarkerAlt, FaCheck, FaTimes, FaLocationArrow, FaSave, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EarningCard from '../../components/provider/EarningCard';
import BookingRequestCard from '../../components/provider/BookingRequestCard';
import LeafletMap from '../../components/common/LeafletMap';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const { user, updateProviderSettings, updateUser } = useAuth();
  const [activeBookings, setActiveBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [pendingCustomRequests, setPendingCustomRequests] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Location Management state
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState({
    street: user?.address?.street || '',
    locality: user?.address?.locality || '',
    city: user?.address?.city || user?.city || 'Haldwani',
    state: user?.address?.state || 'Uttarakhand',
    pincode: user?.address?.pincode || '',
    latitude: user?.address?.latitude || user?.location?.coordinates?.[1] || 29.3803,
    longitude: user?.address?.longitude || user?.location?.coordinates?.[0] || 79.5126,
    serviceRadius: user?.serviceRadius || 10,
  });

  const [togglingAvailability, setTogglingAvailability] = useState(false);

  // Sync state when user context updates
  useEffect(() => {
    if (user) {
      setLocationForm(prev => ({
        ...prev,
        street: user.address?.street || prev.street,
        locality: user.address?.locality || prev.locality,
        city: user.address?.city || user.city || prev.city,
        state: user.address?.state || prev.state,
        pincode: user.address?.pincode || prev.pincode,
        latitude: user.address?.latitude || (user.location?.coordinates?.[1]) || prev.latitude,
        longitude: user.address?.longitude || (user.location?.coordinates?.[0]) || prev.longitude,
        serviceRadius: user.serviceRadius || prev.serviceRadius,
      }));
    }
  }, [user]);

  const loadDashboardData = async () => {
    // 1. Fetch Bookings
    try {
      const res = await fetch('http://localhost:5000/api/bookings', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setPendingBookings(data.bookings.filter(b => b.status === 'pending'));
        setActiveBookings(data.bookings.filter(b => b.status === 'confirmed' || b.status === 'upcoming' || b.status === 'ongoing'));
      }
    } catch (e) {
      console.error('Failed to load bookings', e);
    }

    // 2. Fetch Custom Requests
    try {
      const res = await fetch('http://localhost:5000/api/custom-requests', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setPendingCustomRequests(data.requests || []);
      }
    } catch (e) {
      console.error('Failed to load custom requests', e);
    }

    // 3. Fetch Offered Services
    try {
      const res = await fetch('http://localhost:5000/api/services/me', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setMyServices(data.services || []);
      }
    } catch (e) {
      console.error('Failed to load services', e);
    }

    // 4. Fetch Notifications
    try {
      const res = await fetch('http://localhost:5000/api/notifications', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle Availability Toggle
  const handleToggleAvailability = async (e) => {
    const newValue = e.target.checked;
    
    // Check if location is set before enabling
    const hasValidLocation = user?.location?.coordinates && 
      (user.location.coordinates[0] !== 0 || user.location.coordinates[1] !== 0);

    if (newValue && !hasValidLocation) {
      toast.error('Please save your service location before turning on availability.');
      setIsEditingLocation(true);
      return;
    }

    setTogglingAvailability(true);
    try {
      const res = await updateProviderSettings({ openToCustomRequests: newValue });
      if (res.success) {
        toast.success(newValue ? 'Availability ON! You are now accepting requests.' : 'Availability turned OFF.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update availability');
    } finally {
      setTogglingAvailability(false);
    }
  };

  // Handle Geolocation auto-detect
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation is not supported by your browser');
    }
    toast.loading('Detecting current GPS coordinates...', { id: 'geo' });
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
          if (data.success) {
            setLocationForm(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              city: data.city || data.locality || prev.city,
              locality: data.locality || prev.locality,
              street: data.formattedAddress || prev.street,
            }));
            toast.success('Location detected!', { id: 'geo' });
          } else {
            setLocationForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
            toast.success(`Coordinates captured: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, { id: 'geo' });
          }
        } catch (e) {
          setLocationForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
          toast.success('Coordinates captured via GPS', { id: 'geo' });
        }
      },
      (err) => {
        toast.error('Could not get GPS location. Please select on map or enter address.', { id: 'geo' });
      }
    );
  };

  // Handle Location Save to MongoDB
  const handleSaveLocation = async (e) => {
    e.preventDefault();
    setSavingLocation(true);
    try {
      const res = await fetch('http://localhost:5000/api/location/provider', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          latitude: Number(locationForm.latitude),
          longitude: Number(locationForm.longitude),
          street: locationForm.street,
          locality: locationForm.locality,
          city: locationForm.city,
          state: locationForm.state,
          pincode: locationForm.pincode,
          serviceRadius: Number(locationForm.serviceRadius),
          formattedAddress: `${locationForm.street || ''} ${locationForm.locality || ''} ${locationForm.city}, ${locationForm.state} ${locationForm.pincode}`.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Provider base location saved to MongoDB!');
        setIsEditingLocation(false);
        if (updateUser) updateUser(data.user);
        loadDashboardData();
      } else {
        toast.error(data.message || 'Failed to save location');
      }
    } catch (e) {
      toast.error('Network error saving location');
    } finally {
      setSavingLocation(false);
    }
  };

  // Handle Accept / Reject for Standard Booking
  const handleAcceptBooking = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'confirmed' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Booking accepted!');
        loadDashboardData();
      } else throw new Error(data.message);
    } catch (e) {
      toast.error('Failed to accept booking');
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'cancelled' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Booking declined');
        loadDashboardData();
      } else throw new Error(data.message);
    } catch (e) {
      toast.error('Failed to decline booking');
    }
  };

  // Handle Accept / Decline for Custom Request
  const handleCustomRequestAction = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/custom-requests/${id}/${action}`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        toast.success(action === 'accept' ? 'Custom request accepted!' : 'Custom request ignored');
        loadDashboardData();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(`Failed to ${action} custom request`);
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

  const isAvailable = user?.openToCustomRequests || false;
  const hasSavedLocation = user?.location?.coordinates && 
    (user.location.coordinates[0] !== 0 || user.location.coordinates[1] !== 0);

  const totalPendingCount = pendingBookings.length + pendingCustomRequests.length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your service location, requests, and bookings from your MongoDB-driven dashboard.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/provider/add-service'}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          <span className="text-lg">+</span> Add New Service
        </button>
      </motion.div>

      {/* Top Banner Cards: Availability & Location Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Availability Toggle Box */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className={`p-6 rounded-2xl border ${isAvailable ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'} shadow-sm relative overflow-hidden`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <h3 className="font-bold text-gray-900 text-lg">
                  {isAvailable ? 'Online & Accepting Requests' : 'Offline / Paused'}
                </h3>
              </div>
              <p className="text-xs text-gray-600">
                {isAvailable 
                  ? `Receiving custom requests within ${user?.serviceRadius || 10} km radius.`
                  : 'Toggle ON to receive custom service requests from nearby customers.'}
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
              <input 
                type="checkbox" 
                checked={isAvailable} 
                onChange={handleToggleAvailability}
                disabled={togglingAvailability}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {!hasSavedLocation && (
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center gap-2 text-xs font-semibold text-amber-800">
              <FaExclamationTriangle className="text-amber-600 flex-shrink-0" />
              <span>Location missing! Save your workplace location below to receive matches.</span>
            </div>
          )}
        </motion.div>

        {/* Location Summary Box */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary-600 text-lg" />
                <h3 className="font-bold text-gray-900 text-base">Operating Base Location</h3>
              </div>
              <p className="text-sm font-semibold text-gray-800 truncate max-w-xs">
                {user?.address?.city || user?.city || 'Not set'} {user?.address?.pincode ? `- ${user.address.pincode}` : ''}
              </p>
              <p className="text-xs text-gray-500">
                Service Radius: <span className="font-bold text-primary-600">{user?.serviceRadius || 10} km</span>
              </p>
            </div>

            <button 
              onClick={() => setIsEditingLocation(!isEditingLocation)}
              className="px-3 py-1.5 rounded-xl border border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-100 text-xs font-bold transition flex items-center gap-1.5"
            >
              {isEditingLocation ? 'Close Map' : '📍 Edit Location'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Interactive Location Form & Map Modal */}
      <AnimatePresence>
        {isEditingLocation && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="card p-6 bg-gradient-to-br from-purple-50/50 to-white border border-purple-100 overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-purple-950 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-purple-600" /> Manage Provider Work Location & Operating Radius
                </h3>
                <p className="text-xs text-gray-500">
                  Set your base GPS location on the map. Requests within your operating radius will be matched to you.
                </p>
              </div>
              
              <button 
                type="button" 
                onClick={handleDetectLocation} 
                className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <FaLocationArrow /> Detect My Location
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Street Address / Locality</label>
                  <input 
                    type="text" 
                    value={locationForm.street} 
                    onChange={e => setLocationForm({ ...locationForm, street: e.target.value })}
                    placeholder="e.g. Near Bus Stand, Mall Road" 
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City / Town *</label>
                  <input 
                    type="text" 
                    value={locationForm.city} 
                    onChange={e => setLocationForm({ ...locationForm, city: e.target.value })}
                    required 
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                  <input 
                    type="text" 
                    value={locationForm.pincode} 
                    onChange={e => setLocationForm({ ...locationForm, pincode: e.target.value })}
                    required 
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Operating Service Radius (km) *</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={locationForm.serviceRadius} 
                    onChange={e => setLocationForm({ ...locationForm, serviceRadius: e.target.value })}
                    required 
                    className="input-field text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-purple-900 font-semibold">
                    📍 Current Coordinates: <span className="font-mono">{locationForm.latitude.toFixed(4)}, {locationForm.longitude.toFixed(4)}</span>
                  </p>
                  <p className="text-[11px] text-gray-500">Drag pin or click map to adjust exact base pin.</p>
                </div>
              </div>

              {/* Map View */}
              <LeafletMap 
                center={[locationForm.latitude, locationForm.longitude]}
                markerPosition={[locationForm.latitude, locationForm.longitude]}
                radius={Number(locationForm.serviceRadius || 10)}
                useCustomRedIcon={true}
                interactive={true}
                height="300px"
                onPositionChange={(lat, lng) => {
                  setLocationForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
                }}
              />

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setIsEditingLocation(false)} className="btn-ghost text-sm">Cancel</button>
                <button type="submit" disabled={savingLocation} className="btn-primary text-sm flex items-center gap-2">
                  <FaSave /> {savingLocation ? 'Saving to MongoDB...' : 'Save Base Location'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EarningCard title="Pending Requests" value={totalPendingCount.toString()} subtitle="Needs your response" icon="📥" color="primary" index={0} />
        <EarningCard title="Active Jobs" value={activeBookings.length.toString()} subtitle="Confirmed & Ongoing" icon="📋" color="secondary" index={1} />
        <EarningCard title="Offered Services" value={myServices.length.toString()} subtitle="Active listings" icon="💼" color="success" index={2} />
        <EarningCard title="Notifications" value={unreadNotifCount.toString()} subtitle="Unread alerts" icon="🔔" color="info" index={3} />
      </div>

      {/* Main Grid: Pending Inbox & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Requests Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="text-xl">📥</span> Pending Incoming Requests 
                {totalPendingCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{totalPendingCount}</span>
                )}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Standard Pending Bookings */}
              {pendingBookings.map((b) => (
                <div key={b.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Standard Booking</span>
                      <span className="text-xs text-gray-400">#{b.id}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{b.serviceName}</h3>
                    <p className="text-xs text-gray-600">Customer: {b.customerName}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                      <span>📅 {b.date}</span>
                      <span>⏰ {b.time}</span>
                      <span className="font-bold text-emerald-600">₹{b.total}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button onClick={() => handleAcceptBooking(b.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center gap-1">
                      <FaCheck /> Accept
                    </button>
                    <button onClick={() => handleRejectBooking(b.id)} className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center gap-1">
                      <FaTimes /> Decline
                    </button>
                  </div>
                </div>
              ))}

              {/* Custom Service Pending Requests */}
              {pendingCustomRequests.map((r) => (
                <div key={r._id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Custom Request</span>
                      {r.budget && <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">Budget: ₹{r.budget}</span>}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{r.serviceTitle || 'Custom Service'}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{r.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                      <span>📍 {r.location?.address?.split(',')[0]}</span>
                      <span>📅 {r.date}</span>
                      <span>⏰ {r.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button onClick={() => handleCustomRequestAction(r._id, 'accept')} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-700 flex items-center gap-1">
                      <FaCheck /> Accept & Quote
                    </button>
                    <button onClick={() => handleCustomRequestAction(r._id, 'decline')} className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center gap-1">
                      <FaTimes /> Ignore
                    </button>
                  </div>
                </div>
              ))}

              {totalPendingCount === 0 && (
                <div className="card p-8 text-center bg-white border border-gray-100">
                  <span className="text-4xl">📭</span>
                  <p className="text-gray-500 font-medium text-sm mt-3">No pending requests right now.</p>
                  <p className="text-xs text-gray-400 mt-1">Make sure your availability toggle is ON and base location is saved to receive requests.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Active / Confirmed Bookings Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaClock className="text-primary-500" /> Active & Upcoming Bookings ({activeBookings.length})
            </h2>
            <div className="space-y-4">
              {activeBookings.length > 0 ? (
                activeBookings.map((b, i) => (
                  <BookingRequestCard key={b.id} booking={b} index={i} onAccept={handleAcceptBooking} onReject={handleRejectBooking} />
                ))
              ) : (
                <div className="card p-6 text-center bg-white border border-gray-100 text-xs text-gray-400">
                  No active or ongoing bookings.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar Column: Live Notifications & Offered Services (1 col) */}
        <div className="space-y-6">
          {/* Real MongoDB Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="card p-5 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FaBell className="text-amber-500" /> System Alerts
              </h3>
              {unreadNotifCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadNotifCount} unread
                </span>
              )}
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n._id} className={`p-3 rounded-xl border ${!n.read ? 'bg-primary-50/50 border-primary-100' : 'bg-gray-50/50 border-gray-100'} text-xs space-y-1`}>
                    <p className="font-bold text-gray-900">{n.title}</p>
                    <p className="text-gray-600 leading-snug">{n.message}</p>
                    <p className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">No notifications yet.</p>
              )}
            </div>
          </motion.div>

          {/* Offered Services Listing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                <FaBriefcase className="text-primary-500" /> My Services ({myServices.length})
              </h3>
            </div>
            <div className="card divide-y divide-gray-100 bg-white">
              {myServices.length > 0 ? (
                myServices.map((service) => (
                  <div key={service.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <img src={service.image} alt={service.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{service.name}</h4>
                        <p className="text-[11px] text-gray-500">₹{service.price} {service.priceType === 'hourly' ? '/hr' : ''}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Service"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-gray-400">
                  No services listed yet.
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ProviderDashboard;
