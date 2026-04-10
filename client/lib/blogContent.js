function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugifyText(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function markdownToHtml(markdown) {
  const source = escapeHtml(markdown).replace(/\r\n/g, "\n");
  const blocks = source.split(/\n{2,}/);

  const renderedBlocks = blocks.map((block) => {
    if (/^#{1,3}\s/.test(block)) {
      return block
        .split("\n")
        .map((line) => {
          if (/^###\s+/.test(line)) {
            const text = line.replace(/^###\s+/, "");
            return `<h3 id="${slugifyText(text)}">${text}</h3>`;
          }
          if (/^##\s+/.test(line)) {
            const text = line.replace(/^##\s+/, "");
            return `<h2 id="${slugifyText(text)}">${text}</h2>`;
          }
          if (/^#\s+/.test(line)) {
            const text = line.replace(/^#\s+/, "");
            return `<h1 id="${slugifyText(text)}">${text}</h1>`;
          }
          return line;
        })
        .join("");
    }

    if (/^(?:- |\* )/m.test(block)) {
      const items = block
        .split("\n")
        .filter(Boolean)
        .map((line) => `<li>${line.replace(/^(?:- |\* )/, "")}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    }

    return `<p>${block.replace(/\n/g, "<br />")}</p>`;
  });

  let html = renderedBlocks.join("");

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*(?!\s)(.+?)(?!\s)\*(?!\*)/g, "$1<em>$2</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');

  return html;
}

function extractSections(markdown) {
  const normalized = String(markdown || "").replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const sections = [];
  let current = null;
  let paragraphBuffer = [];

  function flushParagraph() {
    if (!current || paragraphBuffer.length === 0) {
      return;
    }

    current.paragraphs.push(paragraphBuffer.join(" ").trim());
    paragraphBuffer = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);

    if (headingMatch) {
      flushParagraph();

      if (current) {
        sections.push(current);
      }

      current = {
        heading: headingMatch[1],
        paragraphs: [],
      };
      continue;
    }

    if (!current) {
      current = {
        heading: "Overview",
        paragraphs: [],
      };
    }

    if (line.trim()) {
      paragraphBuffer.push(line.trim());
      continue;
    }

    flushParagraph();
  }

  flushParagraph();

  if (current) {
    sections.push(current);
  }

  return sections;
}

function stripMarkdownText(markdown) {
  return String(markdown || "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  markdownToHtml,
  extractSections,
  stripMarkdownText,
};
