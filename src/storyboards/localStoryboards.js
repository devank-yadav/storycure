// src/storyboards/localStoryboards.js
//
// Put images under /public/comics/<slug>/scene-<n>-<Panel>.jpg
// Example below uses /public/comics/sample/...

export const SAMPLE_STORYBOARD = {
  id: 'sample',
  titleMatch: /alex|hospital|adventure/i, // used to auto-select if titles match
  cues: [
    // at = seconds in the audio when this cue becomes active
    { at: 0,  panels: {
      A: '/comics/sample/scene-1-A.jpg',
      B: '/comics/sample/scene-1-B.jpg',
      C: '/comics/sample/scene-1-C.jpg',
      D: '/comics/sample/scene-1-D.jpg',
      E: '/comics/sample/scene-1-E.jpg',
      F: '/comics/sample/scene-1-F.jpg',
    }},
    { at: 5,  panels: { C: '/comics/sample/scene-2-C.jpg', E: '/comics/sample/scene-2-E.jpg' }},
    { at: 12, panels: { A: '/comics/sample/scene-3-A.jpg', F: '/comics/sample/scene-3-F.jpg' }},
    { at: 18, panels: { B: null, D: '/comics/sample/scene-4-D.jpg' }}, // set to null to clear a panel
    { at: 26, panels: { B: '/comics/sample/scene-5-B.jpg' }},
  ],
};

// pick a storyboard for the current track (by id/title/etc.)
export function getStoryboardForTrack(track) {
  if (!track) return SAMPLE_STORYBOARD;
  // 1) by explicit track.storyboardId (optional future-proofing)
  if (track.storyboardId === 'sample') return SAMPLE_STORYBOARD;

  // 2) by title match
  if (SAMPLE_STORYBOARD.titleMatch?.test(track.title || '')) return SAMPLE_STORYBOARD;

  // fallback
  return SAMPLE_STORYBOARD;
}