import { motion } from 'framer-motion';

const EmailSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed right-6 md:right-10 bottom-0 hidden md:flex flex-col items-center gap-6 z-40"
    >
      <motion.a
        href="https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSDZPMZWWwWWBwWrDzhhtZBmmnBhkRNGgNzRtflhBLpqkTMjHCwSlmLTBjVjKPXqrrLBqzsq"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="vertical-text font-mono text-xs text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all tracking-widest"
      >
        abhinandanx538@gmail.com
      </motion.a>
      <div className="w-px h-24 bg-muted-foreground" />
    </motion.div>
  );
};

export default EmailSidebar;
