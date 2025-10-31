<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
	xmlns:html="http://www.w3.org/TR/REC-html40"
	xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>XML Sitemap - dps.codes</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<style type="text/css">
					body {
						font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
						color: #333;
						background: #f5f5f5;
						margin: 0;
						padding: 20px;
					}
					.container {
						max-width: 1000px;
						margin: 0 auto;
						background: white;
						padding: 40px;
						border-radius: 8px;
						box-shadow: 0 2px 8px rgba(0,0,0,0.1);
					}
					h1 {
						color: #14b8a6;
						font-size: 28px;
						margin-bottom: 10px;
					}
					.description {
						color: #666;
						margin-bottom: 30px;
						line-height: 1.6;
					}
					table {
						width: 100%;
						border-collapse: collapse;
						margin-top: 20px;
					}
					th {
						background: #14b8a6;
						color: white;
						padding: 12px;
						text-align: left;
						font-weight: 600;
					}
					td {
						padding: 12px;
						border-bottom: 1px solid #e0e0e0;
					}
					tr:hover {
						background: #f9f9f9;
					}
					.url {
						color: #14b8a6;
						text-decoration: none;
						word-break: break-all;
					}
					.url:hover {
						text-decoration: underline;
					}
					.footer {
						margin-top: 30px;
						padding-top: 20px;
						border-top: 1px solid #e0e0e0;
						color: #999;
						font-size: 14px;
						text-align: center;
					}
					.stats {
						background: #f0fdfa;
						padding: 15px;
						border-radius: 6px;
						margin-bottom: 20px;
						border-left: 4px solid #14b8a6;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<h1>XML Sitemap</h1>
					<div class="description">
						This is the XML sitemap for <strong>dps.codes</strong>. It helps search engines discover and index all pages on this website.
					</div>
					<div class="stats">
						<strong>Total URLs:</strong> <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
					</div>
					<table>
						<thead>
							<tr>
								<th>URL</th>
								<th>Last Modified</th>
								<th>Change Frequency</th>
								<th>Priority</th>
							</tr>
						</thead>
						<tbody>
							<xsl:for-each select="sitemap:urlset/sitemap:url">
								<tr>
									<td>
										<a class="url" href="{sitemap:loc}">
											<xsl:value-of select="sitemap:loc"/>
										</a>
									</td>
									<td>
										<xsl:value-of select="sitemap:lastmod"/>
									</td>
									<td>
										<xsl:value-of select="sitemap:changefreq"/>
									</td>
									<td>
										<xsl:value-of select="sitemap:priority"/>
									</td>
								</tr>
							</xsl:for-each>
						</tbody>
					</table>
					<div class="footer">
						Generated for Devendra Pratap Singh • <a href="https://dps.codes/" class="url">Visit Site</a>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>

