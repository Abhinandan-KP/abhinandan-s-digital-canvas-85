import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-24" ref={ref}>
      <div className="container mx-auto max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-mono text-primary text-sm mb-4"
        >
          06. What's Next?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
        >
          Get In Touch
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-muted-foreground text-lg leading-relaxed mb-12"
        >
          Although I'm currently looking for new opportunities, my inbox is always open. 
          Whether you have a question about my projects, want to discuss software engineering, 
          or just want to say hi, I'll try my best to get back to you!
        </motion.p>

        <motion.a
          href="https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSDZPMZWWwWWBwWrDzhhtZBmmnBhkRNGgNzRtflhBLpqkTMjHCwSlmLTBjVjKPXqrrLBqzsq"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block px-8 py-4 border border-primary text-primary font-mono text-sm rounded hover:bg-primary/10 transition-colors"
        >
          Say Hello
        </motion.a>
      </div>
    </section>
  );
};

export default Contact;
