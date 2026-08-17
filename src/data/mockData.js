import { FaBolt, FaFaucet, FaBroom, FaHammer, FaSnowflake, FaPaintRoller, FaWrench, FaBoxOpen, FaTv, FaBug } from 'react-icons/fa';

export const categories = [
  { id: 1, name: 'Electrician', icon: 'FaBolt', color: 'from-yellow-400 to-orange-500', description: 'Wiring, switches, fans & more', count: 45 },
  { id: 2, name: 'Plumber', icon: 'FaFaucet', color: 'from-blue-400 to-cyan-500', description: 'Pipes, taps, drainage & more', count: 38 },
  { id: 3, name: 'Cleaning', icon: 'FaBroom', color: 'from-green-400 to-emerald-500', description: 'Home deep cleaning services', count: 52 },
  { id: 4, name: 'Carpenter', icon: 'FaHammer', color: 'from-amber-500 to-yellow-600', description: 'Furniture repair & installation', count: 28 },
  { id: 5, name: 'AC Service', icon: 'FaSnowflake', color: 'from-sky-400 to-blue-500', description: 'AC repair, gas refill & service', count: 35 },
  { id: 6, name: 'Painter', icon: 'FaPaintRoller', color: 'from-purple-400 to-pink-500', description: 'Wall painting & waterproofing', count: 22 },
  { id: 7, name: 'Appliance Repair', icon: 'FaWrench', color: 'from-red-400 to-rose-500', description: 'Washing machine, fridge & more', count: 41 },
  { id: 8, name: 'Pest Control', icon: 'FaBug', color: 'from-teal-400 to-green-500', description: 'Cockroach, termite, bed bugs', count: 18 },
];

