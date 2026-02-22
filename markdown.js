function parseMarkdown(md) {
  const lines = md.split("\n");
  let html = "";
  let inUl = false;
  let inOl = false;

  for (let rawLine of lines) {
    const line = rawLine.trim();

    // Headings
    if (line.startsWith("## ")) {
      closeLists();
      html += `<h2>${line.slice(3)}</h2>`;
      continue;
    }

    if (line.startsWith("# ")) {
      closeLists();
      html += `<h1>${line.slice(2)}</h1>`;
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
    if (line.startsWith("- ")) {
      if (!inUl) {
        closeLists();
        html += "<ul>";
        inUl = true;
      }
      html += `<li>${line.slice(2)}</li>`;
      continue;
    }

    // Empty line
    if (line === "") {
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
