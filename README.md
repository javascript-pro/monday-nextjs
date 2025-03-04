# Monday.com + Next.js API Integration

This repository demonstrates a proof of concept (PoC) for integrating **Monday.com's GraphQL API** with **Next.js**. The project establishes a secure API layer within a Next.js app that successfully connects to and queries Monday.com. While the current implementation is minimal and does not yet manipulate data, it serves as a foundation for further development.

[Monday.com > NextJS POC Board](https://goldlabel-apps.monday.com/boards/8614115261)
demo@goldlabel.pro
demo2025

## 🔗 Live Demo
A live version of this demo is available at:
[https://monday.goldlabel.pro](https://monday.goldlabel.pro)

## 📂 Repository Overview
- **Frontend:** A basic Next.js PWA that interacts with the API layer.
- **Backend:** A Next.js API route that securely connects to Monday.com's GraphQL API.

## 📌 Key Files

### 1. API Route: `src/app/api/monday/route.ts`
This file contains the API logic that interacts with Monday.com's GraphQL API. It serves as a bridge between the frontend and Monday.com, handling authentication and requests.

🔗 [View API route](https://github.com/javascript-pro/monday-nextjs/blob/master/src/app/api/monday/route.ts)

### 2. Frontend Page: `src/app/page.tsx`
The primary UI component that interacts with the API. It fetches data from the Next.js backend and displays responses.

🔗 [View Frontend Page](https://github.com/javascript-pro/monday-nextjs/blob/master/src/app/page.tsx)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Monday.com account
- A Monday.com API Key
- Next.js installed globally (optional)

### Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/javascript-pro/monday-nextjs.git
   cd monday-nextjs
   ```

2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Monday.com API key:
   ```sh
   MONDAY_API_KEY=your_monday_api_key_here
   ```

4. Run the development server:
   ```sh
   npm run dev  # or yarn dev
   ```

5. Open [http://localhost:1997](http://localhost:1997) in your browser to see the demo in action.

## 📈 Next Steps
- Implement CRUD operations to **create, update, and delete** items within Monday.com.
- Improve the UI to make data visualization clearer.
- Enhance error handling and authentication security.

## 🛠 Technologies Used
- **Next.js** – Full-stack React framework
- **Monday.com API** – GraphQL API for data retrieval
- **TypeScript** – Type safety and maintainability


