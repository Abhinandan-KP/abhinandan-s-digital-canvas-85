import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { num: '01.', label: 'About', href: '#about' },
  { num: '02.', label: 'Work', href: '#work' },
  { num: '04.', label: 'Activity', href: '#activity' },
  { num: '05.', label: 'Certificates', href: '#certificates' },
  { num: '06.', label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="w-10 h-10 border border-primary rounded flex items-center justify-center text-primary font-mono text-lg hover:bg-primary/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          A
        </motion.a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-primary">{item.num}</span> {item.label}
            </motion.a>
          ))}
          <motion.a
            href="./assets/resume.pdf"
            download
            target="_blank"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="px-4 py-2 border border-primary text-primary font-mono text-sm rounded hover:bg-primary/10 transition-colors"
          >
            Resume
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </motion.header>
  );
};

export default Navbar;