export const services = [
  {
    id: 1,
    name: 'Fan Installation',
    category: 'Electrician',
    categoryId: 1,
    description: 'Professional ceiling fan installation service. Our certified electricians will install your new ceiling fan safely and efficiently, including wiring and bracket mounting.',
    longDescription: 'Get your ceiling fan installed by our expert electricians. Service includes removal of old fan (if any), installation of new ceiling fan, testing of all speed settings, and cleanup. We bring all necessary tools and hardware. All our electricians are background-verified and trained professionals.',
    price: 299,
    priceType: 'fixed',
    hourlyRate: null,
    estimatedTime: '1-2 hours',
    rating: 4.8,
    reviewCount: 127,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492CC74b4?w=400&h=300&fit=crop',
    popular: true,
    includes: ['Fan mounting', 'Wiring connection', 'Speed testing', 'Old fan removal', 'Cleanup'],
    excludes: ['Fan purchase', 'Major wiring changes', 'False ceiling work'],
  },
  {
    id: 2,
    name: 'Pipe Leak Repair',
    category: 'Plumber',
    categoryId: 2,
    description: 'Fix leaking pipes, joints, and connections. Quick and reliable plumbing repair service at your doorstep.',
    longDescription: 'Our experienced plumbers will diagnose and fix any pipe leaks in your home. Service covers bathroom pipes, kitchen pipes, and main line connections. We use high-quality sealing materials and replacement parts for long-lasting repairs.',
    price: 199,
    priceType: 'fixed',
    hourlyRate: 250,
    estimatedTime: '1-3 hours',
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop',
    popular: true,
    includes: ['Leak detection', 'Pipe sealing', 'Joint repair', 'Testing', 'Cleanup'],
    excludes: ['Pipe replacement', 'Underground pipe work', 'New pipeline installation'],
  },
  {
    id: 3,
    name: 'Full Home Cleaning',
    category: 'Cleaning',
    categoryId: 3,
    description: 'Complete deep cleaning of your home including kitchen, bathrooms, bedrooms, and living areas.',
    longDescription: 'Transform your home with our comprehensive deep cleaning service. Our trained cleaning professionals use professional-grade equipment and eco-friendly cleaning solutions to make every corner of your home spotless.',
    price: 1499,
    priceType: 'fixed',
    hourlyRate: null,
    estimatedTime: '4-6 hours',
    rating: 4.9,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    popular: true,
    includes: ['Kitchen cleaning', 'Bathroom scrubbing', 'Floor mopping', 'Dusting', 'Window cleaning'],
    excludes: ['Carpet shampooing', 'Upholstery cleaning', 'Exterior cleaning'],
  },
  {
    id: 4,
    name: 'Furniture Assembly',
    category: 'Carpenter',
    categoryId: 4,
    description: 'Expert furniture assembly service for all types of flat-pack and ready-to-assemble furniture.',
    longDescription: 'Our skilled carpenters will assemble your furniture quickly and correctly. Whether it\'s a wardrobe, bed frame, desk, or shelf unit, we handle all types of furniture assembly with care and precision.',
    price: 399,
    priceType: 'fixed',
    hourlyRate: 350,
    estimatedTime: '2-4 hours',
    rating: 4.7,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
    popular: false,
    includes: ['Assembly', 'Hardware tightening', 'Level adjustment', 'Cleanup'],
    excludes: ['Furniture purchase', 'Custom modifications', 'Painting/polishing'],
  },
  {
    id: 5,
    name: 'AC Gas Refill',
    category: 'AC Service',
    categoryId: 5,
    description: 'AC gas refilling service with leak detection and pressure testing for optimal cooling performance.',
    longDescription: 'Restore your AC\'s cooling performance with our gas refill service. Our technicians will check for leaks, repair minor leaks if found, and refill refrigerant gas to the correct pressure level. Compatible with all AC brands.',
    price: 1299,
    priceType: 'fixed',
    hourlyRate: null,
    estimatedTime: '1-2 hours',
    rating: 4.5,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1631545806609-05faf572e1fa?w=400&h=300&fit=crop',
    popular: true,
    includes: ['Leak detection', 'Gas refill', 'Pressure testing', 'Cooling check', 'Filter cleaning'],
    excludes: ['Compressor repair', 'PCB replacement', 'Deep AC service'],
  },
  {
    id: 6,
    name: 'Room Painting',
    category: 'Painter',
    categoryId: 6,
    description: 'Professional room painting service with premium paints. Transform your space with a fresh coat of paint.',
    longDescription: 'Give your room a fresh new look with our professional painting service. Our painters provide smooth, even finishes using premium quality paints. Service includes wall preparation, primer application, and two coats of paint.',
    price: 2499,
    priceType: 'fixed',
    hourlyRate: null,
    estimatedTime: '1-2 days',
    rating: 4.8,
    reviewCount: 63,
    image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=300&fit=crop',
    popular: false,
    includes: ['Wall preparation', 'Primer coat', '2 coats of paint', 'Furniture covering', 'Cleanup'],
    excludes: ['Paint purchase', 'Texture work', 'Ceiling painting', 'Waterproofing'],
  },
  {
    id: 7,
    name: 'Washing Machine Repair',
    category: 'Appliance Repair',
    categoryId: 7,
    description: 'Expert repair service for all washing machine brands. Fix drainage, spin, and motor issues.',
    longDescription: 'Our trained technicians can diagnose and repair all types of washing machine problems including drainage issues, spin problems, motor failures, and electronic faults. We carry common spare parts for quick repairs.',
    price: 349,
    priceType: 'hourly',
    hourlyRate: 349,
    estimatedTime: '1-3 hours',
    rating: 4.4,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop',
    popular: false,
    includes: ['Diagnosis', 'Minor repairs', 'Testing', 'Service tips'],
    excludes: ['Spare parts cost', 'Major component replacement', 'Installation'],
  },
  {
    id: 8,
    name: 'Cockroach Control',
    category: 'Pest Control',
    categoryId: 8,
    description: 'Effective cockroach treatment using safe, odorless gel and spray methods for lasting results.',
    longDescription: 'Eliminate cockroaches from your home with our professional pest control service. We use a combination of gel baiting and residual spraying methods that are safe for your family and pets while being highly effective against cockroaches.',
    price: 799,
    priceType: 'fixed',
    hourlyRate: null,
    estimatedTime: '1-2 hours',
    rating: 4.7,
    reviewCount: 145,
    image: 'https://images.unsplash.com/photo-1632935190605-517110529e78?w=400&h=300&fit=crop',
    popular: true,
    includes: ['Gel treatment', 'Spray treatment', 'Kitchen treatment', 'Bathroom treatment', '30-day warranty'],
    excludes: ['Termite treatment', 'Bed bug treatment', 'Fumigation'],
  },
  {
    id: 9,
    name: 'Switchboard Repair',
    category: 'Electrician',
    categoryId: 1,
    description: 'Repair or replace faulty switchboards, sockets, and electrical switches safely.',
    longDescription: 'Our electricians will repair or replace damaged switchboards, modular switches, and power sockets. We use ISI-certified components and ensure all connections are safe and properly insulated.',
    price: 199,
    priceType: 'fixed',
    hourlyRate: 300,
    estimatedTime: '30 min - 1 hour',
    rating: 4.6,
    reviewCount: 201,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    popular: false,
    includes: ['Switch replacement', 'Wiring check', 'Safety testing'],
    excludes: ['Switch/socket cost', 'Major rewiring', 'MCB installation'],
  },
  {
    id: 10,
    name: 'Bathroom Deep Clean',
    category: 'Cleaning',
    categoryId: 3,
    description: 'Intensive bathroom cleaning service including tile scrubbing, fixture polishing, and disinfection.',
    longDescription: 'Get your bathroom sparkling clean with our deep cleaning service. We scrub tiles, clean grout, polish fixtures, descale shower heads, and disinfect all surfaces. Perfect for removing hard water stains and mold.',
    price: 499,
    priceType: 'fixed',
    hourlyRate: null,
    estimatedTime: '1-2 hours',
    rating: 4.8,
    reviewCount: 178,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
    popular: true,
    includes: ['Tile scrubbing', 'Fixture polishing', 'Mirror cleaning', 'Floor cleaning', 'Disinfection'],
    excludes: ['Plumbing repairs', 'Tile replacement', 'Waterproofing'],
  },
  {
    id: 11,
    name: 'AC Regular Service',
    category: 'AC Service',
    categoryId: 5,
    description: 'Complete AC servicing including filter cleaning, coil cleaning, and performance check.',
    longDescription: 'Keep your AC running efficiently with our regular service. Includes thorough cleaning of filters, evaporator and condenser coils, drain line, and comprehensive performance check.',
    price: 499,
    priceType: 'fixed',
    hourlyRate: null,
    estimatedTime: '1 hour',
    rating: 4.7,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    popular: true,
    includes: ['Filter cleaning', 'Coil cleaning', 'Drain cleaning', 'Gas pressure check', 'Performance test'],
    excludes: ['Gas refill', 'Part replacement', 'Deep chemical wash'],
  },
  {
    id: 12,
    name: 'Door Lock Repair',
    category: 'Carpenter',
    categoryId: 4,
    description: 'Fix jammed locks, broken door handles, and install new locks for better security.',
    longDescription: 'Our carpenters can repair or replace door locks, fix jammed mechanisms, repair broken handles, and install new high-security locks. We work with all types of doors including wooden, metal, and UPVC.',
    price: 249,
    priceType: 'fixed',
    hourlyRate: 300,
    estimatedTime: '30 min - 1 hour',
    rating: 4.5,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
    popular: false,
    includes: ['Lock diagnosis', 'Repair/replacement', 'Testing', 'Lubrication'],
    excludes: ['Lock purchase cost', 'Door replacement', 'Frame repair'],
  },
];

