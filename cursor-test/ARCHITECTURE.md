# KoloHealth - Architecture Proposal

## 📋 Project Overview

**KoloHealth** is a holistic mobile health platform connecting patients with a diverse ecosystem of healthcare providers, wellness coaches, and peer support communities.

---

## 🏗️ Architecture Analysis

### **Technology Stack Decisions**

1. **Frontend:** React Native (Expo SDK 50+) with Expo Router

   - ✅ File-based routing for intuitive navigation
   - ✅ NativeWind for consistent styling
   - ✅ TypeScript for type safety

2. **Backend:** Supabase

   - ✅ PostgreSQL (relational integrity for health records)
   - ✅ Built-in Auth (Row Level Security for HIPAA compliance)
   - ✅ Realtime subscriptions for messaging
   - ✅ Storage for encrypted documents
   - ⚠️ **HIPAA Compliance Note:** Supabase requires Business Associate Agreement (BAA) for HIPAA compliance. Consider:
     - Supabase Enterprise with BAA
     - Self-hosted Supabase (full control)
     - Alternative: AWS Amplify with HIPAA-eligible services

3. **State Management:**

   - **React Query (TanStack Query):** Remote data (appointments, records, messages)
   - **Zustand:** Local app state (theme, modals, auth status)
   - ✅ Separation of concerns: server state vs. client state

4. **Security:**
   - End-to-end encryption for sensitive messages
   - Row Level Security (RLS) policies in Supabase
   - Encryption at rest (Supabase handles this)
   - Encryption in transit (HTTPS/WSS)

---

## 📁 Refined Folder Structure

