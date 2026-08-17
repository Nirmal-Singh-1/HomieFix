import { motion } from 'framer-motion';

const Privacy = () => {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect personal information (name, email, phone, address), payment information processed securely through our partners, location data for service matching, and usage data to improve our platform.' },
    { title: '2. How We Use Your Information', content: 'We use your data to connect you with service providers, process bookings and payments, send booking confirmations and updates, improve our platform, and ensure safety through identity verification and fraud prevention.' },
    { title: '3. Information Sharing', content: 'We share your name and contact details with assigned service providers to fulfill bookings. Payment information is shared with secure payment processors. We may disclose information if required by law. We never sell your personal information to third parties.' },
    { title: '4. Data Security', content: 'We implement industry-standard security measures including SSL encryption, secure data storage, and regular security audits to protect your personal information. Access to user data is restricted to authorized personnel only.' },
    { title: '5. Data Retention', content: 'We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting our support team.' },
    { title: '6. Your Rights', content: 'You have the right to access, update, or delete your personal information. You can manage your data preferences from your account settings or by contacting us. You may also opt out of promotional communications at any time.' },
    { title: '7. Cookies', content: 'We use cookies and similar technologies to enhance your browsing experience, remember preferences, and analyze platform usage. You can manage cookie settings through your browser preferences.' },
    { title: '8. Children\'s Privacy', content: 'HomeFix is not intended for users under 18 years of age. We do not knowingly collect personal information from children.' },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-4xl mb-4 inline-block">🔒</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="text-gray-400 mt-3">Last updated: January 1, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card p-6 md:p-10 mb-8">
            <p className="text-gray-600 leading-relaxed">
              At HomeFix, we take your privacy seriously. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our platform.
            </p>
          </motion.div>
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="card p-6 md:p-8 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 bg-primary-50 rounded-2xl p-8 text-center">
            <p className="text-gray-700 font-medium">Questions about your data?</p>
            <p className="text-sm text-gray-500 mt-1">Contact our DPO at <strong className="text-primary-600">privacy@homefix.in</strong></p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
