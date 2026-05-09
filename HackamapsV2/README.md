# 🚀 HackaMaps: The Global Hackathon Quest Map

HackaMaps is a premium, real-time interactive platform designed for hackers to discover, track, and navigate the global hackathon ecosystem. 

## ✨ Key Features

### 🔍 Advanced Filtering System
We've implemented a powerful, intuitive filter panel that helps you find exactly what you're looking for:
*   **Quick Search**: A high-speed search field that filters by **Event Title**, **City**, or **Country** simultaneously.
*   **Event Status Toggle**:
    *   **All**: The default view, showing the complete history and future of hackathons.
    *   **Upcoming**: Focus solely on future opportunities.
    *   **Past**: Explore historical data and previous winners.
*   **Visual Timeframe**: A dynamic "Starting Time" slider to filter events by their proximity (automatically disabled for past events to improve UX).
*   **Geo-Filtering**: Filter by specific Continents or Categories (AI, Web3, FinTech, etc.).

### 🗺️ Interactive Maps
*   **Hackathon Map**: A high-performance map view to visualize hackathons globally with custom markers.
*   **Hacker Face Map**: A unique social map where hackers can drop "pins" to showcase their location, social links, and network.


## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS + Framer Motion (for premium animations)
*   **Backend/Auth**: Supabase (PostgreSQL + Real-time)
*   **Payments**: Stripe API Integration
*   **Icons**: Lucide React
*   **Maps**: React Leaflet

## 🚀 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Ensure your `.env` file contains the necessary `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📄 License
Internal use only. Part of the FaradayX HackerMaps ecosystem.
