import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash,
  FaArrowRight, FaArrowLeft, FaCheck,
} from 'react-icons/fa';

import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STEP_INFO = 1;
const STEP_ROLE = 2;

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(STEP_INFO);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({});
  const [selectedRole, setSelectedRole] = useState('customer');

  const { register, handleSubmit, formState: { errors }, trigger } = useForm();

  const handleInfoNext = async (data) => {
    const valid = await trigger(['name', 'email', 'phone', 'password']);
    if (!valid) return;
    setFormData(data);
    setCurrentStep(STEP_ROLE);
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: selectedRole,
      });
      toast.success('Account created successfully! 🎉');
      if (selectedRole === 'provider') navigate('/provider');
      else navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: STEP_INFO,  label: 'Your Info' },
    { id: STEP_ROLE,  label: 'Role' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ──────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="flex items-center gap-2 mb-8">
              <span className="text-4xl">🏠</span>
              <span className="text-2xl font-bold">Homie<span className="text-secondary-400">Fix</span></span>
            </Link>
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
              Join the HomieFix<br />Community
            </h1>
            <p className="text-blue-100 mt-4 text-base leading-relaxed max-w-sm">
              Create your account and get access to trusted home service professionals.
            </p>
            <div className="mt-10 space-y-5">
              {[
                { icon: '✅', text: 'Verified professionals at your doorstep' },
                { icon: '🔒', text: 'Secure payments with money-back guarantee' },
                { icon: '⭐', text: '24/7 customer support' },
                { icon: '🚀', text: 'Fast and reliable service' },
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

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">🏠</span>
              <span className="text-2xl font-bold text-gray-900">Homie<span className="text-primary-600">Fix</span></span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">
              {currentStep === STEP_INFO  && 'Fill in your details to get started'}
              {currentStep === STEP_ROLE  && 'How do you want to use HomieFix?'}
            </p>

            {/* Progress steps */}
            <div className="mt-6 mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center gap-1.5 ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                        ${currentStep > step.id
                          ? 'bg-primary-600 text-white'
                          : currentStep === step.id
                            ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                        {currentStep > step.id ? <FaCheck className="text-xs" /> : step.id}
                      </div>
                      <span className="hidden sm:block text-xs font-medium">{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-6 sm:w-24 h-0.5 mx-1.5 transition-colors duration-300
                        ${currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <motion.div
                  className="bg-primary-600 h-1 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* ── Step content ── */}
            <AnimatePresence mode="wait">

              {/* STEP 1 — Personal Info */}
              {currentStep === STEP_INFO && (
                <motion.form
                  key="step-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                  onSubmit={handleSubmit(handleInfoNext)}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        id="reg-name"
                        {...register('name', { required: 'Name is required.' })}
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
                        id="reg-email"
                        type="email"
                        {...register('email', {
                          required: 'Email is required.',
                          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address.' },
                        })}
                        placeholder="Enter your email"
                        className="input-field pl-11"
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        id="reg-phone"
                        type="tel"
                        {...register('phone', {
                          required: 'Phone number is required.',
                        })}
                        placeholder="Enter your mobile number"
                        className="input-field pl-11"
                        autoComplete="tel"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Password is required.',
                          minLength: { value: 6, message: 'Password must be at least 6 characters.' },
                        })}
                        placeholder="Create a strong password"
                        className="input-field pl-11 pr-11"
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <div className="flex justify-end pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="btn-primary flex items-center gap-2"
                    >
                      Next <FaArrowRight className="text-xs" />
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* STEP 2 — Role Selection */}
              {currentStep === STEP_ROLE && (
                <motion.div
                  key="step-role"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between pb-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(STEP_INFO)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <FaArrowLeft className="text-xs" /> Back
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer */}
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
                      <h3 className="font-semibold text-gray-900">I need a service</h3>
                      <p className="text-xs text-gray-500 mt-1">Customer</p>
                      <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
                        <li className="flex items-center gap-1.5"><FaCheck className="text-primary-500" /> Browse services</li>
                        <li className="flex items-center gap-1.5"><FaCheck className="text-primary-500" /> Book providers</li>
                        <li className="flex items-center gap-1.5"><FaCheck className="text-primary-500" /> Track bookings</li>
                        <li className="flex items-center gap-1.5"><FaCheck className="text-primary-500" /> Rate &amp; review</li>
                      </ul>
                    </motion.div>

                    {/* Provider */}
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
                      <h3 className="font-semibold text-gray-900">I want to provide services</h3>
                      <p className="text-xs text-gray-500 mt-1">Provider</p>
                      <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
                        <li className="flex items-center gap-1.5"><FaCheck className="text-secondary-500" /> List your services</li>
                        <li className="flex items-center gap-1.5"><FaCheck className="text-secondary-500" /> Get bookings</li>
                        <li className="flex items-center gap-1.5"><FaCheck className="text-secondary-500" /> Earn money</li>
                        <li className="flex items-center gap-1.5"><FaCheck className="text-secondary-500" /> Build reputation</li>
                      </ul>
                    </motion.div>
                  </div>

                  <motion.button
                    id="create-account-btn"
                    type="button"
                    onClick={handleCreateAccount}
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account 🎉'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

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
