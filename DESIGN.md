# 3-Screen Swipe Interface Design

## Screen Layout
```
     ←───────────── Swipe ─────────────→
     
[Add Content]  ←→  [Review]  ←→  [Knowledge Graph]
    Screen 1       Screen 2        Screen 3 (P1)
                  (Default/Home)

    ● ○ ○           ○ ● ○           ○ ○ ●
  Page indicator showing current screen
```

## Navigation Behavior
- App opens to Screen 2 (Review) - the primary action
- Swipe right → Knowledge Graph (P1 - coming soon state)
- Swipe left → Add Content
- Page dots at bottom show which screen you're on
- Smooth transitions with spring physics

## Screen 1: Add Content
```
┌─────────────────────┐
│    Add Content      │
│                     │
│  ┌───────────────┐  │
│  │ Paste URL or  │  │
│  │ enter text... │  │
│  └───────────────┘  │
│                     │
│  [Auto-detect URL]  │
│                     │
│  Recent adds:       │
│  • Binary Search    │
│  • React Hooks      │
│                     │
│      ● ○ ○          │
└─────────────────────┘
```

## Screen 2: Review (Home/Default)

### State A: Cards Due
```
┌─────────────────────┐
│  Review      [Show  │
│             All/Due]│
│        📚           │
│                     │
│ ┌─── Ready to ───┐  │
│ │  Review: 12     │  │
│ │ cards due       │  │
│ │                 │  │
│ │ [Start Review]  │ ← │  Swipe hints
│ └─────────────────┘  │
│                     │
│ ┌─ Review Topics ─┐  │
│ │ Biology: 5 cards │  │
│ │ Physics: 4 cards │  │
│ │ Spanish: 3 cards │  │
│ └─────────────────┘  │
│                     │
│ Next: 2:30 PM       │
│      ○ ● ○          │
└─────────────────────┘
```

### State B: All Caught Up
```
┌─────────────────────┐
│  Review      [Show  │
│             Cards]  │
│        ✨           │
│                     │
│     All done!       │
│                     │
│ You've completed    │
│ all reviews. Great  │
│ work staying        │
│ consistent!         │
│                     │
│ ┌─ Next Review ───┐  │
│ │    2:30 PM      │ ← │
│ │ 3 cards from    │  │
│ │ Biology ready   │  │
│ └─────────────────┘  │
│                     │
│ ┌─ Study Streak ──┐  │
│ │ 🔥 7 days       │  │
│ │ ████████░░░     │  │
│ │ Keep it up!     │  │
│ └─────────────────┘  │
│                     │
│ 💡 Consider adding  │
│    more materials   │
│      ○ ● ○          │
└─────────────────────┘
```

## Screen 3: Knowledge Graph (P1)

### Initial State
```
┌─────────────────────┐
│  Knowledge Graph    │
│                     │
│        🧠           │
│                     │
│   Coming Soon!      │
│                     │
│ We're building an   │
│ interactive graph   │
│ that will show      │
│ connections between │
│ your learning       │
│ materials.          │
│                     │
│ Preview features:   │
│ • Visual topic      │
│   connections       │
│ • Learning path     │
│   suggestions       │
│ • Knowledge gap     │
│   identification    │
│                     │
│ 📊 For now, focus   │
│    on building your │
│    knowledge through│
│    regular reviews! │
│                     │
│      ○ ○ ●          │
└─────────────────────┘
```

## Review Flow (Modal Over Screen 2)

### State 1: Question Display
```
┌─────────────────────┐
│ Question 1/12    ✕  │  ← Exit button
│ ████░░░░░░░░░░░░     │  ← Progress bar
│                     │
│ Biology - Plant     │  ← Context name
│ Processes           │
│                     │
│ What is the primary │
│ function of         │
│ photosynthesis in   │
│ plants?             │
│                     │
│       🎤            │
│ Tap the microphone  │
│ to record your      │
│ answer              │
└─────────────────────┘
```

### State 2: Recording
```
┌─────────────────────┐
│ Question 1/12    ✕  │
│ ████░░░░░░░░░░░░     │
│                     │
│ Biology - Plant     │
│ Processes           │
│                     │
│ What is the primary │
│ function of         │
│ photosynthesis in   │
│ plants?             │
│                     │
│       🔴            │  ← Red recording dot
│     ••• •••         │  ← Pulsing animation
│ Recording...        │
│ Tap to stop         │
└─────────────────────┘
```

