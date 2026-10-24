// Round 3 — photo-led redesign: real photographs as local files.
//
// Imported with Vite's `?inline` suffix so the build base64-inlines them
// into the JS bundle. That matters because the single-file demo inlines the
// JS: normal asset imports would emit separate /assets/*.jpg files that the
// demo file cannot carry, and photos would break. No external hotlinks, and
// the user's reference mockup images are never reused as assets.
//
// Sources, authors and licenses: src/web/assets/photos/SOURCES.md
// (also credited compactly on the Transparency page).
import heroStreet from './photos/gaudi.jpg?inline';
import travelWindow from './photos/travel-window.jpg?inline';
import paella from './photos/paella.jpg?inline';
import workLaptop from './photos/work-laptop.jpg?inline';
import granvia from './photos/granvia.jpg?inline';
import marketPeppers from './photos/boqueria-peppers.jpg?inline';

export const PHOTOS = {
  heroStreet,
  travelWindow,
  paella,
  workLaptop,
  granvia,
  marketPeppers,
} as const;
