import React, { useState, useRef, useEffect, Suspense } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Volume2, Trophy, Zap, Download, Upload, Music, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
const MusicStaff = React.lazy(() => import('./components/MusicStaff'));

// --- DATA: ABRSM GRADE 1 SYLLABUS ---
const OLD_LEVEL_1_QUESTIONS = [
  { id: 't-c4', note: "c/4", answer: "C", audio: "C4" },
  { id: 't-d4', note: "d/4", answer: "D", audio: "D4" },
  { id: 't-e4', note: "e/4", answer: "E", audio: "E4" },
  { id: 't-f4', note: "f/4", answer: "F", audio: "F4" },
  { id: 't-g4', note: "g/4", answer: "G", audio: "G4" },
];

const OLD_LEVEL_2_QUESTIONS = [
  { id: 't-a4', note: "a/4", answer: "A", audio: "A4" },
  { id: 't-b4', note: "b/4", answer: "B", audio: "B4" },
  { id: 't-c5', note: "c/5", answer: "C", audio: "C5" },
  { id: 't-d5', note: "d/5", answer: "D", audio: "D5" },
];

const LEVEL_1_QUESTIONS = [
  { id: 't-c4', note: "c/4", answer: "C", audio: "C4" },
  { id: 't-e4', note: "e/4", answer: "E", audio: "E4" },
  { id: 't-g4', note: "g/4", answer: "G", audio: "G4" },
  { id: 't-b4', note: "b/4", answer: "B", audio: "B4" },
  { id: 't-d5', note: "d/5", answer: "D", audio: "D5" },
  { id: 't-f5', note: "f/5", answer: "F", audio: "F5" },
];

const LEVEL_2_QUESTIONS = [
  { id: 't-d4', note: "d/4", answer: "D", audio: "D4" },
  { id: 't-f4', note: "f/4", answer: "F", audio: "F4" },
  { id: 't-a4', note: "a/4", answer: "A", audio: "A4" },
  { id: 't-c5', note: "c/5", answer: "C", audio: "C5" },
  { id: 't-e5', note: "e/5", answer: "E", audio: "E5" },
];

const LEVEL_9_QUESTIONS = [
  { id: 'b-g2', note: "g/2", answer: "G", audio: "G2" },
  { id: 'b-b2', note: "b/2", answer: "B", audio: "B2" },
  { id: 'b-d3', note: "d/3", answer: "D", audio: "D3" },
  { id: 'b-f3', note: "f/3", answer: "F", audio: "F3" },
  { id: 'b-a3', note: "a/3", answer: "A", audio: "A3" },
];

const LEVEL_10_QUESTIONS = [
  { id: 'b-a2', note: "a/2", answer: "A", audio: "A2" },
  { id: 'b-c3', note: "c/3", answer: "C", audio: "C3" },
  { id: 'b-e3', note: "e/3", answer: "E", audio: "E3" },
  { id: 'b-g3', note: "g/3", answer: "G", audio: "G3" },
];

const LEVEL_13_QUESTIONS = [
  { id: 'mel9-1', name: "Bass Walk", notes: [
    { id: 'b-g2-l9-1', note: "g/2", answer: "G", audio: "G2", duration: 'q' },
    { id: 'b-a2-l9-2', note: "a/2", answer: "A", audio: "A2", duration: 'q' },
    { id: 'b-b2-l9-3', note: "b/2", answer: "B", audio: "B2", duration: 'q' },
    { id: 'b-a2-l9-4', note: "a/2", answer: "A", audio: "A2", duration: 'h' },
  ]},
  { id: 'mel9-2', name: "Low Hot Cross Buns", notes: [
    { id: 'b-b2-l9-5', note: "b/2", answer: "B", audio: "B2", duration: 'q' },
    { id: 'b-a2-l9-6', note: "a/2", answer: "A", audio: "A2", duration: 'q' },
    { id: 'b-g2-l9-7', note: "g/2", answer: "G", audio: "G2", duration: 'h' },
    { id: 'b-b2-l9-8', note: "b/2", answer: "B", audio: "B2", duration: 'q' },
    { id: 'b-a2-l9-9', note: "a/2", answer: "A", audio: "A2", duration: 'q' },
    { id: 'b-g2-l9-10', note: "g/2", answer: "G", audio: "G2", duration: 'h' },
  ]},
];

const LEVEL_14_QUESTIONS = [
    { id: 'mel10-1', name: "Bass Scale", notes: [
    { id: 'b-c3-l10-1', note: "c/3", answer: "C", audio: "C3", duration: 'q' },
    { id: 'b-d3-l10-2', note: "d/3", answer: "D", audio: "D3", duration: 'q' },
    { id: 'b-e3-l10-3', note: "e/3", answer: "E", audio: "E3", duration: 'q' },
    { id: 'b-f3-l10-4', note: "f/3", answer: "F", audio: "F3", duration: 'q' },
    { id: 'b-g3-l10-5', note: "g/3", answer: "G", audio: "G3", duration: 'q' },
    { id: 'b-f3-l10-6', note: "f/3", answer: "F", audio: "F3", duration: 'q' },
    { id: 'b-e3-l10-7', note: "e/3", answer: "E", audio: "E3", duration: 'q' },
    { id: 'b-d3-l10-8', note: "d/3", answer: "D", audio: "D3", duration: 'h' },
  ]},
  { id: 'mel10-2', name: "Bass Arpeggio", notes: [
    { id: 'b-c3-l10-9', note: "c/3", answer: "C", audio: "C3", duration: 'q' },
    { id: 'b-e3-l10-10', note: "e/3", answer: "E", audio: "E3", duration: 'q' },
    { id: 'b-g3-l10-11', note: "g/3", answer: "G", audio: "G3", duration: 'q' },
    { id: 'b-c4-l10-12', note: "c/4", answer: "C", audio: "C4", duration: 'q' },
    { id: 'b-g3-l10-13', note: "g/3", answer: "G", audio: "G3", duration: 'q' },
    { id: 'b-e3-l10-14', note: "e/3", answer: "E", audio: "E3", duration: 'q' },
    { id: 'b-c3-l10-15', note: "c/3", answer: "C", audio: "C3", duration: 'h' },
  ]},
];

const RHYMES = {
  "1": ["Every", "Good", "Boy", "Deserves", "Fun"],
  "2": ["F", "A", "C", "E"],
  "9": ["Good", "Boys", "Do", "Fine", "Always"],
  "10": ["All", "Cows", "Eat", "Grass"]
};

