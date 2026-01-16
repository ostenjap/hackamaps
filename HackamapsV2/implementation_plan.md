# Implementation Plan - Profile Management

## 1. Audit & Analysis
**Current State:**
- `AuthContext` manages user session and basic profile data (`username`, `full_name`, `website`). # no website in the current implementation
- `UserMenu` has a "Profile" button but it is non-functional.
- `AppContent` does not have a state or view for Profile.
- `profiles` table exists but lacks `avatar_url`.

**Goal:**
- Allow users to edit identity (`username`, `full_name`, `website`). no website
- Allow users to upload and update profile picture (`avatar_url`). no avatar just normal picture , please use MCP to my Supabase

## 2. Infrastructure Changes (User Action Required)
You need to run the following SQL in your Supabase SQL Editor to prepare the database and storage.

```sql
-- 1. Add avatar_url to profiles table
alter table profiles add column if not exists avatar_url text;

-- 2. Set up Storage for Avatars
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 3. Storage Policies (Allow public read, restricted upload) use the word profile picture
create policy "Avatar images are publicly accessible."
  on storage.objects for select 
  using ( bucket_id = 'avatars' ); 

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
  
create policy "Anyone can update their own avatar."
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'avatars' );
```

## 3. Frontend Implementation Plan

### Step 1: Update `AuthContext`
Update the `Profile` interface to include `avatar_url`.

```typescript
// src/contexts/AuthContext.tsx
interface Profile {
    id: string;
    username: string | null;
    full_name: string | null;
    <-- Add this
}
```

### Step 2: Create `ProfileModal` Component
Create `src/components/Auth/ProfileModal.tsx`.
- **Features**:
    - Image Uploader: Click to select image, upload to `avatars` bucket, get public URL.
    - Form Fields: Username, Full Name, Website.
    - "Save Changes" button to update `profiles` table.
- **UI**: Reuse `AuthModal` styles (dark mode, glassmorphism).

```tsx
// Draft Structure for ProfileModal.tsx
export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    // ... state for form fields & avatar
    
    const handleImageUpload = async (event) => {
        // 1. Upload file to Supabase Storage 'avatars' bucket
        // 2. Get public URL
        // 3. Set avatarUrl state
    };

    const handleSave = async () => {
        // Update profiles table with new data
    };

    return (
        // Modal UI with Image Preview and Inputs
    )
}
```

### Step 3: Integrate into `AppContent`
- Add `isProfileOpen` state to `AppContent`.
- Pass `onOpenProfile={() => setIsProfileOpen(true)}` to `UserMenu`.
- Render `<ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />`.

### Step 4: Update `UserMenu`
- Accept `onOpenProfile` prop.
- trigger `onOpenProfile` when "Profile" button is clicked.

## 4. Verification Plan
1. **Manual Test**:
    - Log in.
    - Open Profile Modal.
    - Upload an image -> Verify it appears in preview.
    - Change name/username -> Save.
    - Refresh -> Verify changes persist and avatar is shown in `UserMenu` (header).
2. **Edge Cases**:
    - Upload invalid file type.
    - Save without changes.
    - Network error during upload.