export const providers = [
  {
    id: 1,
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    services: ['Electrician'],
    serviceIds: [1],
    experience: 8,
    hourlyRate: 300,
    rating: 4.8,
    reviewCount: 127,
    completedJobs: 342,
    location: 'Meerut, UP',
    distance: '2.5 km',
    verified: true,
    available: true,
    joinedDate: '2024-03-15',
    bio: 'Certified electrician with 8+ years of experience. Specialized in residential electrical work, fan installation, and wiring repairs.',
    badges: ['Top Rated', 'Quick Response'],
    status: 'approved',
  },
  {
    id: 2,
    name: 'Amit Sharma',
    email: 'amit@example.com',
    phone: '+91 98765 43211',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    services: ['Plumber'],
    serviceIds: [2],
    experience: 12,
    hourlyRate: 350,
    rating: 4.6,
    reviewCount: 89,
    completedJobs: 567,
    location: 'Meerut, UP',
    distance: '3.8 km',
    verified: true,
    available: true,
    joinedDate: '2023-11-20',
    bio: 'Master plumber handling all types of plumbing work. Expert in pipe repair, bathroom fitting, and water tank installation.',
    badges: ['Experienced', 'Verified'],
    status: 'approved',
  },
  {
    id: 3,
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+91 98765 43212',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    services: ['Cleaning'],
    serviceIds: [3],
    experience: 5,
    hourlyRate: 250,
    rating: 4.9,
    reviewCount: 234,
    completedJobs: 891,
    location: 'Meerut, UP',
    distance: '1.2 km',
    verified: true,
    available: true,
    joinedDate: '2024-01-10',
    bio: 'Professional cleaning expert with a team of trained cleaners. We ensure spotless results every time with eco-friendly products.',
    badges: ['Top Rated', 'Eco Friendly'],
    status: 'approved',
  },
  {
    id: 4,
    name: 'Rohit Mehta',
    email: 'rohit@example.com',
    phone: '+91 98765 43213',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    services: ['AC Service', 'Appliance Repair'],
    serviceIds: [5, 7],
    experience: 10,
    hourlyRate: 400,
    rating: 4.7,
    reviewCount: 156,
    completedJobs: 423,
    location: 'Meerut, UP',
    distance: '4.1 km',
    verified: true,
    available: false,
    joinedDate: '2023-08-05',
    bio: 'AC and appliance repair specialist. Factory-trained technician for all major brands. Quick diagnosis and reliable repairs.',
    badges: ['Brand Certified', 'Quick Fix'],
    status: 'approved',
  },
  {
    id: 5,
    name: 'Deepak Verma',
    email: 'deepak@example.com',
    phone: '+91 98765 43214',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    services: ['Carpenter', 'Painter'],
    serviceIds: [4, 6],
    experience: 15,
    hourlyRate: 350,
    rating: 4.8,
    reviewCount: 63,
    completedJobs: 234,
    location: 'Meerut, UP',
    distance: '5.5 km',
    verified: true,
    available: true,
    joinedDate: '2024-05-22',
    bio: 'Veteran carpenter and painter with 15 years of craftsmanship. Expert in furniture assembly, repair, and interior painting.',
    badges: ['Master Craftsman'],
    status: 'pending',
  },
];

