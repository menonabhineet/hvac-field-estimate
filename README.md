# Field Estimate Tool

[Live Demo](https://menonabhineet.github.io/hvac-field-estimate/)

**Testing Note:** Please test the application on both mobile and desktop views! It features two completely distinct, highly optimized layouts depending on the screen size. Prioritize testing on a mobile device or responsive mobile view, as this tool is primarily designed for field technicians working on their phones.

A robust, mobile-first web application designed for field technicians to generate service estimates and invoices on-site. Built with Next.js, Tailwind CSS, and Zustand. The application is entirely client-side, making it perfect for static hosting on platforms like GitHub Pages.

## Approach: What I Built

I built a multi-step, highly responsive field estimation tool that allows HVAC technicians to quickly select a customer, add required equipment, calculate labor hours, apply manual adjustments, and generate a final invoice. The primary goal was to create a friction-free, native app-like experience within a web browser, ensuring technicians can perform their work quickly while out in the field.

## Approach: Why I Made These Choices

The architecture and UX decisions were driven by the constraints and realities of working in the field:

*   **Responsive Split-Screen Architecture**: Designed primarily for mobile usage on-site, the interface uses a fluid, single-column stepper. However, when viewed on tablets or desktops, the layout intelligently utilizes CSS Grid to present a dual-pane view, keeping the invoice summary pinned to the right side while the technician navigates the steps on the left.
*   **Fuzzy Search**: Powered by Fuse.js, the customer and equipment search bars tolerate typos and partial matches, drastically reducing the time spent hunting for specific parts or addresses on a small keyboard.
*   **State Persistence**: The entire estimate state is managed by Zustand and hooked into local storage persistence. If a technician accidentally refreshes the page or loses connection, absolutely no data is lost.
*   **Micro-Animations**: Framer Motion is integrated to provide smooth page transitions and list item animations, giving the tool a premium, native application feel.
*   **Print Layout for Invoices**: Instead of generating a server-driven PDF, the tool leverages a dedicated CSS print media layout. When the technician generates an invoice, all UI elements are stripped away, presenting a clean, professional document that can be natively saved as a PDF on iOS or Android devices.
*   **Barcode Scanner**: Integrated camera scanning via react-zxing allows technicians to scan equipment barcodes on-site for immediate lookup.
*   **Quick-Add Favorites**: A dedicated horizontal scrolling row in the equipment step provides one-tap access to high-frequency parts like capacitors and ignitors.
*   **PWA Ready**: Includes a manifest file and Apple meta tags, allowing technicians to install the tool directly to their home screen as a standalone application.

## Approach: What I Would Do Differently With More Time

Given more time, I would expand the application beyond a static frontend prototype in the following ways:

*   **Real Backend Integration**: Migrate from flat JSON files to a relational database (like PostgreSQL with Prisma) to handle dynamic updates to labor rates, customer profiles, and a rapidly expanding equipment inventory.
*   **True Offline-First Sync**: While Zustand local storage prevents accidental data loss, I would implement a robust offline-first architecture (e.g., WatermelonDB or RxDB). This would allow technicians to complete full estimates in cellular dead zones and automatically sync the data back to the server once they reconnect.
*   **Authentication and Tenant Isolation**: Implement NextAuth to allow secure technician logins. This would support multi-tenancy, where different HVAC branches could manage their own customers and inventory.
*   **Server-Side Document Generation**: The current CSS print layout is clever and lightweight, but integrating a library like react-pdf on a Node server would allow for pixel-perfect, multi-page document generation that could be emailed directly to the customer without requiring the technician to manually save and attach a file.

## Tech Stack

*   Framework: Next.js (App Router, Static Export)
*   Styling: Tailwind CSS
*   State Management: Zustand
*   Icons: Lucide React
*   Search: Fuse.js
*   Animations: Framer Motion
*   Scanner: react-zxing

## How to Run Locally

1.  Clone the repository:
    `git clone <repo_url>`
2.  Navigate into the project directory:
    `cd <project_directory>`
3.  Install the dependencies:
    `npm install`
4.  Start the development server:
    `npm run dev`
5.  Open `http://localhost:3000` in your web browser.
