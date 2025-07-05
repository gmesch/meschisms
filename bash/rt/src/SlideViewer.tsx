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

  // Function to update URL with current slide
  const updateURL = (slideIndex: number) => {
    // Get current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const currentSlide = urlParams.get('slide');
    
    // Only update if the slide actually changed
    if (currentSlide !== slideIndex.toString()) {
      urlParams.set('slide', slideIndex.toString());
      
      // Create new URL
      const newURL = window.location.origin + window.location.pathname + 
                     (urlParams.toString() ? `?${urlParams.toString()}` : '') + 
                     window.location.hash;
      
      // Update the URL
      window.history.replaceState({ slide: slideIndex }, '', newURL);
      
      // Small delay to ensure the browser shows the update
      setTimeout(() => {
        // This empty timeout helps ensure the URL update is visible
      }, 0);
    }
  };

  // Function to get initial slide from URL
  const getInitialSlide = (): number => {
    const urlParams = new URLSearchParams(window.location.search);
    const slideParam = urlParams.get('slide');
    if (slideParam) {
      const slideIndex = parseInt(slideParam, 10);
      return isNaN(slideIndex) ? 0 : Math.max(0, slideIndex);
    }
    return 0;
  };

  // Function to navigate to a specific slide
  const navigateToSlide = (slideIndex: number) => {
    if (contentData && slideIndex >= 0 && slideIndex < contentData.slides.length) {
      setCurrentSlideIndex(slideIndex);
    }
  };

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
        
        // Set initial slide from URL after content is loaded
        const initialSlide = getInitialSlide();
        if (initialSlide < parsedContent.slides.length) {
          setCurrentSlideIndex(initialSlide);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Update URL when slide changes
  useEffect(() => {
    if (contentData) {
      updateURL(currentSlideIndex);
    }
  }, [currentSlideIndex, contentData]);

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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
  const hasPrevious = currentSlideIndex > 0;
  const hasNext = currentSlideIndex < contentData.slides.length - 1;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      padding: '40px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Fixed header section - always at top */}
      <div style={{
        height: '120px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#333',
          marginBottom: '20px',
          height: '30px',
          lineHeight: '30px'
        }}>
          {contentData.title}
        </div>
        
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#2c3e50',
          height: '40px',
          lineHeight: '40px'
        }}>
          {currentSlide.title}
        </div>
      </div>
      
      {/* Content area - takes remaining space */}
      <div style={{
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0
      }}>
        <div 
          style={{
            fontSize: '18px',
            lineHeight: '1.6',
            textAlign: 'left',
            color: '#34495e',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '100%',
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: slideContent }}
        />
        
        {/* Navigation links */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '800px',
          marginTop: '30px',
          padding: '0 20px'
        }}>
          <div style={{
            flex: '1',
            textAlign: 'left'
          }}>
            {hasPrevious && (
              <button
                onClick={() => navigateToSlide(currentSlideIndex - 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3498db',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '10px 0',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#2980b9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#3498db';
                }}
              >
                ← Previous: {contentData.slides[currentSlideIndex - 1].title}
              </button>
            )}
          </div>
          
          <div style={{
            flex: '1',
            textAlign: 'right'
          }}>
            {hasNext && (
              <button
                onClick={() => navigateToSlide(currentSlideIndex + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3498db',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '10px 0',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#2980b9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#3498db';
                }}
              >
                Next: {contentData.slides[currentSlideIndex + 1].title} →
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Fixed footer section - always at bottom */}
      <div style={{
        height: '80px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <div style={{
          fontSize: '16px',
          color: '#7f8c8d',
          textAlign: 'center',
          marginBottom: '10px',
          height: '20px',
          lineHeight: '20px'
        }}>
          Slide {currentSlideIndex + 1} of {contentData.slides.length}
        </div>
        
        <div style={{
          fontSize: '14px',
          color: '#95a5a6',
          textAlign: 'center',
          height: '20px',
          lineHeight: '20px'
        }}>
          Use ↑ and ↓ arrow keys to navigate slides
        </div>
      </div>
    </div>
  );
};

export default SlideViewer; 