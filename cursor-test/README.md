# KoloHealth

A holistic mobile health platform connecting patients with a diverse ecosystem of providers (Doctors, Therapists, Coaches, and Peers).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (optional, but recommended)
- Supabase account (for backend)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:
```bash
npm start
```

## 📁 Project Structure

```
kolo-health/
├── app/                    # Expo Router (file-based routing)
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Tab navigation
│   └── (stack)/           # Stack/modal screens
├── src/
│   ├── components/        # UI components (atomic design)
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand stores
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── design-system/     # Design tokens
│   └── queries/           # React Query definitions
└── supabase/              # Database migrations
```

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo SDK 50+), Expo Router, TypeScript
- **Styling:** NativeWind (Tailwind CSS)
- **State Management:** 
  - React Query (TanStack Query) for server state
  - Zustand for client state
- **Backend:** Supabase (Auth, Database, Realtime, Storage)
- **Validation:** Zod

## 📱 Features (Planned)

- ✅ Phase 1: Foundation & Architecture
- ⏳ Phase 2: Authentication & User Roles
- ⏳ Phase 3: Centralized Health Profile
- ⏳ Phase 4: Smart Appointment Sharing
- ⏳ Phase 5: Secure Messaging & Virtual Consultation
- ⏳ Phase 6: Wellness Resource Hub
- ⏳ Phase 7: Community Circles

## 🔒 Security & Compliance

- HIPAA compliance considerations
- GDPR compliance
- End-to-end encryption for sensitive data
- Row Level Security (RLS) policies

## 📝 License

ISC