const LEVEL_DATA = {
  "1": {
    title: "Level 1: On the Lines",
    clef: "treble",
    questions: LEVEL_1_QUESTIONS
  },
  "2": {
    title: "Level 2: In the Spaces",
    clef: "treble",
    questions: LEVEL_2_QUESTIONS
  },
  "3": {
    title: "Level 3: Treble Explorer",
    clef: "treble",
    questions: OLD_LEVEL_1_QUESTIONS
  },
  "4": {
    title: "Level 4: Treble Practice",
    type: "proficiency",
    clef: "treble",
    questions: OLD_LEVEL_1_QUESTIONS
  },
  "5": {
    title: "Level 5: Treble Climber",
    clef: "treble",
    questions: OLD_LEVEL_2_QUESTIONS
  },
   "6": {
    title: "Level 6: Combined Practice",
    type: "proficiency",
    clef: "treble",
    questions: [ ...OLD_LEVEL_1_QUESTIONS, ...OLD_LEVEL_2_QUESTIONS ]
  },
  "7": {
    title: "Level 7: Melodies",
    type: "melody",
    clef: "treble",
    questions: [
      { id: 'melody-1', name: "Mary Had a Little Lamb", notes: [
        { id: 't-e4', note: "e/4", answer: "E", audio: "E4", duration: 'q' },
        { id: 't-d4', note: "d/4", answer: "D", audio: "D4", duration: 'q' },
        { id: 't-c4', note: "c/4", answer: "C", audio: "C4", duration: 'q' },
        { id: 't-d4', note: "d/4", answer: "D", audio: "D4", duration: 'q' },
        { id: 't-e4', note: "e/4", answer: "E", audio: "E4", duration: 'q' },
        { id: 't-e4', note: "e/4", answer: "E", audio: "E4", duration: 'q' },
        { id: 't-e4', note: "e/4", answer: "E", audio: "E4", duration: 'h' },
      ]},
      { id: 'melody-2', name: "Twinkle, Twinkle", notes: [
        { id: 't-c4', note: "c/4", answer: "C", audio: "C4", duration: 'q' },
        { id: 't-c4', note: "c/4", answer: "C", audio: "C4", duration: 'q' },
        { id: 't-g4', note: "g/4", answer: "G", audio: "G4", duration: 'q' },
        { id: 't-g4', note: "g/4", answer: "G", audio: "G4", duration: 'q' },
        { id: 't-a4', note: "a/4", answer: "A", audio: "A4", duration: 'q' },
        { id: 't-a4', note: "a/4", answer: "A", audio: "A4", duration: 'q' },
        { id: 't-g4', note: "g/4", answer: "G", audio: "G4", duration: 'h' },
      ]},
      { id: 'melody-3', name: "Ode to Joy", notes: [
        { id: 't-e4', note: "e/4", answer: "E", audio: "E4", duration: 'q' },
        { id: 't-e4', note: "e/4", "answer": "E", audio: "E4", duration: 'q' },
        { id: 't-f4', note: "f/4", answer: "F", audio: "F4", duration: 'q' },
        { id: 't-g4', note: "g/4", answer: "G", audio: "G4", duration: 'q' },
        { id: 't-g4', note: "g/4", answer: "G", audio: "G4", duration: 'q' },
        { id: 't-f4', note: "f/4", answer: "F", audio: "F4", duration: 'q' },
        { id: 't-e4', note: "e/4", answer: "E", audio: "E4", duration: 'q' },
        { id: 't-d4', note: "d/4", answer: "D", audio: "D4", duration: 'q' },
      ]},
       { id: 'melody-4', name: "Hot Cross Buns", notes: [
        { id: 't-b4', note: "b/4", answer: "B", audio: "B4", duration: 'q' },
        { id: 't-a4', note: "a/4", answer: "A", audio: "A4", duration: 'q' },
        { id: 't-g4', note: "g/4", answer: "G", audio: "G4", duration: 'h' },
        { id: 't-b4', note: "b/4", answer: "B", audio: "B4", duration: 'q' },
        { id: 't-a4', note: "a/4", answer: "A", audio: "A4", duration: 'q' },
        { id: 't-g4', note: "g/4", answer: "G", audio: "G4", duration: 'h' },
      ]},
       { id: 'melody-5', name: "Baby Shark", notes: [
        { id: 't-c4', note: "c/4", answer: "C", audio: "C4", duration: 'q' },
        { id: 't-d4', note: "d/4", answer: "D", audio: "D4", duration: 'q' },
        { id: 't-f4', note: "f/4", answer: "F", audio: "F4", duration: 'h' },
      ]},
    ]
  },
  "8": {
    title: "Level 8: Extended Melodies (Treble)",
    type: "melody",
    clef: "treble",
    questions: [
      { id: 'mel6-1', name: "Four-Bar Scale Run", notes: [
        { id: 't-c4-l6-1', note: "c/4", answer: "C", audio: "C4", duration: 'q' },
        { id: 't-d4-l6-2', note: "d/4", answer: "D", audio: "D4", duration: 'q' },
        { id: 't-e4-l6-3', note: "e/4", answer: "E", audio: "E4", duration: 'q' },
        { id: 't-f4-l6-4', note: "f/4", answer: "F", audio: "F4", duration: 'q' },
        { id: 't-g4-l6-5', note: "g/4", answer: "G", audio: "G4", duration: 'q' },
        { id: 't-a4-l6-6', note: "a/4", answer: "A", audio: "A4", duration: 'q' },
        { id: 't-b4-l6-7', note: "b/4", answer: "B", audio: "B4", duration: 'q' },
        { id: 't-c5-l6-8', note: "c/5", answer: "C", audio: "C5", duration: 'q' },
        { id: 't-d5-l6-9', note: "d/5", answer: "D", audio: "D5", duration: 'q' },
        { id: 't-e5-l6-10', note: "e/5", answer: "E", audio: "E5", duration: 'q' },
        { id: 't-f5-l6-11', note: "f/5", answer: "F", audio: "F5", duration: 'q' },
        { id: 't-g5-l6-12', note: "g/5", answer: "G", audio: "G5", duration: 'q' },
        { id: 't-a5-l6-13', note: "a/5", answer: "A", audio: "A5", duration: 'q' },
        { id: 't-b5-l6-14', note: "b/5", answer: "B", audio: "B5", duration: 'q' },
        { id: 't-c6-l6-15', note: "c/6", answer: "C", audio: "C6", duration: 'q' },
        { id: 't-b5-l6-16', note: "b/5", answer: "B", audio: "B5", duration: 'q' },
      ]},
      { id: 'mel6-2', name: "Arpeggio Span", notes: [
        { id: 't-e4-l6-1', note: "e/4", answer: "E", audio: "E4", duration: 'q' },
        { id: 't-g4-l6-2', note: "g/4", answer: "G", audio: "G4", duration: 'q' },
        { id: 't-c5-l6-3', note: "c/5", answer: "C", audio: "C5", duration: 'q' },
        { id: 't-e5-l6-4', note: "e/5", answer: "E", audio: "E5", duration: 'q' },
        { id: 't-g5-l6-5', note: "g/5", answer: "G", audio: "G5", duration: 'q' },
        { id: 't-c6-l6-6', note: "c/6", answer: "C", audio: "C6", duration: 'q' },
        { id: 't-b5-l6-7', note: "b/5", answer: "B", audio: "B5", duration: 'q' },
        { id: 't-a5-l6-8', note: "a/5", answer: "A", audio: "A5", duration: 'q' },
        { id: 't-g5-l6-9', note: "g/5", answer: "G", audio: "G5", duration: 'q' },
        { id: 't-e5-l6-10', note: "e/5", answer: "E", audio: "E5", duration: 'q' },
        { id: 't-c5-l6-11', note: "c/5", answer: "C", audio: "C5", duration: 'q' },
        { id: 't-g4-l6-12', note: "g/4", answer: "G", audio: "G4", duration: 'q' },
        { id: 't-e4-l6-13', note: "e/4", answer: "E", audio: "E4", duration: 'q' },
        { id: 't-c4-l6-14', note: "c/4", answer: "C", audio: "C4", duration: 'q' },
        { id: 't-d4-l6-15', note: "d/4", answer: "D", audio: "D4", duration: 'q' },
        { id: 't-e4-l6-16', note: "e/4", answer: "E", audio: "E4", duration: 'q' },
      ]},
      { id: 'mel6-3', name: "Range Run", notes: [
        { id: 't-g4-l6-1', note: "g/4", answer: "G", audio: "G4", duration: 'q' },
        { id: 't-a4-l6-2', note: "a/4", answer: "A", audio: "A4", duration: 'q' },
        { id: 't-b4-l6-3', note: "b/4", answer: "B", audio: "B4", duration: 'q' },
        { id: 't-c5-l6-4', note: "c/5", answer: "C", audio: "C5", duration: 'q' },
        { id: 't-d5-l6-5', note: "d/5", answer: "D", audio: "D5", duration: 'q' },
        { id: 't-e5-l6-6', note: "e/5", answer: "E", audio: "E5", duration: 'q' },
        { id: 't-f5-l6-7', note: "f/5", answer: "F", audio: "F5", duration: 'q' },
        { id: 't-g5-l6-8', note: "g/5", answer: "G", audio: "G5", duration: 'q' },
        { id: 't-a5-l6-9', note: "a/5", answer: "A", audio: "A5", duration: 'q' },
        { id: 't-b5-l6-10', note: "b/5", answer: "B", audio: "B5", duration: 'q' },
        { id: 't-c6-l6-11', note: "c/6", answer: "C", audio: "C6", duration: 'q' },
        { id: 't-b5-l6-12', note: "b/5", answer: "B", audio: "B5", duration: 'q' },
        { id: 't-a5-l6-13', note: "a/5", answer: "A", audio: "A5", duration: 'q' },
        { id: 't-g5-l6-14', note: "g/5", answer: "G", audio: "G5", duration: 'q' },
        { id: 't-f5-l6-15', note: "f/5", answer: "F", audio: "F5", duration: 'q' },
        { id: 't-e5-l6-16', note: "e/5", answer: "E", audio: "E5", duration: 'q' },
      ]},
    ]
  },
  "9": {
    title: "Level 9: On the Lines (Bass)",
    clef: "bass",
    questions: LEVEL_9_QUESTIONS
  },
  "10": {
    title: "Level 10: In the Spaces (Bass)",
    clef: "bass",
    questions: LEVEL_10_QUESTIONS
  },
  "11": {
    title: "Level 11: Bass Lowlands",
    clef: "bass",
    questions: [
      { id: 'b-e2', note: "e/2", answer: "E", audio: "E2" },
      { id: 'b-f2', note: "f/2", answer: "F", audio: "F2" },
      { id: 'b-g2', note: "g/2", answer: "G", audio: "G2" },
      { id: 'b-a2', note: "a/2", answer: "A", audio: "A2" },
      { id: 'b-b2', note: "b/2", answer: "B", audio: "B2" },
    ]
  },
  "12": {
    title: "Level 12: Bass Summit",
    clef: "bass",
    questions: [
      { id: 'b-c3', note: "c/3", answer: "C", audio: "C3" },
      { id: 'b-d3', note: "d/3", answer: "D", audio: "D3" },
      { id: 'b-e3', note: "e/3", answer: "E", audio: "E3" },
      { id: 'b-f3', note: "f/3", answer: "F", audio: "F3" },
      { id: 'b-g3', note: "g/3", answer: "G", audio: "G3" },
      { id: 'b-a3', note: "a/3", answer: "A", audio: "A3" },
      { id: 'b-b3', note: "b/3", answer: "B", audio: "B3" },
      { id: 'b-c4', note: "c/4", answer: "C", audio: "C4" },
    ]
  },
  "13": {
    title: "Level 13: Bass Melodies",
    type: "melody",
    clef: "bass",
    questions: LEVEL_13_QUESTIONS
  },
  "14": {
    title: "Level 14: Extended Bass Melodies",
    type: "melody",
    clef: "bass",
    questions: LEVEL_14_QUESTIONS
  }
};
const LEVEL_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