export const bookings = [
  {
    id: 'HF1024',
    serviceId: 1,
    serviceName: 'Fan Installation',
    category: 'Electrician',
    providerId: 1,
    providerName: 'Rahul Kumar',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    customerId: 1,
    customerName: 'Ankit Sharma',
    customerPhone: '+91 99887 76655',
    date: '2026-01-15',
    time: '10:00 AM',
    duration: 2,
    address: '123, Main Street, Sector 12, Meerut, UP 250001',
    status: 'confirmed',
    visitCharge: 100,
    labourCharge: 600,
    platformFee: 20,
    total: 720,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    description: 'Need to install a new ceiling fan in the bedroom. Old fan needs to be removed first.',
    timeline: [
      { step: 'Booking Confirmed', done: true, time: '09:00 AM' },
      { step: 'Provider Assigned', done: true, time: '09:15 AM' },
      { step: 'Provider On The Way', done: false, time: null },
      { step: 'Service Started', done: false, time: null },
      { step: 'Service Completed', done: false, time: null },
    ],
    createdAt: '2026-01-14T15:30:00Z',
  },
  {
    id: 'HF1023',
    serviceId: 2,
    serviceName: 'Pipe Leak Repair',
    category: 'Plumber',
    providerId: 2,
    providerName: 'Amit Sharma',
    providerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    customerId: 1,
    customerName: 'Ankit Sharma',
    customerPhone: '+91 99887 76655',
    date: '2026-01-14',
    time: '2:00 PM',
    duration: 1.5,
    address: '123, Main Street, Sector 12, Meerut, UP 250001',
    status: 'completed',
    visitCharge: 100,
    labourCharge: 375,
    platformFee: 25,
    total: 500,
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    description: 'Kitchen sink pipe is leaking badly. Water dripping from the joint.',
    timeline: [
      { step: 'Booking Confirmed', done: true, time: '12:00 PM' },
      { step: 'Provider Assigned', done: true, time: '12:10 PM' },
      { step: 'Provider On The Way', done: true, time: '01:30 PM' },
      { step: 'Service Started', done: true, time: '02:00 PM' },
      { step: 'Service Completed', done: true, time: '03:30 PM' },
    ],
    createdAt: '2026-01-13T10:00:00Z',
  },
  {
    id: 'HF1022',
    serviceId: 3,
    serviceName: 'Full Home Cleaning',
    category: 'Cleaning',
    providerId: 3,
    providerName: 'Priya Singh',
    providerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    customerId: 1,
    customerName: 'Ankit Sharma',
    customerPhone: '+91 99887 76655',
    date: '2026-01-16',
    time: '9:00 AM',
    duration: 5,
    address: '123, Main Street, Sector 12, Meerut, UP 250001',
    status: 'upcoming',
    visitCharge: 0,
    labourCharge: 1499,
    platformFee: 50,
    total: 1549,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    description: 'Complete home deep cleaning for a 3BHK apartment.',
    timeline: [
      { step: 'Booking Confirmed', done: true, time: '08:00 AM' },
      { step: 'Provider Assigned', done: false, time: null },
      { step: 'Provider On The Way', done: false, time: null },
      { step: 'Service Started', done: false, time: null },
      { step: 'Service Completed', done: false, time: null },
    ],
    createdAt: '2026-01-12T18:00:00Z',
  },
  {
    id: 'HF1021',
    serviceId: 5,
    serviceName: 'AC Gas Refill',
    category: 'AC Service',
    providerId: 4,
    providerName: 'Rohit Mehta',
    providerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    customerId: 1,
    customerName: 'Ankit Sharma',
    customerPhone: '+91 99887 76655',
    date: '2026-01-10',
    time: '11:00 AM',
    duration: 2,
    address: '123, Main Street, Sector 12, Meerut, UP 250001',
    status: 'completed',
    visitCharge: 100,
    labourCharge: 1199,
    platformFee: 40,
    total: 1339,
    paymentMethod: 'Net Banking',
    paymentStatus: 'paid',
    description: 'AC not cooling properly, needs gas refill.',
    timeline: [
      { step: 'Booking Confirmed', done: true, time: '09:00 AM' },
      { step: 'Provider Assigned', done: true, time: '09:30 AM' },
      { step: 'Provider On The Way', done: true, time: '10:30 AM' },
      { step: 'Service Started', done: true, time: '11:00 AM' },
      { step: 'Service Completed', done: true, time: '12:45 PM' },
    ],
    createdAt: '2026-01-09T14:00:00Z',
  },
  {
    id: 'HF1020',
    serviceId: 4,
    serviceName: 'Furniture Assembly',
    category: 'Carpenter',
    providerId: 5,
    providerName: 'Deepak Verma',
    providerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    customerId: 1,
    customerName: 'Ankit Sharma',
    customerPhone: '+91 99887 76655',
    date: '2026-01-08',
    time: '3:00 PM',
    duration: 3,
    address: '123, Main Street, Sector 12, Meerut, UP 250001',
    status: 'cancelled',
    visitCharge: 0,
    labourCharge: 1050,
    platformFee: 35,
    total: 1085,
    paymentMethod: 'UPI',
    paymentStatus: 'refunded',
    description: 'Assemble new wardrobe from IKEA.',
    timeline: [
      { step: 'Booking Confirmed', done: true, time: '01:00 PM' },
      { step: 'Booking Cancelled', done: true, time: '02:00 PM' },
    ],
    createdAt: '2026-01-07T11:00:00Z',
  },
  {
    id: 'HF1019',
    serviceId: 10,
    serviceName: 'Bathroom Deep Clean',
    category: 'Cleaning',
    providerId: 3,
    providerName: 'Priya Singh',
    providerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    customerId: 1,
    customerName: 'Ankit Sharma',
    customerPhone: '+91 99887 76655',
    date: '2026-01-15',
    time: '3:00 PM',
    duration: 2,
    address: '123, Main Street, Sector 12, Meerut, UP 250001',
    status: 'ongoing',
    visitCharge: 0,
    labourCharge: 499,
    platformFee: 15,
    total: 514,
    paymentMethod: 'Cash',
    paymentStatus: 'pending',
    description: 'Deep clean 2 bathrooms with descaling.',
    timeline: [
      { step: 'Booking Confirmed', done: true, time: '01:00 PM' },
      { step: 'Provider Assigned', done: true, time: '01:15 PM' },
      { step: 'Provider On The Way', done: true, time: '02:30 PM' },
      { step: 'Service Started', done: true, time: '03:00 PM' },
      { step: 'Service Completed', done: false, time: null },
    ],
    createdAt: '2026-01-14T20:00:00Z',
  },
];

