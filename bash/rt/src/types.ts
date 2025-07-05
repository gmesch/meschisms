export interface Slide {
  title: string;
  text: string;
}

export interface ContentData {
  title: string;
  slides: Slide[];
}

export interface SlideViewerState {
  currentSlideIndex: number;
  contentData: ContentData | null;
  loading: boolean;
  error: string | null;
  showSummary: boolean;
  highlightedSlide: number;
} 