const sanitizeHtml = require('sanitize-html');

const cleanHTML = (dirtyHtml) => {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'strike', 'sub', 'sup',
      'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'img', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'code',
      'hr'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel', 'style'],
      'img': ['src', 'alt', 'width', 'height', 'title', 'style'],
      'div': ['style', 'class'],
      'span': ['style', 'class'],
      '*': ['style'] // Allow inline styles but sanitize them
    },
    allowedStyles: {
      '*': {
        // Allow specific CSS properties to avoid malicious styles
        'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/],
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'font-weight': [/^bold$/, /^\d{1,3}$/],
        'font-size': [/^\d+(?:px|em|%)$/]
      }
    },
    // Allow image and link protocols (prevent JavaScript injection)
    allowedSchemes: ['http', 'https', 'data'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    },
    transformTags: {
      'a': (tagName, attribs) => {
        // Force external links to open in a new tab with rel="noopener"
        if (attribs.href && !attribs.href.startsWith('#')) {
          attribs.target = '_blank';
          attribs.rel = 'noopener noreferrer';
        }
        return { tagName, attribs };
      }
    }
  });
};

module.exports = cleanHTML;
