# Desktop Design - Claude-Inspired Learning Interface

## Overview
A calm, focused desktop experience inspired by Claude AI's conversational interface, optimized for spaced repetition learning. The design prioritizes clarity, reduces cognitive load, and makes reviewing feel as natural as having a conversation.

## Layout Structure

### Navigation-Based Layout (Hybrid Approach)
```
┌──────────────────────────────────────────────────────────────┐
│  Total Recall     [Home] [Library] [Stats] [Graph]    👤 ⚙️  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     Main Content Area                        │
│                    (Content changes based                    │
│                     on navigation selection)                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Navigation Items:**
- **Home** (default) - Review dashboard focused on studying
- **Library** - Context management and organization  
- **Stats** - Analytics and progress tracking
- **Graph** - Knowledge visualization (future feature)

## States & Flows

### 1. Home - Review Dashboard (Default View)

```
┌─────────────────────────────────────────────────────┐
│              Welcome back!                          │
│                                                     │
│      📚 You have 12 cards ready for review         │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │        Start Review (12 cards)             │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  Quick Stats                                        │
│  ────────────                                       │
│  🔥 7 day streak                                   │
│  📊 89% retention rate                             │
│  ⏰ Next review in 2 hours (3 cards)               │
│                                                     │
│  Recent Activity                                    │
│  ────────────────                                   │
│  • Biology: 5 cards reviewed 2 hours ago           │
│  • Spanish: 8 cards reviewed yesterday             │
│  • Physics: 3 new cards added today                │
│                                                     │
│  [Filter Review] [Add Context]                      │
└─────────────────────────────────────────────────────┘
```

**Filter Review Option:**
Clicking "Filter Review" opens a modal to select specific contexts to review.

### 2. Library - Context Management View

```
┌─────────────────────────────────────────────────────┐
│  My Learning Library                                │
│  ────────────────────                               │
│                                                     │
│  [+ Add Context]  🔍 Search...  Sort: Due ▼        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Name              Questions  Due  Retention  │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 🧬 Biology         45        12   85%       │   │
│  │    Photosynthesis, Cell structure...        │   │
│  │                                [Review] [...] │   │
│  ├─────────────────────────────────────────────┤   │
│  │ ⚛️ Physics          32        8    92%       │   │
│  │    Quantum mechanics, Thermodynamics...     │   │
│  │                                [Review] [...] │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 🇪🇸 Spanish         28        0    78%       │   │
│  │    Vocabulary, Grammar, Conversations...    │   │
│  │                                [Review] [...] │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 🔢 Mathematics     15        3    95%       │   │
│  │    Calculus, Linear algebra...              │   │
│  │                                [Review] [...] │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Actions Menu (...) includes:**
- View Questions
- Edit Context
- Regenerate Questions  
- Delete Context

### 3. Review Session - Question Display (Modal Overlay)

```
╔═════════════════════════════════════════════════════╗
║                                                     ║
║  Review Session                3 of 12  Exit Skip  ║
║  ━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░              25%  ║
║                                                     ║
║  Biology › Photosynthesis                          ║
║  ─────────────────────────────────────             ║
║                                                     ║
║  What is the primary function of chlorophyll       ║
║  in the photosynthesis process?                    ║
║                                                     ║
║                                                     ║
║                                                     ║
║  ┌─────────────────────────────────────────────┐   ║
║  │                                             │   ║
║  │  Type your answer here...                   │   ║
║  │                                             │   ║
║  └─────────────────────────────────────────────┘   ║
║                                    [Submit] or ↵   ║
║                                                     ║
║  Keyboard: Enter to submit, → to skip              ║
║                                                     ║
╚═════════════════════════════════════════════════════╝

       (Background content is dimmed/blurred)
```

### 4. Review Session - Correct Answer Feedback (Modal Overlay)

