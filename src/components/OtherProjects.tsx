import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Folder, Github, ExternalLink } from 'lucide-react';

const otherProjects = [
  {
    title: 'Anemia Detector',
    description: 'An ML-powered web application that detects anemia from medical input data using a trained classification model deployed on the frontend.',
    tech: ['React', 'Machine Learning', 'Vercel'],
    github: 'https://github.com/Abhinandan-KP/Anemiadetectorfrontend',
    external: 'https://anemiadetectorfrontend.vercel.app/',
  },
  {
    title: 'Phishing Sentinel',
    description: 'A cybersecurity tool that detects and flags phishing URLs in real-time using pattern recognition and heuristic analysis to protect users from malicious websites.',
    tech: ['Python', 'Cybersecurity', 'Machine Learning'],
    github: 'https://github.com/Abhinandan-KP/Phishing-Sentinel',
    external: '',
  },
  {
    title: 'Dijkstra & BFS Maze Visualizer',
    description: 'An interactive educational tool to visualize Graph Traversal algorithms (Dijkstra\'s shortest path and BFS) on a live maze grid with step-by-step animation of the traversal process.',
    tech: ['React', 'JavaScript', 'Algorithms'],
    github: 'https://github.com/Abhinandan-KP/Dijkstra-BFS-Maze-Visualizer',
    external: 'https://dijkstra-bfs-maze-visualizer.vercel.app/',
  },
  {
    title: 'Event Management System',
    description: 'A full-stack event management platform supporting event creation, registration, scheduling, and attendee management with a clean responsive UI.',
    tech: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/Abhinandan-KP/eventManagement1',
    external: 'https://event-management1-woad.vercel.app/',
  },
];

const OtherProjects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-16 px-6 md:px-12 lg:px-24" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Other Noteworthy Projects
          </h3>
          <a
            href="https://github.com/Abhinandan-KP"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-primary link-underline"
          >
            view the archive
          </a>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
              className="project-card flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <Folder className="w-10 h-10 text-primary" />
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.external && (
                    <a
                      href={project.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              <h4 className="text-xl font-semibold text-foreground mb-3 hover:text-primary transition-colors">
                <a href={project.external} target="_blank" rel="noopener noreferrer">
                  {project.title}
                </a>
              </h4>

              <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                {project.description}
              </p>

              <ul className="flex flex-wrap gap-3">
                {project.tech.map((tech) => (
                  <li key={tech} className="font-mono text-xs text-muted-foreground">
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherProjects;
