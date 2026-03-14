import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github } from 'lucide-react';

const ContributionGraph = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="activity" className="py-16 md:py-24 px-6 md:px-12 lg:px-24" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading" data-num="04.">
            My Coding Activity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LeetCode */}
            <div className="bg-card rounded-lg p-5 flex flex-col items-center shadow-lg border border-border">
              <h3 className="font-mono text-primary text-sm mb-4 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#FFA116]">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                </svg>
                LeetCode
              </h3>
              <img src="https://leetcard.jacoblin.cool/Abhinandanx538?theme=dark&font=ABeeZee&ext=heatmap"
                   alt="LeetCode Heatmap" className="w-full rounded-lg" />
            </div>

            {/* GitHub */}
            <div className="bg-card rounded-lg p-5 flex flex-col items-center shadow-lg border border-border">
              <h3 className="font-mono text-primary text-sm mb-4 flex items-center gap-2">
                <Github className="w-5 h-5 text-foreground" />
                GitHub
              </h3>
              <div className="w-full overflow-x-auto flex items-center justify-center">
                <img src="https://ghchart.rshah.org/4078c0/Abhinandan-KP"
                     alt="GitHub Contribution Graph" className="w-full min-w-full rounded-lg" />
              </div>
            </div>

            {/* Codeforces */}
            <div className="bg-card rounded-lg p-5 flex flex-col items-center shadow-lg border border-border overflow-hidden">
              <h3 className="font-mono text-primary text-sm mb-4 flex items-center gap-2">
                <img src="https://cdn.codeforces.com/s/34569/favicon-96x96.png" alt="Codeforces" className="w-5 h-5" />
                Codeforces
              </h3>
              <div className="w-full flex justify-center flex-1">
                <img src="https://cf.leed.at/?id=xmas123"
                     alt="Codeforces Stats" className="w-full rounded-lg object-contain max-h-48" />
              </div>
            </div>

            {/* GeeksforGeeks */}
            <div className="bg-card rounded-lg p-5 flex flex-col items-center shadow-lg border border-border overflow-hidden">
              <h3 className="font-mono text-primary text-sm mb-4 flex items-center gap-2">
                <img src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" alt="GFG" className="w-5 h-5" />
                GeeksforGeeks
              </h3>
              <div className="w-full flex justify-center flex-1">
                <img src="https://geeks-for-geeks-stats-api.vercel.app/?userName=abhiroznll"
                     alt="GeeksforGeeks Stats" className="w-full rounded-lg object-contain max-h-48"
                     onError={(e) => {
                       e.currentTarget.src = "https://gfgstatscard.vercel.app/api?username=abhiroznll&theme=dark";
                     }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContributionGraph;