export const reviews = [
  {
    id: 1,
    bookingId: 'HF1023',
    serviceId: 2,
    providerId: 2,
    customerId: 1,
    customerName: 'Ankit Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
    rating: 5,
    comment: 'Excellent work! Amit fixed the pipe leak quickly and professionally. He also checked other pipes for potential issues. Very thorough and clean work.',
    date: '2026-01-14',
    providerReply: 'Thank you for the kind words, Ankit! Happy to help. Feel free to reach out anytime.',
    helpful: 12,
  },
  {
    id: 2,
    bookingId: 'HF1021',
    serviceId: 5,
    providerId: 4,
    customerId: 1,
    customerName: 'Neha Gupta',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    rating: 4,
    comment: 'Good service overall. AC is cooling much better now after the gas refill. Technician was knowledgeable. Only took a bit longer than expected.',
    date: '2026-01-11',
    providerReply: null,
    helpful: 8,
  },
  {
    id: 3,
    bookingId: 'HF1022',
    serviceId: 3,
    providerId: 3,
    customerId: 1,
    customerName: 'Vikram Patel',
    customerAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=50&h=50&fit=crop&crop=face',
    rating: 5,
    comment: 'Absolutely amazing deep cleaning service! The team was professional, thorough, and the house looks brand new. Will definitely book again.',
    date: '2026-01-13',
    providerReply: 'Thank you Vikram! We take pride in delivering spotless results. See you next time! 🙂',
    helpful: 24,
  },
  {
    id: 4,
    bookingId: 'HF1024',
    serviceId: 1,
    providerId: 1,
    customerId: 1,
    customerName: 'Suman Agarwal',
    customerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face',
    rating: 5,
    comment: 'Rahul is the best electrician I\'ve ever hired! Installed 3 fans perfectly. Very punctual and professional. Highly recommended!',
    date: '2026-01-15',
    providerReply: 'Thank you Suman ji! It was a pleasure working at your home. Stay safe! 🔧',
    helpful: 18,
  },
];

