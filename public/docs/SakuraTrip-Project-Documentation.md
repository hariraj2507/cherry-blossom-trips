# SakuraTrip - Digital Nomad Travel Planner
## Complete Project Documentation

---

## 📋 Executive Summary

**SakuraTrip** is an AI-powered travel planning application designed specifically for digital nomads. It combines intelligent trip recommendations with a comprehensive workspace directory, helping remote workers plan trips while ensuring they have access to reliable work environments.

### Key Features
- 🤖 **AI Trip Planner** - Personalized travel recommendations using Google Gemini
- 🏢 **Workspace Directory** - 100+ verified nomad-friendly workspaces globally
- 💰 **Budget Analysis** - Real-time budget feasibility and cost estimates
- ✈️ **Flight Information** - Estimated prices, airlines, and booking tips
- 📍 **Nearby Destinations** - Day trip suggestions within 100km radius
- 🌸 **Cherry Blossom Theme** - Unique Sakura-inspired design system

---

## 🏗️ Technical Architecture

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | Latest | Type Safety |
| Tailwind CSS | 3.x | Styling |
| Vite | Latest | Build Tool |
| React Router | 6.30.1 | Navigation |
| TanStack Query | 5.83.0 | Data Fetching |
| Recharts | 2.15.4 | Data Visualization |
| Framer Motion | Via shadcn | Animations |

### Backend Infrastructure (Lovable Cloud)

| Component | Technology | Purpose |
|-----------|------------|---------|
| Database | PostgreSQL | Data Persistence |
| Authentication | Supabase Auth | User Management |
| Edge Functions | Deno Runtime | AI Processing |
| Storage | Supabase Storage | File Management |
| Real-time | Supabase Realtime | Live Updates |

### AI Engine

| Model | Provider | Use Case |
|-------|----------|----------|
| Gemini 2.5 Flash | Google | Travel Recommendations |
| Image Generation | Unsplash API | Attraction Imagery |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ... (50+ components)
│   ├── TripPlannerForm.tsx    # Main AI trip planning form
│   ├── RecommendationsDisplay.tsx  # Trip results display
│   ├── BudgetTracker.tsx      # Budget management
│   ├── BudgetAnalysisCard.tsx # Cost analysis visualization
│   ├── WorkspaceDirectory.tsx # Workspace search & filters
│   ├── WorkspaceCard.tsx      # Individual workspace display
│   ├── WorkspaceFilters.tsx   # Filter controls
│   ├── WorkspaceSuggestionForm.tsx  # User workspace submissions
│   ├── CherryBlossomTree.tsx  # Animated SVG decorations
│   ├── HeroSection.tsx        # Landing page hero
│   ├── Navigation.tsx         # App navigation
│   └── NavLink.tsx            # Navigation links
├── pages/
│   ├── Index.tsx              # Main application page
│   └── NotFound.tsx           # 404 error page
├── hooks/
│   ├── use-toast.ts           # Toast notifications
│   └── use-mobile.tsx         # Mobile detection
├── integrations/
│   └── supabase/
│       ├── client.ts          # Supabase client (auto-generated)
│       └── types.ts           # Database types (auto-generated)
├── lib/
│   └── utils.ts               # Utility functions
├── index.css                  # Global styles & design tokens
├── App.tsx                    # Root component
└── main.tsx                   # Entry point

supabase/
├── config.toml                # Supabase configuration
└── functions/
    └── travel-recommendations/
        └── index.ts           # AI recommendation edge function
```

---

## 🗄️ Database Schema

### Tables Overview

```
┌─────────────────────┐     ┌─────────────────────┐
│       trips         │     │    trip_expenses    │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │────<│ trip_id (FK)        │
│ user_id             │     │ id (PK)             │
│ destination         │     │ amount              │
│ start_date          │     │ category            │
│ end_date            │     │ description         │
│ total_budget        │     │ date                │
│ currency            │     │ created_at          │
│ ai_recommendations  │     └─────────────────────┘
│ budget_feasibility  │
│ status              │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│     workspaces      │────<│  workspace_reviews  │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │     │ id (PK)             │
│ name                │     │ workspace_id (FK)   │
│ city, country       │     │ user_id             │
│ region              │     │ rating              │
│ description         │     │ wifi_rating         │
│ wifi_quality        │     │ noise_rating        │
│ wifi_speed_mbps     │     │ comment             │
│ noise_level         │     │ created_at          │
│ has_power_outlets   │     └─────────────────────┘
│ has_quiet_zones     │
│ hours_open/close    │     ┌─────────────────────┐
│ amenities[]         │     │ workspace_suggestions│
│ image_url           │     ├─────────────────────┤
│ website_url         │     │ id (PK)             │
│ latitude, longitude │     │ name, city, country │
│ average_rating      │     │ user_id             │
│ review_count        │     │ description         │
│ created_at          │     │ wifi_speed_estimate │
│ updated_at          │     │ noise_level_estimate│
└─────────────────────┘     │ has_power_outlets   │
                            │ status              │
