import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUsers, FaRocket, FaHeart, FaBriefcase, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Careers = () => {
  const openPositions = [
    { title: 'Full Stack Developer', dept: 'Engineering', location: 'Meerut / Remote', type: 'Full-time', urgent: true },
    { title: 'UI/UX Designer', dept: 'Design', location: 'Meerut', type: 'Full-time', urgent: false },
    { title: 'Operations Manager', dept: 'Operations', location: 'Delhi NCR', type: 'Full-time', urgent: true },
    { title: 'Customer Support Lead', dept: 'Support', location: 'Meerut', type: 'Full-time', urgent: false },
    { title: 'Marketing Specialist', dept: 'Marketing', location: 'Remote', type: 'Full-time', urgent: false },
    { title: 'Data Analyst', dept: 'Analytics', location: 'Meerut / Remote', type: 'Full-time', urgent: true },
  ];

  const perks = [
    { icon: '💰', title: 'Competitive Salary', desc: 'Industry-standard pay with performance bonuses' },
    { icon: '🏠', title: 'Flexible Work', desc: 'Hybrid model with work-from-home options' },
    { icon: '📈', title: 'Growth & Learning', desc: 'Learning budget and career development programs' },
    { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive health coverage for you and family' },
    { icon: '🎯', title: 'Stock Options', desc: 'ESOPs for all full-time employees' },
    { icon: '🎉', title: 'Fun Culture', desc: 'Team outings, hackathons, and celebrations' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,191,36,0.15),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/90 mb-6">
              <FaBriefcase className="text-secondary-400" />
              We're Hiring!
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Build the Future of<br /><span className="text-secondary-400">Home Services</span>
            </h1>
            <p className="text-blue-100 mt-6 text-lg md:text-xl max-w-2xl mx-auto">
              Join our fast-growing team and help millions of homeowners find trusted service professionals.
            </p>
            <a href="#positions" className="inline-flex items-center gap-2 btn-secondary mt-8 !rounded-xl">
              View Open Positions <FaArrowRight className="text-xs" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title">Why Join HomeFix?</h2>
            <p className="section-subtitle">We believe great work comes from great people in a great environment</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card p-6 hover:shadow-lg transition-shadow group">
                <span className="text-3xl group-hover:scale-125 transition-transform inline-block">{perk.icon}</span>
                <h3 className="font-semibold text-gray-900 mt-3">{perk.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="section-title">Our Culture</h2>
              <p className="text-gray-600 mt-4 leading-relaxed">
                At HomeFix, we believe in building a diverse, inclusive workplace where everyone can do their best work. Our team is passionate about solving real-world problems and creating impact in people's daily lives.
              </p>
              <div className="space-y-4 mt-6">
                {[
                  { icon: <FaRocket className="text-primary-500" />, text: 'Move fast, break things, learn faster' },
                  { icon: <FaHeart className="text-red-500" />, text: 'Empathy-driven decision making' },
                  { icon: <FaUsers className="text-emerald-500" />, text: 'Collaboration over competition' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">{item.icon}</div>
                    <p className="text-sm font-medium text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 text-white text-center">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '30+', label: 'Team Members' },
                  { value: '5', label: 'Cities' },
                  { value: '40%', label: 'Women in Tech' },
                  { value: '4.5⭐', label: 'Glassdoor Rating' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-blue-100 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title">Open Positions</h2>
            <p className="section-subtitle">{openPositions.length} roles available — find your fit</p>
          </motion.div>
          <div className="space-y-4">
            {openPositions.map((pos, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center gap-4 group cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{pos.title}</h3>
                    {pos.urgent && <span className="badge bg-red-100 text-red-600 text-[10px]">Urgent</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><FaBriefcase className="text-xs text-gray-400" /> {pos.dept}</span>
                    <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs text-gray-400" /> {pos.location}</span>
                    <span className="badge-primary text-[10px]">{pos.type}</span>
                  </div>
                </div>
                <button className="btn-outline !py-2 !px-5 text-sm flex items-center gap-2 self-start sm:self-center">
                  Apply <FaArrowRight className="text-xs" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Didn't find */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-10 text-center bg-primary-50 rounded-2xl p-8">
            <p className="text-gray-700 font-medium">Don't see a role that fits?</p>
            <p className="text-sm text-gray-500 mt-1">Send your resume to <strong className="text-primary-600">careers@homefix.in</strong> and we'll keep you in mind!</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
