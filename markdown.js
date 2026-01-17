// function parseMarkdown(md) {
//   return md
//     .replace(/^# (.*$)/gim, "<h1>$1</h1>")
//     .replace(/^## (.*$)/gim, "<h2>$1</h2>")
//     .replace(/^\- (.*$)/gim, "<li>$1</li>")
//     .replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>")
//     .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
//     .replace(/\n/g, "<br>");
// }

function parseMarkdown(md) {
  const lines = md.split("\n");
  let html = "";
  let inUl = false;
  let inOl = false;

  for (let line of lines) {
    // Headings
    if (/^## /.test(line)) {
      closeLists();
      html += `<h2>${line.replace(/^## /, "")}</h2>`;
      continue;
    }

    if (/^# /.test(line)) {
      closeLists();
      html += `<h1>${line.replace(/^# /, "")}</h1>`;
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      if (!inOl) {
        closeLists();
        html += "<ol>";
        inOl = true;
      }
      html += `<li>${line.replace(/^\d+\. /, "")}</li>`;
      continue;
    }

    // Unordered list
    if (/^- /.test(line)) {
      if (!inUl) {
        closeLists();
        html += "<ul>";
        inUl = true;
      }
      html += `<li>${line.replace(/^- /, "")}</li>`;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      closeLists();
      continue;
    }

    // Paragraph / raw HTML
    closeLists();
    html += `<p>${line}</p>`;
  }

  closeLists();
  return html;

  function closeLists() {
    if (inUl) {
      html += "</ul>";
      inUl = false;
    }
    if (inOl) {
      html += "</ol>";
      inOl = false;
    }
  }
}
