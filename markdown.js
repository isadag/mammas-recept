function parseMarkdown(md) {
  let html = md;

  // Headings
  html = html.replace(/^# (.*)$/gim, "<h1>$1</h1>");
  html = html.replace(/^## (.*)$/gim, "<h2>$1</h2>");

  // Unordered list
  html = html.replace(/(?:^|\n)- (.*)/g, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

  // Ordered list (KEY FIX)
  html = html.replace(/(?:^|\n)\d+\. (.*)/g, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/gs, "<ol>$1</ol>");

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return html;
}