┌─────────────────────┐     │ created_at          │
│   user_favorites    │     └─────────────────────┘
├─────────────────────┤
│ id (PK)             │
│ user_id             │
│ workspace_id (FK)   │
│ trip_id (FK)        │
│ created_at          │
└─────────────────────┘
```

### Row-Level Security (RLS)

All tables are protected with RLS policies:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| trips | Own only | Own only | Own only | Own only |
| trip_expenses | Own trips | Own trips | Own trips | Own trips |
| workspaces | Public | Admin only | Admin only | Admin only |
| workspace_reviews | Public | Authenticated | Own only | Own only |
| workspace_suggestions | Own/null | Public | — | — |
| user_favorites | Own only | Own only | — | Own only |

---

## 🧩 Component Details

### 1. TripPlannerForm (`src/components/TripPlannerForm.tsx`)

**Purpose:** Main form for collecting travel preferences and triggering AI recommendations.

**Features:**
- Traveler name input
- Origin and destination selection
- Date range picker
- Budget input with currency selection (USD, EUR, GBP, INR, JPY)
- Traveler count
- Interest tags (Culture, Food, Adventure, Nature, etc.)
- **Easter Egg:** Special popup for "Cuddalore" destination

**State Management:**
```typescript
const [formData, setFormData] = useState({
  travelerName: '',
  fromLocation: '',
  destination: '',
  startDate: '',
  endDate: '',
  budget: '',
  currency: 'USD',
  travelers: '1',
  interests: [] as string[],
});
```

### 2. RecommendationsDisplay (`src/components/RecommendationsDisplay.tsx`)

**Purpose:** Displays AI-generated travel recommendations in an organized, tabbed interface.

**Tabs:**
- ✈️ **Flights** - Price estimates, airlines, booking tips
- 📅 **Itinerary** - Day-by-day activity suggestions
- 📍 **Nearby Spots** - Day trip destinations within 100km

### 3. WorkspaceDirectory (`src/components/WorkspaceDirectory.tsx`)

**Purpose:** Searchable directory of 100+ nomad-friendly workspaces.

**Features:**
- Text search (name, city, country, region)
- WiFi quality filter (Excellent, Good, Moderate)
- Noise level filter (Silent, Quiet, Moderate, Noisy)
- Power outlets filter
- Quiet zones filter
- Grouped display by country

### 4. CherryBlossomTree (`src/components/CherryBlossomTree.tsx`)

**Purpose:** Animated SVG cherry blossom tree for visual appeal.

**Animation Features:**
- Falling petals with randomized paths
- Gentle branch swaying
- CSS keyframe animations

---

## 🎨 Design System

### Sakura Color Palette

```css
:root {
  /* Primary - Cherry Blossom Pink */
  --primary: 350 90% 72%;           /* #F9A8C4 */
  --primary-foreground: 350 10% 10%;
  
  /* Background - Soft Cream */
  --background: 40 30% 96%;         /* #FBF9F5 */
  --foreground: 350 10% 15%;
  
  /* Accent Colors */
  --sakura-light: 350 100% 95%;     /* #FFF0F5 */
  --sakura-accent: 45 100% 70%;     /* #FFD54F - Gold */
  
  /* Semantic Colors */
  --card: 40 25% 98%;
  --muted: 40 15% 85%;
  --destructive: 0 85% 60%;
}
```

### Typography

```css
/* Heading Font - Minecraft Style */
@import '@fontsource/press-start-2p';
font-family: 'Press Start 2P', monospace;

/* Body Font - System Stack */
font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

### Component Variants

```typescript
// Button variants
variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "sakura"

// Input variants  
variant: "default" | "sakura"

// Card variants
variant: "default" | "sakura"
```

