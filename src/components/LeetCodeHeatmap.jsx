import { useEffect, useState } from 'react';

/* ════════════════════════════════════════════════
   Build 53-week grid from submissionMap
════════════════════════════════════════════════ */
function buildGrid(submissionMap) {
  const CELL = 14, GAP = 3;
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const start = new Date(today);
  start.setDate(today.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);

  const weeks = [];
  const monthLabels = [];
  let totalActive = 0;
  let totalSubmissions = 0;
  const allDays = [];
  let cursor = new Date(start);
  let weekIndex = 0;

  while (cursor <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(cursor);
      dt.setDate(cursor.getDate() + d);
      if (dt > today) {
        week.push({ key: '', count: 0, isFuture: true, date: dt });
        continue;
      }
      const key = dt.toISOString().split('T')[0];
      const count = submissionMap[key] || 0;
      week.push({ key, count, isFuture: false, date: dt });
      if (count > 0) { totalActive++; totalSubmissions += count; }
      allDays.push({ key, count });
    }

    const firstReal = week.find(c => !c.isFuture);
    if (firstReal && firstReal.date.getDate() <= 7) {
      monthLabels.push({
        label: firstReal.date.toLocaleString('default', { month: 'short' }),
        col: weekIndex,
      });
    }

    weeks.push(week);
    cursor.setDate(cursor.getDate() + 7);
    weekIndex++;
  }

  let maxStreak = 0, currentStreak = 0, run = 0;
  const sorted = [...allDays].reverse();
  let i = sorted[0]?.count === 0 ? 1 : 0;
  for (; i < sorted.length; i++) {
    if (sorted[i].count > 0) currentStreak++;
    else break;
  }
  allDays.forEach(({ count }) => {
    if (count > 0) { run++; if (run > maxStreak) maxStreak = run; }
    else run = 0;
  });

  return { weeks, monthLabels, totalActive, totalSubmissions, maxStreak, currentStreak, CELL, GAP };
}

/* ════════════════════════════════════════════════
   Color scale
════════════════════════════════════════════════ */
const LC_COLORS = ['#282828', '#1a3a1f', '#1e6b2e', '#25a244', '#2cbe4e'];

function shade(count) {
  if (count === 0) return LC_COLORS[0];
  if (count === 1) return LC_COLORS[1];
  if (count <= 3) return LC_COLORS[2];
  if (count <= 6) return LC_COLORS[3];
  return LC_COLORS[4];
}

/* ════════════════════════════════════════════════
   Tooltip
════════════════════════════════════════════════ */
function Tooltip({ cell, pos }) {
  if (!cell) return null;
  return (
    <div style={{
      position: 'fixed',
      left: pos.x + 12,
      top: pos.y - 36,
      backgroundColor: '#3d3d3d',
      color: '#fff',
      padding: '5px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontFamily: 'monospace',
      pointerEvents: 'none',
      zIndex: 9999,
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    }}>
      {cell.count} submission{cell.count !== 1 ? 's' : ''} on {cell.key}
    </div>
  );
}

