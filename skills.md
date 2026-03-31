# CMS Communication Skill (News, Notifications, Popups, Banners, Slider)

This skill provides the architectural blueprints and implementation patterns for building and managing real-time communication components (News, Notifications, Popups, Banners, and Sliders) for institutional websites.

## 1. Overview

Institutional websites require dynamic ways to communicate urgent information, routine updates, and visual highlights. This skill standardizes the "Manager" pattern used for these components.

### Core Pattern: The Manager Component

All CMS components follow a consistent UI/UX pattern in the Admin Panel:

- **Accordion Editor**: A collapsible form section for adding/editing items with **Live Preview**.
- **Real-time Metrics**: Visual counts of active vs. inactive items.
- **Data Persistence**: Direct integration with Supabase for CRUD operations.
- **Feedback Loops**: Success toasts, error alerts, and "Delete Confirmation" dialogs.

---

## 2. Component Specifications

### A. News Ticker (Announcement Bar)

- **Purpose**: Continuous scrolling text for high-priority updates.
- **Data Schema (`news_ticker`)**:
  - `id` (uuid)
  - `text` (text): The announcement content.
  - `label` (text): Badge type (e.g., 'New', 'Results', 'Circular').
  - `link` (text): Optional URL for details.
  - `sort_order` (int): Display priority.
- **UI Features**:
  - Multi-colored badges with glow effects (e.g., Red for 'New', Green for 'Results').
  - Maximum character limit (usually 150-200) to keep the ticker readable.

### B. Notifications (Bulletins/Circulars)

- **Purpose**: Categorized lists of official documents and notices.
- **Data Schema (`notifications`)**:
  - `id` (uuid)
  - `category` (enum): 'student', 'circular', 'recruitment', 'tender'.
  - `text` (text): Title of the notice.
  - `link` (text): Link to PDF/Document.
  - `date_label` (text): Human-readable date (e.g., 'Jan 20, 2026').
- **UI Features**:
  - Tabbed interface to switch between categories.
  - "New" indicators for recently posted items.

### C. Popups & Modal Banners

- **Purpose**: Urgent interruptions (e.g., Holiday notice, Admission deadline).
- **Data Schema (`popup_banners`)**:
  - `id` (uuid)
  - `title` (text): Banner badge (e.g., 'ATTENTION').
  - `heading` (text): Main title.
  - `description` (text): Body content.
  - `image_url` (text): Icon or background image.
  - `link` (text): Optional "View Details" URL.
  - `is_active` (bool): Toggle visibility.
- **UI Features**:
  - Glassmorphism overlays.
  - Direct Google Drive image integration.
  - Limit to 1-2 active popups to avoid user fatigue.

### D. Hero Sliders (Carousel)

- **Purpose**: Large-scale visual storytelling on the homepage.
- **Data Schema (`main_slider`)**:
  - `id` (uuid)
  - `title` (text): Small badge overlay.
  - `subtitle` (text): Large text caption.
  - `image_url` (text): High-res background.
  - `sort_order` (int): Carousel order.
  - `is_active` (bool): Toggle visibility.
- **UI Features**:
  - Aspect ratio enforcement (e.g., 16:9 or 21:9).
  - Blurred background for portrait images to prevent empty space.

---

## 3. Technical Implementation Patterns

### Image Handling (Google Drive Wrapper)

To use Google Drive for hosting images without external costs, use a utility to convert "Share" links to "Direct" links:

```typescript
export const getGoogleDriveDirectLink = (url: string) => {
  if (url.includes("drive.google.com")) {
    const fileId =
      url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
    return fileId
      ? `https://drive.google.com/uc?export=view&id=${fileId}`
      : url;
  }
  return url;
};
```

### Real-time Sync (Supabase)

Enable realtime on the client to ensure the website updates instantly when the Admin makes a change:

```typescript
useEffect(() => {
  const channel = supabase
    .channel("cms_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "news_ticker" },
      fetchNews,
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 4. Design Guidelines (Aesthetics)

1. **Interactive Feedback**: All buttons should have hover/active states (e.g., `scale-95`).
2. **Gradients & Depth**: Use subtle gradients for headers and `shadow-xl` for editor panels.
3. **Consistency**: Use a unified icon set (Lucide React) and typography (e.g., Noto Serif for headlines, Inter for UI).
4. **Mobile First**: Managers must be fully usable on mobile, using dropdowns for tab navigation if necessary.