```
╔═════════════════════════════════════════════════════╗
║  Review Session                    3 of 12   Exit  ║
║  ━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░              25%  ║
│                                                     │
║  ✅ Correct!                                       ║
║  ─────────────────────────────────────             ║
║                                                     ║
║  Excellent! You correctly identified that          ║
║  chlorophyll absorbs light energy and converts     ║
║  it into chemical energy. You also mentioned       ║
║  its green color, which shows good understanding   ║
║  of light absorption properties.                   ║
║                                                     ║
║  Next review: In 4 days                            ║
║                                                     ║
║                           [Continue →] or Space    ║
╚═════════════════════════════════════════════════════╝
```

### 5. Review Session - Incorrect Answer Feedback (Modal Overlay)

```
╔═════════════════════════════════════════════════════╗
║  Review Session                    3 of 12   Exit  ║
║  ━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░              25%  ║
│                                                     │
║  ⚠️ Not quite right                                ║
║  ─────────────────────────────────────             ║
║                                                     ║
║  Your answer:                                      ║
║  "Chlorophyll helps plants make food"              ║
║                                                     ║
║  Why it's incomplete:                              ║
║  While you touched on the concept, you missed      ║
║  the key detail about converting light energy      ║
║  into chemical energy (ATP and NADPH).             ║
║                                                     ║
║  [View Correct Answer]                             ║
║                                                     ║
║  Next review: Tomorrow                             ║
║                                                     ║
║                           [Continue →] or Space    ║
╚═════════════════════════════════════════════════════╝
```

### 6. Review Session - Showing Correct Answer (Modal Overlay)

```
╔═════════════════════════════════════════════════════╗
║  Review Session                    3 of 12   Exit  ║
║  ━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░              25%  ║
│                                                     │
║  ⚠️ Not quite right                                ║
║  ─────────────────────────────────────             ║
║                                                     ║
║  Your answer:                                      ║
║  "Chlorophyll helps plants make food"              ║
║                                                     ║
║  Correct answer:                                   ║
║  "Chlorophyll absorbs light energy (mainly red     ║
║  and blue wavelengths) and converts it into        ║
║  chemical energy in the form of ATP and NADPH,     ║
║  which are used in the Calvin cycle to produce     ║
║  glucose."                                         ║
║                                                     ║
║  Why the difference matters:                       ║
║  Specificity about energy conversion (light →      ║
║  chemical) and the molecules involved (ATP,        ║
║  NADPH) demonstrates deeper understanding.         ║
║                                                     ║
║                           [Continue →] or Space    ║
╚═════════════════════════════════════════════════════╝
```

### 7. Session Complete (Modal Overlay)

```
╔═════════════════════════════════════════════════════╗
║  Session Complete! 🎉                              ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━           100%   ║
│                                                     │
║  Great work! You've completed 12 cards.            ║
║                                                     ║
║  Session Summary:                                  ║
║  ─────────────────────────────                     ║
║  • Correct: 9 cards (75%)                         ║
║  • Incorrect: 3 cards (25%)                       ║
║  • Average difficulty: Medium                      ║
║  • Time spent: 8 minutes                          ║
║                                                     ║
║  Next cards due:                                   ║
║  • 2 cards in 3 hours                             ║
║  • 5 cards tomorrow                               ║
║  • 8 cards in 3 days                              ║
║                                                     ║
║  [Back to Home]  [Review Mistakes]                 ║
╚═════════════════════════════════════════════════════╝
```

## Additional Views

### 3. Stats - Analytics Dashboard

```
┌─────────────────────────────────────────────────────┐
│  Learning Analytics                                │
│  ──────────────────                               │
│                                                     │
│  Overview                     Last 30 days ▼       │
│  ────────                                        │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │ 🔥 7     │  │ 📊 89%   │  │ 📚 523   │   │
│  │ Streak   │  │ Retention │  │ Reviewed  │   │
│  └───────────┘  └───────────┘  └───────────┘   │
│                                                     │
│  Daily Reviews                                      │
│  ─────────────                                    │
│  [Chart showing daily review counts]               │
│                                                     │
│  Performance by Context                             │
│  ────────────────────                             │
│  Biology:    ████████████████░░░░  85%             │
│  Physics:    ██████████████████░░  92%             │
│  Spanish:    ███████████████░░░░░  78%             │
│  Math:       ███████████████████░  95%             │
└─────────────────────────────────────────────────────┘
```

