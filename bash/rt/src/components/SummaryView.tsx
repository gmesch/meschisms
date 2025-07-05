import React, { useRef, useEffect } from 'react';
import { ContentData } from '../types';
import { getContentFile } from '../urlUtils';

interface SummaryViewProps {
  contentData: ContentData;
  highlightedSlide: number;
  onNavigateToSlide: (slideIndex: number) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  contentData,
  highlightedSlide,
  onNavigateToSlide
}) => {
  const summaryScrollRef = useRef<HTMLDivElement>(null);
  
  // Get current content file to preserve in URLs
  const contentFile = getContentFile();
  const contentParam = contentFile !== 'content.yaml' ? `&content=${contentFile}` : '';

  // Auto-scroll to highlighted slide in summary view
  useEffect(() => {
    if (summaryScrollRef.current) {
      const container = summaryScrollRef.current;
      const slideElements = container.querySelectorAll('[data-slide-index]');
      const highlightedElement = slideElements[highlightedSlide] as HTMLElement;
      
      if (highlightedElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = highlightedElement.getBoundingClientRect();
        
        // Check if the highlighted element is outside the visible area
        const isAbove = elementRect.top < containerRect.top;
        const isBelow = elementRect.bottom > containerRect.bottom;
        
        if (isAbove || isBelow) {
          // Scroll the element into view with some padding
          highlightedElement.scrollIntoView({
            behavior: 'smooth',
            block: isAbove ? 'start' : 'end',
            inline: 'nearest'
          });
        }
      }
    }
  }, [highlightedSlide]);

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
      overflow: 'hidden',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '32px',
          color: '#2c3e50',
          margin: '0 0 10px 0'
        }}>
          {contentData.title}
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#7f8c8d',
          margin: 0
        }}>
          Click on a slide or use arrow keys to navigate, Enter to select
        </p>
      </div>

      {/* Slides list */}
      <div 
        ref={summaryScrollRef}
        style={{
          flex: '1',
          overflow: 'auto',
          padding: '0 20px'
        }}
      >
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Title slide as first entry */}
          <a
            data-slide-index={0}
            href={`?slide=0${contentParam}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigateToSlide(0);
            }}
            style={{
              display: 'block',
              padding: '15px 20px',
              margin: '10px 0',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: highlightedSlide === 0 ? '#3498db' : '#ffffff',
              color: highlightedSlide === 0 ? '#ffffff' : '#2c3e50',
              border: highlightedSlide === 0 ? '2px solid #2980b9' : '2px solid #ecf0f1',
              transition: 'all 0.2s ease',
              fontSize: '18px',
              fontWeight: highlightedSlide === 0 ? 'bold' : 'normal'
            }}
            onMouseEnter={e => {
              if (highlightedSlide !== 0) {
                e.currentTarget.style.backgroundColor = '#ecf0f1';
                e.currentTarget.style.borderColor = '#bdc3c7';
              }
            }}
            onMouseLeave={e => {
              if (highlightedSlide !== 0) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#ecf0f1';
              }
            }}
          >
            <div style={{ fontSize: '16px', marginBottom: '5px', opacity: 0.8 }}>Title Slide</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{contentData.title}</div>
          </a>
          {/* All other slides, shifted by 1 */}
          {contentData.slides.map((slide, index) => (
            <a
              key={index + 1}
              data-slide-index={index + 1}
              href={`?slide=${index + 1}${contentParam}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateToSlide(index + 1);
              }}
              style={{
                display: 'block',
                padding: '15px 20px',
                margin: '10px 0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: highlightedSlide === index + 1 ? '#3498db' : '#ffffff',
                color: highlightedSlide === index + 1 ? '#ffffff' : '#2c3e50',
                border: highlightedSlide === index + 1 ? '2px solid #2980b9' : '2px solid #ecf0f1',
                transition: 'all 0.2s ease',
                fontSize: '18px',
                fontWeight: highlightedSlide === index + 1 ? 'bold' : 'normal'
              }}
              onMouseEnter={e => {
                if (highlightedSlide !== index + 1) {
                  e.currentTarget.style.backgroundColor = '#ecf0f1';
                  e.currentTarget.style.borderColor = '#bdc3c7';
                }
              }}
              onMouseLeave={e => {
                if (highlightedSlide !== index + 1) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#ecf0f1';
                }
              }}
            >
              <div style={{ fontSize: '16px', marginBottom: '5px', opacity: 0.8 }}>Slide {index + 1}</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{slide.title}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '20px 0',
        color: '#7f8c8d',
        fontSize: '14px'
      }}>
        Press Enter to go to highlighted slide • Press Escape to return to current slide
      </div>
    </div>
  );
}; 