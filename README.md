# miette-frontend

> The React frontend for Miette — a sewing project tracker with a social layer.

Miette (French for "crumb") allows sewists to leave a breadcrumb trail of their sewing projects, documenting each garment from first inspiration to finished piece and sharing that journey with a community of people who get it. This repository contains the Vite/React frontend application.

---

## Live URLs

| Service     | URL                                    |
| ----------- | -------------------------------------- |
| Frontend    | `https://miette-frontend.onrender.com` |
| Backend API | `https://miette-backend.onrender.com`  |

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Stretch Goals](#stretch-goals)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Views and Routes](#views-and-routes)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Design Philosophy](#design-philosophy)

---

## Overview

Miette's frontend is a mobile-first React single-page application. It communicates with the Miette REST API to provide a full sewing project tracking and social experience — from documenting a garment at the planning stage through to completion, with every status transition preserved as a snapshot users can look back on at any time.

The app's identity is built around the breadcrumb trail concept: every project tells the full story of a garment's journey, not just its finished state.

---

## Core Features

### Authentication

New users can register with a username, email, password, and first name. Returning users log in with email and password. Sessions are managed with JWTs stored client-side. Incorrect login credentials return a deliberately vague error message that does not reveal whether the email or password was wrong — protecting against account enumeration.

### User Profiles

Every user has a profile page displaying their display name, username, bio, follower and following counts, and a joined date. The profile has three tabs — My Projects, Liked Projects, and My Categories. Profile owners see an edit mode for updating their display name, username, bio, and avatar photo. Viewing another user's profile shows their public projects and a Follow/Unfollow button.

### Create a Project

The project creation form is the most distinctive feature in the app. When a user selects a project status — Planning, In Progress, Complete, or Altering — the form adapts, showing only the fields relevant to that stage. Material fields are labelled "Planned" in planning status and "Used" in all other statuses. The pattern section expands conditionally when the pattern toggle is on. The upcycle section appears only for non-planning statuses. At least one field must be filled before submission is allowed.

### Project Status History — The Breadcrumb Trail

Every time a user moves a project to a new status, a full snapshot of the project's current state is saved before the transition takes effect. Users can tap "View History" on any project to see a timeline of every past stage — what the project looked like the moment they moved on from it. This history is accessible to all viewers of a public project, not just the owner. On mobile the history opens as a bottom sheet. On desktop it slides in from the right as a drawer panel.

### Edit a Project

Users can update any field on their projects while keeping the current status. The edit form mirrors the create form's dynamic field structure. Status changes happen through a separate, dedicated action — not the edit form — to ensure every status transition triggers a snapshot correctly.

### Move a Project Between Statuses

A dedicated status change action with a confirmation modal shows the user exactly what is happening — which status they are moving from and to — and explicitly states that a snapshot will be saved. Projects can move between any statuses in any order. Planning → Complete → Altering → Planning is valid. Real sewing doesn't always go in a straight line.

### Image Upload and Carousels

Users can upload multiple images to a project via a drag-and-drop interface. Images are categorized by type — Inspo, In Progress, or Completed — and labeled accordingly. Images display as scrollable carousels on the project detail page. If no images have been uploaded, a placeholder image appears automatically so project cards never look broken or empty.

### Home Feed

The home feed shows a curated mix of public projects — primarily from followed users, supplemented by a rotating discovery selection from users the current user doesn't yet follow. Projects from all statuses appear in the feed because Miette celebrates the full sewing journey, not just finished pieces. New users who haven't followed anyone yet see a warm empty state with links to search for sewists and create their first project. The discovery section always renders to prevent a completely empty screen.

### Follow Other Users

Users can follow and unfollow other sewists from their profile pages or directly from search results. Following is one-way (Instagram-style) — no approval required for public accounts. Follow and unfollow actions update optimistically, giving immediate visual feedback without waiting for the server response.

### Like a Project

Any logged-in user can like public projects that aren't their own. Likes are indicated by a heart icon that fills and changes color when active. Like counts are visible on project cards. The interaction updates optimistically. Liked projects are collected in the "Liked Projects" tab on the user's profile.

### User-Created Categories

Users can organize their projects into custom categories — like "Summer Dresses", "Gifts I've Made", or "Upcycled Pieces". Categories appear as cards in the My Categories profile tab. Each card can be opened to view all projects in that category. An Uncategorized bucket shows projects with no assigned category. Categories can be renamed or deleted without affecting the projects inside them.

### Search for Other Users

A search bar on the Search page allows users to find other sewists by username. Search is case-insensitive and matches any part of the username. Matched characters are highlighted in results. The search fires with a debounce delay so results appear as the user types without flooding the server with requests. When no results are found, a friendly empty state message appears alongside suggested sewists to follow.

### Custom Loading Page

A branded loading indicator appears whenever the app is fetching data. The indicator is indeterminate — it communicates activity without making a false promise about how long the wait will be.

---

## Stretch Goals

Features planned for implementation after the core MVP is complete:

- **Interactive progress bar** — a color-coded timeline bar on each project showing how long it spent in each status, with hover/tap states revealing the exact duration
- **Guest view** — visitors can view individual public project pages via direct URL without an account, with a persistent prompt to register
- **Private accounts** — users can set their account to private, requiring follow approval before their projects are visible
- **Projects belonging to multiple categories** — a junction table upgrade allowing a project to appear in several categories simultaneously
- **Upload previously completed projects** — a dedicated form mode for backdating finished projects with approximate completion dates and difficulty ratings
- **Search and filter projects** — filter by fabric type, clothing item type, season, pattern, and more with stackable filter combinations
- **Comments on projects** — leave comments on public projects, with one-level reply threading
- **Haberdashery tracker** — a personal inventory of notions, buttons, zippers, and other supplies linked to projects
- **Fabric stash tracker** — a digital library of fabric entries with fiber content, yardage, and project links
- **Personal pattern library** — catalog owned patterns with details, modifications, and links to the projects sewn from them

---

## Tech Stack

| Technology       | Role                                                                     |
| ---------------- | ------------------------------------------------------------------------ |
| Vite             | Build tool and development server                                        |
| React 19         | UI component library                                                     |
| React Router DOM | Client-side routing                                                      |
| TanStack Query   | Server state management — fetching, caching, synchronization             |
| React Hook Form  | Form state management and validation                                     |
| Tailwind CSS     | Utility-first styling                                                    |
| `clsx`           | Conditional class name composition                                       |
| Framer Motion    | Animations and transitions (bottom sheet, drawer, micro-interactions)    |
| Embla Carousel   | Touch-friendly image carousels                                           |
| React Dropzone   | Drag-and-drop image upload interface                                     |
| `date-fns`       | Date formatting and duration calculation                                 |
| `linkify-react`  | Auto-detects and renders URLs in project descriptions as clickable links |
| Lucide React     | Icon library                                                             |
| `sonner`         | Toast notification system                                                |
| ESLint           | Code quality and linting                                                 |
| Vitest           | Unit testing                                                             |

---

## Architecture

### Component Philosophy

Components are organized by their role. Pages are top-level route components. UI components are reusable pieces with no knowledge of routing or API calls. Feature components combine UI components with data-fetching logic for a specific feature area.

### State Management

- **Server state** (API data — projects, users, likes, follows) is managed by TanStack Query. It handles fetching, caching, background refetching, and loading/error states.
- **UI state** (modals open/closed, active tabs, form state) is managed with React's built-in `useState` and `useContext`. No Redux is needed — UI state in Miette is local and simple enough for React's built-in tools.
- **Form state** is managed by React Hook Form, which minimizes re-renders and makes conditional field logic clean.

### Optimistic UI

Social interactions (likes, follows) update immediately in the UI before the server confirms the action. If the server request fails, the UI reverts. This makes the app feel responsive and native rather than laggy.

### Mobile-First Responsive Design

All layouts are designed for mobile viewport first, then adapted for tablet and desktop using Tailwind's responsive prefixes (`md:`, `lg:`). The navigation bar is a bottom tab bar on mobile and a top header on wider screens. Responsive units are used throughout — no fixed pixel values for layout dimensions.

---

## Views and Routes

### Public / Unauthenticated Views

| Route           | View                                                           |
| --------------- | -------------------------------------------------------------- |
| `/`             | Landing page — showcases public projects, two CTAs to register |
| `/login`        | Login form                                                     |
| `/register`     | Registration form                                              |
| `/projects/:id` | Public project detail (view only, no interactions)             |

### Authenticated Views

| Route                | View                                      |
| -------------------- | ----------------------------------------- |
| `/feed`              | Home feed — followed projects + discovery |
| `/profile/:username` | User profile — own or another user's      |
| `/projects/new`      | Create project form                       |
| `/projects/:id`      | Project detail — full interactions        |
| `/projects/:id/edit` | Edit project form                         |
| `/search`            | User search                               |

### Overlay / Modal Views

These are not separate routes — they render on top of existing views:

- Status history bottom sheet (mobile) / right drawer (desktop)
- Status change confirmation modal
- Followers / Following user list modal
- New category creation modal

---

## Project Structure

```
miette-frontend/
├── .env.example
├── .gitignore
├── index.html
├── vite.config.js
├── public/
│   └── _redirects        — Render client-side routing fix
└── src/
    ├── main.jsx           — React app entry point
    ├── App.jsx            — Root component, router setup
    ├── assets/            — Static assets (images, fonts)
    ├── components/        — Reusable UI components
    │   ├── ui/            — Generic: Button, Input, Modal, Toast
    │   ├── project/       — ProjectCard, ProjectForm, StatusBadge
    │   ├── profile/       — ProfileHeader, CategoryCard
    │   └── layout/        — NavBar, TabBar, PageWrapper
    ├── pages/             — Top-level route components
    │   ├── LandingPage.jsx
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── FeedPage.jsx
    │   ├── ProfilePage.jsx
    │   ├── ProjectDetailPage.jsx
    │   ├── CreateProjectPage.jsx
    │   ├── EditProjectPage.jsx
    │   └── SearchPage.jsx
    ├── hooks/             — Custom React hooks
    ├── api/               — API call functions (used by TanStack Query)
    └── context/           — React context (auth state)
```

---

## Local Development

### Prerequisites

- Node.js 18+
- The `miette-backend` server running locally on port 8080

### Setup

```bash
# clone the repository
git clone https://github.com/DarynG4/miette-frontend.git
cd miette-frontend

# install dependencies
npm install

# copy environment variable template
cp .env.example .env
# fill in VITE_API_URL

# start development server
npm run dev
```

The app starts at `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to `http://localhost:8080`, so the backend must be running locally for API calls to work.

---

## Environment Variables

| Variable       | Description          | Local Value             |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |

In production, `VITE_API_URL` is set to the Render backend URL in the Render dashboard environment settings.

Variables without the `VITE_` prefix are not exposed to browser code — this is a Vite security feature.

---

## Deployment

The frontend is deployed on [Render](https://render.com) as a Static Site.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Auto-deploy:** pushes to `main` trigger automatic redeployment

The `public/_redirects` file contains a catch-all rule that serves `index.html` for all routes, allowing React Router to handle client-side navigation correctly on direct URL access and page refresh.

---

## Design Philosophy

**Organic softness** — rounded corners throughout, circles over squares, hard angles used sparingly and with intention. The visual language communicates warmth rather than rigidity.

**Generous whitespace** — content breathes. Projects are the focus, not the chrome around them.

**Mobile-first** — designed for the smallest viewport first, scaled up. The bottom tab bar on mobile is a deliberate platform-native choice. Responsive units everywhere.

**Graceful states** — every data-dependent view has three states: loading (skeleton loaders or spinner), error (friendly message with recovery path), and empty (warm, on-brand messaging with a clear next action). No view is ever left blank or broken.

**Optimistic UI** — social interactions (likes, follows) respond instantly. The app feels fast because it doesn't make the user wait for confirmation of low-stakes actions.

**Accessibility** — every image has descriptive, concise alt text. Interactive elements have focus states. The `prefers-reduced-motion` media query is respected — animations are suppressed for users who have requested it in their OS settings. Semantic HTML is used throughout.

**Micro-interactions over decoration** — animations serve a purpose. The status history panel slides in to communicate where it came from. The heart animation on like is on-brand and distinct from Instagram's implementation. Toast notifications confirm actions without interrupting flow.