### 4. Graph - Knowledge Visualization (Future)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              🌐 Knowledge Graph                     │
│                                                     │
│                  Coming Soon                        │
│                                                     │
│     This feature will visualize connections        │
│     between your learning topics and show          │
│     knowledge dependencies.                        │
│                                                     │
│              [Notify When Available]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Adding Content Flow

### Add Context Modal
```
┌─────────────────────────────────────────────────────┐
│  Add Learning Content                          ✕   │
│  ─────────────────────────────────────────         │
│                                                     │
│  Name your content:                                │
│  ┌─────────────────────────────────────────────┐   │
│  │ Photosynthesis Overview                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Add from:                                         │
│  ○ URL   ● Text                                    │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Photosynthesis is the process by which      │   │
│  │ plants convert light energy into chemical   │   │
│  │ energy. The process occurs in chloroplasts  │   │
│  │ and involves two main stages...             │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│         [Cancel]  [Add & Generate Questions]       │
│                                                     │
│  ℹ️ AI will automatically generate flashcards      │
└─────────────────────────────────────────────────────┘
```

## Filter Review Modal

```
┌─────────────────────────────────────────────────────┐
│  Select Contexts to Review                     ✕   │
│  ─────────────────────────                        │
│                                                     │
│  ☑ 🧬 Biology (5 cards due)                      │
│  ☐ ⚛️ Physics (3 cards due)                       │
│  ☑ 🇪🇸 Spanish (4 cards due)                      │
│  ☐ 🔢 Math (0 cards due)                          │
│                                                     │
│  Total: 9 cards selected                           │
│                                                     │
│         [Cancel]  [Start Review →]                 │
└─────────────────────────────────────────────────────┘
```

## Empty States

### First Time User
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│               Welcome to Total Recall!              │
│                      📚                            │
│                                                     │
│     Your AI-powered spaced repetition companion    │
│                                                     │
│  Get started by adding your first learning         │
│  content. I'll automatically create flashcards     │
│  and schedule reviews using scientifically-proven  │
│  spaced repetition.                                │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ 🔗 Add from URL                          │      │
│  │ Paste any article or webpage             │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ 📝 Add from Text                         │      │
│  │ Type or paste your notes                 │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
│  ┌──────────────────────────────────────────┐      │
│  │ 🎯 Try Sample Content                    │      │
│  │ Load example biology flashcards          │      │
│  └──────────────────────────────────────────┘      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### No Cards Due
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ✨ All caught up!                      │
│                                                     │
│         You've completed all reviews.              │
│         Great work staying consistent!             │
│                                                     │
│  Next review session:                              │
│  Tomorrow at 9:00 AM (5 cards)                     │
│                                                     │
│  While you wait:                                   │
│  • Add new content to learn                        │
│  • Review your progress stats                      │
│  • Browse your knowledge library                   │
│                                                     │
│  [Add Content]  [View Stats]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Filtering & Selection

### Review with Filters
```
┌─────────────────────────────────────────────────────┐
│  Start Filtered Review                             │
│  ─────────────────────────────────────             │
│                                                     │
│  Review cards from:                                │
│  ☑ Biology (5 cards due)                          │
│  ☐ Physics (3 cards due)                          │
│  ☑ Spanish (4 cards due)                          │
│  ☐ Math (0 cards due)                             │
│                                                     │
│  Total: 9 cards selected                           │
│                                                     │
│         [Cancel]  [Start Review →]                 │
└─────────────────────────────────────────────────────┘
```

## Keyboard Shortcuts

### Global
- `Cmd/Ctrl + K` - Command palette
- `Cmd/Ctrl + N` - Add context
- `R` - Start review (when cards due)
- `?` - Show keyboard shortcuts

### During Review
- `Enter` - Submit answer
- `Space` - Continue to next card
- `→` or `S` - Skip current card
- `Cmd/Ctrl + Enter` - Force submit
- `Escape` - Pause session

