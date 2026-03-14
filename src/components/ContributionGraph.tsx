import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';

const ContributionGraph = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Generate random contribution data for the last year
  const contributionData = useMemo(() => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(startDate.getFullYear() - 1);

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const random = Math.random();
      let level = 0;
      if (random > 0.3) level = 1;
      if (random > 0.5) level = 2;
      if (random > 0.7) level = 3;
      if (random > 0.85) level = 4;

      data.push({
        date: new Date(d),
        level,
      });
    }
    return data;
  }, []);

  const weeks = useMemo(() => {
    const result = [];
    let week = [];

    for (let i = 0; i < contributionData.length; i++) {
      week.push(contributionData[i]);
      if (week.length === 7 || i === contributionData.length - 1) {
        result.push(week);
        week = [];
      }
    }
    return result;
  }, [contributionData]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-card';
      case 1: return 'bg-primary/20';
      case 2: return 'bg-primary/40';
      case 3: return 'bg-primary/70';
      case 4: return 'bg-primary';
      default: return 'bg-card';
    }
  };

  const totalContributions = contributionData.filter(d => d.level > 0).length;

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

          <div className="bg-card rounded-lg p-4 md:p-6 overflow-x-auto">
            {/* Month labels */}
            <div className="flex gap-1 mb-2 ml-8">
              {months.map((month, index) => (
                <span
                  key={month}
                  className="text-xs text-muted-foreground"
                  style={{ width: `${100 / 12}%`, minWidth: '40px' }}
                >
                  {month}
                </span>
              ))}
            </div>

            {/* Contribution grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 mr-2">
                <span className="text-xs text-muted-foreground h-3">Mon</span>
                <span className="text-xs text-muted-foreground h-3"></span>
                <span className="text-xs text-muted-foreground h-3">Wed</span>
                <span className="text-xs text-muted-foreground h-3"></span>
                <span className="text-xs text-muted-foreground h-3">Fri</span>
                <span className="text-xs text-muted-foreground h-3"></span>
                <span className="text-xs text-muted-foreground h-3">Sun</span>
              </div>

              {/* Weeks */}
              <div className="flex gap-0.5">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-0.5">
                    {week.map((day, dayIndex) => (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.5 + weekIndex * 0.01, duration: 0.2 }}
                        className={`contribution-cell ${getLevelColor(day.level)}`}
                        title={`${day.date.toDateString()}: ${day.level} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
              <span>{totalContributions} contributions in the last year</span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`contribution-cell ${getLevelColor(level)}`}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContributionGraph;
