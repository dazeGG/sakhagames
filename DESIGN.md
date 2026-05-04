# Design System Specification: High-End Editorial Archive

## 1. Overview and Creative North Star

**Creative North Star: "The Arctic Curator"**

This is a high-end digital archive design system. It deliberately moves away from typical "app-like" interfaces toward a strict, premium editorial style.

Strict monochrome, high contrast, and radical geometric precision (**all corners are 0px**) create a clean and calm space where the main heroes are bright full-color photographs of Yakutian sports.

We consciously break symmetry. **Intentional Asymmetry** and generous whitespace help focus attention on the content rather than the interface.

---

## 2. Colors

The palette is strictly limited to black, white, and subtle tonal transitions. All colors must be taken from the custom tokens defined in `main.css` (`@theme` block).

### 2.1 Full Color Palette (from main.css)

**Primary (Main monochrome scale)**
- primary-50: `#F5F5F5`
- primary-100: `#E5E5E5`
- primary-200: `#CCCCCC`
- primary-300: `#A8A8A8`
- primary-400: `#7A7A7A`
- primary-500: `#000000`
- primary-600: `#1F1F1F`
- primary-700: `#2A2A2A`
- primary-800: `#3B3B3B`
- primary-900: `#111111`
- primary-950: `#0A0A0A`

**Secondary**
- secondary-50: `#F6F6F6`
- secondary-100: `#E9E9E9`
- secondary-200: `#D9D9D9`
- secondary-300: `#B8B8B8`
- secondary-400: `#8F8F8F`
- secondary-500: `#6B6B6B`
- secondary-600: `#4D4D4D`
- secondary-700: `#3A3A3A`
- secondary-800: `#282828`
- secondary-900: `#1C1C1C`
- secondary-950: `#121212`

**Success (Green)**
- green-50: `#F0F5F2`
- green-100: `#E0EBE5`
- green-200: `#C2D8CE`
- green-300: `#9EC0B0`
- green-400: `#6FA18A`
- green-500: `#1A5C3A`
- green-600: `#13482E`
- green-700: `#0F3A25`
- green-800: `#0C2F1F`
- green-900: `#0A2619`
- green-950: `#081F14`

**Info (Blue)**
- blue-50: `#F0F4F8`
- blue-100: `#E0E9F2`
- blue-200: `#C2D4E6`
- blue-300: `#9EB9D4`
- blue-400: `#6F96B8`
- blue-500: `#1E4A7C`
- blue-600: `#163A63`
- blue-700: `#122F50`
- blue-800: `#0F263F`
- blue-900: `#0C1E32`
- blue-950: `#0A1827`

**Warning (Yellow)**
- yellow-50: `#F9F6F0`
- yellow-100: `#F4EFD9`
- yellow-200: `#E9E0B8`
- yellow-300: `#D9C98F`
- yellow-400: `#C4A95F`
- yellow-500: `#8C6F1F`
- yellow-600: `#6F5718`
- yellow-700: `#5A4614`
- yellow-800: `#46370F`
- yellow-900: `#2F240A`
- yellow-950: `#1F1807`

**Error (Red)**
- red-50: `#F8F1F1`
- red-100: `#F2E2E2`
- red-200: `#E6C8C8`
- red-300: `#D4A5A5`
- red-400: `#B97B7B`
- red-500: `#8C2A2A`
- red-600: `#6B1F1F`
- red-700: `#541919`
- red-800: `#3F1212`
- red-900: `#2B0C0C`
- red-950: `#1F0808`

**Neutral**
- neutral-50: `#FAFAFA`
- neutral-100: `#F9F9F9`
- neutral-200: `#F3F3F4`
- neutral-300: `#E8E8E8`
- neutral-400: `#D4D4D4`
- neutral-500: `#A3A3A3`
- neutral-600: `#6B6B6B`
- neutral-700: `#4A4A4A`
- neutral-800: `#2F2F2F`
- neutral-900: `#1A1C1C`
- neutral-950: `#0F0F0F`

### "No-Line" Rule
Visible borders (1px borders) are **forbidden**. Sections and blocks are separated **only through tonal background shifts** using the colors above.

### Textures
- Floating elements (header, modals) use semi-transparent backgrounds with strong `backdrop-blur` (20px+).
- Primary buttons use a subtle gradient from `primary-500` to `primary-800`.

---

## 3. Typography

- **h1 / Display:** PT Serif (`--font-serif-classic`)
- **Headings, metadata, navigation, uppercase:** Montserrat (`--font-heading`)
- **Body text:** Noto Sans (`--font-sans`)

---

## 4. Depth and Elevation

Depth is achieved only through **tonal layering**, never shadows.  
**Zero Radius:** All elements have `border-radius: 0`.

---

## 5. Components

### Buttons
- **Primary:** `bg-primary-500` text-white. On hover: `bg-primary-800`.
- **Tertiary:** no background, text only with underline.

### Input Fields
- Background: `surface-container-high`.
- No borders. Label (Montserrat uppercase) placed above.

### Archive Cards
- Top: full-width full-color image
- Bottom: background white (`neutral-50` or `#FFFFFF`), serif heading + sans-serif metadata

### Main Navigation
- Horizontal, generous whitespace. Hover: color inversion.

---

## 6. Do's and Don'ts

### Do:
- Use bright full-color photographs as the main visual accent.
- Apply asymmetric compositions.
- Give headings plenty of air.

### Don't:
- Never use rounded corners (`border-radius: 0` everywhere).
- Never use gray text for body content — only `neutral-900` / `#1A1C1C`.
- Never use visible lines. Separate content only with Tailwind spacing: `20` (5rem), `30` (7.5rem), `40` (10rem).
- Never desaturate photographs.

---

## 7. Interactions

- **Transitions:** `150ms linear` only.
- **Hover states:** Strong color inversion (black ↔ white).
- Interactions should feel precise and confident, like turning pages in a heavy archival album.

---

**Created:** April 2026  
**For project:** SakhaGames (Nuxt 4 + Django REST Framework)