### Navigation
- `J` - Next item in list
- `K` - Previous item in list
- `Cmd/Ctrl + 1-9` - Jump to context

## Visual Design System

### Colors (Claude-Inspired)
```css
--background: #FAFAF8;      /* Warm off-white */
--surface: #FFFFFF;         /* Pure white */
--surface-hover: #F9F9F8;   /* Subtle hover */
--border: #E5E5E2;          /* Light warm gray */
--border-subtle: #F0F0ED;   /* Very light border */

--text-primary: #2D2D2D;    /* Soft black */
--text-secondary: #6B6B6B;  /* Muted gray */
--text-tertiary: #9B9B98;   /* Light gray */

--accent: #D97757;          /* Warm terracotta */
--accent-hover: #C4604A;    /* Darker terracotta */
--accent-light: #FFF4F0;    /* Light peach background */

--success: #589B7C;         /* Muted green */
--warning: #D4A574;         /* Warm yellow */
--error: #C87A7A;           /* Soft red */

--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 6px rgba(0,0,0,0.06);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.08);
```

### Typography
```css
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;

--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Spacing
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

## Component Specifications

### Buttons
- Primary: Filled accent color, white text
- Secondary: Border only, accent text
- Hover: Slight darken, subtle shadow
- Disabled: 50% opacity
- Min height: 40px
- Padding: 12px 20px
- Border radius: 8px

### Cards
- Background: White
- Border: 1px solid var(--border-subtle)
- Border radius: 12px
- Padding: 20px
- Shadow: var(--shadow-sm)
- Hover shadow: var(--shadow-md)

### Input Fields
- Height: 44px
- Border: 1px solid var(--border)
- Focus border: var(--accent)
- Border radius: 8px
- Padding: 12px 16px
- Font size: 16px

### Progress Bars
- Height: 4px
- Background: var(--border-subtle)
- Fill: var(--accent)
- Border radius: 2px
- Smooth animation on change

## Responsive Behavior

### Breakpoints
- Desktop: 1280px+ (full layout)
- Laptop: 1024px-1279px (slightly narrower sidebar)
- Tablet: 768px-1023px (collapsible sidebar)
- Mobile: <768px (use mobile design from DESIGN.md)

### Sidebar Behavior
- Desktop: Always visible, 300px width
- Laptop: Visible, 250px width
- Tablet: Collapsible, overlay when open
- Mobile: Hidden, use mobile navigation

## Animations & Transitions

### Page Transitions
- Fade in: 200ms ease-out
- Slide: 300ms ease-in-out
- No jarring movements
- Respect prefers-reduced-motion

### Micro-interactions
- Button hover: 150ms ease
- Card hover: 200ms ease
- Progress bar: 500ms ease-out
- Loading states: Subtle pulse

## Future Enhancements (TBD)

### Context Details Dialog
- Show original content
- List all questions
- Edit individual questions
- Regenerate questions
- View statistics
- Add manual questions

### Knowledge Graph View
- Visual connections between topics
- Learning path suggestions
- Knowledge gap identification
- Progress visualization

### Advanced Features
- Bulk operations
- Import/Export
- Collaboration
- Mobile sync
- Offline mode
- Custom FSRS parameters

## Implementation Notes

### State Management
- Review session state in React Context
- Selected contexts in local state
- Persist filters in localStorage
- Sync with database on changes

### Performance
- Virtualize long lists
- Lazy load context contents
- Debounce search input
- Optimistic UI updates
- Preload next question

### Accessibility
- Full keyboard navigation
- ARIA labels and roles
- Focus management
- Screen reader support
- High contrast mode support

## Design Principles

1. **Calm Technology**: Never overwhelm, always guide gently
2. **Progressive Disclosure**: Show complexity only when needed
3. **Conversational**: Feel like chatting with a knowledgeable friend
4. **Focused**: One primary action at a time
5. **Forgiving**: Easy to recover from mistakes
6. **Delightful**: Small moments of joy without being gamified