import YAML from 'js-yaml';
import { ContentData } from './types';
import { getContentFile, getInitialSlide } from './urlUtils';

export const loadContent = async (): Promise<{ contentData: ContentData; initialSlide: number }> => {
  // Get content filename from URL parameter or use default
  const contentFile = getContentFile();
  
  // Fetch the YAML file
  const response = await fetch(contentFile);
  if (!response.ok) {
    throw new Error(`Failed to load content file: ${response.statusText}`);
  }
  
  const yamlText = await response.text();
  const parsedContent = YAML.load(yamlText) as ContentData;
  
  // Get initial slide from URL
  const initialSlide = getInitialSlide();
  const validInitialSlide = initialSlide < parsedContent.slides.length ? initialSlide : 0;
  
  return { contentData: parsedContent, initialSlide: validInitialSlide };
}; 