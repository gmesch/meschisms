import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import content from '../content.yaml';

interface Slide {
  title: string;
  text: string;
}

interface ContentData {
  title: string;
  slides: Slide[];
}

const SlideViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const contentData = content as ContentData;
  const slides = contentData.slides;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setCurrentSlideIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (event.key === 'ArrowDown') {
        setCurrentSlideIndex(prevIndex => 
          prevIndex < slides.length - 1 ? prevIndex + 1 : prevIndex
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [slides.length]);

  const currentSlide = slides[currentSlideIndex];
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
        Slide {currentSlideIndex + 1} of {slides.length}
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