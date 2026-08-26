# Videoselz Shoppable Video Analytics Dashboard

A full-stack analytics dashboard for tracking engagement with shoppable product videos.

The dashboard shows video views, clicks, add-to-cart conversions, conversion rate, product information, pagination, and includes a **Simulate Traffic** feature to generate engagement events.

## Tech Stack

### Frontend

- React
- Vite
- CSS Modules

### Backend

- Node.js
- Express
- better-sqlite3

### Database

- SQLite

## Features

- Video analytics dashboard
- Views, clicks, and add-to-cart conversions
- Conversion rate calculated on the frontend
- Product images, names, categories, and prices
- Backend pagination
- Responsive analytics table
- Simulate Traffic button
- Loading, error, and empty states
- Reusable SQLite seed script

## Project Structure

```text
videoselz/
├── client/
├── server/
├── README.md
└── AI_PROMPTING.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/shivammchaudhary1/videoselz.git
cd videoselz
```

---

## Backend Setup

Open a terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory.

You can copy the example file:

```bash
cp .env.example .env
```

Or create `server/.env` manually with:

```env
PORT=5000
```

Create the SQLite database tables:

```bash
npm run db:migrate
```

Seed the database:

```bash
npm run db:seed
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory.

You can copy the example file:

```bash
cp .env.example .env
```

Or create `client/.env` manually with:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

## API Endpoints

### Create Engagement Event

```http
POST /api/events
```

Example request:

```json
{
  "videoId": 1,
  "eventType": "view"
}
```

Supported event types:

```text
view
click
add_to_cart
```

### Get Video Analytics

```http
GET /api/analytics/videos?page=1&limit=5
```

Returns video analytics including:

- product information
- views
- clicks
- conversions
- pagination data

## Conversion Rate

Conversion rate is calculated on the frontend as required by the assignment:

```text
Conversion Rate = Conversions / Views × 100
```

If a video has zero views, the dashboard displays:

```text
0.00%
```

## Simulate Traffic

The **Simulate Traffic** button:

1. Selects a random video.
2. Selects a random event type.
3. Sends the event to `POST /api/events`.
4. Saves the event in SQLite.
5. Fetches the latest analytics.
6. Refreshes the dashboard.

## Database

The application uses three main entities:

```text
Product
   |
   | one-to-many
   v
Video
   |
   | one-to-many
   v
EngagementEvent
```

The analytics query uses SQL aggregation with:

```text
JOIN
LEFT JOIN
GROUP BY
SUM
CASE
LIMIT
OFFSET
```

A `LEFT JOIN` is used so videos with zero engagement events are still returned.

## Seed Data

Run:

```bash
cd server
npm run db:seed
```

The seed script creates sample products, videos, and engagement events.

Product information is seeded from local JSON data, including product images and categories. The application does not depend on an external product API at runtime.

One video is intentionally left without engagement events to verify the analytics `LEFT JOIN` behavior.

## Useful Commands

### Backend

```bash
cd server

npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend

```bash
cd client

npm install
npm run dev
```

### Frontend Production Build

```bash
cd client
npm run build
```

## AI Collaboration

AI was used to speed up development, review implementation decisions, help with SQLite and SQL aggregation, debug issues, and improve responsiveness.

Details of the major AI-assisted interactions are documented in:

```text
AI_PROMPTING.md
```

## Candidate Pitch

30-second private/unlisted YouTube pitch:

```text
https://youtu.be/aR6iPRziiOM
```

## Technical Walkthrough

3–5 minute project walkthrough:

```text
https://youtu.be/ErCzajkRJ0o
```

## Repository

```text
https://github.com/shivammchaudhary1/videoselz
```

## Author

Shivam Chaudhary
