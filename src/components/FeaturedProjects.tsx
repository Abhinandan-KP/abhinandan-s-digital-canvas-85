import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ExternalLink, Folder } from 'lucide-react';

const projects = [
  {
    title: 'UPI Playground',
    description: 'A specialized developer tool to simulate NPCI UPI deep-linking protocols. It allows developers to debug payment parameters (\'pa\', \'pn\') and mobile intent flows in real-time, featuring strict input validation to reduce integration errors.',
    tech: ['React', 'JavaScript', 'Vite', 'Tailwind'],
    github: 'https://github.com/Abhinandan-KP',
    external: '#',
    featured: true,
  },
  {
    title: '3D Satellite Orbit Visualizer',
    description: 'A scientific visualization engine that converts raw CSV coordinate data into interactive 3D spherical trajectories. Engineered a Spherical-to-Cartesian transformation pipeline to map satellite data accurately onto a rotating Earth model.',
    tech: ['Python', 'Pandas', 'Plotly', 'Vercel'],
    github: 'https://github.com/Abhinandan-KP',
    external: '#',
    featured: true,
  },
  {
    title: 'Dijkstra & BFS Visualizer',
    description: 'An interactive educational tool to visualize Graph Traversal algorithms. It effectively demonstrates the time-complexity differences between Weighted (Dijkstra) and Unweighted (BFS) searches with step-by-step frontier expansion.',
    tech: ['React', 'JavaScript', 'Algorithms'],
    github: 'https://github.com/Abhinandan-KP',
    external: '#',
    featured: true,
  },
];

const FeaturedProjects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-12 lg:px-24" ref={ref}>
      <div className="container mx-auto max-w-5xl">
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
      </div>
    </section>
  );
};

export default FeaturedProjects;
