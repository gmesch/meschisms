import React, { useEffect, useReducer } from 'react';
import { ContentData } from './types';
import { updateURL } from './urlUtils';
import { loadContent } from './contentLoader';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { LoadingView } from './components/LoadingView';
import { ErrorView } from './components/ErrorView';
import { SummaryView } from './components/SummaryView';
import { SlideView } from './components/SlideView';

// Reducer and actions for navigation
interface SlideState {
  currentSlideIndex: number;
  showSummary: boolean;
  highlightedSlide: number;
  maxSlideIndex: number;
}

type SlideAction =
  | { type: 'GOTO_SLIDE'; index: number }
  | { type: 'NEXT_SLIDE' }
  | { type: 'PREV_SLIDE' }
  | { type: 'SHOW_SUMMARY' }
  | { type: 'HIDE_SUMMARY' }
  | { type: 'HIGHLIGHT_SLIDE'; index: number }
  | { type: 'MOVE_HIGHLIGHT'; direction: 'left' | 'right' }
  | { type: 'SET_MAX_SLIDE_INDEX'; max: number };

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max));
}

function slideReducer(state: SlideState, action: SlideAction): SlideState {
  switch (action.type) {
    case 'SET_MAX_SLIDE_INDEX':
      return { ...state, maxSlideIndex: action.max };
    case 'GOTO_SLIDE':
      return {
        ...state,
        currentSlideIndex: clamp(action.index, 0, state.maxSlideIndex),
        showSummary: false,
      };
    case 'NEXT_SLIDE':
      return {
        ...state,
        currentSlideIndex: clamp(state.currentSlideIndex + 1, 0, state.maxSlideIndex),
        showSummary: false,
      };
    case 'PREV_SLIDE':
      return {
        ...state,
        currentSlideIndex: clamp(state.currentSlideIndex - 1, 0, state.maxSlideIndex),
        showSummary: false,
      };
    case 'SHOW_SUMMARY':
      return {
        ...state,
        showSummary: true,
        highlightedSlide: state.currentSlideIndex,
      };
    case 'HIDE_SUMMARY':
      return {
        ...state,
        showSummary: false,
      };
    case 'HIGHLIGHT_SLIDE':
      return {
        ...state,
        highlightedSlide: clamp(action.index, 0, state.maxSlideIndex),
      };
    case 'MOVE_HIGHLIGHT':
      return {
        ...state,
        highlightedSlide: clamp(
          state.highlightedSlide + (action.direction === 'left' ? -1 : 1),
          0,
          state.maxSlideIndex
        ),
      };
    default:
      return state;
  }
}

const SlideViewer: React.FC = () => {
  const [contentData, setContentData] = React.useState<ContentData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Reducer for navigation state
  const [state, dispatch] = useReducer(slideReducer, {
    currentSlideIndex: 0,
    showSummary: false,
    highlightedSlide: 0,
    maxSlideIndex: 0,
  });

  // Load content on component mount
  useEffect(() => {
    const loadContentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { contentData: data, initialSlide } = await loadContent();
        setContentData(data);
        dispatch({ type: 'SET_MAX_SLIDE_INDEX', max: data.slides.length });
        dispatch({ type: 'GOTO_SLIDE', index: initialSlide });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    loadContentData();
  }, []);

  // Update maxSlideIndex if contentData changes
  useEffect(() => {
    if (contentData) {
      dispatch({ type: 'SET_MAX_SLIDE_INDEX', max: contentData.slides.length });
    }
  }, [contentData]);

  // Update URL when slide changes
  useEffect(() => {
    if (contentData) {
      updateURL(state.currentSlideIndex);
    }
  }, [state.currentSlideIndex, contentData]);

  // Keyboard navigation
  useKeyboardNavigation({
    contentData,
    showSummary: state.showSummary,
    highlightedSlide: state.highlightedSlide,
    currentSlideIndex: state.currentSlideIndex,
    onNavigateToSlide: (idx) => {
      dispatch({ type: 'GOTO_SLIDE', index: idx });
    },
    onToggleSummary: () => {
      if (state.showSummary) {
        dispatch({ type: 'GOTO_SLIDE', index: state.highlightedSlide });
      } else {
        dispatch({ type: 'SHOW_SUMMARY' });
      }
    },
    onMoveHighlight: (direction) => {
      dispatch({ type: 'MOVE_HIGHLIGHT', direction });
    },
    onSetCurrentSlideIndex: (updater) => {
      dispatch({
        type: 'GOTO_SLIDE',
        index: typeof updater === 'function' ? updater(state.currentSlideIndex) : updater,
      });
    },
    onSetShowSummary: (show) => {
      dispatch(show ? { type: 'SHOW_SUMMARY' } : { type: 'HIDE_SUMMARY' });
    },
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
  if (state.showSummary && contentData) {
    return (
      <SummaryView
        contentData={contentData}
        highlightedSlide={state.highlightedSlide}
        onNavigateToSlide={(idx) => dispatch({ type: 'GOTO_SLIDE', index: idx })}
      />
    );
  }

  // Render slide view
  if (contentData) {
    return (
      <SlideView
        contentData={contentData}
        currentSlideIndex={state.currentSlideIndex}
        onNavigateToSlide={(idx) => dispatch({ type: 'GOTO_SLIDE', index: idx })}
      />
    );
  }

  return null;
};

export default SlideViewer; 