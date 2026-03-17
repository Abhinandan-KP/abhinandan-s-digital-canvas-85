import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, FileText, X, Award } from 'lucide-react';

const certifications = [
  { file: 'Abhinandan udemy certificate.jpg', title: 'Mastering Data Structures & Algorithms using C', type: 'image' },
  { file: 'certificate udemy backend.pdf', title: 'Udemy Backend  Development', type: 'pdf' },
  { file: 'Database creation etc.pdf', title: 'Mastering MYSQL: Database Creation, Management & SQL Queries', type: 'pdf' },
  { file: 'Full-Stack Development for beginner.pdf', title: 'Full-Stack Development', type: 'pdf' },
  { file: 'Fundamentals of Object Oriented Programming.pdf', title: 'OOP Fundamentals', type: 'pdf' },
  { file: 'Legacy Responsive Web Design V8.jpeg', title: 'Legacy Responsive Web Design V8', type: 'image' },
  { file: 'Programming In Java.pdf', title: 'Programming in Java', type: 'pdf' },
  { file: 'UC-6e1bc6b0-a4bd-4bc0-be43-9e3f9aa00df0.pdf', title: 'Python Complete Course For Python Beginners', type: 'pdf' },
];

const Certifications = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-20% 0px -20% 0px' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleOpen = (cert: any, e: React.MouseEvent) => {
    e.preventDefault();
    const encodedFile = cert.file.split('/').map(encodeURIComponent).join('/');
    const url = `/assets/certificates/${encodedFile}`;
    if (cert.type === 'pdf') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedImage(url);
    }
  };

  return (
    <>
      <section id="certificates" className="py-16 md:py-24 px-6 md:px-12 lg:px-24 transition-all duration-1000" ref={ref}>
        <motion.div 
          className="container mx-auto max-w-6xl"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-heading"
            data-num="05."
          >
            Certificates
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => {
              const url = `/assets/certificates/${cert.file.split('/').map(encodeURIComponent).join('/')}`;
              
              return (
                <motion.div
                  key={cert.file}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.05 * index, duration: 0.5 }}
                  className="bg-card border border-border rounded-lg overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-300 shadow-lg"
                >
                  {/* Thumbnail Area */}
                  <div 
                    className="relative w-full aspect-video bg-[#112240] cursor-pointer overflow-hidden border-b border-border flex items-center justify-center"
                    onClick={(e) => handleOpen(cert, e)}
                  >
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none" />
                    
                    {cert.type === 'image' ? (
                      <img src={url} alt={cert.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-primary/50 group-hover:text-primary transition-colors">
                        <FileText className="w-16 h-16 mb-2" />
                        <span className="font-mono text-xs font-semibold">PDF Document</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Text Details & Action */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2" title={cert.title}>
                      {cert.title}
                    </h3>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground font-mono">
                        <Award className="w-4 h-4 mr-1 text-primary" />
                        Certificate
                      </div>
                      <button 
                        onClick={(e) => handleOpen(cert, e)}
                        className="flex items-center gap-2 text-sm font-mono text-primary hover:text-foreground transition-colors"
                      >
                        View <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Certificate Preview"
              className="max-w-full max-h-full object-contain rounded-sm shadow-xl border border-border"
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Certifications;