export const earningsData = {
  totalEarnings: 25400,
  platformFees: 2540,
  netEarnings: 22860,
  availableBalance: 8500,
  weekly: [
    { week: 'Week 1', earnings: 5200, jobs: 12 },
    { week: 'Week 2', earnings: 6800, jobs: 15 },
    { week: 'Week 3', earnings: 7100, jobs: 16 },
    { week: 'Week 4', earnings: 6300, jobs: 14 },
  ],
  monthly: [
    { month: 'Aug', earnings: 18200 },
    { month: 'Sep', earnings: 21500 },
    { month: 'Oct', earnings: 19800 },
    { month: 'Nov', earnings: 23100 },
    { month: 'Dec', earnings: 25400 },
    { month: 'Jan', earnings: 22860 },
  ],
  transactions: [
    { id: 1, bookingId: 'HF1024', amount: 500, fee: 50, net: 450, date: '2026-01-15', status: 'completed' },
    { id: 2, bookingId: 'HF1023', amount: 720, fee: 72, net: 648, date: '2026-01-14', status: 'completed' },
    { id: 3, bookingId: 'HF1022', amount: 1499, fee: 150, net: 1349, date: '2026-01-13', status: 'completed' },
    { id: 4, bookingId: 'HF1021', amount: 1299, fee: 130, net: 1169, date: '2026-01-10', status: 'completed' },
    { id: 5, bookingId: 'HF1019', amount: 499, fee: 50, net: 449, date: '2026-01-15', status: 'pending' },
  ],
  bankDetails: {
    accountNumber: 'XXXX4567',
    bankName: 'ICICI Bank',
    ifsc: 'ICIC0001234',
  },
};

