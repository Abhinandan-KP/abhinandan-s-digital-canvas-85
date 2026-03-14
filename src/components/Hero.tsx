import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 pt-24">
      <div className="container mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-primary mb-5"
        >
          Hi, my name is
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-2"
        >
          Abhinandan.
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-muted-foreground mb-8"
        >
          I build things for the web.
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-lg md:text-xl max-w-xl mb-12 leading-relaxed"
        >
          I'm a software engineer and B.Tech CSE student at{' '}
          <span className="text-foreground">SRM Institute of Science & Technology</span> (2028). 
          I specialize in building accessible, human-centered products using C++, Java, and the MERN stack. 
          Currently, I'm focused on building scalable developer tools and exploring AI architecture.
        </motion.p>
        
        <motion.a
          href="#work"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block px-8 py-4 border border-primary text-primary font-mono text-sm rounded hover:bg-primary/10 transition-colors"
        >
          Check out my work!
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;
