# KoloHealth - Database Schema Reference

## 📊 Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         users                                │
├─────────────────────────────────────────────────────────────┤
│ id (UUID, PK) | email | phone | role (ENUM)                │
│ first_name | last_name | avatar_url | bio                   │
│ date_of_birth | gender | is_active | created_at             │
└─────────────────────────────────────────────────────────────┘
         │                    │
         │                    │
    ┌────▼────┐          ┌────▼──────────────┐
    │ health_ │          │  provider_        │
    │ profiles│          │  profiles         │
    ├─────────┤          ├───────────────────┤
    │ user_id │          │ user_id (FK)      │
    │ blood_  │          │ specialization    │
    │ type    │          │ license_number    │
    │ allergies│         │ rating            │
    │ medical_│          │ consultation_fee  │
    │ history │          │ availability      │
    └─────────┘          └───────────────────┘

┌──────────────────────────────────────────────────────┐
│              appointments                             │
├──────────────────────────────────────────────────────┤
│ id (PK) | patient_id (FK→users) | provider_id (FK) │
│ appointment_type | scheduled_at | duration_minutes  │
│ status | notes | meeting_link | created_at          │
└──────────────────────────────────────────────────────┘
         │
         │
    ┌────▼──────────────────┐
    │ appointment_sharing   │
    ├───────────────────────┤
    │ appointment_id (FK)   │
    │ shared_by_id (FK)     │
    │ shared_with_id (FK)   │
    │ permissions[]         │
    └───────────────────────┘

┌──────────────────────────────────────────────────────┐
│              chats                                    │
├──────────────────────────────────────────────────────┤
│ id (PK) | participant_1_id (FK) | participant_2_id   │
│ is_group | group_name | last_message_at              │
└──────────────────────────────────────────────────────┘
         │
         │
    ┌────▼──────────────┐  ┌────▼──────────────┐
    │ chat_participants │  │     messages       │
    ├───────────────────┤  ├───────────────────┤
    │ chat_id (FK)      │  │ chat_id (FK)      │
    │ user_id (FK)      │  │ sender_id (FK)    │
    │ role              │  │ content_encrypted │
    │ last_read_at      │  │ is_read           │
    └───────────────────┘  └───────────────────┘

┌──────────────────────────────────────────────────────┐
│              health_records                           │
├──────────────────────────────────────────────────────┤
│ id (PK) | user_id (FK) | provider_id (FK)           │
│ record_type | title | data_encrypted (JSONB)        │
│ file_url | visibility | shared_with[] | created_at  │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              community_circles                        │
├──────────────────────────────────────────────────────┤
│ id (PK) | name | description | category              │
│ created_by_id (FK) | is_private | is_anonymous      │
│ member_count | created_at                            │
└──────────────────────────────────────────────────────┘
         │
         │
    ┌────▼──────────────┐  ┌────▼──────────────┐
    │ circle_members    │  │  circle_posts     │
    ├───────────────────┤  ├───────────────────┤
    │ circle_id (FK)    │  │ circle_id (FK)    │
    │ user_id (FK)      │  │ author_id (FK)    │
    │ role              │  │ is_anonymous      │
    │ joined_at         │  │ content          │
    └───────────────────┘  │ like_count       │
                           └───────────────────┘