```
kolo-health/
├── app/                              # Expo Router (file-based routing)
│   ├── (auth)/                      # Auth stack (unauthenticated)
│   │   ├── _layout.tsx              # Auth layout wrapper
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── onboarding/
│   │       ├── _layout.tsx
│   │       ├── role-selection.tsx
│   │       ├── [role].tsx           # Dynamic role-based onboarding
│   │       └── completion.tsx
│   ├── (tabs)/                      # Tab-based navigation (authenticated)
│   │   ├── _layout.tsx              # Tab layout with role-based tabs
│   │   ├── index.tsx                # Home/Dashboard (role-specific)
│   │   ├── appointments.tsx         # Appointments list
│   │   ├── messages.tsx             # Messaging hub
│   │   ├── health-profile.tsx       # Health profile
│   │   ├── community.tsx            # Community circles
│   │   ├── wellness-hub.tsx         # Wellness resources
│   │   └── profile.tsx              # User profile settings
│   ├── (stack)/                     # Modal/Stack screens
│   │   ├── _layout.tsx              # Stack layout
│   │   ├── appointment-details/[id].tsx
│   │   ├── book-appointment.tsx
│   │   ├── chat/[id].tsx            # One-on-one chat
│   │   ├── group-chat/[id].tsx      # Group chat
│   │   ├── provider-profile/[id].tsx
│   │   ├── health-record/[id].tsx
│   │   ├── video-consultation/[id].tsx
│   │   └── [+not-found].tsx
│   └── _layout.tsx                  # Root layout (auth guard)
│
├── src/
│   ├── components/
│   │   ├── atoms/                   # Smallest UI units
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts             # Barrel exports
│   │   ├── molecules/               # Simple combinations
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── MessagePreview.tsx
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterChip.tsx
│   │   │   └── index.ts
│   │   ├── organisms/               # Complex components
│   │   │   ├── forms/
│   │   │   │   ├── HealthForm.tsx
│   │   │   │   ├── AppointmentForm.tsx
│   │   │   │   └── MessageForm.tsx
│   │   │   ├── lists/
│   │   │   │   ├── AppointmentList.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   └── ProviderGrid.tsx
│   │   │   ├── calendar/
│   │   │   │   ├── CalendarView.tsx
│   │   │   │   └── AvailabilityPicker.tsx
│   │   │   └── index.ts
│   │   ├── sections/                # Full-page sections
│   │   │   ├── HealthProfileSection.tsx
│   │   │   ├── AppointmentsSection.tsx
│   │   │   ├── CommunitySection.tsx
│   │   │   └── index.ts
│   │   └── layouts/                 # Layout components
│   │       ├── ScreenLayout.tsx
│   │       ├── SafeAreaWrapper.tsx
│   │       └── index.ts
│   │
│   ├── hooks/
│   │   ├── auth/
│   │   │   ├── useAuth.ts           # Auth state & methods
│   │   │   ├── useAuthGuard.ts      # Route protection
│   │   │   └── useRole.ts           # Role-based access
│   │   ├── data/                    # React Query hooks
│   │   │   ├── useAppointments.ts
│   │   │   ├── useMessages.ts
│   │   │   ├── useHealthProfile.ts
│   │   │   ├── useProviders.ts
│   │   │   ├── useCommunity.ts
│   │   │   └── useWellness.ts
│   │   ├── ui/
│   │   │   ├── useTheme.ts
│   │   │   ├── useModal.ts
│   │   │   └── useKeyboard.ts
│   │   └── index.ts
│   │
│   ├── store/                       # Zustand stores
│   │   ├── authStore.ts             # Auth state (local)
│   │   ├── uiStore.ts               # Theme, modals, loading
│   │   ├── filterStore.ts           # Global filters
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Supabase client setup
│   │   │   ├── auth.ts              # Auth service
│   │   │   └── storage.ts           # File storage
│   │   ├── api/
│   │   │   ├── appointments.service.ts
│   │   │   ├── health-profile.service.ts
│   │   │   ├── messages.service.ts
│   │   │   ├── providers.service.ts
│   │   │   ├── community.service.ts
│   │   │   └── wellness.service.ts
│   │   ├── encryption/
│   │   │   ├── encryption.service.ts  # E2E encryption
│   │   │   └── key-management.ts      # Key exchange
│   │   └── notifications/
│   │       └── push-notifications.ts
│   │
│   ├── types/
│   │   ├── database.types.ts        # Auto-generated from Supabase
│   │   ├── models.ts                # Core domain models
│   │   ├── api.types.ts             # API responses
│   │   ├── forms.types.ts           # Form schemas
│   │   └── enums.ts                 # Enums (roles, statuses)
│   │
│   ├── utils/
│   │   ├── constants.ts             # App constants
│   │   ├── date-utils.ts            # Date formatting
│   │   ├── validation.ts            # Zod schemas
│   │   ├── formatting.ts            # Text/number formatting
│   │   ├── permissions.ts           # Permission checks
│   │   └── encryption-utils.ts      # Encryption helpers
│   │
│   ├── design-system/
│   │   ├── colors.ts                # Color palette
│   │   ├── typography.ts            # Font sizes, weights
│   │   ├── spacing.ts               # Spacing scale
│   │   ├── theme.ts                 # Theme provider
│   │   └── tokens.ts                # Design tokens
│   │
│   ├── queries/                     # React Query definitions
│   │   ├── appointments.queries.ts
│   │   ├── health-profile.queries.ts
│   │   ├── messages.queries.ts
│   │   ├── providers.queries.ts
│   │   ├── community.queries.ts
│   │   ├── wellness.queries.ts
│   │   └── query-keys.ts            # Query key factory
│   │
│   └── lib/
│       ├── react-query.ts           # QueryClient setup
│       ├── zustand.ts               # Store setup
│       └── supabase.ts              # Supabase initialization
│
├── supabase/
│   ├── migrations/                  # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_indexes.sql
│   ├── functions/                   # Edge Functions (if needed)
│   └── seed.sql                     # Seed data (dev only)
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env.local                       # Local env (gitignored)
├── app.json                         # Expo config
├── eas.json                         # EAS Build config
├── tsconfig.json
├── tailwind.config.js
├── babel.config.js
├── package.json
└── README.md
```

---

## 🗄️ Enhanced Database Schema (ERD)

### **Core Tables**

#### **1. users** (Supabase Auth + Extended Profile)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'patient',
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  date_of_birth DATE,
  gender gender_enum,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM (
  'patient',
  'doctor',
  'therapist',
  'coach',
  'holistic_practitioner',
  'moderator',
  'admin'
);

CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
```

#### **2. health_profiles** (Patient Health Data)

```sql
CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blood_type TEXT,
  allergies JSONB DEFAULT '[]'::jsonb,
  medical_history JSONB DEFAULT '{}'::jsonb,
  current_medications JSONB DEFAULT '[]'::jsonb,
  emergency_contact JSONB,
  fitness_metrics JSONB DEFAULT '{}'::jsonb,
  lifestyle_habits JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **3. provider_profiles** (Provider-Specific Data)

```sql
CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  license_number TEXT,
  license_expiry DATE,
  qualifications JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  consultation_fee DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  availability_schedule JSONB DEFAULT '{}'::jsonb,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  languages TEXT[] DEFAULT ARRAY['en'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **4. appointments**

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_type appointment_type_enum NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status appointment_status_enum DEFAULT 'pending',
  notes TEXT,
  meeting_link TEXT, -- For video consultations
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_appointment_time CHECK (scheduled_at > created_at)
);

CREATE TYPE appointment_type_enum AS ENUM (
  'consultation',
  'therapy_session',
  'coaching_session',
  'follow_up',
  'emergency'
);

CREATE TYPE appointment_status_enum AS ENUM (
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);
```

#### **5. appointment_sharing** (Permission-Based Sharing)

```sql
CREATE TABLE appointment_sharing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  shared_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shared_with_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permissions sharing_permission_enum[] DEFAULT ARRAY['view']::sharing_permission_enum[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(appointment_id, shared_with_id)
);

CREATE TYPE sharing_permission_enum AS ENUM ('view', 'edit', 'comment');
```

#### **6. chats** (Conversations)

```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_2_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for groups
  is_group BOOLEAN DEFAULT false,
  group_name TEXT, -- For group chats
  group_description TEXT,
  group_avatar_url TEXT,
  created_by_id UUID REFERENCES users(id),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **7. chat_participants** (Many-to-Many for Groups)

```sql
CREATE TABLE chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role participant_role_enum DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(chat_id, user_id)
);

CREATE TYPE participant_role_enum AS ENUM ('member', 'moderator', 'admin');
```

#### **8. messages**

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_encrypted TEXT NOT NULL, -- E2E encrypted content
  content_type message_type_enum DEFAULT 'text',
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE message_type_enum AS ENUM ('text', 'image', 'file', 'prescription', 'report');
```

#### **9. health_records**

```sql
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id), -- NULL for self-entered
  record_type record_type_enum NOT NULL,
  title TEXT NOT NULL,
  data_encrypted JSONB NOT NULL, -- Encrypted health data
  file_url TEXT, -- Encrypted file storage URL
  visibility visibility_enum DEFAULT 'private',
  shared_with UUID[], -- Array of user IDs with access
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE record_type_enum AS ENUM (
  'lab_test',
  'prescription',
  'therapy_note',
  'diagnosis',
  'vaccination',
  'imaging',
  'vital_signs',
  'fitness_log',
  'nutrition_log'
);

CREATE TYPE visibility_enum AS ENUM ('private', 'shared', 'provider_only');
```

#### **10. community_circles**

```sql
CREATE TABLE community_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category circle_category_enum NOT NULL,
  created_by_id UUID NOT NULL REFERENCES users(id),
  is_private BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false, -- Allow anonymous posts
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE circle_category_enum AS ENUM (
  'mental_health',
  'chronic_illness',
  'fitness',
  'nutrition',
  'wellness',
  'support_group',
  'general'
);
```

#### **11. circle_members**

```sql
CREATE TABLE circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES community_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role participant_role_enum DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(circle_id, user_id)
);
```

#### **12. circle_posts**

