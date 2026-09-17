import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay, FiCheckCircle, FiZap, FiShield, FiGlobe } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const features = [
  {
    icon: FiZap,
    title: 'Real-time Translation',
    description: 'Instant sign language to text translation with AI-powered accuracy.',
  },
  {
    icon: FiShield,
    title: 'Privacy First',
    description: 'Your data stays secure with end-to-end encryption and local processing.',
  },
  {
    icon: FiGlobe,
    title: 'Multi-language Support',
    description: 'Support for multiple sign languages from around the world.',
  },
  {
    icon: FiCheckCircle,
    title: 'High Accuracy',
    description: '98%+ accuracy rate powered by advanced machine learning models.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Connect Camera',
    description: 'Simply enable your webcam or upload a video file to get started.',
  },
  {
    step: '02',
    title: 'AI Detection',
    description: 'Our AI analyzes hand gestures and movements in real-time.',
  },
  {
    step: '03',
    title: 'Get Translation',
    description: 'Receive instant text translation with confidence scores.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const Landing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-block">
            <span className="rounded-full border border-primary/20 glass-card-light px-4 py-2 text-sm font-medium text-primary">
              Powered by Advanced AI
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-7xl"
          >
            Break Communication Barriers with{' '}
            <span className="gradient-text">AI Sign Language Translation</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary sm:text-xl"
          >
            Real-time, accurate, and accessible sign language translation for everyone.
            Connect, communicate, and bridge the gap between communities.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/signup"
              className="btn-primary group flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold text-white"
            >
              <span>Start Free Trial</span>
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/live-detection"
              className="flex items-center gap-2 rounded-2xl border border-border glass-card px-8 py-4 text-lg font-semibold transition-colors hover:border-primary/40 text-text"
            >
              <FiPlay size={18} className="text-primary" />
              <span>Live Detection Option</span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="relative mt-16">
            <div className="glass-card rounded-3xl p-2 shadow-glow-lg">
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/50">
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
                  >
                    <FiPlay size={40} className="text-primary" />
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-text-secondary"
                  >
                    AI Demo Preview
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>

    <section id="features" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="section-title mb-4">
            Why Choose <span className="gradient-text">Our Platform</span>
          </h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Built with cutting-edge technology to deliver the best sign language translation experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="glass-card glass-card-hover rounded-2xl p-6"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <feature.icon size={26} className="text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <section id="how-it-works" className="relative px-4 py-20 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="section-title mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-subtitle mx-auto max-w-2xl">Get started in just 3 simple steps</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {howItWorks.map((step, index) => (
            <motion.div key={step.step} variants={itemVariants} className="relative">
              <div className="glass-card h-full rounded-2xl p-8">
                <div className="mb-4 text-5xl font-bold gradient-text opacity-50">{step.step}</div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="text-text-secondary">{step.description}</p>
              </div>
              {index < howItWorks.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 text-primary/30 md:block">
                  <FiArrowRight size={22} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <section id="pricing" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl glass-card p-8 text-center sm:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
          <div className="relative z-10">
            <h2 className="section-title mb-4">Ready to Transform Communication?</h2>
            <p className="section-subtitle mx-auto mb-8 max-w-2xl">
              Join thousands of users already breaking communication barriers with AI-powered sign language translation.
            </p>
            <Link
              to="/signup"
              className="btn-primary group inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold text-white"
            >
              <span>Start Free Trial</span>
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Landing;