### State 3: Processing
```
┌─────────────────────┐
│ Question 1/12    ✕  │
│ ████░░░░░░░░░░░░     │
│                     │
│                     │
│                     │
│   Processing...     │
│     ⚪ ⚪ ⚪         │  ← Loading animation
│                     │
│ Transcribing and    │
│ evaluating your     │
│ answer...           │
│                     │
│                     │
└─────────────────────┘
```

### State 4: Feedback
```
┌─────────────────────┐
│ Question 1/12    ✕  │
│ ████░░░░░░░░░░░░     │
│                     │
│    ✓ Good (3)       │  ← Score badge
│                     │
│ Good answer! You    │
│ correctly identified│
│ that photosynthesis │
│ converts light      │
│ energy into chemical│
│ energy (glucose).   │
│ You also mentioned  │
│ chlorophyll and     │
│ oxygen production,  │
│ showing solid       │
│ understanding.      │
│                     │
│  [Next Question →]  │
└─────────────────────┘
```

### State 5: Session Complete
```
┌─────────────────────┐
│ Question 12/12   ✕  │
│ ████████████████    │  ← Full progress
│                     │
│    ✓ Okay (2)       │
│                     │
│ Your explanation    │
│ captured the key    │
│ concept but could   │
│ improve by          │
│ mentioning quantum  │
│ measurement effects.│
│                     │
│                     │
│                     │
│                     │
│  [Finish Review]    │
└─────────────────────┘
```

## Voice Review Technical Flow
1. Display question with mic button
2. User taps mic → Start recording (browser MediaRecorder API)
3. User speaks answer → Tap to stop
4. Convert audio to base64 string
5. Send to `question.evaluateAnswer` tRPC mutation
6. Backend: Transcribe with OpenAI Whisper
7. Backend: Evaluate with Google Gemini
8. Backend: Auto-update FSRS via `question.review`
9. Return feedback + score to client
10. Show feedback → User taps Next

## New API Required

### `question.evaluateAnswer` (tRPC Mutation)
**Input:**
```typescript
{
  questionId: number,
  audioData: string  // base64 encoded audio
}
```

**Output:**
```typescript
{
  transcription: string,  // What user said
  feedback: string,       // AI evaluation
  score: number,         // 1-4 FSRS rating
  nextDue: Date          // Next review date
}
```

**Why REST/tRPC works:**
- Recording is complete before sending (not streaming)
- Audio files are small (~100-500KB for 5-30 seconds)
- Simple request/response pattern
- No need for WebSocket complexity

## Implementation Details

### Color Palette (Claude-Inspired)
- **Background**: #FAFAF8 (Warm off-white)
- **Surface**: #FFFFFF (Pure white for cards)
- **Primary**: #D97757 (Soft terracotta - accent)
- **Text Primary**: #2D2D2D (Soft black)
- **Text Secondary**: #6B6B6B (Muted gray)
- **Border**: #E5E5E2 (Light warm gray)
- **Success**: #589B7C (Muted green)
- **Recording**: #D97757 (Warm accent for mic)
- **Shadow**: rgba(0,0,0,0.06) (Very subtle)

### Typography
- **Font**: Inter or system sans-serif
- **Weights**: 400 (regular), 500 (medium), 600 (semibold)
- **Sizes**: 14px (small), 16px (body), 20px (title), 24px (header)
- **Line Height**: 1.5 for body text
- **Letter Spacing**: -0.01em for headers

### Swipe Mechanics
- Use framer-motion with drag and dragConstraints
- Snap points at 0%, 100%, 200% screen width
- Velocity-based transitions
- Rubber band effect at edges

### Visual Indicators
- Page dots animate on swipe
- Subtle shadows on screen edges hint at more content
- Optional: Small preview of adjacent screens at edges

### State Management
- Current screen index in React state
- Persist last viewed screen in localStorage
- Always open to Review screen on fresh launch

### Mobile-First Interactions
- Large touch targets (minimum 48px)
- Swipe gestures for navigation
- Single thumb operation
- No typing required (paste URLs)
- Clear visual feedback