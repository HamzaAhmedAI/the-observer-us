const { Client } = require('pg');
const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
if(!url){console.error('NO DB URL');process.exit(2);}
(async()=>{
  const c = new Client({ connectionString: url });
  await c.connect();
  const r = await c.query("SELECT id, status, slug, updated_at FROM articles ORDER BY id DESC LIMIT 30");
  console.log('ROWCOUNT', r.rowCount);
  for(const row of r.rows){ console.log(row.id, row.status, row.slug, row.updated_at); }
  await c.end();
})().catch(e=>{console.error(e.message);process.exit(1);});
