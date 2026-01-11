# Auth System Implementation Plan

## Overview
This plan outlines the steps to implement a complete Authentication system for HackerMaps using Supabase. The goal is to provide a premium, visually stunning sign-up/sign-in experience that integrates seamlessly with the existing "glassmorphism" aesthetic.

## 1. Backend Foundation (Supabase)

### 1.1 Auth Configuration
- **Provider**: Email/Password.
- (Optional) OAuth: Google/GitHub if simpler for user, but we will start with robust Email/Password flow including "Forgot Password".

### 1.2 Database Schema (`profiles` table)
Since `auth.users` is protected, we need a public/private table for user details.

**Table: `public.profiles`**
- `id`: uuid (Primary Key, references `auth.users.id` on delete cascade)
- `username`: text (unique)
- `full_name`: text
- `avatar_url`: text
- `website`: text
- `updated_at`: timestamp with time zone

### 1.3 Row Level Security (RLS) Policies
- **Select**: Public (anyone can read profiles to see organizers/users).
- **Insert**: Authenticated users can insert their own profile (often handled by a Trigger on auth.users creation).
- **Update**: Users can only update their own profile.

### 1.4 Triggers
- Automatic creation of a row in `public.profiles` when a new user signs up via `auth.users`.

## 2. Frontend Architecture

### 2.1 Context Management
**File: `src/contexts/AuthContext.tsx`**
- Wraps the application to provide global user state (`user`, `session`, `profile`, `loading`).
- Listens to Supabase `onAuthStateChange` events.
- Provides utility functions: `signOut`.

### 2.2 UI Components

**Location**: `src/components/Auth/`

1.  **`AuthModal.tsx`**
    *   **Design**: Centered glass modal with backdrop blur.
    *   **State**: Switchable tabs for "Sign In" vs "Sign Up".
    *   **Fields**: Email, Password, (Username for Sign Up).
    *   **Visuals**: Neon accents, smooth transitions between tabs, error/success toast integration.
    *   **Features**:
        *   "Forgot Password?" link -> opens ForgotPasswordModal.
        *   Form validation.
        *   Loading states (spinners/skeleton).

2.  **`ForgotPasswordModal.tsx`**
    *   Simple flow: Input email -> Send Reset Link.
    *   Feedback: Success message "Check your email".

3.  **`UserMenu.tsx`**
    *   Replaces the current placeholder avatar in `App.tsx` header.
    *   **State Unauthenticated**: Shows "Sign In" / "Sign Up" buttons.
    *   **State Authenticated**: Shows User Avatar.
    *   **Interactions**: Clicking Avatar opens a dropdown (Profile, Settings, Sign Out).

4.  **`ResetPassword.tsx`** (Page/Modal)
    *   Handles the user clicking the link from email.
    *   Inputs: New Password, Confirm Password.

## 3. Implementation Steps

### Step 1: Backend Setup (SQL)
Run the following SQL in your Supabase SQL Editor to set up the `profiles` table and security triggers.

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Handle new user signup automatically
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Step 2: Auth Context
- Create `AuthContext` to manage session state globally.
- Wrap `App.tsx` (or `main.tsx`) with the provider.

### Step 3: UI Components Construction
- Build `AuthModal` with Sign In/Up logic.
- Build `UserMenu` to switch between Auth states.
- Style them using the existing `neutral-900`, `blue-500` palette with glass effects.

### Step 4: Integration
- Connect `UserMenu` to `App.tsx` header.
- Test Sign Up -> Check Supabase -> Check Profile creation.
- Test Sign In.
- Test Log Out.
- Test Forgot Password flow.

## 4. Dependencies
- `@supabase/supabase-js` (Already installed).
- `lucide-react` (Already installed) for icons (User, Mail, Lock, LogOut).