export const adminStats = {
  totalUsers: 1250,
  totalProviders: 184,
  totalBookings: 2450,
  totalRevenue: 1250000,
  pendingProviders: 12,
  activeBookings: 45,
  monthlyGrowth: 15.3,
  revenueGrowth: 22.5,
  recentRevenue: [
    { day: 'Mon', revenue: 12500 },
    { day: 'Tue', revenue: 18200 },
    { day: 'Wed', revenue: 15600 },
    { day: 'Thu', revenue: 21000 },
    { day: 'Fri', revenue: 19400 },
    { day: 'Sat', revenue: 25100 },
    { day: 'Sun', revenue: 16800 },
  ],
  topServices: [
    { name: 'Cleaning', bookings: 520, revenue: 412000 },
    { name: 'Electrician', bookings: 380, revenue: 285000 },
    { name: 'Plumber', bookings: 340, revenue: 198000 },
    { name: 'AC Service', bookings: 290, revenue: 345000 },
  ],
};

export const notifications = [
  { id: 1, type: 'success', icon: '🎉', message: 'Booking #HF1024 confirmed successfully', time: '2 min ago', read: false },
  { id: 2, type: 'info', icon: '✅', message: 'Provider Rahul Kumar has been assigned', time: '5 min ago', read: false },
  { id: 3, type: 'info', icon: '🚗', message: 'Provider is on the way to your location', time: '15 min ago', read: false },
  { id: 4, type: 'success', icon: '💰', message: 'Payment of ₹720 received for booking #HF1024', time: '1 hour ago', read: true },
  { id: 5, type: 'warning', icon: '🔔', message: 'New booking request from Ankit Sharma', time: '2 hours ago', read: true },
  { id: 6, type: 'success', icon: '⭐', message: 'You received a 5-star review from Suman', time: '3 hours ago', read: true },
];

export const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
];

export const cities = ['Meerut', 'Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad', 'Lucknow'];

export const users = [
  { id: 1, name: 'Ankit Sharma', email: 'ankit@example.com', phone: '+91 99887 76655', role: 'customer', status: 'active', joinedDate: '2025-06-15', bookings: 8, spent: 5627 },
  { id: 2, name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 99887 76656', role: 'customer', status: 'active', joinedDate: '2025-07-20', bookings: 5, spent: 3450 },
  { id: 3, name: 'Vikram Patel', email: 'vikram@example.com', phone: '+91 99887 76657', role: 'customer', status: 'active', joinedDate: '2025-08-10', bookings: 12, spent: 8920 },
  { id: 4, name: 'Suman Agarwal', email: 'suman@example.com', phone: '+91 99887 76658', role: 'customer', status: 'blocked', joinedDate: '2025-09-01', bookings: 3, spent: 1500 },
  { id: 5, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 99887 76659', role: 'customer', status: 'active', joinedDate: '2025-10-12', bookings: 7, spent: 6100 },
];

// Real Backend API integration
const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('homefix_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const mockApi = {
  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  getServices: async (filters) => {
    let url = `${API_URL}/services`;
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch services');
    return data;
  },

  getBookings: async () => {
    const res = await fetch(`${API_URL}/bookings`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
    return data;
  },

  createBooking: async (bookingData) => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create booking');
    return data;
  },

  processPayment: async (paymentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, transactionId: `TXN${Date.now()}`, message: 'Payment successful' });
      }, 1000);
    });
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  getEarnings: async () => {
    const res = await fetch(`${API_URL}/earnings`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch earnings');
    return data;
  },

  updateBookingStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update booking status');
    return data;
  },
};
