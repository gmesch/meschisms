import React, { useState, useEffect } from 'react';
import { ContentData } from './types';
import { updateURL } from './urlUtils';
import { loadContent } from './contentLoader';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { LoadingView } from './components/LoadingView';
import { ErrorView } from './components/ErrorView';
import { SummaryView } from './components/SummaryView';
import { SlideView } from './components/SlideView';

const SlideViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [highlightedSlide, setHighlightedSlide] = useState<number>(0);

  // Function to navigate to a specific slide
  const navigateToSlide = (slideIndex: number) => {
    if (contentData && slideIndex >= 0 && slideIndex < contentData.slides.length) {
      setCurrentSlideIndex(slideIndex);
      setShowSummary(false);
    }
  };

  // Function to toggle summary view
  const toggleSummary = () => {
    if (showSummary) {
      // If in summary mode, go to the highlighted slide
      navigateToSlide(highlightedSlide);
    } else {
      // If in slide mode, show summary with current slide highlighted
      setHighlightedSlide(currentSlideIndex);
      setShowSummary(true);
    }
  };

  // Function to move highlight in summary view
  const moveHighlight = (direction: 'left' | 'right') => {
    if (!contentData) return;
    
    if (direction === 'left') {
      setHighlightedSlide(prev => prev > 0 ? prev - 1 : prev);
    } else {
      setHighlightedSlide(prev => prev < contentData.slides.length - 1 ? prev + 1 : prev);
    }
  };

  // Load content on component mount
  useEffect(() => {
    const loadContentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { contentData: data, initialSlide } = await loadContent();
        setContentData(data);
        setCurrentSlideIndex(initialSlide);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContentData();
  }, []);

  // Update URL when slide changes
  useEffect(() => {
    if (contentData) {
      updateURL(currentSlideIndex);
    }
  }, [currentSlideIndex, contentData]);

  // Keyboard navigation
  useKeyboardNavigation({
    contentData,
    showSummary,
    highlightedSlide,
    currentSlideIndex,
    onNavigateToSlide: navigateToSlide,
    onToggleSummary: toggleSummary,
    onMoveHighlight: moveHighlight,
    onSetCurrentSlideIndex: setCurrentSlideIndex,
    onSetShowSummary: setShowSummary
  });

  // Render loading state
  if (loading) {
    return <LoadingView />;
  }

  // Render error state
  if (error) {
    return <ErrorView error={error} />;
  }

  // Render summary view
  if (showSummary && contentData) {
    return (
      <SummaryView
        contentData={contentData}
        highlightedSlide={highlightedSlide}
        onNavigateToSlide={navigateToSlide}
      />
    );
  }

  // Render slide view
  if (contentData) {
    return (
      <SlideView
        contentData={contentData}
        currentSlideIndex={currentSlideIndex}
        onNavigateToSlide={navigateToSlide}
      />
    );
  }

  return null;
};

export default SlideViewer; 