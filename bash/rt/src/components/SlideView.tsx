import React from 'react';
import { ContentData } from '../types';
import { renderMarkdown } from '../markdownConfig';
import { NavigationLinks } from './NavigationLinks';

interface SlideViewProps {
  contentData: ContentData;
  currentSlideIndex: number;
  onNavigateToSlide: (slideIndex: number) => void;
}

export const SlideView: React.FC<SlideViewProps> = ({
  contentData,
  currentSlideIndex,
  onNavigateToSlide
}) => {
  const currentSlide = contentData.slides[currentSlideIndex];
  const slideContent = renderMarkdown(currentSlide.text);

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
        overflow: 'hidden',
        minHeight: 0,
        paddingTop: '20px'
      }}>
        <div 
          style={{
            fontSize: '18px',
            lineHeight: '1.6',
            textAlign: 'left',
            color: '#34495e',
            maxWidth: '800px',
            width: '100%',
            flex: '1',
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: slideContent }}
        />
        
        <NavigationLinks
          contentData={contentData}
          currentSlideIndex={currentSlideIndex}
          onNavigateToSlide={onNavigateToSlide}
        />
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
          Use ↑/← and ↓/→ arrow keys to navigate slides • Press Enter for overview
        </div>
      </div>
    </div>
  );
}; 