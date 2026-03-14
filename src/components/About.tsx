import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const technologies = [
  'JavaScript (ES6+)',
  'React',
  'Node.js',
  'C++',
  'Java',
  'SQL',
  'Python',
  'Tailwind CSS',
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-20% 0px -20% 0px' });

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-12 lg:px-24" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-heading"
          data-num="01."
        >
          About Me
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:col-span-2 space-y-4"
          >
            <p className="text-muted-foreground leading-relaxed">
              Hello! My name is Abhinandan and I enjoy creating things that live on the internet. 
              My interest in software engineering started with a curiosity for problem-solving, 
              which led me to dive deep into coding fundamentals and C++ logic before formally 
              starting my engineering degree.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Fast-forward to today, and I'm currently pursuing my B.Tech in Computer Science & Engineering 
              at <span className="text-primary">SRM Institute of Science & Technology</span>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My main focus these days is mastering the MERN stack, while actively expanding my skill set 
              into <span className="text-primary">Cloud Computing (AWS)</span> and{' '}
              <span className="text-primary">Artificial Intelligence</span> to build smarter, scalable applications.
            </p>
            <p className="text-muted-foreground mt-6 font-semibold text-foreground">
              Skills I Know
            </p>
            <ul className="grid grid-cols-2 gap-2 mt-4">
              {technologies.map((tech, index) => (
                <motion.li
                  key={tech}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                  className="flex items-center gap-2 font-mono text-sm text-muted-foreground"
                >
                  <span className="text-primary">▹</span>
                  {tech}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative group"
          >
            <div className="relative w-full aspect-square max-w-[280px] mx-auto">
              {/* Profile image with blur and tint effect */}
              <div className="w-full h-full bg-[#112240] rounded relative z-10 overflow-hidden">
                <div className={`absolute inset-0 bg-primary/20 mix-blend-multiply transition-opacity duration-500 z-10 pointer-events-none ${isInView ? 'opacity-0' : 'opacity-100'}`} />
                <img 
                  src="/assets/Abhinandan.png" 
                  alt="Abhinandan" 
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isInView 
                      ? 'grayscale-0 blur-none opacity-100' 
                      : 'grayscale blur-[8px] opacity-40 scale-95'
                  } group-hover:grayscale-0 group-hover:blur-none group-hover:opacity-100 group-hover:scale-100`} 
                />
              </div>
              {/* Border offset effect */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary rounded z-0 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