export default function App() {
  // --- STATE ---
  const [gameState, setGameState] = useState('welcome');
  const [level, setLevel] = useState('1');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [proficiency, setProficiency] = useState({});
  const [currentNoteInMelodyIndex, setCurrentNoteInMelodyIndex] = useState(0);
  const [melodyAnswers, setMelodyAnswers] = useState({});
  const [wrongNoteMessage, setWrongNoteMessage] = useState(null);
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [midiEnabled, setMidiEnabled] = useState(false);
  const [midiDevices, setMidiDevices] = useState([]);
  const [selectedMidiInputId, setSelectedMidiInputId] = useState(null);
  const midiAccessRef = useRef(null);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [levelCompleteMessage, setLevelCompleteMessage] = useState(null);
  const [instructionStep, setInstructionStep] = useState(0);

  const [warmupQueue, setWarmupQueue] = useState([]);
  const [warmupIndex, setWarmupIndex] = useState(0);

  const fileInputRef = useRef(null);
  const synth = useRef(null);
  const errorSynth = useRef(null);
  const toneModuleRef = useRef(null);

  const currentLevelData = LEVEL_DATA[level];

  useEffect(() => {
    // When proficiency changes, check if the level is complete.
    // This avoids using stale state within handleAnswer.
    if (gameState === 'playing' && currentLevelData.type === 'proficiency') {
      if (checkProficiency(currentLevelData, proficiency)) {
        advanceToNextLevel();
      }
    }
  }, [proficiency, level, gameState]);
  const ensureTone = async () => {
    if (!toneModuleRef.current) {
      try {
        const Tone = await import('tone');
        toneModuleRef.current = Tone;
        synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
        errorSynth.current = new Tone.MembraneSynth().toDestination();
        await Tone.start();
      } catch (err) {
        console.error('Failed to load Tone.js', err);
      }
    } else {
      try {
        await toneModuleRef.current.start();
      } catch (e) {
        // ignore
      }
    }
    return toneModuleRef.current;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dev') === 'true') {
      setIsDevMode(true);
      console.log("Developer mode enabled. You can now jump to any level.");
    }
  }, []);

  useEffect(() => {
    if ((level === '1' || level === '2' || level === '9' || level === '10') && gameState === 'playing') {
      setInstructionStep(1);
    }
  }, [level, gameState]);

  const checkProficiency = (level, currentProficiency) => {
    const targetQuestionIds = new Set(level.questions.map(q => q.id));
    for (const id of targetQuestionIds) {
      const stats = currentProficiency[id];
      if (!stats || stats.attempts === 0) return false;
      if ((stats.correct / stats.attempts) < 0.80 || stats.correct < 5) return false;
    }
    return true; // All notes mastered
  };

  const advanceToNextLevel = async () => {
    const currentLevelIndex = LEVEL_ORDER.indexOf(level);
    const nextLevelKey = LEVEL_ORDER[currentLevelIndex + 1];

    if (nextLevelKey) {
      // Show encouraging message + small confetti and play a short fanfare
      setLevelCompleteMessage(`Great job — Level ${Number(level) + 1} unlocked!`);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      try {
        await ensureTone();
        // simple fanfare: chord then a higher note
        if (synth.current) {
          synth.current.triggerAttackRelease(["C5","E5","G5"], "8n");
          setTimeout(() => {
            try { synth.current.triggerAttackRelease("C6", "8n"); } catch (e) {}
          }, 220);
        }
      } catch (e) {
        // ignore tone errors
      }

      setTimeout(() => {
        setLevel(nextLevelKey);
        setCurrentQ(0);
        setCurrentNoteInMelodyIndex(0);
        setLevelCompleteMessage(null);
      }, 1400);
    } else {
      setGameState('victory');
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
    }
  };

  // --- SAVE / LOAD SYSTEM ---
  const handleSave = () => {
    const saveData = {
      level, currentQ, score, streak, proficiency, priorityQueue,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MusicQuest_L${level}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({ particleCount: 40, spread: 60, colors: ['#A78BFA', '#F472B6'] });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setLevel(data.level || '1');
        setCurrentQ(data.currentQ || 0);
        setScore(data.score || 0);
        setStreak(data.streak || 0);
        setProficiency(data.proficiency || {});
        setPriorityQueue(data.priorityQueue || []);
        startWarmup(data.level || '1', data.currentQ || 0);
      } catch (err) {
        alert("Oops! That file looks broken.");
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  // --- Local storage persistence ---
  const STORAGE_KEY = 'musicQuestSave';

  const loadFromLocalStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      setLevel(data.level || '1');
      setCurrentQ(data.currentQ || 0);
      setScore(data.score || 0);
      setStreak(data.streak || 0);
      setProficiency(data.proficiency || {});
      setPriorityQueue(data.priorityQueue || []);
      setCurrentNoteInMelodyIndex(data.currentNoteInMelodyIndex || 0);
      setMelodyAnswers(data.melodyAnswers || {});
      setGameState(data.gameState || 'playing');
      return true;
    } catch (err) {
      console.warn('Failed to load saved state', err);
      return false;
    }
  };

  const saveToLocalStorage = () => {
    try {
      const payload = {
        level,
        currentQ,
        score,
        streak,
        proficiency,
        priorityQueue,
        currentNoteInMelodyIndex,
        melodyAnswers,
        gameState,
        timestamp: new Date().toISOString()
      };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Failed to save state', err);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    resetGame();
    setHasSavedProgress(false);
  };

  const resumeGame = async () => {
    await ensureTone();
    const loaded = loadFromLocalStorage();
    if (loaded) {
      setHasSavedProgress(true);
      setGameState('playing');
    }
  };

  // --- GAME LOGIC ---
  // On mount, detect saved progress but do not auto-load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHasSavedProgress(true);
    } catch (e) {
      setHasSavedProgress(false);
    }
  }, []);

  // Autosave whenever important state changes
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    // Don't autosave the default welcome screen — it can clobber an existing save
    if (gameState === 'welcome') return;
    saveToLocalStorage();
  }, [level, currentQ, score, streak, proficiency, priorityQueue, currentNoteInMelodyIndex, melodyAnswers, gameState]);

  const startWarmup = async (savedLevel, savedQ) => {
    await ensureTone();
    const levelKey = savedLevel.toString(); // Ensure it's a string
    const savedLevelIndex = LEVEL_ORDER.indexOf(levelKey);

    if (savedLevelIndex > 0 || savedQ > 0) {
      const reviewQs = [];
      // Get all questions from levels before the saved one
      let sourceQs = [];
      for(let i=0; i < savedLevelIndex; i++){
          const levelId = LEVEL_ORDER[i];
          if(LEVEL_DATA[levelId].type !== 'melody'){ // Do not include melodies in warmup
            sourceQs.push(...LEVEL_DATA[levelId].questions);
          }
      }

      if(sourceQs.length > 0){
        for(let i=0; i<3; i++) {
          reviewQs.push({ ...sourceQs[Math.floor(Math.random() * sourceQs.length)], isReview: true });
        }
        setWarmupQueue(reviewQs);
        setWarmupIndex(0);
        setGameState('warmup');
      } else {
         setGameState('playing');
      }

    } else {
      setGameState('playing');
    }
  };

  const playNote = (note) => {
    synth.current.triggerAttackRelease(note, "8n");
  };

  // MIDI helpers
  const MIDI_TO_NAME = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  const midiMessageHandler = (event) => {
    const [status, data1, data2] = event.data;
    const command = status & 0xf0;
    const noteNumber = data1;
    const velocity = data2;

    // Note on (0x90) with velocity > 0
    if (command === 0x90 && velocity > 0) {
      const name = MIDI_TO_NAME[noteNumber % 12];
      const octave = Math.floor(noteNumber / 12) - 1; // MIDI note 60 -> C4
      const full = `${name}${octave}`; // e.g., E4 or C#4
      // For MIDI input we use full note name to match activeQ.audio (e.g., "E4")
      handleAnswer(full);
    }
  };

  const connectMIDI = async () => {
    if (!navigator.requestMIDIAccess) {
      alert('Web MIDI API not supported in this browser.');
      return;
    }
    try {
      const access = await navigator.requestMIDIAccess();
      midiAccessRef.current = access;
      const inputs = Array.from(access.inputs.values());
      setMidiDevices(inputs.map(i => ({ id: i.id, name: i.name || i.id })));
      // auto-select first device if available
      if (inputs.length > 0) {
        const first = inputs[0];
        setSelectedMidiInputId(first.id);
        // attach only to selected input
        first.onmidimessage = midiMessageHandler;
      }
      setMidiEnabled(true);
      access.onstatechange = () => {
        const updated = Array.from(access.inputs.values());
        setMidiDevices(updated.map(i => ({ id: i.id, name: i.name || i.id })));
      };
    } catch (err) {
      console.error('MIDI connect error', err);
    }
  };

  const disconnectMIDI = () => {
    const access = midiAccessRef.current;
    if (access) {
      if (selectedMidiInputId) {
        const input = access.inputs.get(selectedMidiInputId);
        if (input) input.onmidimessage = null;
      } else {
        Array.from(access.inputs.values()).forEach(input => input.onmidimessage = null);
      }
      // keep access reference but clear selected
      midiAccessRef.current = access;
    }
    setSelectedMidiInputId(null);
    setMidiDevices([]);
    setMidiEnabled(false);
  };

  const selectMidiInput = (id) => {
    const access = midiAccessRef.current;
    if (!access) return;
    // detach previous
    if (selectedMidiInputId) {
      const prev = access.inputs.get(selectedMidiInputId);
      if (prev) prev.onmidimessage = null;
    }
    const input = access.inputs.get(id);
    if (input) {
      input.onmidimessage = midiMessageHandler;
      setSelectedMidiInputId(id);
      setMidiEnabled(true);
    }
  };

  const getNextProficiencyQuestion = () => {
    let nextQuestionId;
    let newPriorityQueue = [...priorityQueue];

    if (newPriorityQueue.length > 0) {
      nextQuestionId = newPriorityQueue.shift(); // Get note from the front of the queue
    } else {
      // If queue is empty, pick a random note from the level
      const allQuestionIds = currentLevelData.questions.map(q => q.id);
      nextQuestionId = allQuestionIds[Math.floor(Math.random() * allQuestionIds.length)];
    }

    const nextQIndex = currentLevelData.questions.findIndex(q => q.id === nextQuestionId);
    setPriorityQueue(newPriorityQueue);
    setCurrentQ(nextQIndex >= 0 ? nextQIndex : 0);
  };

  const handleAnswer = (selectedNote) => {
    const currentLevelData = LEVEL_DATA[level];
    const levelType = currentLevelData.type;

    // Determine the active question (warmup, melody, or standard)
    let activeQ;
    if (gameState === 'warmup') {
      activeQ = warmupQueue[warmupIndex];
    } else if (levelType === 'melody') {
      const melody = currentLevelData.questions[currentQ];
      activeQ = melody.notes[currentNoteInMelodyIndex];
    } else {
      activeQ = currentLevelData.questions[currentQ];
    }

    const isCorrect = selectedNote === activeQ.answer;

    // --- Universal State Updates ---
    if (gameState !== 'warmup' && currentLevelData.type === 'proficiency') {
      const noteId = activeQ.id;
      setProficiency(prev => {
        const stats = prev[noteId] || { attempts: 0, correct: 0 };
        return {
          ...prev,
          [noteId]: {
            attempts: stats.attempts + 1,
            correct: stats.correct + (isCorrect ? 1 : 0)
          }
        };
      });
    }

    if (isCorrect) {
      // CORRECT ANSWER
      playNote(activeQ.audio);
      const delay = 600;

      if (gameState === 'warmup') {
        setFeedback('correct');
        setTimeout(() => {
          setFeedback(null);
          if (warmupIndex + 1 < warmupQueue.length) {
            setWarmupIndex(i => i + 1);
          } else {
            setGameState('playing');
          }
        }, delay);
        return;
      }

      // Update score/streak for the correct note
      setScore(s => s + 10);
      setStreak(s => s + 1);

      if (levelType === 'proficiency') {
        // If it was in the priority queue, remove one instance
        setPriorityQueue(prev => {
            const index = prev.indexOf(activeQ.id);
            if (index > -1) {
                return [...prev.slice(0, index), ...prev.slice(index + 1)];
            }
            return prev;
        });
      }

      if (levelType === 'melody') {
        // Mark this note as correct in melodyAnswers
        setMelodyAnswers(prev => {
          const copy = { ...prev };
          const melodyKey = String(currentQ);
          const melody = currentLevelData.questions[currentQ];
          const len = melody.notes.length;
          if (!copy[melodyKey] || copy[melodyKey].length !== len) {
            copy[melodyKey] = Array(len).fill(null);
          }
          copy[melodyKey][currentNoteInMelodyIndex] = 'correct';
          return copy;
        });

        // Advance to next note or finish melody
        setTimeout(() => {
          const melody = currentLevelData.questions[currentQ];
          if (currentNoteInMelodyIndex + 1 < melody.notes.length) {
            setCurrentNoteInMelodyIndex(i => i + 1);
          } else {
            // Finished melody: decide whether to advance or repeat
            const statuses = (melodyAnswers[String(currentQ)] || []).concat();
            // include the latest correct one we just set
            statuses[currentNoteInMelodyIndex] = 'correct';
            const hasWrong = statuses.some(s => s === 'wrong');
            if (hasWrong) {
              // Let the player try the same melody again
              setFeedback('wrong');
              setTimeout(() => setFeedback(null), 1000);
              // Reset statuses for replay
              setMelodyAnswers(prev => ({ ...prev, [String(currentQ)]: Array(melody.notes.length).fill(null) }));
              setCurrentNoteInMelodyIndex(0);
            } else {
              // All green — show celebration then advance
              setFeedback('correct');
              confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
              setTimeout(() => {
                setFeedback(null);
                if (currentQ + 1 < currentLevelData.questions.length) {
                  setCurrentQ(q => q + 1);
                  setCurrentNoteInMelodyIndex(0);
                } else {
                  advanceToNextLevel();
                }
              }, 1200);
            }
          }
        }, delay);
      } else {
        // Non-melody correct logic (standard/proficiency)
        setFeedback('correct');
        setTimeout(() => {
          setFeedback(null);
          if (levelType === 'proficiency') {
            getNextProficiencyQuestion();
          } else {
            if (currentQ + 1 < currentLevelData.questions.length) {
              setCurrentQ(q => q + 1);
            } else {
              advanceToNextLevel();
            }
          }
        }, delay);
      }

    } else {
      // --- WRONG ANSWER ---
      errorSynth.current.triggerAttackRelease("C2", "8n");
      setStreak(0);

      if (levelType === 'proficiency') {
          // Add the note to the priority queue twice to increase its frequency
          setPriorityQueue(prev => [...prev, activeQ.id, activeQ.id]);
      }

      if (levelType === 'melody') {
        // Mark this note as wrong and tell the player the correct note
        setMelodyAnswers(prev => {
          const copy = { ...prev };
          const melodyKey = String(currentQ);
          const melody = currentLevelData.questions[currentQ];
          const len = melody.notes.length;
          if (!copy[melodyKey] || copy[melodyKey].length !== len) {
            copy[melodyKey] = Array(len).fill(null);
          }
          copy[melodyKey][currentNoteInMelodyIndex] = 'wrong';
          return copy;
        });

        // Play the correct note so the learner can hear it
        playNote(activeQ.audio);

        // Show wrong overlay + the correct-note hint briefly
        setFeedback('wrong');
        setWrongNoteMessage(`Correct: ${activeQ.answer}`);
        setTimeout(() => {
          setWrongNoteMessage(null);
          setFeedback(null);
        }, 1600);

        // Advance to the next note so the player continues the melody
        const melody = currentLevelData.questions[currentQ];
        if (currentNoteInMelodyIndex + 1 < melody.notes.length) {
          setTimeout(() => setCurrentNoteInMelodyIndex(i => i + 1), 600);
        } else {
          // Last note: decide whether to replay the melody or advance
          const statuses = (melodyAnswers[String(currentQ)] || Array(melody.notes.length).fill(null)).slice();
          statuses[currentNoteInMelodyIndex] = 'wrong';
          const hasWrong = statuses.some(s => s === 'wrong');
          if (hasWrong) {
            // replay melody
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 1000);
            setMelodyAnswers(prev => ({ ...prev, [String(currentQ)]: Array(melody.notes.length).fill(null) }));
            setCurrentNoteInMelodyIndex(0);
          } else {
            // all correct (unlikely here since this branch is wrong), advance
            setTimeout(() => {
              if (currentQ + 1 < currentLevelData.questions.length) {
                setCurrentQ(q => q + 1);
                setCurrentNoteInMelodyIndex(0);
              } else {
                advanceToNextLevel();
              }
            }, 800);
          }
        }
      } else {
        setFeedback('wrong');
        setTimeout(() => {
          setFeedback(null);
          if (levelType === 'proficiency') {
             getNextProficiencyQuestion();
          }
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setLevel('1');
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setProficiency({});
    setCurrentNoteInMelodyIndex(0);
    setPriorityQueue([]);
    setGameState('welcome');
  };

  // --- RENDER HELPERS ---
  const activeQuestion = (() => {
    if (gameState === 'welcome' || gameState === 'victory') return null;
    if (gameState === 'warmup') return warmupQueue[warmupIndex];

    const question = currentLevelData.questions[currentQ];
    if (currentLevelData.type === 'melody') {
      // For melodies, the "question" is the whole melody object,
      // but the note to be answered is a specific one inside it.
      // We pass the whole melody and the index to MusicStaff.
      return question;
    }
    return question;
  })();

  // Ensure melodyAnswers array exists for the current melody
  useEffect(() => {
    if (currentLevelData.type === 'melody' && activeQuestion) {
      setMelodyAnswers(prev => {
        const key = String(currentQ);
        if (prev[key] && prev[key].length === activeQuestion.notes.length) return prev;
        return { ...prev, [key]: Array(activeQuestion.notes.length).fill(null) };
      });
    }
  }, [level, currentQ, activeQuestion]);

  const noteToAnswer = (() => {
     if (!activeQuestion || gameState === 'welcome' || gameState === 'victory') return null;
     if (gameState === 'warmup') return activeQuestion;
     if (currentLevelData.type === 'melody') {
       return activeQuestion.notes[currentNoteInMelodyIndex];
     }
     return activeQuestion;
  })();

  const selectedMidiDeviceName = (() => {
    if (!selectedMidiInputId || midiDevices.length === 0) return null;
    const dev = midiDevices.find(d => d.id === selectedMidiInputId);
    return dev ? dev.name : null;
  })();

  const pianoKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const bgStyle = gameState === 'warmup'
    ? "bg-gradient-to-b from-orange-300 to-yellow-400"
    : gameState === 'victory'
    ? "bg-gradient-to-b from-green-400 to-teal-500"
    : "bg-gradient-to-b from-violet-400 to-fuchsia-500";

  // --- SCREEN: VICTORY ---
  if (gameState === 'victory') {
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700 ${bgStyle}`}>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-md w-full border-b-[10px] border-black/10"
            >
                <Trophy size={80} className="text-yellow-400 mx-auto mb-6 drop-shadow-lg" />
                <h1 className="text-4xl font-black text-green-500 mb-2">YOU DID IT!</h1>
                <p className="text-gray-500 font-bold text-lg mb-8">You are a Music Master!</p>
                <button onClick={resetGame} className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 text-xl font-black py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                  <RotateCcw size={28} /> PLAY AGAIN
                </button>
            </motion.div>
        </div>
    );
  }

  // --- SCREEN: WELCOME ---
  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border-b-8 border-indigo-200"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-300 p-4 rounded-full shadow-lg animate-float">
              <Music size={48} className="text-indigo-600" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-indigo-600 mb-2 tracking-tight">Music Quest</h1>
          <div className="space-y-4">
              <button onClick={async () => { await ensureTone(); setLevel('1'); setCurrentQ(0); setScore(0); setStreak(0); setProficiency({}); setCurrentNoteInMelodyIndex(0); setPriorityQueue([]); setGameState('playing'); }} className="w-full bg-green-400 hover:bg-green-300 text-white text-xl font-black py-4 px-6 rounded-2xl shadow-[0_6px_0_rgb(21,128,61)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-2">
              <Play size={28} fill="currentColor" /> NEW GAME
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            <button onClick={() => fileInputRef.current.click()} className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-500 text-xl font-black py-4 px-6 rounded-2xl shadow-[0_6px_0_rgb(165,180,252)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-2">
              <Upload size={28} /> LOAD SAVE
            </button>
            {hasSavedProgress && (
              <button onClick={resumeGame} className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 text-xl font-black py-4 px-6 rounded-2xl shadow-[0_6px_0_rgb(133,77,14)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-2">
                Resume
              </button>
            )}
          </div>
          {isDevMode && (
            <div className="mt-6 p-4 bg-indigo-100 rounded-2xl border-2 border-indigo-200">
              <h3 className="font-bold text-indigo-700 text-lg">DEV MODE: Jump to Level</h3>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {LEVEL_ORDER.map(levelId => (
                  <button key={levelId} onClick={async () => {
                      await ensureTone();
                      setLevel(levelId);
                      setCurrentQ(0);
                      setScore(0);
                      setStreak(0);
                      setProficiency({});
                      setCurrentNoteInMelodyIndex(0);
                      setPriorityQueue([]);
                      setGameState('playing');
                    }} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-3 rounded-lg shadow-md active:scale-95 transition-all">
                    {levelId}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // --- SCREEN: PLAYING / WARMUP ---
  return (
    <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 transition-colors duration-700 ${bgStyle} overflow-hidden`}>

      {instructionStep > 0 && (
        <motion.div
          className="absolute inset-0 bg-indigo-500/90 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-center w-full max-w-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            key={instructionStep}
          >
            <AnimatePresence mode="wait">
              {instructionStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-black text-indigo-600 mb-4">
                    {level === '1' || level === '9' ? 'Notes on the Lines' : 'Notes in the Spaces'}
                  </h2>
                  <div className="flex flex-wrap justify-center items-center gap-4 text-2xl sm:text-4xl font-bold text-gray-700 my-6 sm:my-8">
                    {RHYMES[level].map((word) => (
                      <motion.div layoutId={`word-${word}`} key={word} className="p-2">
                        <div className="flex flex-col items-center">
                          <span className="text-4xl sm:text-5xl font-black text-fuchsia-500">{word[0]}</span>
                          <span className="text-lg sm:text-2xl">{word}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-base sm:text-lg text-gray-500 mb-6 sm:mb-8">
                    {
                      level === '1' ? "Remember this rhyme to name the notes on the lines!"
                      : level === '2' ? "The notes in the spaces spell out the word FACE!"
                      : level === '9' ? "Remember this rhyme for the bass clef lines!"
                      : "And this one for the spaces in the bass clef!"
                    }
                  </p>
                  <button
                    onClick={() => setInstructionStep(2)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-lg sm:text-xl font-black py-3 px-8 sm:py-4 sm:px-12 rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {instructionStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-black text-indigo-600 mb-4">
                    Let's map it to the staff!
                  </h2>
                  <div className="relative w-full h-48 sm:h-64 my-8">
                    <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet">
                      {/* Staff lines */}
                      {[...Array(5)].map((_, i) => (
                        <line key={i} x1="10" y1={20 + i * 20} x2="390" y2={20 + i * 20} stroke="black" strokeWidth="1" />
                      ))}

                      {/* Words and Dots */}
                      {RHYMES[level].map((word, index) => {
                        const isLineNote = level === '1' || level === '9';
                        const leftPos = 60 + index * 60;
                        const topPos = isLineNote 
                          ? 100 - index * 20 // E,G,B,D,F (treble) or G,B,D,F,A (bass) on lines 100,80,60,40,20
                          : 90 - index * 20;  // F,A,C,E (treble) or A,C,E,G (bass) in spaces 90,70,50,30

                        return (
                          <g key={word}>
                            <motion.circle
                              cx={leftPos}
                              cy={topPos}
                              r="8"
                              fill="black"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                            />
                            <motion.g layoutId={`word-${word}`}>
                              <text
                                x={leftPos + 20}
                                y={topPos}
                                dominantBaseline="middle"
                                fontFamily="sans-serif"
                                className="text-lg"
                              >
                                {word}
                              </text>
                            </motion.g>
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                   <p className="text-base sm:text-lg text-gray-500 mb-6 sm:mb-8">
                    The notes correspond to the lines and spaces on the staff.
                  </p>
                  <button
                    onClick={() => setInstructionStep(0)}
                    className="bg-green-400 hover:bg-green-500 text-white text-lg sm:text-xl font-black py-3 px-8 sm:py-4 sm:px-12 rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    Got it!
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}

      {/* HEADER HUD - COMPACT VERSION */}
      {/* Reduced margins (mb-2), padding (p-2), and size */}
      <div className="w-full max-w-2xl flex justify-between items-center bg-white/20 backdrop-blur-lg rounded-2xl p-2 mb-2 shadow-xl border border-white/30">
        <div className="flex items-center gap-2 pl-2">
          {gameState === 'warmup' ? (
             <div className="bg-yellow-400 p-1.5 rounded-lg text-yellow-900 shadow-sm"><Zap size={20} fill="currentColor"/></div>
          ) : (
             <div className="bg-yellow-400 p-1.5 rounded-lg text-yellow-900 shadow-sm"><Trophy size={20} fill="currentColor"/></div>
          )}
          <div>
            <p className="text-[10px] text-white/80 font-bold uppercase leading-none mb-0.5">{gameState === 'warmup' ? "Warm-Up" : "Score"}</p>
            <p className="font-black text-xl text-white leading-none">{gameState === 'warmup' ? `${warmupIndex + 1}/3` : score}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           {gameState !== 'warmup' && (
             <div className="hidden sm:flex bg-black/20 px-2 py-1.5 rounded-lg gap-1">
               {[...Array(10)].map((_, i) => (
                 <Star key={i} size={16} className={i < streak ? "text-yellow-300 fill-yellow-300" : "text-white/20"} />
               ))}
             </div>
           )}

           <button
             onClick={handleSave}
             className="bg-white hover:bg-gray-50 text-indigo-600 px-3 py-2 rounded-xl font-bold flex items-center gap-1 shadow-md active:scale-95 transition text-sm"
           >
             <Download size={18} strokeWidth={3} /> <span className="hidden sm:inline">SAVE</span>
           </button>
              <button onClick={clearLocalStorage} className="ml-2 bg-white hover:bg-gray-50 text-red-600 px-3 py-2 rounded-xl font-bold flex items-center gap-1 shadow-md active:scale-95 transition text-sm">
                Clear Progress
              </button>
             {/* MIDI connect button */}
              <button
                onClick={() => midiEnabled ? disconnectMIDI() : connectMIDI()}
                className={`ml-1 bg-white hover:bg-gray-50 text-indigo-600 px-3 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md active:scale-95 transition text-sm ${midiEnabled ? 'ring-2 ring-green-300' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mic"><path d="M12 1v11"></path><path d="M19 11a7 7 0 0 1-14 0"></path><line x1="12" y1="23" x2="12" y2="17"></line></svg>
                <span className="hidden sm:inline">{midiEnabled ? `MIDI: ${selectedMidiDeviceName || 'Connected'}` : 'Connect MIDI'}</span>
              </button>
             {midiDevices.length > 0 && (
               <select value={selectedMidiInputId || ''} onChange={(e) => selectMidiInput(e.target.value)} className="ml-2 rounded-md px-2 py-1 text-sm">
                 {midiDevices.map(d => (
                   <option key={d.id} value={d.id}>{d.name}</option>
                 ))}
               </select>
             )}
        </div>
      </div>

      {/* GAME CARD - RESIZED */}
      <motion.div
        key={activeQuestion ? activeQuestion.id : 'loading'}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border-b-[8px] border-black/5 flex flex-col"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Card Header - Compact */}
        <div className={`px-4 py-3 flex justify-between items-center ${gameState === 'warmup' ? 'bg-orange-100' : 'bg-indigo-50'}`}>
          <h2 className={`text-lg sm:text-xl font-black ${gameState === 'warmup' ? 'text-orange-500' : 'text-indigo-500'}`}>
             {gameState === 'warmup' ? "Let's Remember!" : `${currentLevelData.title}${currentLevelData.type === 'melody' ? `: ${activeQuestion.name}`: ''}`}
          </h2>
          <button
            onClick={() => { playNote(noteToAnswer.audio); }}
            className="p-2 bg-white rounded-full hover:scale-110 shadow-md transition-transform"
          >
            <Volume2 className={gameState === 'warmup' ? "text-orange-500" : "text-indigo-500"} size={20} />
          </button>
        </div>

        {/* Music Staff Area - Flexible Height */}
        <div className="flex-grow flex justify-center items-center bg-white relative p-2 overflow-x-auto">
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-[2rem]"
              >
                 {wrongNoteMessage ? (
                  <>
                    <XCircle className="text-red-400 w-20 h-20 mb-2 drop-shadow-xl" />
                    <h2 className="text-2xl font-black text-red-400">{wrongNoteMessage}</h2>
                  </>
                 ) : feedback === 'correct' ? (
                   <>
                    <CheckCircle className="text-green-500 w-24 h-24 mb-2 drop-shadow-xl" />
                    <h2 className="text-4xl font-black text-green-500">AWESOME!</h2>
                   </>
                 ) : (
                   <>
                    <XCircle className="text-red-400 w-24 h-24 mb-2 drop-shadow-xl" />
                    <h2 className="text-4xl font-black text-red-400">TRY AGAIN</h2>
                   </>
                 )}
              </motion.div>
            )}
            {levelCompleteMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-[2rem]"
              >
                <CheckCircle className="text-green-500 w-20 h-20 mb-2 drop-shadow-lg" />
                <h2 className="text-2xl font-black text-green-600 text-center px-6">{levelCompleteMessage}</h2>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full">
            {activeQuestion && (
              <Suspense fallback={<div className="py-8">Loading staff...</div>}>
                <MusicStaff
                  clef={currentLevelData.clef}
                  notes={currentLevelData.type === 'melody' ? activeQuestion.notes : [{note: noteToAnswer.note, duration: 'w'}]}
                  highlightedNoteIndex={currentLevelData.type === 'melody' ? currentNoteInMelodyIndex : 0}
                  noteStatuses={currentLevelData.type === 'melody' ? (melodyAnswers[String(currentQ)] || Array(activeQuestion.notes.length).fill(null)) : (feedback === 'correct' || feedback === 'wrong' ? [feedback] : null)}
                />
              </Suspense>
            )}
          </div>
        </div>

        {/* Piano Keys - Compact Bottom Padding */}
        <div className="grid grid-cols-7 gap-1 p-2 bg-gray-100 pb-2">
          {pianoKeys.map((note) => (
            <button
              key={note}
              onClick={() => handleAnswer(note)}
              className="
                h-20 sm:h-28 rounded-b-xl rounded-t-lg
                bg-white border-b-[4px] border-gray-300
                shadow-lg active:border-b-0 active:translate-y-[4px] active:shadow-none
                transition-all flex items-end justify-center pb-2
                text-xl sm:text-2xl font-black text-gray-400 hover:text-indigo-600 hover:bg-gray-50
              "
            >
              {note}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Footer Info - Compact */}
      <div className="mt-2 text-white/70 font-bold text-xs bg-black/10 px-3 py-1 rounded-full">
        {currentLevelData.type === 'melody'
          ? `Level ${level} • Melody ${currentQ + 1} / ${currentLevelData.questions.length}`
          : `Level ${level} • Note ${currentQ + 1} / ${currentLevelData.questions.length}`
        }
      </div>
    </div>
  );
}