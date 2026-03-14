import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Award } from 'lucide-react';

const certifications = [
  {
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: '2024',
    link: '#',
  },
  {
    title: 'React Developer Certificate',
    issuer: 'Meta',
    date: '2024',
    link: '#',
  },
  {
    title: 'Data Structures & Algorithms',
    issuer: 'Coursera',
    date: '2023',
    link: '#',
  },
];

const Certifications = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="certifications" className="py-16 md:py-24 px-6 md:px-12 lg:px-24" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-heading"
          data-num="05."
        >
          Certifications
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.a
              key={cert.title}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
              className="project-card group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <Award className="w-10 h-10 text-primary" />
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {cert.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-1">{cert.issuer}</p>
              <p className="font-mono text-xs text-muted-foreground">{cert.date}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
