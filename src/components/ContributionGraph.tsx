import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Github } from 'lucide-react';
import { GitHubCalendar } from 'react-github-calendar';
import LeetCodeHeatmap from './LeetCodeHeatmap';
/* ═══════════════════════════════════════════════════════════
   SHARED HeatmapGrid — reused for both CF and GFG
═══════════════════════════════════════════════════════════ */
const HeatmapGrid = ({ data = {}, colors, loading, error }: { data?: any, colors: string[], loading: boolean, error: boolean }) => {
  if (loading) return (
    <p className="text-muted-foreground font-mono text-xs m-0">
      Loading heatmap...
    </p>
  );
  if (error) return (
    <p className="text-muted-foreground font-mono text-xs m-0">
      Heatmap unavailable
    </p>
  );

  const CELL = 11, GAP = 3;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(today.getDate() - 52 * 7 - today.getDay());

  const weeks = [];
  const monthLabels = [];

  for (let w = 0; w < 53; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start);
      dt.setDate(start.getDate() + w * 7 + d);
      const key = dt.toISOString().split('T')[0];
      week.push({ key, count: data[key] || 0, isFuture: dt > today });
    }
    const anchor = new Date(week[0].key);
    if (!week[0].isFuture && anchor.getDate() <= 7) {
      monthLabels.push({
        label: anchor.toLocaleString('default', { month: 'short' }),
        col: w,
      });
    }
    weeks.push(week);
  }

  const shade = (count: number, isFuture: boolean) => {
    if (isFuture) return 'transparent';
    if (count === 0) return colors[0];
    if (count === 1) return colors[1];
    if (count <= 3) return colors[2];
    if (count <= 6) return colors[3];
    return colors[4];
  };

  return (
    <div className="overflow-x-auto pb-1 max-w-full">
      <div className="inline-block">
        {/* Month labels */}
        <div className="relative h-[18px] mb-1">
          {monthLabels.map((m, i) => (
            <span key={i} className="absolute text-[10px] text-muted-foreground font-mono" style={{ left: m.col * (CELL + GAP) }}>
              {m.label}
            </span>
          ))}
        </div>
        {/* Grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((cell, di) => (
                <div
                  key={di}
                  title={cell.isFuture ? '' : `${cell.key}: ${cell.count}`}
                  className="rounded-[2px] border border-white/5"
                  style={{
                    width: CELL,
                    height: CELL,
                    backgroundColor: shade(cell.count, cell.isFuture),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1 mt-2 justify-end">
          <span className="text-[10px] text-muted-foreground font-mono">Less</span>
          {colors.map((c, i) => (
            <div key={i} className="rounded-[2px] border border-white/5" style={{ width: CELL, height: CELL, backgroundColor: c }} />
          ))}
          <span className="text-[10px] text-muted-foreground font-mono">More</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CODEFORCES HEATMAP — uses official Codeforces API
═══════════════════════════════════════════════════════════ */
const CF_COLORS = ['#161b22', '#1a3a5c', '#1c5490', '#1f8dd6', '#58a6ff'];

const CodeforcesHeatmap = ({ username }: { username: string }) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10000`
        );
        if (!res.ok) throw new Error('Network error');
        const json = await res.json();
        if (json.status !== 'OK') throw new Error('CF API error');

        const counts: any = {};
        json.result.forEach((sub: any) => {
          if (sub.verdict === 'OK') {
            const key = new Date(sub.creationTimeSeconds * 1000)
              .toISOString()
              .split('T')[0];
            counts[key] = (counts[key] || 0) + 1;
          }
        });
        if (!cancelled) setData(counts);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [username]);

  return <HeatmapGrid data={data} colors={CF_COLORS} loading={loading} error={error} />;
};



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
          <h2 className="section-heading" data-num="03.">
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
              <div className="w-full mt-2">
                <LeetCodeHeatmap username="Abhinandanx538" />
              </div>
            </div>

            {/* GitHub */}
            <div className="bg-card rounded-xl p-6 flex flex-col items-center shadow-2xl border border-border/50 backdrop-blur-sm">
              <h3 className="font-mono text-primary text-lg mb-6 flex items-center gap-3">
                <Github className="w-6 h-6 text-foreground" />
                GitHub Contributions
              </h3>
              <div className="w-full overflow-x-auto flex items-center justify-center p-4 bg-muted/20 rounded-lg border border-border/30">
                <GitHubCalendar
                  username="Abhinandan-KP"
                  colorScheme="dark"
                  theme={{
                    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
                  }}
                  fontSize={12}
                  blockSize={11}
                  blockMargin={4}
                />
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
                <div className="w-full max-w-[800px] overflow-x-auto mt-4 md:mt-0">
                  <CodeforcesHeatmap username="xmas123" />
                </div>
              </div>
            </div>


          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContributionGraph;
