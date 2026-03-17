import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ExternalLink, Folder } from 'lucide-react';

const projects = [
  {
    title: 'Anemia Detector',
    description: 'An ML-powered web application that detects anemia from medical input data using a trained classification model deployed on the frontend.',
    tech: ['React', 'Machine Learning', 'Vercel'],
    github: 'https://github.com/Abhinandan-KP/Anemiadetectorfrontend',
    external: 'https://anemiadetectorfrontend.vercel.app/',
    featured: true,
  },
  {
    title: 'Phishing Sentinel',
    description: 'A cybersecurity tool that detects and flags phishing URLs in real-time using pattern recognition and heuristic analysis to protect users from malicious websites.',
    tech: ['Python', 'Cybersecurity', 'Machine Learning'],
    github: 'https://github.com/Abhinandan-KP/Phishing-Sentinel',
    external: '',
    featured: true,
  },
  {
    title: 'Dijkstra & BFS Maze Visualizer',
    description: 'An interactive educational tool to visualize Graph Traversal algorithms (Dijkstra\'s shortest path and BFS) on a live maze grid with step-by-step animation of the traversal process.',
    tech: ['React', 'JavaScript', 'Algorithms'],
    github: 'https://github.com/Abhinandan-KP/Dijkstra-BFS-Maze-Visualizer',
    external: 'https://dijkstra-bfs-maze-visualizer.vercel.app/',
    featured: true,
  },
];

const FeaturedProjects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-20% 0px -20% 0px' });

  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 transition-all duration-1000" ref={ref}>
      <motion.div 
        className="container mx-auto max-w-5xl"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-heading"
          data-num="02."
        >
          Some Things I've Built
        </motion.h2>

        <div className="space-y-24 md:space-y-32">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className={`relative grid md:grid-cols-12 gap-4 items-center ${
                index % 2 === 1 ? 'md:text-right' : ''
              }`}
            >
              {/* Project Image */}
              <div
                className={`relative md:col-span-7 aspect-video bg-card rounded overflow-hidden group ${
                  index % 2 === 1 ? 'md:col-start-6' : ''
                }`}
              >
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all duration-300 z-10" />
                <div className="w-full h-full bg-navy-light flex items-center justify-center">
                  <span className="text-primary/30 font-mono text-2xl">{project.title}</span>
                </div>
              </div>

              {/* Project Info */}
              <div
                className={`md:col-span-6 md:absolute md:top-1/2 md:-translate-y-1/2 z-20 ${
                  index % 2 === 1 ? 'md:left-0' : 'md:right-0'
                }`}
              >
                <p className="font-mono text-primary text-sm mb-2">Featured Project</p>
                <h3 className="text-2xl font-semibold text-foreground mb-4 hover:text-primary transition-colors">
                  <a href={project.external} target="_blank" rel="noopener noreferrer">
                    {project.title}
                  </a>
                </h3>
                <div className="bg-card p-6 rounded-lg shadow-xl mb-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <ul
                  className={`flex flex-wrap gap-4 mb-4 ${
                    index % 2 === 1 ? 'md:justify-start' : 'md:justify-end'
                  }`}
                >
                  {project.tech.map((tech) => (
                    <li key={tech} className="font-mono text-xs text-muted-foreground">
                      {tech}
                    </li>
                  ))}
                </ul>
                <div
                  className={`flex gap-4 ${
                    index % 2 === 1 ? 'md:justify-start' : 'md:justify-end'
                  }`}
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={project.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturedProjects;
