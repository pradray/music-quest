import React, { useRef, useEffect } from 'react';
import { Renderer, Formatter, Stave, StaveNote, Voice, Beam } from 'vexflow';

const MusicStaff = ({ clef, notes, highlightedNoteIndex, noteStatuses }) => {
  const containerRef = useRef();
  const lastHighlightedRef = useRef(-1);
  const activeScrollIdRef = useRef(0);
  const lastMeasureRef = useRef(-1);

  useEffect(() => {
    if (containerRef.current && notes && notes.length > 0) {
      containerRef.current.innerHTML = '';

      const DURATION_TO_BEATS = { 'w': 4, 'h': 2, 'q': 1, '8': 0.5 };
      const BEATS_PER_MEASURE = 4;

      // 1. Split notes into measures based on a 4/4 time signature.
      const measuresOfNotes = [];
      let currentMeasureNotes = [];
      let currentMeasureBeats = 0;

      notes.forEach((note, index) => {
        const noteDuration = note.duration || 'w';
        const noteBeats = DURATION_TO_BEATS[noteDuration] || 0;

        currentMeasureNotes.push({ ...note, originalIndex: index });
        currentMeasureBeats += noteBeats;

        if (currentMeasureBeats >= BEATS_PER_MEASURE) {
          measuresOfNotes.push(currentMeasureNotes);
          currentMeasureNotes = [];
          currentMeasureBeats = 0;
        }
      });

      if (currentMeasureNotes.length > 0) {
        measuresOfNotes.push(currentMeasureNotes);
      }

      const numMeasures = measuresOfNotes.length;

      // Measure sizing: try to use available container width; otherwise fall back to defaults
      const containerWidth = containerRef.current.clientWidth || Math.floor(window.innerWidth * 0.9);
      const defaultMeasureWidth = numMeasures > 1 ? 280 : 330;
      let measureWidth = defaultMeasureWidth;
      const preferredTotal = (numMeasures * defaultMeasureWidth) + 40;
      if (containerWidth > preferredTotal) {
        measureWidth = Math.floor((containerWidth - 40) / numMeasures);
      }

      const totalWidth = (numMeasures * measureWidth) + 40; // Add padding

      // make container horizontally scrollable
      containerRef.current.style.overflowX = 'auto';
      containerRef.current.style.webkitOverflowScrolling = 'touch';

      // Create an inner element that will contain the renderer so the outer
      // container can remain a scroll viewport while the inner content grows
      const inner = document.createElement('div');
      inner.style.width = `${totalWidth}px`;
      inner.style.height = `150px`;
      inner.style.position = 'relative';
      containerRef.current.appendChild(inner);
      // mark the outer container so it's easy to find in the console
      try {
        containerRef.current.dataset.musicStaff = 'true';
        containerRef.current.id = 'music-staff-outer';
      } catch (e) {}

      // Create an actual canvas element and hand it to VexFlow's Canvas renderer
      const canvas = document.createElement('canvas');
      // Set backing pixel size and CSS size
      canvas.width = totalWidth;
      canvas.height = 150;
      canvas.style.width = `${totalWidth}px`;
      canvas.style.height = `150px`;
      inner.appendChild(canvas);
      // mark the inner renderer element too
      try {
        inner.dataset.musicStaffInner = 'true';
        inner.id = 'music-staff-inner';
      } catch (e) {}

      const renderer = new Renderer(canvas, Renderer.Backends.CANVAS);
      // ensure renderer backing size matches
      renderer.resize(totalWidth, 150);
      const context = renderer.getContext();
      const formatter = new Formatter();
      let x = 10;

      // keep track of absolute x positions for each original note index
      const notePositions = [];

      // track start X for each measure so we can center the current bar
      const measureStarts = [];
      // track last note index for each measure (end-of-measure detection)
      const measureEnds = [];

      // 2. Create staves and voices for each measure
      measuresOfNotes.forEach((measureNotes, i) => {
        measureStarts.push(x);
        // record the last originalIndex in this measure
        if (measureNotes.length > 0) {
          measureEnds[i] = measureNotes[measureNotes.length - 1].originalIndex;
        }
        const stave = new Stave(x, 40, measureWidth);
        if (i === 0) {
          stave.addClef(clef).addTimeSignature('4/4');
        }
        stave.setContext(context).draw();

        const vexNotes = measureNotes.map(noteData => {
          const staveNote = new StaveNote({
            keys: [noteData.note],
            duration: noteData.duration || 'w',
            clef: clef,
            auto_stem: true,
          });
          // Highlight current note
          if (noteData.originalIndex === highlightedNoteIndex) {
            staveNote.setStyle({ fillStyle: '#A78BFA', strokeStyle: '#A78BFA' });
          }
          // Apply per-note status color if provided
          if (noteStatuses && typeof noteStatuses[noteData.originalIndex] !== 'undefined') {
            const status = noteStatuses[noteData.originalIndex];
            if (status === 'correct') {
              staveNote.setStyle({ fillStyle: '#10B981', strokeStyle: '#10B981' });
            } else if (status === 'wrong') {
              staveNote.setStyle({ fillStyle: '#F87171', strokeStyle: '#F87171' });
            }
          }
          return staveNote;
        });

        const voice = new Voice({ num_beats: 4, beat_value: 4 }).setStrict(false);
        voice.addTickables(vexNotes);

        formatter.joinVoices([voice]).format([voice], measureWidth * 0.8);
        voice.draw(context, stave);

        const beams = Beam.generateBeams(vexNotes);
        beams.forEach(beam => beam.setContext(context).draw());

        // record positions for auto-scroll (note: getAbsoluteX is canvas coords)
        vexNotes.forEach((vfNote, idx) => {
          const absX = vfNote.getAbsoluteX();
          const originalIndex = measureNotes[idx].originalIndex;
          notePositions[originalIndex] = absX;
        });

        // Draw plain status symbols (green tick / red cross) above notes
        if (noteStatuses) {
          context.save();
          context.font = '20px Arial';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          measureNotes.forEach((noteData, idx) => {
            const status = noteStatuses[noteData.originalIndex];
            if (!status) return;
            const vfNote = vexNotes[idx];
            const sx = vfNote.getAbsoluteX() + 6;
            const y = 28; // position above the staff
            if (status === 'correct') {
              context.fillStyle = '#10B981';
              context.fillText('✓', sx, y);
            } else if (status === 'wrong') {
              context.fillStyle = '#EF4444';
              context.fillText('✕', sx, y);
            }
          });
          context.restore();
        }

        x += measureWidth;
      });

      // Expose debug info for console inspection
      inner._notePositions = notePositions;
      inner._measureStarts = measureStarts;
      inner._measureWidth = measureWidth;
      // expose the ref so callers can inspect/modify current measure state
      try { inner._lastMeasureRef = lastMeasureRef; } catch (e) {}
      inner._canvas = canvas;
      containerRef.current._inner = inner;
      // Expose a small debug handle for quick console inspection
      try {
        window.__musicStaffDebug = { inner, container: containerRef.current };
      } catch (e) {}

      // Auto-scroll to keep the current measure in view
      (function ensureVisibleScroll() {
        if (!containerRef.current || !inner || !canvas) return;

        const measureIndex = measuresOfNotes.findIndex(m => m.some(n => n.originalIndex === highlightedNoteIndex));
        if (measureIndex < 0) return;

        const container = containerRef.current;
        const cw = container.clientWidth;
        const maxScroll = Math.max(0, inner.scrollWidth - cw);

        // Calculate the target scroll position to center the current measure
        const measureStart = measureStarts[measureIndex];
        const measureEnd = measureStarts[measureIndex + 1] || totalWidth - 20;
        const measureWidth = measureEnd - measureStart;
        
        let targetScroll = measureStart - (cw / 2) + (measureWidth / 2);

        // Clamp the target scroll to valid bounds
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        
        // Only scroll if the target is significantly different from the current position
        if (Math.abs(container.scrollLeft - targetScroll) > 10) {
          container.scrollTo({
            left: targetScroll,
            behavior: 'smooth',
          });
        }
      })();
    }
  }, [clef, notes, highlightedNoteIndex, noteStatuses]);

  return <div ref={containerRef} style={{ minHeight: '150px', width: '100%' }} />;
};

export default MusicStaff;