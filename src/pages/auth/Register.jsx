import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaMapMarkerAlt, FaCity, FaArrowRight, FaArrowLeft, FaCheck, FaUserTie, FaShieldAlt, FaTools, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const steps = [
  { id: 1, title: 'Personal Info', icon: FaUser },
  { id: 2, title: 'Address', icon: FaMapMarkerAlt },
  { id: 3, title: 'Choose Role', icon: FaShieldAlt },
];

const Register = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

  const nextStep = async () => {
    let fields = [];
    if (currentStep === 1) fields = ['name', 'email', 'phone', 'password'];
    if (currentStep === 2) fields = ['street', 'city', 'pincode'];

    const valid = await trigger(fields);
    if (valid) setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (data) => {
    if (!agreedTerms) {
      toast.error('Please agree to Terms & Conditions');
      return;
    }
    setIsLoading(true);
    try {
      await authRegister({ ...data, role: selectedRole });
      toast.success('Account created successfully! 🎉');
      if (selectedRole === 'provider') navigate('/provider');
      else navigate('/');
    } catch (err) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="flex items-center gap-2 mb-8">
              <span className="text-4xl">🏠</span>
              <span className="text-2xl font-bold">Home<span className="text-secondary-400">Fix</span></span>
            </Link>

            <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
              Join the HomeFix<br />Community
            </h1>
            <p className="text-blue-100 mt-4 text-base leading-relaxed max-w-sm">
              Create your account and get access to trusted home service professionals.
            </p>

            <div className="mt-10 space-y-5">
              {[
                { icon: '✅', text: 'Verified professionals at your doorstep' },
                { icon: '🔒', text: 'Secure payments with money-back guarantee' },
                { icon: '⭐', text: '24/7 customer support' },
                { icon: '💰', text: '20% off on your first booking' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-blue-100">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-20 -left-10 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">🏠</span>
              <span className="text-2xl font-bold text-gray-900">Home<span className="text-primary-600">Fix</span></span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in your details to get started</p>

            {/* Progress Bar */}
            <div className="mt-6 mb-8">
              <div className="flex items-center justify-between mb-3">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                    transition-all duration-300
                                    ${currentStep > step.id
                                      ? 'bg-primary-600 text-white'
                                      : currentStep === step.id
                                        ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600'
                                        : 'bg-gray-100 text-gray-400'
                                    }`}>
                        {currentStep > step.id ? <FaCheck className="text-xs" /> : step.id}
                      </div>
                      <span className="hidden sm:block text-xs font-medium">{step.title}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-8 sm:w-16 h-0.5 mx-2 transition-colors duration-300
                                    ${currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div
                  className="bg-primary-600 h-1 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          {...register('name', { required: 'Name is required' })}
                          placeholder="Enter your full name"
                          className="input-field pl-11"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="email"
                          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                          placeholder="Enter your email"
                          className="input-field pl-11"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="tel"
                          {...register('phone', { required: 'Phone is required' })}
                          placeholder="+91 98765 43210"
                          className="input-field pl-11"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                          placeholder="Create a strong password"
                          className="input-field pl-11 pr-11"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Address */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          {...register('street', { required: 'Street is required' })}
                          placeholder="123, Main Street, Sector 12"
                          className="input-field pl-11"
                        />
                      </div>
                      {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                        <div className="relative">
                          <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                          <input
                            {...register('city', { required: 'City is required' })}
                            placeholder="Meerut"
                            className="input-field pl-11"
                          />
                        </div>
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
                        <input
                          {...register('pincode', { required: 'Pincode is required', pattern: { value: /^[0-9]{6}$/, message: 'Invalid pincode' } })}
                          placeholder="250001"
                          className="input-field"
                        />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Landmark (Optional)</label>
                      <input
                        {...register('landmark')}
                        placeholder="Near City Mall"
                        className="input-field"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Role Selection */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-gray-500 mb-4">Choose how you want to use HomeFix</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Customer Card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedRole('customer')}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
                                  ${selectedRole === 'customer'
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                  }`}
                      >
                        <div className="text-3xl mb-3">👤</div>
                        <h3 className="font-semibold text-gray-900">Customer</h3>
                        <p className="text-xs text-gray-500 mt-1">Book home services</p>
                        <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
                          <li className="flex items-center gap-1.5"><FaCheck className="text-primary-500" /> Browse services</li>
                          <li className="flex items-center gap-1.5"><FaCheck className="text-primary-500" /> Book providers</li>
                          <li className="flex items-center gap-1.5"><FaCheck className="text-primary-500" /> Track bookings</li>
                          <li className="flex items-center gap-1.5"><FaCheck className="text-primary-500" /> Rate & review</li>
                        </ul>
                      </motion.div>

                      {/* Provider Card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedRole('provider')}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
                                  ${selectedRole === 'provider'
                                    ? 'border-secondary-500 bg-secondary-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                  }`}
                      >
                        <div className="text-3xl mb-3">🔧</div>
                        <h3 className="font-semibold text-gray-900">Service Provider</h3>
                        <p className="text-xs text-gray-500 mt-1">Offer your services</p>
                        <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
                          <li className="flex items-center gap-1.5"><FaCheck className="text-secondary-500" /> List your services</li>
                          <li className="flex items-center gap-1.5"><FaCheck className="text-secondary-500" /> Get bookings</li>
                          <li className="flex items-center gap-1.5"><FaCheck className="text-secondary-500" /> Earn money</li>
                          <li className="flex items-center gap-1.5"><FaCheck className="text-secondary-500" /> Build reputation</li>
                        </ul>
                      </motion.div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-2.5 mt-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-0.5"
                      />
                      <span className="text-sm text-gray-500">
                        I agree to the <a href="#" className="text-primary-600 font-medium">Terms of Service</a>{' '}
                        and <a href="#" className="text-primary-600 font-medium">Privacy Policy</a>
                      </span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                {currentStep > 1 ? (
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                    <FaArrowLeft className="text-xs" /> Back
                  </button>
                ) : <div />}

                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-primary flex items-center gap-2"
                  >
                    Next <FaArrowRight className="text-xs" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
                  </motion.button>
                )}
              </div>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
