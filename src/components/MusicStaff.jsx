import React, { useRef, useEffect } from 'react';
import { Factory, Formatter, Stave, StaveNote, Voice, Beam } from 'vexflow';

const MusicStaff = ({ clef, notes, highlightedNoteIndex }) => {
  const containerRef = useRef();

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
      const measureWidth = numMeasures > 1 ? 280 : 330; // Use smaller measures if there are many
      const totalWidth = (numMeasures * measureWidth) + 40; // Add padding

      const factory = new Factory({
        renderer: { elementId: containerRef.current, width: totalWidth, height: 150 },
      });

      const context = factory.getContext();
      const formatter = new Formatter();
      let x = 10;

      // 2. Create staves and voices for each measure
      measuresOfNotes.forEach((measureNotes, i) => {
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
          if (noteData.originalIndex === highlightedNoteIndex) {
            staveNote.setStyle({ fillStyle: '#A78BFA', strokeStyle: '#A78BFA' });
          }
          return staveNote;
        });

        const voice = new Voice({ num_beats: 4, beat_value: 4 }).setStrict(false);
        voice.addTickables(vexNotes);

        formatter.joinVoices([voice]).format([voice], measureWidth * 0.8);
        voice.draw(context, stave);

        const beams = Beam.generateBeams(vexNotes);
        beams.forEach(beam => beam.setContext(context).draw());

        x += measureWidth;
      });
    }
  }, [clef, notes, highlightedNoteIndex]);

  return <div ref={containerRef} style={{ minHeight: '150px' }} />;
};

export default MusicStaff;