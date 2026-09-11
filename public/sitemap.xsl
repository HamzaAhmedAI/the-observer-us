<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>The Observer US — News Sitemap</title>
        <style>
          :root { --brand:#dc2626; --ink:#111827; --muted:#6b7280; --line:#e5e7eb; }
          * { box-sizing: border-box; }
          body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:var(--ink); background:#fff; }
          header { display:flex; align-items:center; gap:16px; padding:28px 24px; border-bottom:1px solid var(--line); }
          header img { height:56px; width:56px; border-radius:10px; object-fit:contain; }
          header h1 { font-size:22px; margin:0; }
          header p { margin:4px 0 0; color:var(--muted); font-size:14px; }
          main { max-width:820px; margin:0 auto; padding:24px; }
          h2 { font-size:15px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); margin:8px 0 16px; }
          ul { list-style:none; margin:0; padding:0; }
          li { padding:14px 0; border-bottom:1px solid var(--line); }
          a { color:var(--brand); text-decoration:none; font-weight:600; font-size:16px; }
          a:hover { text-decoration:underline; }
          .meta { color:var(--muted); font-size:13px; margin-top:4px; }
          footer { text-align:center; color:var(--muted); font-size:13px; padding:32px 16px; }
        </style>
      </head>
      <body>
        <header>
          <img src="/logo.png" alt="The Observer US logo" />
          <div>
            <h1>The Observer US</h1>
            <p>Google News Sitemap — articles published in the last 48 hours</p>
          </div>
        </header>
        <main>
          <h2>Indexed Articles</h2>
          <ul>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <li>
                <a href="{sitemap:loc}">
                  <xsl:value-of select="news:news/news:title" />
                </a>
                <div class="meta">
                  <xsl:value-of select="news:news/news:publication_date" />
                </div>
              </li>
            </xsl:for-each>
          </ul>
        </main>
        <footer>© The Observer US — Generated dynamically.</footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
