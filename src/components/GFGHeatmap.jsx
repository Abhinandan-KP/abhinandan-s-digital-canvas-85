import { useEffect, useState } from 'react';

/* ════════════════════════════════════════════════
   Build 53-week heatmap grid
════════════════════════════════════════════════ */
function buildGrid(submissionMap) {
  const CELL = 14, GAP = 3;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const start = new Date(today);
  start.setDate(today.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);

  const weeks = [], monthLabels = [], allDays = [];
  let totalActive = 0, totalSubmissions = 0;
  let cursor = new Date(start), weekIndex = 0;

  while (cursor <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(cursor);
      dt.setDate(cursor.getDate() + d);
      if (dt > today) { week.push({ key: '', count: 0, isFuture: true, date: dt }); continue; }
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

  let maxStreak = 0, run = 0;
  allDays.forEach(({ count }) => {
    if (count > 0) { run++; if (run > maxStreak) maxStreak = run; }
    else run = 0;
  });

  return { weeks, monthLabels, totalActive, totalSubmissions, maxStreak, CELL, GAP };
}

/* ════════════════════════════════════════════════
   Colors
════════════════════════════════════════════════ */
const GFG_COLORS = ['#1a1a1a', '#0d3316', '#146b2a', '#1aaa42', '#2ccc55'];
function shade(count) {
  if (count === 0) return GFG_COLORS[0];
  if (count === 1) return GFG_COLORS[1];
  if (count <= 3) return GFG_COLORS[2];
  if (count <= 6) return GFG_COLORS[3];
  return GFG_COLORS[4];
}

/* ════════════════════════════════════════════════
   Tooltip
════════════════════════════════════════════════ */
function Tooltip({ cell, pos }) {
  if (!cell) return null;
  return (
    <div style={{
      position: 'fixed', left: pos.x + 12, top: pos.y - 38,
      backgroundColor: '#2d2d2d', color: '#fff', padding: '5px 10px',
      borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace',
      pointerEvents: 'none', zIndex: 9999, whiteSpace: 'nowrap',
      boxShadow: '0 2px 8px rgba(0,0,0,0.6)', border: '1px solid #3a3a3a',
    }}>
      {cell.count} problem{cell.count !== 1 ? 's' : ''} solved on {cell.key}
    </div>
  );
}

/* ════════════════════════════════════════════════
   Stat Row
════════════════════════════════════════════════ */
function StatRow({ icon, label, value, color }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 0', borderBottom: '1px solid #2a2a2a',
    }}>
      <span style={{ color: '#aaa', fontSize: '12px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon} {label}
      </span>
      <span style={{ color: color || '#e6edf3', fontSize: '13px', fontFamily: 'monospace', fontWeight: '600' }}>
        {value ?? '—'}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
const GFGHeatmap = ({ username = 'abhiroznll' }) => {
  const [data, setData]           = useState(null);   // { heatmap, stats, lastUpdated }
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [hoveredCell, setHovered] = useState(null);
  const [tooltipPos, setTPos]     = useState({ x: 0, y: 0 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    // Primary: read from locally-committed JSON (populated by GitHub Actions scraper)
    fetch('/gfg-data.json')
      .then(r => { if (!r.ok) throw new Error('no file'); return r.json(); })
      .then(json => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        // Fallback: try the authapi directly (works for stats, not heatmap)
        fetch(`https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${username}`)
          .then(r => r.ok ? r.json() : null)
          .then(json => {
            if (!cancelled) {
              if (json?.data) {
                const d = json.data;
                setData({
                  username,
                  heatmap: {},
                  lastUpdated: null,
                  stats: {
                    name: d.name,
                    totalSolved: d.total_problems_solved,
                    instituteRank: d.institute_rank,
                    institute: d.institute_name,
                    score: d.score,
                    monthlyScore: d.monthly_score,
                    currentStreak: d.pod_solved_current_streak,
                    maxStreak: d.pod_solved_longest_streak,
                  },
                });
              } else {
                setError('Could not load GFG data.');
              }
              setLoading(false);
            }
          })
          .catch(() => {
            if (!cancelled) { setError('Could not load GFG data.'); setLoading(false); }
          });
      });

    return () => { cancelled = true; };
  }, [username]);

  /* ── Loading ── */
  if (loading) return (
    <div style={{ width: '100%', padding: '8px 0' }}>
      <style>{`@keyframes gp{0%,100%{opacity:.3}50%{opacity:.9}}`}</style>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ width: '200px', height: '260px', backgroundColor: '#1e1e1e', borderRadius: '10px', animation: 'gp 1.5s infinite' }} />
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 53 }).map((_, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Array.from({ length: 7 }).map((_, di) => (
                  <div key={di} style={{
                    width: 14, height: 14, borderRadius: 2, backgroundColor: '#1a1a1a',
                    animation: `gp 1.5s ${(wi + di) * 0.01}s infinite`,
                  }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Error — show profile link ── */
  if (error || !data) return (
    <div style={{ color: '#8b949e', fontFamily: 'monospace', fontSize: 13, padding: '8px 0', textAlign: 'center' }}>
      <p style={{ marginBottom: 12 }}>GFG data temporarily unavailable.</p>
      <a
        href={`https://www.geeksforgeeks.org/user/${username}/`}
        target="_blank" rel="noopener noreferrer"
        style={{
          color: '#2ccc55', textDecoration: 'none', fontSize: 13,
          border: '1px solid #2ccc55', padding: '6px 14px', borderRadius: 6,
        }}
      >
        View GFG Profile ↗
      </a>
    </div>
  );

  const heatmap    = data.heatmap   || {};
  const stats      = data.stats     || {};
  const hasHeatmap = Object.keys(heatmap).length > 0;

  const { weeks, monthLabels, totalActive, totalSubmissions, maxStreak, CELL, GAP } =
    buildGrid(heatmap);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ══ LEFT PANEL — Stats ══ */}
        <div style={{
          width: '200px', minWidth: '180px', flexShrink: 0,
          backgroundColor: '#1e1e1e', border: '1px solid #2e2e2e',
          borderRadius: '10px', padding: '14px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #2a2a2a',
          }}>
            <img src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" alt="GFG"
              style={{ width: 18, height: 18 }}
              onError={e => { e.target.style.display = 'none'; }} />
            <span style={{ color: '#2ccc55', fontSize: '12px', fontFamily: 'monospace', fontWeight: '700' }}>
              {username}
            </span>
          </div>

          <StatRow icon="✅" label="Solved:"      value={stats.totalSolved}  color="#2ccc55" />
          <StatRow icon="🏆" label="Rank:"        value={stats.instituteRank ? `#${stats.instituteRank}` : '—'} color="#FFA116" />
          <StatRow icon="⭐" label="Score:"       value={stats.score}         color="#e6edf3" />
          <StatRow icon="📅" label="Monthly:"     value={stats.monthlyScore}  color="#58a6ff" />
          <StatRow icon="🔥" label="Cur Streak:"  value={stats.currentStreak !== undefined ? `${stats.currentStreak} days` : '—'} color="#ff6b35" />
          <StatRow icon="⚡" label="Best Streak:" value={stats.maxStreak !== undefined ? `${stats.maxStreak} days` : '—'} color="#e6edf3" />

          {stats.institute && (
            <div style={{ marginTop: 10, padding: '6px 0', borderTop: '1px solid #2a2a2a' }}>
              <span style={{ color: '#555', fontSize: '10px', fontFamily: 'monospace' }}>
                🎓 {String(stats.institute).length > 26
                  ? String(stats.institute).slice(0, 26) + '…'
                  : stats.institute}
              </span>
            </div>
          )}

          <a
            href={`https://www.geeksforgeeks.org/user/${username}/`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block', marginTop: '12px', textAlign: 'center', padding: '7px',
              backgroundColor: '#1c4a28', border: '1px solid #2ccc55', borderRadius: '6px',
              color: '#2ccc55', fontSize: '11px', fontFamily: 'monospace', textDecoration: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#25663a'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#1c4a28'}
          >
            View GFG Profile ↗
          </a>

          {data.lastUpdated && (
            <div style={{ marginTop: 8, textAlign: 'center' }}>
              <span style={{ color: '#444', fontSize: '9px', fontFamily: 'monospace' }}>
                Synced {new Date(data.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* ══ RIGHT PANEL — Heatmap ══ */}
        <div style={{ flex: 1, minWidth: '280px' }}>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {hasHeatmap ? (
              <>
                <span style={{ color: '#e6edf3', fontSize: 13, fontFamily: 'monospace' }}>
                  <strong style={{ color: '#fff', fontSize: 15 }}>{totalSubmissions}</strong>
                  {' '}submissions in the past year
                </span>
                <span style={{ color: '#8b949e', fontSize: 12, fontFamily: 'monospace' }}>
                  Active days: <strong style={{ color: '#e6edf3' }}>{totalActive}</strong>
                </span>
                <span style={{ color: '#8b949e', fontSize: 12, fontFamily: 'monospace' }}>
                  Max streak: <strong style={{ color: '#e6edf3' }}>{maxStreak}</strong>
                </span>
              </>
            ) : (
              <span style={{ color: '#555', fontSize: 12, fontFamily: 'monospace' }}>
                📊 Heatmap will auto-populate after GitHub Actions scraper runs
              </span>
            )}
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
                            setHovered(cell);
                            setTPos({ x: e.clientX, y: e.clientY });
                          }
                        }}
                        onMouseMove={e => setTPos({ x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          width: CELL, height: CELL, borderRadius: 2,
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
                    position: 'absolute', left: m.col * (CELL + GAP),
                    fontSize: 10, color: '#8b949e', fontFamily: 'monospace',
                  }}>
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 10, color: '#8b949e', fontFamily: 'monospace', marginRight: 2 }}>Less</span>
            {GFG_COLORS.map((c, i) => (
              <div key={i} style={{ width: CELL, height: CELL, borderRadius: 2, backgroundColor: c }} />
            ))}
            <span style={{ fontSize: 10, color: '#8b949e', fontFamily: 'monospace', marginLeft: 2 }}>More</span>
          </div>
        </div>
      </div>

      <Tooltip cell={hoveredCell} pos={tooltipPos} />
    </div>
  );
};

export default GFGHeatmap;