┌──────────────────────────────────────────────────────┐
│              wellness_content                         │
├──────────────────────────────────────────────────────┤
│ id (PK) | title | description | content_type        │
│ category | content_url | thumbnail_url               │
│ author_id (FK) | tags[] | is_published | created_at │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              notifications                            │
├──────────────────────────────────────────────────────┤
│ id (PK) | user_id (FK) | type | title | body        │
│ data (JSONB) | is_read | created_at                 │
└──────────────────────────────────────────────────────┘
```

## 🔑 Key Relationships

### **User Relationships**

- **One-to-One:** `users` → `health_profiles` (patients only)
- **One-to-One:** `users` → `provider_profiles` (providers only)
- **One-to-Many:** `users` → `appointments` (as patient or provider)
- **One-to-Many:** `users` → `health_records` (owner)
- **One-to-Many:** `users` → `messages` (sender)
- **Many-to-Many:** `users` ↔ `chats` (via `chat_participants`)
- **Many-to-Many:** `users` ↔ `community_circles` (via `circle_members`)

### **Appointment Relationships**

- **Many-to-One:** `appointments` → `users` (patient)
- **Many-to-One:** `appointments` → `users` (provider)
- **One-to-Many:** `appointments` → `appointment_sharing` (sharing permissions)

### **Chat Relationships**

- **One-to-Many:** `chats` → `messages`
- **Many-to-Many:** `chats` ↔ `users` (via `chat_participants`)

### **Health Records Relationships**

- **Many-to-One:** `health_records` → `users` (patient/owner)
- **Many-to-One:** `health_records` → `users` (provider, nullable)

### **Community Relationships**

- **One-to-Many:** `community_circles` → `circle_posts`
- **Many-to-Many:** `community_circles` ↔ `users` (via `circle_members`)

## 📝 Enums Reference

### **user_role**

- `patient`
- `doctor`
- `therapist`
- `coach`
- `holistic_practitioner`
- `moderator`
- `admin`

### **appointment_type_enum**

- `consultation`
- `therapy_session`
- `coaching_session`
- `follow_up`
- `emergency`

### **appointment_status_enum**

- `pending`
- `confirmed`
- `in_progress`
- `completed`
- `cancelled`
- `no_show`

### **record_type_enum**

- `lab_test`
- `prescription`
- `therapy_note`
- `diagnosis`
- `vaccination`
- `imaging`
- `vital_signs`
- `fitness_log`
- `nutrition_log`

### **visibility_enum**

- `private`
- `shared`
- `provider_only`

### **message_type_enum**

- `text`
- `image`
- `file`
- `prescription`
- `report`

### **content_type_enum**

- `article`
- `video`
- `audio`
- `program`
- `guide`

## 🔒 Row Level Security (RLS) Strategy

### **General Principles**

1. Users can only read/update their own records
2. Providers can read/update records for their patients only
3. Admins have restricted read access (audit purposes)
4. Sharing permissions are enforced at the database level

### **Key RLS Policies**

#### **health_profiles**

- Users can read/update their own profile
- Providers can read (not update) profiles of their patients

#### **appointments**

- Patients can read/update their own appointments
- Providers can read/update appointments where they are the provider
- Shared appointments visible to users in `appointment_sharing`

#### **health_records**

- Users can read records where `user_id = auth.uid()`
- Users can read records where `shared_with` contains their ID
- Providers can read records where `provider_id = auth.uid()`

#### **messages**

- Users can read messages in chats where they are participants
- Users can only send messages to chats they belong to

---

## 📈 Performance Optimizations

### **Indexes**

- Foreign keys are automatically indexed
- Additional indexes on frequently queried columns:
  - `appointments(scheduled_at)` - for calendar views
  - `messages(chat_id, created_at DESC)` - for message lists
  - `notifications(user_id, is_read)` - for unread counts

### **Query Patterns**

- Use pagination for large lists (messages, appointments, posts)
- Implement cursor-based pagination for real-time feeds
- Cache frequently accessed data (provider profiles, user info)

---

## 🔄 Data Migration Strategy

1. **Initial Schema:** Create all tables with RLS disabled
2. **Enable RLS:** Add RLS policies after schema is stable
3. **Seed Data:** Create test users and sample data
4. **Indexes:** Add indexes after initial data load

---

This schema supports:

- ✅ Multi-role user system
- ✅ Secure health data storage
- ✅ Appointment management and sharing
- ✅ Real-time messaging (1-on-1 and groups)
- ✅ Community features
- ✅ Wellness content management
- ✅ HIPAA-compliant data access controls
