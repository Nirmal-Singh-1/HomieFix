import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash,
  FaArrowRight, FaArrowLeft, FaCheck, FaSms,
} from 'react-icons/fa';

import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Step definitions
const STEP_INFO    = 1;
const STEP_PHONE   = 2;
const STEP_OTP     = 3;
const STEP_ROLE    = 4;

const RESEND_SECONDS = 60;

const Register = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, registerVerified } = useAuth();

  const [currentStep, setCurrentStep] = useState(STEP_INFO);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Collected data across steps
  const [formData, setFormData]       = useState({});
  const [phone, setPhone]             = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [phoneVerified, setPhoneVerified]     = useState(false);

  // OTP state
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const otpRefs = useRef([]);

  // Role selection
  const [selectedRole, setSelectedRole] = useState('customer');

  const { register, handleSubmit, formState: { errors }, trigger } = useForm();

  // ── Resend countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  // ── Step 1: personal info submit ─────────────────────────────────────────
  const handleInfoNext = async (data) => {
    const valid = await trigger(['name', 'email', 'password']);
    if (!valid) return;
    setFormData(data);
    setCurrentStep(STEP_PHONE);
  };

  // ── Step 2: send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!phone.trim()) {
      toast.error('Phone number is required.');
      return;
    }
    setOtpSending(true);
    try {
      const res = await sendOtp(phone.trim());
      setNormalizedPhone(res.phone); // E.164 form returned from backend
      toast.success(res.message);
      setResendTimer(RESEND_SECONDS);
      setCurrentStep(STEP_OTP);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpSending(false);
    }
  };

  // ── Step 3: OTP digit input helpers ──────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }
    setOtpVerifying(true);
    try {
      await verifyOtp(normalizedPhone, code);
      setPhoneVerified(true);
      toast.success('Phone verified! 🎉');
      setCurrentStep(STEP_ROLE);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtpSending(true);
    try {
      const res = await sendOtp(phone.trim());
      setOtp(['', '', '', '', '', '']);
      setResendTimer(RESEND_SECONDS);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpSending(false);
    }
  };

  // ── Step 4: final account creation ───────────────────────────────────────
  const handleCreateAccount = async () => {
    if (!phoneVerified) {
      toast.error('Please verify your phone number first.');
      return;
    }
    setIsLoading(true);
    try {
      await registerVerified({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: normalizedPhone,
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

  // ── Step indicator labels ─────────────────────────────────────────────────
  const steps = [
    { id: STEP_INFO,  label: 'Your Info' },
    { id: STEP_PHONE, label: 'Phone' },
    { id: STEP_OTP,   label: 'Verify' },
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
                { icon: '📲', text: 'Phone verified via SMS OTP' },
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
              {currentStep === STEP_PHONE && 'We\'ll send an OTP to verify your number'}
              {currentStep === STEP_OTP   && 'Enter the OTP sent to your WhatsApp'}
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
                      <div className={`w-6 sm:w-12 h-0.5 mx-1.5 transition-colors duration-300
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

              {/* STEP 2 — Phone Number */}
              {currentStep === STEP_PHONE && (
                <motion.div
                  key="step-phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <FaSms className="text-blue-500 text-xl mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-800">
                      We'll send a 6-digit OTP via SMS to verify your phone number.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        id="reg-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="input-field pl-11"
                        autoComplete="tel"
                      />
                    </div>
                      <p className="text-xs text-gray-400 mt-1">Enter your Indian mobile number (10 digits or with +91)</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(STEP_INFO)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <FaArrowLeft className="text-xs" /> Back
                    </button>

                    <motion.button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="btn-primary flex items-center gap-2 disabled:opacity-60"
                    >
                      {otpSending ? <LoadingSpinner size="sm" /> : (
                        <><FaSms /> Send OTP via SMS</>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — OTP Verification */}
              {currentStep === STEP_OTP && (
                <motion.div
                  key="step-otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaSms className="text-blue-500 text-3xl" />
                    </div>
                    <p className="text-sm text-gray-600">
                      OTP sent via SMS to<br />
                      <span className="font-semibold text-gray-900">
                        {normalizedPhone.slice(0, 3)}****{normalizedPhone.slice(-4)}
                      </span>
                    </p>
                  </div>

                  {/* 6-digit OTP input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter 6-digit OTP</label>
                    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-digit-${i}`}
                          ref={(el) => (otpRefs.current[i] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl transition-all duration-200 outline-none
                            ${digit
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-primary-400'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify button */}
                  <motion.button
                    id="otp-verify-btn"
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpVerifying || otp.join('').length < 6}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {otpVerifying ? <LoadingSpinner size="sm" /> : 'Verify OTP'}
                  </motion.button>

                  {/* Resend */}
                  <div className="text-center text-sm text-gray-500">
                    Didn't receive it?{' '}
                    {resendTimer > 0 ? (
                      <span className="text-gray-400">Resend in <span className="font-medium text-primary-600">{resendTimer}s</span></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={otpSending}
                        className="text-primary-600 font-semibold hover:text-primary-700 disabled:opacity-50"
                      >
                        {otpSending ? 'Sending...' : 'Resend OTP'}
                      </button>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(STEP_PHONE)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 mx-auto"
                    >
                      <FaArrowLeft className="text-xs" /> Change number
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 — Role Selection */}
              {currentStep === STEP_ROLE && (
                <motion.div
                  key="step-role"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
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
