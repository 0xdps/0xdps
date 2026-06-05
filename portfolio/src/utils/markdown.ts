/**
 * Simple markdown to HTML converter for portfolio content
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderMarkdown(md: string): string {
  let html = md;

  // Code blocks (```lang ... ```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang || '';
    const escapedCode = escapeHtml(code.trimEnd());
    return `<pre><code class="language-${language}">${escapedCode}</code></pre>`;
  });

  // Inline code (`...`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Tables
  html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
    const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean);
    const headerHtml = headers.map((h: string) => `<th>${h}</th>`).join('');

    const rowLines = rows.trim().split('\n');
    const rowsHtml = rowLines.map((line: string) => {
      const cells = line.split('|').map((c: string) => c.trim()).filter(Boolean);
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`;
    }).join('');

    return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
  });

  // Unordered lists
  html = html.replace(/^(\s*)[-*] (.*$)/gim, (match, indent, content) => {
    const depth = indent.length;
    return `${indent}<li>${content}</li>`;
  });

  // Wrap consecutive li elements in ul
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ul>${match}</ul>`;
  });

  // Paragraphs (lines that aren't tags)
  html = html.replace(/^(?!<[a-z]|<\/|<li|<ul|<ol|<hr|<blockquote|<pre|<table|<thead|<tbody|<tr|<td|<th)(.+)$/gim, '<p>$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');

  return html.trim();
}
