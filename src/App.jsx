import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Volume2, Trophy, Zap, Download, Upload, Music, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import MusicStaff from './components/MusicStaff';

// --- DATA: ABRSM GRADE 1 SYLLABUS ---
const LEVEL_1_QUESTIONS = [
  { id: 't-c4', note: "c/4", answer: "C", audio: "C4" },
  { id: 't-d4', note: "d/4", answer: "D", audio: "D4" },
  { id: 't-e4', note: "e/4", answer: "E", audio: "E4" },
  { id: 't-f4', note: "f/4", answer: "F", audio: "F4" },
  { id: 't-g4', note: "g/4", answer: "G", audio: "G4" },
];

const LEVEL_2_QUESTIONS = [
  { id: 't-a4', note: "a/4", answer: "A", audio: "A4" },
  { id: 't-b4', note: "b/4", answer: "B", audio: "B4" },
  { id: 't-c5', note: "c/5", answer: "C", audio: "C5" },
  { id: 't-d5', note: "d/5", answer: "D", audio: "D5" },
];

const LEVEL_DATA = {
  "1": {
    title: "Level 1: Treble Explorer",
    clef: "treble",
    questions: LEVEL_1_QUESTIONS
  },
  "2": {
    title: "Level 2: Treble Practice",
    type: "proficiency",
    clef: "treble",
    questions: LEVEL_1_QUESTIONS
  },
  "3": {
    title: "Level 3: Treble Climber",
    clef: "treble",
    questions: LEVEL_2_QUESTIONS
  },
   "4": {
    title: "Level 4: Combined Practice",
    type: "proficiency",
    clef: "treble",
    questions: [ ...LEVEL_1_QUESTIONS, ...LEVEL_2_QUESTIONS ]
  },
  "5": {
    title: "Level 5: Melodies",
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
  "6": {
    title: "Level 6: Bass Lowlands",
    clef: "bass",
    questions: [
      { id: 'b-e2', note: "e/2", answer: "E", audio: "E2" },
      { id: 'b-f2', note: "f/2", answer: "F", audio: "F2" },
      { id: 'b-g2', note: "g/2", answer: "G", audio: "G2" },
      { id: 'b-a2', note: "a/2", answer: "A", audio: "A2" },
      { id: 'b-b2', note: "b/2", answer: "B", audio: "B2" },
    ]
  },
  "7": {
    title: "Level 7: Bass Summit",
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
  }
};
const LEVEL_ORDER = ["1", "2", "3", "4", "5", "6", "7"];

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
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [isDevMode, setIsDevMode] = useState(false);

  const [warmupQueue, setWarmupQueue] = useState([]);
  const [warmupIndex, setWarmupIndex] = useState(0);

  const fileInputRef = useRef(null);
  const synth = useRef(new Tone.PolySynth(Tone.Synth).toDestination());
  const errorSynth = useRef(new Tone.MembraneSynth().toDestination());

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dev') === 'true') {
      setIsDevMode(true);
      console.log("Developer mode enabled. You can now jump to any level.");
    }
  }, []);

  const checkProficiency = (level, currentProficiency) => {
    const targetQuestionIds = new Set(level.questions.map(q => q.id));
    for (const id of targetQuestionIds) {
      const stats = currentProficiency[id];
      if (!stats || stats.attempts === 0) return false;
      if ((stats.correct / stats.attempts) < 0.80 || stats.correct < 5) return false;
    }
    return true; // All notes mastered
  };

  const advanceToNextLevel = () => {
    const currentLevelIndex = LEVEL_ORDER.indexOf(level);
    const nextLevelKey = LEVEL_ORDER[currentLevelIndex + 1];

    if (nextLevelKey) {
      setLevel(nextLevelKey);
      setCurrentQ(0);
      setCurrentNoteInMelodyIndex(0);
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

  // --- GAME LOGIC ---
  const startWarmup = async (savedLevel, savedQ) => {
    await Tone.start();
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
      setFeedback('correct');
      playNote(activeQ.audio);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      const delay = 1200;

      if (gameState === 'warmup') {
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

      // --- Correct Answer Logic Per Level Type ---
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

      setTimeout(() => {
        setFeedback(null);
        if (levelType === 'proficiency') {
          if (checkProficiency(currentLevelData, proficiency)) {
            advanceToNextLevel();
          } else {
            getNextProficiencyQuestion();
          }
        } else if (levelType === 'melody') {
          const melody = currentLevelData.questions[currentQ];
          if (currentNoteInMelodyIndex + 1 < melody.notes.length) {
            setCurrentNoteInMelodyIndex(i => i + 1);
          } else {
            if (currentQ + 1 < currentLevelData.questions.length) {
              setCurrentQ(q => q + 1);
              setCurrentNoteInMelodyIndex(0);
            } else {
              advanceToNextLevel();
            }
          }
        } else {
          // Standard level
          if (currentQ + 1 < currentLevelData.questions.length) {
            setCurrentQ(q => q + 1);
          } else {
            advanceToNextLevel();
          }
        }
      }, delay);

    } else {
      // --- WRONG ANSWER ---
      setFeedback('wrong');
      errorSynth.current.triggerAttackRelease("C2", "8n");
      setStreak(0);

      if (levelType === 'proficiency') {
          // Add the note to the priority queue twice to increase its frequency
          setPriorityQueue(prev => [...prev, activeQ.id, activeQ.id]);
      }

      setTimeout(() => {
        setFeedback(null);
        if (levelType === 'proficiency') {
           getNextProficiencyQuestion();
        }
        if(levelType === 'melody'){
            setCurrentNoteInMelodyIndex(0);
        }
      }, 1000);
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
  const currentLevelData = LEVEL_DATA[level];
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

  const noteToAnswer = (() => {
     if (!activeQuestion || gameState === 'welcome' || gameState === 'victory') return null;
     if (gameState === 'warmup') return activeQuestion;
     if (currentLevelData.type === 'melody') {
       return activeQuestion.notes[currentNoteInMelodyIndex];
     }
     return activeQuestion;
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
            <button onClick={() => { Tone.start(); setLevel('1'); setCurrentQ(0); setScore(0); setStreak(0); setProficiency({}); setCurrentNoteInMelodyIndex(0); setPriorityQueue([]); setGameState('playing'); }} className="w-full bg-green-400 hover:bg-green-300 text-white text-xl font-black py-4 px-6 rounded-2xl shadow-[0_6px_0_rgb(21,128,61)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-2">
              <Play size={28} fill="currentColor" /> NEW GAME
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            <button onClick={() => fileInputRef.current.click()} className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-500 text-xl font-black py-4 px-6 rounded-2xl shadow-[0_6px_0_rgb(165,180,252)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-2">
              <Upload size={28} /> LOAD SAVE
            </button>
          </div>
          {isDevMode && (
            <div className="mt-6 p-4 bg-indigo-100 rounded-2xl border-2 border-indigo-200">
              <h3 className="font-bold text-indigo-700 text-lg">DEV MODE: Jump to Level</h3>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {LEVEL_ORDER.map(levelId => (
                  <button key={levelId} onClick={() => {
                    Tone.start();
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
            onClick={() => playNote(noteToAnswer.audio)}
            className="p-2 bg-white rounded-full hover:scale-110 shadow-md transition-transform"
          >
            <Volume2 className={gameState === 'warmup' ? "text-orange-500" : "text-indigo-500"} size={20} />
          </button>
        </div>

        {/* Music Staff Area - Flexible Height */}
        <div className="flex-grow flex justify-center items-center bg-white relative p-2 overflow-hidden">
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-[2rem]"
              >
                {feedback === 'correct' ? (
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
          </AnimatePresence>

          <div className="scale-90 sm:scale-100 origin-center">
            {activeQuestion && <MusicStaff
               clef={currentLevelData.clef}
               notes={currentLevelData.type === 'melody' ? activeQuestion.notes : [{note: noteToAnswer.note, duration: 'w'}]}
               highlightedNoteIndex={currentLevelData.type === 'melody' ? currentNoteInMelodyIndex : 0}
            />}
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