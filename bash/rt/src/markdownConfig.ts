import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// Configure marked to use highlight.js for syntax highlighting
marked.use({
  renderer: {
    code(code: string, infostring: string | undefined, escaped: boolean) {
      const language = infostring || 'plaintext';
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      const highlighted = hljs.highlight(code, { language: validLanguage }).value;
      return `<pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
    }
  }
});

export const renderMarkdown = (text: string): string => {
  return marked(text);
}; 