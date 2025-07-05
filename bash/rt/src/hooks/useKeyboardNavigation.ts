import { useEffect } from 'react';
import { ContentData } from '../types';

interface UseKeyboardNavigationProps {
  contentData: ContentData | null;
  showSummary: boolean;
  highlightedSlide: number;
  currentSlideIndex: number;
  onNavigateToSlide: (slideIndex: number) => void;
  onToggleSummary: () => void;
  onMoveHighlight: (direction: 'left' | 'right') => void;
  onSetCurrentSlideIndex: (updater: (prevIndex: number) => number) => void;
  onSetShowSummary: (show: boolean) => void;
}

export const useKeyboardNavigation = ({
  contentData,
  showSummary,
  highlightedSlide,
  currentSlideIndex,
  onNavigateToSlide,
  onToggleSummary,
  onMoveHighlight,
  onSetCurrentSlideIndex,
  onSetShowSummary
}: UseKeyboardNavigationProps): void => {
  useEffect(() => {
    if (!contentData) return;
    const maxIndex = contentData.slides.length; // allow up to and including last slide

    const handleKeyDown = (event: KeyboardEvent) => {
      if (showSummary) {
        // Summary view navigation
        if (event.key === 'Enter') {
          // Go to highlighted slide
          onNavigateToSlide(highlightedSlide);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          // Move highlight left/up (previous slide)
          onMoveHighlight('left');
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          // Move highlight right/down (next slide)
          onMoveHighlight('right');
        } else if (event.key === 'Escape') {
          // Exit summary view
          onSetShowSummary(false);
        }
      } else {
        // Slide view navigation
        if (event.key === 'Enter') {
          // Show summary
          onToggleSummary();
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          // Previous slide
          onSetCurrentSlideIndex(prevIndex => 
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          // Next slide
          onSetCurrentSlideIndex(prevIndex => 
            prevIndex < maxIndex ? prevIndex + 1 : prevIndex
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contentData, showSummary, highlightedSlide, currentSlideIndex, onNavigateToSlide, onToggleSummary, onMoveHighlight, onSetCurrentSlideIndex, onSetShowSummary]);
}; 