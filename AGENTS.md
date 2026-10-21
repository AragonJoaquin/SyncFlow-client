# Frontend Agents & Feature Roadmap

This document outlines the architecture, tech stack, style guide, and a list of missing features along with their corresponding successful backend API endpoints for the `client` frontend of **SyncFlow**.

---

## 1. Tech Stack

- **Framework**: React 19 (`react`, `react-dom`) with TypeScript (`typescript`)
- **Routing**: Wouter (`wouter`)
- **State Management & Data Fetching**: Zustand (`zustand`), React Context, Custom Hooks
- **Forms & Validation**: React Hook Form (`react-hook-form`), Zod (`zod`), `@hookform/resolvers`
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`), Custom CSS variables & themes
- **UI Components & Utilities**: Radix UI (`radix-ui`), React Advanced Cropper (`react-advanced-cropper`), Axios (`axios`)
- **Build Tool**: Vite (`vite`, `@vitejs/plugin-react-swc`)
- **Testing & Quality**: Oxlint (`oxlint`), Oxfmt (`oxfmt`)

---

## 2. Style Guide & Design System

- **Colors & Theming**:
  - Defined in `src/styles/theme.css` and `src/styles/chat_page.css`.
  - Supports custom design tokens for backgrounds, cards, borders, text primary/secondary, accents, and status badges (Active, Idle, Do Not Disturb, Disconnected).
- **Typography**:
  - Fonts loaded from `public/fonts/`: **OpenSans** (Regular, Light, SemiBold, Bold) and **Cabin** (Regular, SemiBold).
- **Component Architecture**:
  - Reusable components prefixed with `SF` (e.g., `SFButton`, `SFDialog`, `SFDropDown`, `SFAvatar`, `SFToast`, `SFImage`, `SFGroupCard`, `SFSkeleton`).
  - Modular directory organization (`components/chat/`, `components/input/`, `components/profile-popover/`, `components/svgs/`).
- **Coding Conventions**:
  - Strict TypeScript typing with models mirroring server DTOs (`User`, `WorkGroup`, `Channel`, `Category`, `Message`, `FileRepo`, `PinnedMessage`, `Activity`).
  - Functional components with React hooks.

---

## 3. Feature Roadmap & Missing Features

The following features need to be fully integrated into the client application, mapping frontend user actions to their respective successful backend HTTP/WebSocket endpoints.

### A. Summaries (WorkGroup Stats & Analytics)

- **Description**: Display work group statistics, channel activity summaries, hourly peaks, and role activity charts.
- **Frontend Action**: Opening the group analytics/summary panel or dashboard.
- **Successful Backend Endpoints**:
  - `GET /v1/work_group/{id}/stats` -> Returns overall group statistics.
  - `GET /v1/work_group/{id}/stats/channels_activity` -> Returns activity breakdown per channel.
  - `GET /v1/work_group/{id}/stats/hourly_peak` -> Returns peak usage hours.
  - `GET /v1/work_group/{id}/stats/role_activity` -> Returns role-based activity distribution.

### B. Joining Groups

- **Description**: Browse public groups or join groups via invitation links / ID.
- **Frontend Action**: Clicking "Join" on a public group card or submitting an invite code/link.
- **Successful Backend Endpoints**:
  - `GET /v1/work_group/all` -> Query public groups.
  - `POST /v1/work_group/{id}` -> Join a group by ID.
  - `POST /v1/invite/{id}` -> Join a group by invite code/link (`{id}` is invite code/ID).

### C. Leaving Groups

- **Description**: Allow a user to voluntarily leave a work group.
- **Frontend Action**: Selecting "Leave Group" from group settings or context menu.
- **Successful Backend Endpoints**:
  - `DELETE /v1/work_group/{id}/leave` -> Leaves the specified work group.
  - (WebSocket alternative): `WS_QUIT_GROUP` event via WebSocket connection.

### D. Uploading Images (Public & Private)

- **Description**: Upload profile pictures, chat attachments, or image assets.
- **Frontend Action**: Selecting and cropping an image via `image-upload` components and submitting.
- **Successful Backend Endpoints**:
  - `POST /v1/upload/public` -> Uploads a public image. Returns public file reference/URL on success.
  - `POST /v1/upload/private` -> Uploads a private image. Returns private file reference on success.
  - `GET /v1/upload/public/{id}` -> Retrieve a public image.
  - `GET /v1/upload/private/{id}/{id2}` -> Retrieve a private image.

### E. Authentication & Session Management

- **Description**: Register, login, refresh auth tokens, and logout.
- **Frontend Action**: Auth form submission, token refresh interceptors, logout button.
- **Successful Backend Endpoints**:
  - `POST /v1/auth/signin` -> Creates user and sets auth/refresh cookies (201 Created).
  - `POST /v1/auth/login` -> Logs in user and sets cookies (200 OK).
  - `GET /v1/auth/refresh_token` -> Refreshes JWT session token (200 OK).
  - `GET /v1/auth/logout` -> Clears session cookies (200 OK).

### F. User Profile & Status Management

- **Description**: View/update profile info, update online status.
- **Frontend Action**: Editing profile via popover, changing status dropdown.
- **Successful Backend Endpoints**:
  - `GET /v1/user` -> Get own user profile.
  - `PUT /v1/user` -> Update own profile info.
  - `GET /v1/user/all` -> Get all users.
  - `GET /v1/user/{id}` -> Get user by ID.
  - `PUT /v1/user/status` -> Update user online/idle/dnd status.

### G. Work Group Management (CRUD, Categories, Channels)

- **Description**: Create, update, delete work groups, categories, and chat channels.
- **Frontend Action**: Modal forms for creating groups, categories, and channels.
- **Successful Backend Endpoints**:
  - Work Groups: `POST /v1/work_group`, `PUT /v1/work_group/{id}`, `DELETE /v1/work_group/{id}`.
  - Categories: `POST /v1/category`, `PUT /v1/category/{id}`, `DELETE /v1/category/{id}`.
  - Channels: `POST /v1/channel`, `GET /v1/channel/{id}`, `PUT /v1/channel/{id}`, `DELETE /v1/channel/{id}`.

### H. Messaging & Reactions

- **Description**: Send, edit, delete messages, pin messages, and add/remove reactions.
- **Frontend Action**: Chat input box, message action popovers.
- **Successful Backend Endpoints**:
  - Messages: `POST /v1/channel/{id}/messages`, `GET /v1/channel/{id}/messages`, `PUT /v1/channel/{id}/messages/{id2}`, `DELETE /v1/channel/{id}/messages/{id2}`.
  - Reactions: `PUT /v1/channel/{id}/messages/{id2}/reactions`, `DELETE /v1/channel/{id}/messages/{id2}/reactions`.
  - Pinned Messages: `POST /v1/channel/{id}/messages/{id2}/pin`, `DELETE /v1/channel/{id}/messages/{id2}/pin`, `GET /v1/work_group/{id}/pinned_messages`.

### I. Membership & Administration (Banning, Kicking, Role Assignment)

- **Description**: Manage group members, ban/unban, kick, ascend/degrade roles, transfer ownership, view membership history.
- **Frontend Action**: Member management dialogs and role action buttons.
- **Successful Backend Endpoints**:
  - `DELETE /v1/work_group/{id}/members/ban/{id2}` -> Ban member.
  - `POST /v1/work_group/{id}/members/unban/{id2}` -> Unban member.
  - `DELETE /v1/work_group/{id}/members/kick/{id2}` -> Kick member.
  - `PUT /v1/work_group/{id}/members/ascend/{id2}` -> Ascend member role.
  - `PUT /v1/work_group/{id}/members/degrade/{id2}` -> Degrade member role.
  - `PUT /v1/work_group/{id}/members/transfer_ownership/{id2}` -> Transfer ownership.
  - `GET /v1/work_group/{id}/members/history/{id2}` -> Get membership audit history.