```sql
CREATE TABLE circle_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES community_circles(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id), -- NULL if anonymous
  is_anonymous BOOLEAN DEFAULT false,
  title TEXT,
  content TEXT NOT NULL,
  attachment_urls TEXT[],
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **13. wellness_content**

```sql
CREATE TABLE wellness_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_type content_type_enum NOT NULL,
  category wellness_category_enum NOT NULL,
  content_url TEXT, -- Video/audio URL or article content
  thumbnail_url TEXT,
  duration_minutes INTEGER, -- For video/audio
  author_id UUID REFERENCES users(id),
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE content_type_enum AS ENUM ('article', 'video', 'audio', 'program', 'guide');

CREATE TYPE wellness_category_enum AS ENUM (
  'mental_health',
  'nutrition',
  'fitness',
  'mindfulness',
  'sleep',
  'stress_management',
  'chronic_disease',
  'general'
);
```

#### **14. notifications**

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type_enum NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB, -- Additional data (appointment_id, message_id, etc.)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE notification_type_enum AS ENUM (
  'appointment_reminder',
  'appointment_confirmed',
  'appointment_cancelled',
  'new_message',
  'new_comment',
  'health_record_added',
  'community_post',
  'wellness_tip',
  'system'
);
```

### **Indexes for Performance**

```sql
-- Users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Appointments
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_provider ON appointments(provider_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Messages
CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Health Records
CREATE INDEX idx_health_records_user ON health_records(user_id);
CREATE INDEX idx_health_records_type ON health_records(record_type);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

---

## 🔒 Security & Compliance Considerations

### **HIPAA Compliance Requirements**

1. **Row Level Security (RLS) Policies:**

   - All tables must have RLS enabled
   - Users can only access their own data
   - Providers can only access data for their patients
   - Admins have restricted access

2. **Encryption:**

   - **At Rest:** Supabase handles database encryption
   - **In Transit:** HTTPS/WSS enforced
   - **Application-Level:** E2E encryption for sensitive messages and health records

3. **Audit Logging:**

   - Track all data access (who, what, when)
   - Log all modifications to health records
   - Monitor failed authentication attempts

4. **Access Controls:**
   - Role-based access control (RBAC)
   - Permission-based sharing
   - Time-limited access tokens

### **GDPR Compliance Requirements**

1. **Data Minimization:** Only collect necessary data
2. **Right to Access:** Users can export their data
3. **Right to Erasure:** Users can delete their accounts
4. **Data Portability:** Export functionality
5. **Consent Management:** Explicit consent for data sharing

---

## 🎨 Design System Principles

### **Color Palette (Holistic Health Theme)**

- **Primary:** Calming blues/greens (trust, wellness)
- **Secondary:** Warm earth tones (grounding, comfort)
- **Accent:** Soft purples (mindfulness, healing)
- **Neutral:** Grays for text and backgrounds
- **Semantic:** Success (green), Warning (amber), Error (red)

### **Typography**

- **Headings:** Bold, clear hierarchy
- **Body:** Readable, accessible font sizes (min 16px)
- **Accessibility:** WCAG 2.1 AA compliant contrast ratios

### **Spacing**

- Consistent 4px/8px grid system
- Generous whitespace for clarity

---

## 📊 State Management Strategy

### **React Query (Server State)**

- Appointments, Health Records, Messages, Providers, Community, Wellness Content
- Automatic caching, refetching, and synchronization
- Optimistic updates for better UX

### **Zustand (Client State)**

- Authentication status (local)
- Theme preferences
- Modal states
- Global filters
- UI loading states

---

## 🚀 Next Steps

Once you approve this architecture:

1. **Phase 1 Implementation:**

   - Initialize Expo project with TypeScript
   - Set up Expo Router with auth/tabs/stack structure
   - Configure Supabase client
   - Set up React Query and Zustand
   - Create design system (colors, typography, spacing)
   - Implement basic navigation guards

2. **Database Setup:**
   - Create Supabase project
   - Run migrations
   - Set up RLS policies
   - Configure storage buckets

---

## ✅ Approval Checklist

Please review and confirm:

- [ ] Folder structure aligns with your vision
- [ ] Database schema covers all requirements
- [ ] Security considerations are addressed
- [ ] Design system approach is acceptable
- [ ] State management strategy is clear

**Ready to proceed with Phase 1?** 🚀
