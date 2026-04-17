/**
 * ══════════════════════════════════════════════════
 * GFG Heatmap Fetcher — Run this in your browser console
 * ══════════════════════════════════════════════════
 * 
 * HOW TO USE:
 * 1. Open https://www.geeksforgeeks.org and log in
 * 2. Press F12 → Console tab
 * 3. Copy EVERYTHING below and paste into the console
 * 4. Press Enter — it will download a gfg-heatmap.json file
 * 5. Move that file to: your-project/public/gfg-data.json
 * 6. Run: npm run dev — your heatmap will show!
 * 
 */

(async () => {
  const USERNAME = 'abhiroznll';
  const heatmap = {};
  let page = 1;
  let totalFetched = 0;

  console.log('🔄 Fetching your GFG submissions...');

  while (page <= 20) {
    const url = `https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/?page=${page}`;
    const r = await fetch(url, { credentials: 'include', headers: { Accept: 'application/json' } });
    const j = await r.json();
    const results = j.result || j.results || [];

    if (!results.length) { console.log(`✅ Done at page ${page}`); break; }

    results.forEach(sub => {
      const dateFields = ['submittedAt','submitted_at','createdAt','created_at','timestamp','time','date','lastAttempted'];
      for (const field of dateFields) {
        const val = sub[field];
        if (!val) continue;
        let dt = typeof val === 'number' ? new Date(val > 1e10 ? val : val * 1000) : new Date(val);
        if (!isNaN(dt.getTime()) && dt.getFullYear() > 2020) {
          const key = dt.toISOString().split('T')[0];
          heatmap[key] = (heatmap[key] || 0) + 1;
          break;
        }
      }
    });

    totalFetched += results.length;
    console.log(`Page ${page}: ${results.length} items | Total: ${totalFetched} | Days: ${Object.keys(heatmap).length}`);

    if (!j.next) break;
    page++;
    await new Promise(r => setTimeout(r, 300));
  }

  // Fetch stats
  const statsR = await fetch(`https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${USERNAME}`, { credentials: 'include' });
  const statsJ = await statsR.json();
  const d = statsJ?.data || {};

  const output = {
    username: USERNAME,
    lastUpdated: new Date().toISOString(),
    heatmap,
    stats: {
      name: d.name,
      totalSolved: d.total_problems_solved,
      instituteRank: d.institute_rank,
      institute: d.institute_name,
      score: d.score,
      monthlyScore: d.monthly_score,
      currentStreak: d.pod_solved_current_streak,
      maxStreak: d.pod_solved_longest_streak,
    }
  };

  // Download the file
  const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gfg-data.json';
  a.click();

  console.log('\n✅ Downloaded gfg-data.json!');
  console.log('   Heatmap days:', Object.keys(heatmap).length);
  console.log('   Total solved:', d.total_problems_solved);
  console.log('\n📁 Now move this file to: public/gfg-data.json in your project');
})();
