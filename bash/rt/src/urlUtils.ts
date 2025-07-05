export const updateURL = (slideIndex: number): void => {
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

export const getInitialSlide = (): number => {
  const urlParams = new URLSearchParams(window.location.search);
  const slideParam = urlParams.get('slide');
  if (slideParam) {
    const slideIndex = parseInt(slideParam, 10);
    return isNaN(slideIndex) ? 0 : Math.max(0, slideIndex);
  }
  return 0;
};

export const getContentFile = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('content') || 'content.yaml';
}; 