---

## ⚡ Edge Function: travel-recommendations

**Location:** `supabase/functions/travel-recommendations/index.ts`

### Request Schema

```typescript
interface TravelRequest {
  travelerName?: string;
  fromLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  travelers: number;
  interests: string[];
}
```

### Response Schema

```typescript
interface TravelResponse {
  success: boolean;
  recommendations: {
    budgetAnalysis: {
      feasibility: "comfortable" | "moderate" | "tight" | "insufficient";
      estimatedTotal: number;
      breakdown: {
        flights: number;
        accommodation: number;
        food: number;
        activities: number;
        transportation: number;
        miscellaneous: number;
      };
    };
    flights: {
      estimatedPrice: number;
      airlines: string[];
      tips: string[];
    };
    itinerary: Array<{
      day: number;
      title: string;
      activities: Array<{
        time: string;
        activity: string;
        location: string;
        cost: number;
        photoId: string;  // Unsplash photo ID
      }>;
    }>;
    nearbyDestinations: Array<{
      name: string;
      distance: string;
      description: string;
      suggestedDuration: string;
      photoId: string;
    }>;
  };
}
```

### AI Prompt Engineering

The edge function uses carefully crafted prompts to:
1. Analyze budget feasibility based on destination cost of living
2. Estimate flight prices using historical data patterns
3. Generate culturally appropriate itineraries
4. Suggest nearby destinations within 100km radius
5. Return valid Unsplash photo IDs for visual content

---

## 🔐 Security Implementation

### Authentication Flow

1. User signs up with email/password
2. Email verification required (auto-confirm disabled by default)
3. JWT tokens stored in localStorage
4. Tokens auto-refresh before expiry

### RLS Policy Examples

```sql
-- Users can only view their own trips
CREATE POLICY "Users can view own trips" 
ON public.trips 
FOR SELECT 
USING (auth.uid() = user_id);

-- Anyone can view workspaces (public directory)
CREATE POLICY "Anyone can view workspaces" 
ON public.workspaces 
FOR SELECT 
USING (true);

-- Anyone can suggest workspaces (no auth required)
CREATE POLICY "Anyone can suggest workspaces" 
ON public.workspace_suggestions 
FOR INSERT 
WITH CHECK (true);
```

---

## 🚀 Deployment

### Build Process

```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[anon-key]
VITE_SUPABASE_PROJECT_ID=[project-id]
```

### Edge Function Deployment

Edge functions are automatically deployed when code is pushed. No manual deployment required.

---

## 📊 Data Flow Diagrams

### Trip Planning Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User       │────>│ TripPlanner  │────>│ Edge Function│
│   Input      │     │    Form      │     │ (Gemini AI)  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Recommendations│<───│   Process    │<────│ AI Response  │
│   Display     │    │   Response   │     │   (JSON)     │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Workspace Search Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User       │────>│   Filter     │────>│   Supabase   │
│   Filters    │     │   State      │     │    Query     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Workspace   │<────│   Group by   │<────│  Filter &    │
│   Cards      │     │   Country    │     │    Sort      │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## 🎯 Easter Eggs

### Cuddalore Founder Popup

When users enter "Cuddalore" as their destination, a special popup appears after recommendations are generated, revealing that Cuddalore is the hometown of the app's founder, **A. Hari Raj**.

**Implementation:**
```typescript
if (formData.destination.toLowerCase().includes('cuddalore')) {
  requestAnimationFrame(() => {
    setTimeout(() => {
      setShowFounderPopup(true);
    }, 800);
  });
}
```

---

## 📈 Future Enhancements

1. **User Authentication** - Sign up/login for personalized experiences
2. **Trip History** - Save and revisit past trip plans
3. **Workspace Reviews** - User-submitted ratings and comments
4. **Real-time Collaboration** - Share trips with travel companions
5. **Booking Integration** - Direct flight/hotel booking links
6. **Mobile App** - React Native version for iOS/Android
7. **Offline Mode** - PWA support for offline access

---

## 👨‍💻 Developer Information

**Project:** SakuraTrip - Digital Nomad Travel Planner  
**Founder:** A. Hari Raj  
**Location:** Cuddalore, India  
**Built with:** Lovable AI Platform  

---

## 📚 References

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev)
- [shadcn/ui Components](https://ui.shadcn.com)

---

*Last Updated: February 2026*
