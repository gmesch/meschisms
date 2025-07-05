import React from 'react';
import { ContentData } from '../types';
import { getContentFile } from '../urlUtils';

interface NavigationLinksProps {
  contentData: ContentData;
  currentSlideIndex: number;
  onNavigateToSlide: (slideIndex: number) => void;
}

export const NavigationLinks: React.FC<NavigationLinksProps> = ({
  contentData,
  currentSlideIndex,
  onNavigateToSlide
}) => {
  const totalSlides = contentData.slides.length + 1;
  const hasPrevious = currentSlideIndex > 1;
  const hasNext = currentSlideIndex < contentData.slides.length;
  
  // Get current content file to preserve in URLs
  const contentFile = getContentFile();
  const contentParam = contentFile !== 'content.yaml' ? `&content=${contentFile}` : '';

  // Calculate indices for previous and next slides in the slides array
  const prevIdx = currentSlideIndex - 2; // slides[0] is first real slide
  const nextIdx = currentSlideIndex;     // slides[0] is first real slide

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '800px',
      marginTop: '20px',
      padding: '0 20px',
      flexShrink: 0
    }}>
      <div style={{
        flex: '1',
        textAlign: 'left'
      }}>
        {hasPrevious && (
          <a
            href={`?slide=${currentSlideIndex - 1}${contentParam}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigateToSlide(currentSlideIndex - 1);
            }}
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
            ← Previous: {contentData.slides[prevIdx].title}
          </a>
        )}
      </div>
      
      <div style={{
        flex: '1',
        textAlign: 'right'
      }}>
        {hasNext && (
          <a
            href={`?slide=${currentSlideIndex + 1}${contentParam}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigateToSlide(currentSlideIndex + 1);
            }}
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
            Next: {contentData.slides[nextIdx].title} →
          </a>
        )}
      </div>
    </div>
  );
}; 