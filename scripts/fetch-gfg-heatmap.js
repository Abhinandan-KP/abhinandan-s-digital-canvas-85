/**
 * GFG Heatmap Data Fetcher (with cookie auth)
 * 
 * HOW TO GET YOUR GFG_TOKEN:
 * 1. Open https://www.geeksforgeeks.org and log in
 * 2. Open DevTools → Application → Cookies → geeksforgeeks.org
 * 3. Find the cookie named: _gfg_sso_token  OR  gfg_sso
 * 4. Copy its Value and set it below (or pass as env variable)
 * 
 * Usage:
 *   GFG_TOKEN="your_cookie_value" node scripts/fetch-gfg-heatmap.js
 *   OR edit the GFG_TOKEN line below directly
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const USERNAME  = 'abhiroznll';
const GFG_TOKEN = process.env.GFG_TOKEN || '';   // ← paste your cookie here

if (!GFG_TOKEN) {
  console.log(`
⚠️  No GFG_TOKEN provided!

To get your heatmap data:
1. Open https://www.geeksforgeeks.org and log in
2. Open DevTools (F12) → Application tab → Cookies → https://www.geeksforgeeks.org
3. Find cookie: _gfg_sso_token
4. Copy its Value
5. Run: GFG_TOKEN="paste_value_here" node scripts/fetch-gfg-heatmap.js

OR edit this file and set GFG_TOKEN = "your_value_here"
`);
  process.exit(1);
}

function httpsGet(url, cookie) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'Cookie': `_gfg_sso_token=${cookie}; gfg_sso=${cookie}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Referer': 'https://www.geeksforgeeks.org/',
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, json: null, body: body.slice(0, 200) }); }
      });
    });
    req.on('error', reject);
  });
}

async function main() {
  console.log('Fetching GFG submissions for:', USERNAME);

  const heatmap = {};
  let page = 1;
  let totalFetched = 0;

  // Paginate through submissions
  while (page <= 20) {
    const url = `https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/?page=${page}&user=${USERNAME}`;
    const { status, json } = await httpsGet(url, GFG_TOKEN);

    if (status !== 200 || !json) {
      console.log(`Page ${page}: status ${status}. Stopping.`);
      break;
    }

    if (json.error || json.status === 'FAILED' || !json.result) {
      console.log(`Page ${page}: API error:`, json.error || json.message || 'unknown');
      break;
    }

    const submissions = json.result || [];
    if (submissions.length === 0) {
      console.log(`Page ${page}: no more submissions.`);
      break;
    }

    submissions.forEach(sub => {
      const ts = sub.submittedAt || sub.submitted_at || sub.created_at || sub.timestamp;
      if (ts) {
        const dt = new Date(typeof ts === 'number' ? ts * 1000 : ts);
        if (!isNaN(dt.getTime())) {
          const key = dt.toISOString().split('T')[0];
          heatmap[key] = (heatmap[key] || 0) + 1;
        }
      }
    });

    totalFetched += submissions.length;
    console.log(`Page ${page}: ${submissions.length} submissions. Total: ${totalFetched}. Days: ${Object.keys(heatmap).length}`);
    
    if (!json.next) break;
    page++;
    await new Promise(r => setTimeout(r, 500)); // be nice to GFG servers
  }

  // Read existing file
  const outputPath = path.join(process.cwd(), 'public', 'gfg-data.json');
  let existing = { username: USERNAME, lastUpdated: '', heatmap: {}, stats: {} };
  if (fs.existsSync(outputPath)) {
    try { existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8')); } catch (_) {}
  }

  const output = {
    ...existing,
    lastUpdated: new Date().toISOString(),
    heatmap: { ...existing.heatmap, ...heatmap },
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log('\n✅ Saved!');
  console.log('   Heatmap days:', Object.keys(output.heatmap).length);
  console.log('   Run "git add public/gfg-data.json && git commit -m \'gfg: update heatmap\' && git push" to deploy');
}

main().catch(console.error);
