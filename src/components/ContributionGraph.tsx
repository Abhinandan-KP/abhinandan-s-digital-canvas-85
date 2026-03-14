import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

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
              <h3 className="font-mono text-primary text-sm mb-4">LeetCode</h3>
              <img src="https://leetcard.jacoblin.cool/Abhinandanx538?theme=dark&font=ABeeZee&ext=heatmap"
                   alt="LeetCode Heatmap" className="w-full rounded-lg" />
            </div>

            {/* GitHub */}
            <div className="bg-card rounded-lg p-5 flex flex-col items-center shadow-lg border border-border">
              <h3 className="font-mono text-primary text-sm mb-4">GitHub</h3>
              <div className="w-full overflow-x-auto flex items-center justify-center">
                <img src="https://ghchart.rshah.org/4078c0/Abhinandan-KP"
                     alt="GitHub Contribution Graph" className="w-full min-w-full rounded-lg" />
              </div>
            </div>

            {/* Codeforces */}
            <div className="bg-card rounded-lg p-5 flex flex-col items-center shadow-lg border border-border overflow-hidden">
              <h3 className="font-mono text-primary text-sm mb-4">Codeforces</h3>
              <div className="w-full flex justify-center flex-1">
                <img src="https://codeforces-readme-stats.vercel.app/api/card?user=xmas123&theme=dark"
                     alt="Codeforces Stats" className="w-full rounded-lg object-contain max-h-48"
                     onError={(e) => {
                       e.currentTarget.src = "https://cf.leed.at/?id=xmas123";
                     }} />
              </div>
            </div>

            {/* GeeksforGeeks */}
            <div className="bg-card rounded-lg p-5 flex flex-col items-center shadow-lg border border-border overflow-hidden">
              <h3 className="font-mono text-primary text-sm mb-4">GeeksforGeeks</h3>
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
