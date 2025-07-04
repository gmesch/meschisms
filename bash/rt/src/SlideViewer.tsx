import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import YAML from 'js-yaml';

interface Slide {
  title: string;
  text: string;
}

interface ContentData {
  title: string;
  slides: Slide[];
}

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

const SlideViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get content filename from URL parameter or use default
        const urlParams = new URLSearchParams(window.location.search);
        const contentFile = urlParams.get('content') || 'content.yaml';
        
        // Fetch the YAML file
        const response = await fetch(contentFile);
        if (!response.ok) {
          throw new Error(`Failed to load content file: ${response.statusText}`);
        }
        
        const yamlText = await response.text();
        const parsedContent = YAML.load(yamlText) as ContentData;
        
        setContentData(parsedContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    if (!contentData) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setCurrentSlideIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (event.key === 'ArrowDown') {
        setCurrentSlideIndex(prevIndex => 
          prevIndex < contentData.slides.length - 1 ? prevIndex + 1 : prevIndex
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contentData]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading slides...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', color: '#e74c3c', marginBottom: '20px' }}>
          Error Loading Content
        </div>
        <div style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
          {error}
        </div>
        <div style={{ fontSize: '14px', color: '#999' }}>
          Make sure the content file exists in the dist directory.
        </div>
      </div>
    );
  }

  if (!contentData) {
    return null;
  }

  const currentSlide = contentData.slides[currentSlideIndex];
  const slideContent = marked(currentSlide.text);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333'
      }}>
        {contentData.title}
      </div>
      
      <div style={{
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#2c3e50'
      }}>
        {currentSlide.title}
      </div>
      
      <div 
        style={{
          fontSize: '18px',
          lineHeight: '1.6',
          textAlign: 'left',
          color: '#34495e'
        }}
        dangerouslySetInnerHTML={{ __html: slideContent }}
      />
      
      <div style={{
        fontSize: '16px',
        marginTop: '40px',
        color: '#7f8c8d',
        textAlign: 'center'
      }}>
        Slide {currentSlideIndex + 1} of {contentData.slides.length}
      </div>
      
      <div style={{
        fontSize: '14px',
        marginTop: '20px',
        color: '#95a5a6',
        textAlign: 'center'
      }}>
        Use ↑ and ↓ arrow keys to navigate slides
      </div>
    </div>
  );
};

export default SlideViewer; 