/* ════════════════════════════════════════════════
   Stat Row (left panel)
════════════════════════════════════════════════ */
function StatRow({ icon, label, value, color }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 0',
      borderBottom: '1px solid #2a2a2a',
    }}>
      <span style={{
        color: '#aaa',
        fontSize: '13px',
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        {icon} {label}
      </span>
      <span style={{
        color: color || '#e6edf3',
        fontSize: '13px',
        fontFamily: 'monospace',
        fontWeight: '600',
      }}>
        {value}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Difficulty Bar
════════════════════════════════════════════════ */
function DifficultyBar({ label, solved, total, color }) {
  const pct = total > 0 ? Math.min((solved / total) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
      }}>
        <span style={{ color, fontSize: '12px', fontFamily: 'monospace', fontWeight: '600' }}>
          {label}
        </span>
        <span style={{ color: '#e6edf3', fontSize: '12px', fontFamily: 'monospace' }}>
          {solved} / {total}
        </span>
      </div>
      <div style={{
        height: '4px',
        backgroundColor: '#3a3a3a',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: color,
          borderRadius: '2px',
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Main Component
════════════════════════════════════════════════ */
const LeetCodeHeatmap = ({ username = 'Abhinandanx538' }) => {
  const [submissionMap, setSubmissionMap] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const parseCalendar = (raw) => {
      const map = {};
      Object.entries(raw).forEach(([ts, count]) => {
        const d = new Date(Number(ts) * 1000);
        const key = d.toISOString().split('T')[0];
        map[key] = (map[key] || 0) + Number(count);
      });
      return map;
    };

    const fetchAll = async () => {
      try {
        // Fetch calendar + stats in parallel from primary API
        const [calRes, statsRes] = await Promise.all([
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`,
            { signal: AbortSignal.timeout(12000) }),
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`,
            { signal: AbortSignal.timeout(12000) }),
        ]);

        const calJson = calRes.ok ? await calRes.json() : null;
        const statsJson = statsRes.ok ? await statsRes.json() : null;

        let map = null;
        if (calJson?.submissionCalendar) {
          const raw = typeof calJson.submissionCalendar === 'string'
            ? JSON.parse(calJson.submissionCalendar)
            : calJson.submissionCalendar;
          map = parseCalendar(raw);
        }

        // Also fetch profile for rank
        let rankData = null;
        try {
          const rankRes = await fetch(
            `https://alfa-leetcode-api.onrender.com/${username}`,
            { signal: AbortSignal.timeout(8000) }
          );
          if (rankRes.ok) rankData = await rankRes.json();
        } catch { /* ignore rank fetch failure */ }

        if (!map) throw new Error('No calendar data');

        if (!cancelled) {
          setSubmissionMap(map);
          setStats({
            easySolved: statsJson?.easySolved ?? '—',
            easyTotal: statsJson?.totalEasy ?? '937',
            mediumSolved: statsJson?.mediumSolved ?? '—',
            mediumTotal: statsJson?.totalMedium ?? '2042',
            hardSolved: statsJson?.hardSolved ?? '—',
            hardTotal: statsJson?.totalHard ?? '923',
            totalSolved: statsJson?.solvedProblem ?? '—',
            ranking: rankData?.ranking ?? '—',
          });
        }
      } catch {
        // Fallback
        try {
          const res2 = await fetch(
            `https://leetcode-api-faisalshohag.vercel.app/${username}`,
            { signal: AbortSignal.timeout(12000) }
          );
          if (!res2.ok) throw new Error('Fallback failed');
          const json2 = await res2.json();

          const raw2 = typeof json2.submissionCalendar === 'string'
            ? JSON.parse(json2.submissionCalendar)
            : json2.submissionCalendar;

          if (!raw2) throw new Error('No data');
          const map2 = parseCalendar(raw2);

          if (!cancelled) {
            setSubmissionMap(map2);
            setStats({
              easySolved: json2.easySolved ?? '—',
              easyTotal: json2.totalEasy ?? '937',
              mediumSolved: json2.mediumSolved ?? '—',
              mediumTotal: json2.totalMedium ?? '2042',
              hardSolved: json2.hardSolved ?? '—',
              hardTotal: json2.totalHard ?? '923',
              totalSolved: json2.totalSolved ?? '—',
              ranking: json2.ranking ?? '—',
            });
          }
        } catch {
          if (!cancelled) setError('Could not load LeetCode data. Check username or try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [username]);

  /* ── Loading ── */
  if (loading) return (
    <div style={{ width: '100%', padding: '16px 0' }}>
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {/* Left skeleton */}
        <div style={{
          width: '220px',
          minWidth: '180px',
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          padding: '16px',
          height: '260px',
          animation: 'lc-pulse 1.5s ease-in-out infinite',
        }} />
        {/* Right skeleton */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {Array.from({ length: 53 }).map((_, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Array.from({ length: 7 }).map((_, di) => (
                  <div key={di} style={{
                    width: 14, height: 14, borderRadius: 2,
                    backgroundColor: '#282828',
                    animation: 'lc-pulse 1.5s ease-in-out infinite',
                    animationDelay: `${(wi + di) * 0.01}s`,
                  }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes lc-pulse { 0%,100%{opacity:.4} 50%{opacity:1} }`}</style>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div style={{ color: '#8b949e', fontFamily: 'monospace', fontSize: 13, padding: '16px 0' }}>
      {error}
    </div>
  );

  const {
    weeks, monthLabels, totalActive, totalSubmissions, maxStreak, CELL, GAP
  } = buildGrid(submissionMap);

  return (
    <div style={{ width: '100%' }}>

      {/* ── Main layout: Left stats | Right heatmap ── */}
      <div style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>

        {/* ══ LEFT PANEL — Stats ══ */}
        <div style={{
          width: '220px',
          minWidth: '180px',
          flexShrink: 0,
          backgroundColor: '#1e1e1e',
          border: '1px solid #2e2e2e',
          borderRadius: '10px',
          padding: '16px',
        }}>
          {/* Username + icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            paddingBottom: '10px',
            borderBottom: '1px solid #2a2a2a',
          }}>
            <svg viewBox="0 0 24 24" fill="#FFA116" width={18} height={18}>
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
            </svg>
            <span style={{
              color: '#e6edf3',
              fontSize: '13px',
              fontFamily: 'monospace',
              fontWeight: '700',
            }}>
              {username}
            </span>
          </div>

          {/* Ranking */}
          <StatRow
            icon="🏅"
            label="Ranking:"
            value={stats?.ranking !== '—' ? `#${Number(stats.ranking).toLocaleString()}` : '—'}
            color="#FFA116"
          />

          {/* Total solved */}
          <StatRow
            icon="✅"
            label="Total Solved:"
            value={stats?.totalSolved}
            color="#2cbe4e"
          />

          {/* Difficulty bars */}
          <div style={{ marginTop: '14px' }}>
            <DifficultyBar
              label="Easy"
              solved={stats?.easySolved ?? 0}
              total={stats?.easyTotal ?? 937}
              color="#00b8a3"
            />
            <DifficultyBar
              label="Medium"
              solved={stats?.mediumSolved ?? 0}
              total={stats?.mediumTotal ?? 2042}
              color="#FFA116"
            />
            <DifficultyBar
              label="Hard"
              solved={stats?.hardSolved ?? 0}
              total={stats?.hardTotal ?? 923}
              color="#ef4743"
            />
          </div>
        </div>

        {/* ══ RIGHT PANEL — Heatmap ══ */}
        <div style={{ flex: 1, minWidth: '300px' }}>

          {/* Stats bar above heatmap */}
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '12px',
          }}>
            <span style={{ color: '#e6edf3', fontSize: 13, fontFamily: 'monospace' }}>
              <strong style={{ color: '#fff', fontSize: 15 }}>{totalSubmissions}</strong>
              {' '}submissions in the past one year
            </span>
            <span style={{ color: '#8b949e', fontSize: 12, fontFamily: 'monospace' }}>
              Total active days: <strong style={{ color: '#e6edf3' }}>{totalActive}</strong>
            </span>
            <span style={{ color: '#8b949e', fontSize: 12, fontFamily: 'monospace' }}>
              Max streak: <strong style={{ color: '#e6edf3' }}>{maxStreak}</strong>
            </span>
          </div>

          {/* Grid */}
          <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
            <div style={{ display: 'inline-block', minWidth: 'max-content' }}>
              <div style={{ display: 'flex', gap: GAP }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                    {week.map((cell, di) => (
                      <div
                        key={di}
                        onMouseEnter={e => {
                          if (!cell.isFuture && cell.key) {
                            setHoveredCell(cell);
                            setTooltipPos({ x: e.clientX, y: e.clientY });
                          }
                        }}
                        onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setHoveredCell(null)}
                        style={{
                          width: CELL,
                          height: CELL,
                          borderRadius: 2,
                          backgroundColor: cell.isFuture ? 'transparent' : shade(cell.count),
                          cursor: (!cell.isFuture && cell.key) ? 'pointer' : 'default',
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Month labels */}
              <div style={{ position: 'relative', height: 18, marginTop: 6 }}>
                {monthLabels.map((m, i) => (
                  <span key={i} style={{
                    position: 'absolute',
                    left: m.col * (CELL + GAP),
                    fontSize: 10,
                    color: '#8b949e',
                    fontFamily: 'monospace',
                  }}>
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 10,
            justifyContent: 'flex-end',
          }}>
            <span style={{ fontSize: 10, color: '#8b949e', fontFamily: 'monospace', marginRight: 2 }}>Less</span>
            {LC_COLORS.map((c, i) => (
              <div key={i} style={{
                width: CELL,
                height: CELL,
                borderRadius: 2,
                backgroundColor: c,
              }} />
            ))}
            <span style={{ fontSize: 10, color: '#8b949e', fontFamily: 'monospace', marginLeft: 2 }}>More</span>
          </div>
        </div>
      </div>

      <Tooltip cell={hoveredCell} pos={tooltipPos} />
    </div>
  );
};

export default LeetCodeHeatmap;
