import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaCheck, FaTimes, FaArrowLeft, FaShieldAlt, FaClock, FaTag } from 'react-icons/fa';
import { services, providers, reviews as allReviews } from '../../data/mockData';
import ProviderCard from '../../components/customer/ProviderCard';
import ServiceCard from '../../components/customer/ServiceCard';
import { CardSkeleton } from '../../components/common/LoadingSpinner';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeTab, setActiveTab] = useState('providers');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const found = services.find(s => s.id === parseInt(id));
      setService(found);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-64 w-full rounded-2xl" />
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <div className="skeleton h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">😕</span>
          <h2 className="text-xl font-semibold mt-4">Service not found</h2>
          <Link to="/services" className="btn-primary mt-6 inline-block">Browse Services</Link>
        </div>
      </div>
    );
  }

  const serviceProviders = providers.filter(p =>
    p.services.includes(service.category) || p.serviceIds?.includes(service.categoryId)
  );
  const serviceReviews = allReviews.filter(r => r.serviceId === service.id || r.providerId === serviceProviders[0]?.id);
  const similarServices = services.filter(s => s.category === service.category && s.id !== service.id).slice(0, 3);

  const handleBooking = () => {
    if (selectedProvider) {
      navigate(`/booking?serviceId=${service.id}&providerId=${selectedProvider.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <FaArrowLeft className="text-xs" /> Back to Services
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden">
              <img src={service.image} alt={service.name} className="w-full h-64 md:h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="badge-primary mb-2">{service.category}</span>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{service.name}</h1>
              </div>
            </motion.div>

            {/* Info Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5">
                <FaStar className="text-secondary-500" />
                <span className="font-semibold">{service.rating}</span>
                <span className="text-sm text-gray-400">({service.reviewCount} reviews)</span>
              </div>
              <span className="text-gray-200">|</span>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FaClock className="text-gray-400" /> {service.estimatedTime}
              </div>
              <span className="text-gray-200">|</span>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FaTag className="text-gray-400" /> Starting ₹{service.price}
              </div>
            </div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About this Service</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{service.longDescription}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                    <FaCheck className="text-emerald-500" /> What's Included
                  </h3>
                  <ul className="space-y-1.5">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCheck className="text-emerald-400 text-xs flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                    <FaTimes className="text-red-500" /> Not Included
                  </h3>
                  <ul className="space-y-1.5">
                    {service.excludes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <FaTimes className="text-red-400 text-xs flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Tabs: Providers & Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {['providers', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors
                              ${activeTab === tab
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-400 hover:text-gray-600'
                              }`}
                  >
                    {tab === 'providers' ? `Available Providers (${serviceProviders.length})` : `Reviews (${serviceReviews.length})`}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-4">
                {activeTab === 'providers' ? (
                  serviceProviders.length > 0 ? (
                    serviceProviders.map((prov, i) => (
                      <ProviderCard
                        key={prov.id}
                        provider={prov}
                        index={i}
                        onSelect={setSelectedProvider}
                        selected={selectedProvider?.id === prov.id}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No providers available for this service currently.</p>
                  )
                ) : (
                  serviceReviews.length > 0 ? (
                    serviceReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start gap-3">
                          <img src={review.customerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm text-gray-900">{review.customerName}</h4>
                              <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-0.5 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar key={i} className={`text-xs ${i < review.rating ? 'text-secondary-500' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                            {review.providerReply && (
                              <div className="mt-3 bg-gray-50 rounded-xl p-3">
                                <p className="text-xs font-semibold text-gray-500 mb-1">Provider Reply</p>
                                <p className="text-sm text-gray-600">{review.providerReply}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No reviews yet for this service.</p>
                  )
                )}
              </div>
            </div>

            {/* Similar Services */}
            {similarServices.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Similar Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarServices.map((s, i) => (
                    <ServiceCard key={s.id} service={s} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Price & Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 sticky top-24"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Base Price</span>
                  <span className="font-semibold">₹{service.price}</span>
                </div>
                {service.hourlyRate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hourly Rate</span>
                    <span className="font-semibold">₹{service.hourlyRate}/hr</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform Fee</span>
                  <span className="font-semibold">₹20</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Estimated Total</span>
                  <span className="font-bold text-primary-600 text-lg">₹{service.price + 20}</span>
                </div>
              </div>

              {selectedProvider ? (
                <div className="mt-5 p-3 bg-primary-50 rounded-xl">
                  <p className="text-xs font-semibold text-primary-600 mb-1">Selected Provider</p>
                  <div className="flex items-center gap-2">
                    <img src={selectedProvider.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedProvider.name}</p>
                      <p className="text-xs text-gray-500">⭐ {selectedProvider.rating}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-gray-400 text-center">Select a provider below to book</p>
              )}

              <button
                onClick={handleBooking}
                disabled={!selectedProvider}
                className="btn-primary w-full mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedProvider ? 'Book Now' : 'Select a Provider'}
              </button>

              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
                <FaShieldAlt /> Secure booking with money-back guarantee
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
