# Music Quest

Music Quest is a small React app (Vite) for practicing musical notes and simple melodies. It includes:

- Interactive staff rendering with VexFlow
- On-screen piano keys for answers
- Melodies practice mode with per-note feedback
- GitHub Pages deploy support
- Web MIDI input (connect a MIDI keyboard)
- Local progress persistence via `localStorage`

## Quick Start

Requirements: Node.js 18+, npm (or yarn).

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Deploy to GitHub Pages

This project includes `gh-pages` scripts. Set the `homepage` value in `package.json` to your GitHub Pages URL (e.g. `https://<username>.github.io/music-quest`) then run:

```bash
npm run deploy
```

## Features

- Levels: note identification and melody practice.
- Melody mode (Level 5): marks each note correct/incorrect, plays the correct note on mistakes, and repeats the melody if any note was wrong.
- Visual feedback: green ticks / red crosses above staff notes for melody progress.
- MIDI support: connect a MIDI device and play notes directly. When using MIDI, inputs are matched to full note names (e.g. `E4`). On-screen keys remain single-letter (`C`, `D`, ...).
- Local progress persistence: progress is saved automatically to `localStorage` and restored on load. Use the "Clear Progress" button in the header to reset.

## MIDI Usage

1. Click the `Connect MIDI` button in the app header. Your browser will request permission to access MIDI devices.
2. If multiple MIDI inputs are available, choose the desired device from the dropdown.
3. Play notes on your keyboard — Note On events map to the app's answer logic (MIDI uses full note names like `C4`, `E4`).

Notes:
- The Web MIDI API is required (most Chromium-based browsers and recent Safari). If not supported, the app will alert you.
- Sharps/flats will be passed as full names (e.g. `C#4`) and may not match expected natural notes in the app unless a melody uses them.

## Local Storage

- The app saves progress under the key: `musicQuestSave`.
- The following state is persisted: `level`, `currentQ`, `score`, `streak`, `proficiency`, `priorityQueue`, `currentNoteInMelodyIndex`, `melodyAnswers`, and `gameState`.
- To clear saved progress, use the "Clear Progress" button in the header.

## Project Structure

- `src/App.jsx` — main game logic and UI
- `src/components/MusicStaff.jsx` — VexFlow rendering and per-note status markers
- `vite.config.js` — base path configured for GitHub Pages

## Troubleshooting

- If deployed site shows 404s for assets, ensure `vite.config.js` `base` is set to `'/your-repo-name/'` and `package.json` `homepage` matches your GitHub Pages URL, then rebuild and redeploy.
- MIDI not working: ensure your browser supports Web MIDI and grant permission when prompted.
- If UI feedback is not visible: check browser console for errors and verify `melodyAnswers` state in the dev console.

## Contributing

Feel free to open issues or PRs. Suggested small improvements:
- Add optional mapping of MIDI sharps to nearest natural note for beginner-friendly matching.
- Improve accessibility (keyboard controls, ARIA labels).

---
