import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github } from 'lucide-react';

const ContributionGraph = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-20% 0px -20% 0px' });

  return (
    <section id="activity" className="py-16 md:py-24 px-6 md:px-12 lg:px-24 transition-all duration-1000" ref={ref}>
      <motion.div 
        className="container mx-auto max-w-5xl"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading" data-num="04.">
            My Coding Activity
          </h2>

          <div className="grid grid-cols-1 gap-8">
            {/* LeetCode */}
            <div className="bg-card rounded-xl p-6 flex flex-col items-center shadow-2xl border border-border/50 backdrop-blur-sm">
              <h3 className="font-mono text-primary text-lg mb-6 flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#FFA116]">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                </svg>
                LeetCode Statistics
              </h3>
              <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-center">
                <img src="https://leetcard.jacoblin.cool/Abhinandanx538?theme=dark&font=ABeeZee"
                     alt="LeetCode Stats" className="h-48 md:h-64 object-contain" />
                <img src="https://leetcard.jacoblin.cool/Abhinandanx538?theme=dark&font=ABeeZee&ext=heatmap"
                     alt="LeetCode Heatmap" className="h-48 md:h-64 object-contain" />
              </div>
            </div>

            {/* GitHub */}
            <div className="bg-card rounded-xl p-6 flex flex-col items-center shadow-2xl border border-border/50 backdrop-blur-sm">
              <h3 className="font-mono text-primary text-lg mb-6 flex items-center gap-3">
                <Github className="w-6 h-6 text-foreground" />
                GitHub Contributions
              </h3>
              <div className="w-full overflow-x-auto flex items-center justify-center p-4 bg-muted/20 rounded-lg border border-border/30">
                <img src="https://ghchart.rshah.org/4078c0/Abhinandan-KP"
                     alt="GitHub Contribution Graph" className="w-full max-w-4xl" />
              </div>
            </div>

            {/* Codeforces */}
            <div className="bg-card rounded-xl p-6 flex flex-col items-center shadow-2xl border border-border/50 backdrop-blur-sm">
              <h3 className="font-mono text-primary text-lg mb-6 flex items-center gap-3">
                <img src="https://cdn.codeforces.com/s/34569/favicon-96x96.png" alt="Codeforces" className="w-6 h-6" />
                Codeforces Profile
              </h3>
              <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-center">
                <img src="https://codeforces-readme-stats.vercel.app/api/card?username=xmas123&theme=dark"
                     alt="Codeforces Stats" className="h-48 md:h-64 object-contain" />
                <img src="https://uidu-codeforces-heatmap.vercel.app/api/heatmap?username=xmas123&theme=dark"
                     alt="Codeforces Heatmap" className="h-48 md:h-64 object-contain" />
              </div>
            </div>

            {/* GeeksforGeeks */}
            <div className="bg-card rounded-xl p-6 flex flex-col items-center shadow-2xl border border-border/50 backdrop-blur-sm">
              <h3 className="font-mono text-primary text-lg mb-6 flex items-center gap-3">
                <img src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" alt="GFG" className="w-6 h-6" />
                GeeksforGeeks Profile
              </h3>
              <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-center">
                <img src="https://gfgstatscard.vercel.app/api?username=abhiroznll&theme=dark"
                     alt="GeeksforGeeks Stats" className="h-48 md:h-64 object-contain"
                     onError={(e) => {
                       e.currentTarget.src = "https://gfg-stats-card.vercel.app/api?username=abhiroznll&theme=dark";
                     }} />
                <img src="https://gfg-stats-api.vercel.app/api/heatmap/abhiroznll"
                     alt="GeeksforGeeks Heatmap" className="h-48 md:h-64 object-contain" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContributionGraph;
