/**
 * GFG Heatmap Data Builder
 * Intercepts GFG submissions API and builds heatmap from result array
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const USERNAME = 'abhiroznll';

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');

  const heatmap = {};
  let statsData = null;
  let submissionsCount = 0;

  // Intercept responses and build heatmap from result array
  page.on('response', async (response) => {
    const url = response.url();
    if (!url.includes('practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions')) return;

    try {
      const json = await response.json();
      if (!json) return;

      // Result is an array of submission objects
      const results = json.result || json.results || [];
      if (!Array.isArray(results)) return;

      console.log(`[Submissions page]: ${results.length} items`);

      results.forEach((sub, i) => {
        // Log first item to understand structure
        if (i === 0) {
          console.log('  Sample item keys:', Object.keys(sub).join(', '));
          console.log('  Sample item:', JSON.stringify(sub).slice(0, 200));
        }

        // Try every possible date field
        const dateFields = [
          'submittedAt', 'submitted_at', 'createdAt', 'created_at',
          'timestamp', 'time', 'date', 'solvedAt', 'solved_at',
          'lastSubmittedAt', 'last_submitted',
        ];

        for (const field of dateFields) {
          const val = sub[field];
          if (!val) continue;

          let dt;
          if (typeof val === 'number') {
            dt = new Date(val > 1e10 ? val : val * 1000);
          } else {
            dt = new Date(val);
          }

          if (!isNaN(dt.getTime()) && dt.getFullYear() > 2020) {
            const key = dt.toISOString().split('T')[0];
            heatmap[key] = (heatmap[key] || 0) + 1;
            submissionsCount++;
            break;
          }
        }
      });

      // Stats
      if (json.count !== undefined) {
        console.log(`  Total submissions count: ${json.count}`);
      }
    } catch (e) {
      console.log('Error parsing response:', e.message);
    }
  });

  // Also intercept authapi for stats
  page.on('response', async (response) => {
    const url = response.url();
    if (!url.includes('authapi.geeksforgeeks.org')) return;
    try {
      const json = await response.json();
      if (json?.data?.total_problems_solved !== undefined) {
        statsData = json.data;
        console.log('Stats captured:', json.data.total_problems_solved, 'solved');
      }
    } catch (_) {}
  });

  console.log('Loading GFG profile...');
  await page.goto(`https://www.geeksforgeeks.org/user/${USERNAME}/`, {
    waitUntil: 'networkidle2', timeout: 60000,
  });
  await new Promise(r => setTimeout(r, 5000));

  console.log('\nHeatmap days found:', Object.keys(heatmap).length);
  console.log('Submissions mapped:', submissionsCount);

  // If no submissions found yet, try explicit fetch from within the page
  if (submissionsCount === 0) {
    console.log('\nTrying in-browser fetch to capture submission structure...');
    const sample = await page.evaluate(async (user) => {
      try {
        const r = await fetch(
          `https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/?user=${user}`,
          { credentials: 'include', headers: { Accept: 'application/json' } }
        );
        const j = await r.json();
        const result = j.result || j.results || [];
        return {
          topKeys: Object.keys(j),
          count: j.count,
          firstItem: result[0] || null,
          sampleKeys: result[0] ? Object.keys(result[0]) : [],
        };
      } catch (e) { return { error: e.message }; }
    }, USERNAME);

    console.log('Direct fetch result:', JSON.stringify(sample, null, 2));

    // If we got the structure, build heatmap
    if (sample?.firstItem) {
      const fullData = await page.evaluate(async (user) => {
        const heatmap = {};
        let page = 1;
        while (page <= 10) {
          const r = await fetch(
            `https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/?user=${user}&page=${page}`,
            { credentials: 'include', headers: { Accept: 'application/json' } }
          );
          const j = await r.json();
          const results = j.result || j.results || [];
          if (!results.length) break;

          results.forEach(sub => {
            // Try all date fields
            for (const field of ['submittedAt','submitted_at','createdAt','created_at','timestamp','time','date','lastAttempted']) {
              const val = sub[field];
              if (!val) continue;
              let dt;
              if (typeof val === 'number') dt = new Date(val > 1e10 ? val : val * 1000);
              else dt = new Date(val);
              if (!isNaN(dt.getTime()) && dt.getFullYear() > 2020) {
                const key = dt.toISOString().split('T')[0];
                heatmap[key] = (heatmap[key] || 0) + 1;
                break;
              }
            }
          });

          if (!j.next) break;
          page++;
        }
        return heatmap;
      }, USERNAME);

      Object.assign(heatmap, fullData);
      console.log('\nIn-browser heatmap days:', Object.keys(heatmap).length);
    }
  }

  await browser.close();

  // Save
  const outputPath = path.join(process.cwd(), 'public', 'gfg-data.json');
  let existing = { username: USERNAME, stats: {}, heatmap: {} };
  if (fs.existsSync(outputPath)) {
    try { existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8')); } catch (_) {}
  }

  const output = {
    username: USERNAME,
    lastUpdated: new Date().toISOString(),
    heatmap: { ...existing.heatmap, ...heatmap },
    stats: statsData ? {
      name: statsData.name || existing.stats.name,
      totalSolved: statsData.total_problems_solved || existing.stats.totalSolved,
      instituteRank: statsData.institute_rank || existing.stats.instituteRank,
      institute: statsData.institute_name || existing.stats.institute,
      score: statsData.score || existing.stats.score,
      monthlyScore: statsData.monthly_score || existing.stats.monthlyScore,
      currentStreak: statsData.pod_solved_current_streak ?? existing.stats.currentStreak,
      maxStreak: statsData.pod_solved_longest_streak ?? existing.stats.maxStreak,
    } : existing.stats,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log('\n✅ Saved public/gfg-data.json');
  console.log('   Heatmap days:', Object.keys(output.heatmap).length);
  console.log('   Total solved:', output.stats?.totalSolved);
}

main().catch(e => { console.error(e.message); process.exit(1); });
