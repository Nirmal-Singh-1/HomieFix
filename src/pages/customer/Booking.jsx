import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaShieldAlt, FaCreditCard, FaCheck, FaArrowLeft, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { services, providers, timeSlots, mockApi } from '../../data/mockData';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const serviceId = parseInt(searchParams.get('serviceId'));
  const providerId = parseInt(searchParams.get('providerId'));
  const service = services.find(s => s.id === serviceId);
  const provider = providers.find(p => p.id === providerId);

  if (!service || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">😕</span>
          <h2 className="text-xl font-semibold mt-4">Invalid booking details</h2>
          <button onClick={() => navigate('/services')} className="btn-primary mt-6">Browse Services</button>
        </div>
      </div>
    );
  }

  const visitCharge = 100;
  const labourCharge = (service.hourlyRate || service.price) * duration;
  const platformFee = Math.round(labourCharge * 0.03);
  const total = visitCharge + labourCharge + platformFee;

  // Generate next 7 days
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      value: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  const onSubmitBooking = async (data) => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }
    setStep(2);
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      await mockApi.processPayment({ amount: total, method: paymentMethod });
      const result = await mockApi.createBooking({
        serviceId, providerId, date: selectedDate, time: selectedTime,
        duration, total, paymentMethod,
      });
      setBookingId(result.booking.id);
      setBookingConfirmed(true);
      setStep(3);
      toast.success('Booking confirmed! 🎉');
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirmation Page
  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="card p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheck className="text-3xl text-emerald-500" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
          <p className="text-gray-500 mt-1">Booking #{bookingId}</p>

          <div className="mt-6 space-y-3 text-left bg-gray-50 rounded-xl p-5">
            <div className="flex items-center gap-3 text-sm">
              <FaCalendarAlt className="text-primary-500" />
              <span className="text-gray-600">Date: <span className="font-semibold text-gray-900">{selectedDate}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaClock className="text-primary-500" />
              <span className="text-gray-600">Time: <span className="font-semibold text-gray-900">{selectedTime}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-primary-500">👤</span>
              <span className="text-gray-600">Provider: <span className="font-semibold text-gray-900">{provider.name}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaMapMarkerAlt className="text-primary-500" />
              <span className="text-gray-600">Location: <span className="font-semibold text-gray-900">123, Main Street</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm border-t border-gray-200 pt-3">
              <span className="text-primary-500">💰</span>
              <span className="text-gray-600">Total: <span className="font-bold text-gray-900 text-lg">₹{total}</span></span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => navigate('/my-bookings')} className="btn-primary flex-1">View Booking</button>
            <button onClick={() => navigate('/')} className="btn-outline flex-1">Back to Home</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <FaArrowLeft className="text-xs" /> Back
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {['Booking Details', 'Payment', 'Confirmation'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                            ${step > i + 1 ? 'bg-primary-600 text-white' : step === i + 1 ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                {step > i + 1 ? <FaCheck className="text-xs" /> : i + 1}
              </div>
              <span className={`hidden sm:block text-sm font-medium ${step >= i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
              {i < 2 && <div className={`w-8 sm:w-12 h-0.5 ${step > i + 1 ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Form / Payment */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-6">
                    {/* Service Info */}
                    <div className="card p-5">
                      <h3 className="font-semibold text-gray-900 mb-3">Service Details</h3>
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <img src={service.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-500">{provider.name} ⭐ {provider.rating}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Duration (hours)</label>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => setDuration(Math.max(1, duration - 1))}
                            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">-</button>
                          <span className="text-lg font-semibold w-10 text-center">{duration}</span>
                          <button type="button" onClick={() => setDuration(Math.min(8, duration + 1))}
                            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="card p-5">
                      <h3 className="font-semibold text-gray-900 mb-3">Select Date & Time</h3>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {dates.map((d) => (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => setSelectedDate(d.value)}
                            className={`flex-shrink-0 flex flex-col items-center py-3 px-4 rounded-xl border-2 transition-all
                                      ${selectedDate === d.value
                                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                                        : 'border-gray-100 hover:border-gray-200'
                                      }`}
                          >
                            <span className="text-xs font-medium">{d.day}</span>
                            <span className="text-lg font-bold">{d.date}</span>
                            <span className="text-xs">{d.month}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Time Slot</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {timeSlots.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setSelectedTime(t)}
                              className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all
                                        ${selectedTime === t
                                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                                          : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                        }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="card p-5">
                      <h3 className="font-semibold text-gray-900 mb-3">Service Address</h3>
                      <div className="space-y-3">
                        <input {...register('address', { required: 'Address is required' })} placeholder="Street address" className="input-field" defaultValue="123, Main Street, Sector 12" />
                        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                        <div className="grid grid-cols-2 gap-3">
                          <input {...register('city')} placeholder="City" className="input-field" defaultValue="Meerut" />
                          <input {...register('pincode')} placeholder="Pincode" className="input-field" defaultValue="250001" />
                        </div>
                        <input {...register('landmark')} placeholder="Landmark (optional)" className="input-field" />
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="card p-5">
                      <h3 className="font-semibold text-gray-900 mb-3">Additional Details</h3>
                      <textarea
                        {...register('description')}
                        placeholder="Describe your problem or requirements..."
                        rows={3}
                        className="input-field resize-none"
                      />
                      <div className="mt-3 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
                        <FaUpload className="text-gray-400 text-xl mx-auto" />
                        <p className="text-sm text-gray-500 mt-2">Drag & drop photos or click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    </div>

                    <button type="submit" className="btn-primary w-full">Continue to Payment</button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="card p-5">
                    <h3 className="font-semibold text-gray-900 mb-5">Payment Method</h3>

                    <div className="space-y-3">
                      {[
                        { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: '📱' },
                        { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                        { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: '🏦' },
                        { id: 'cash', label: 'Cash on Service', desc: 'Pay after service completion', icon: '💵' },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                                    ${paymentMethod === method.id
                                      ? 'border-primary-500 bg-primary-50'
                                      : 'border-gray-100 hover:border-gray-200'
                                    }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className="sr-only"
                          />
                          <span className="text-2xl">{method.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">{method.label}</p>
                            <p className="text-xs text-gray-500">{method.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                        ${paymentMethod === method.id ? 'border-primary-500' : 'border-gray-300'}`}>
                            {paymentMethod === method.id && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-amber-50 rounded-xl flex items-center gap-2 text-xs text-amber-700">
                      <FaShieldAlt /> This is a test/demo payment — no real charges will be made
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={processPayment}
                      disabled={isProcessing}
                      className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isProcessing ? <LoadingSpinner size="sm" /> : (
                        <>
                          <FaCreditCard /> Pay ₹{total}
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                <img src={service.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{service.name}</p>
                  <p className="text-xs text-gray-500">{provider.name} ⭐ {provider.rating}</p>
                </div>
              </div>

              {selectedDate && (
                <div className="text-sm text-gray-600 space-y-1.5 mb-4 pb-4 border-b border-gray-100">
                  <p>📅 {selectedDate}</p>
                  {selectedTime && <p>⏰ {selectedTime}</p>}
                  <p>⏱️ {duration} hour(s)</p>
                </div>
              )}

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Visit Charge</span><span>₹{visitCharge}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Labour ({duration} hrs × ₹{service.hourlyRate || service.price})</span><span>₹{labourCharge}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Platform Fee</span><span>₹{platformFee}</span></div>
                <div className="flex justify-between border-t border-gray-100 pt-2.5 font-bold text-gray-900">
                  <span>Total</span><span className="text-primary-600 text-lg">₹{total}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 justify-center">
                <FaShieldAlt /> Secure & encrypted checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
