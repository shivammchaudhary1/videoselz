# Videoselz Shoppable Video Analytics Dashboard

A full-stack analytics dashboard for tracking engagement with shoppable product videos.

The application tracks video views, clicks, and add-to-cart events, displays aggregated analytics, calculates conversion rate on the frontend, and includes a **Simulate Traffic** feature for generating engagement events.

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
- Raw SQL

## Features

- Video analytics dashboard
- Views, clicks, and add-to-cart conversions
- Frontend-calculated conversion rate
- Product details with image, category, and price
- Backend pagination
- Simulated engagement traffic
- Automatic analytics refresh after new events
- Responsive analytics table
- Loading, error, and empty states
- Reusable database migration and seed scripts

## Architecture

The backend follows a lightweight MVC-style structure:

```text
Route
  ↓
Controller
  ↓
Model
  ↓
SQLite
```

- **Routes** define API endpoints.
- **Controllers** handle request validation and HTTP responses.
- **Models** contain database access and raw SQL queries.
- **Database scripts** handle schema creation and sample data seeding.

Database setup is kept separate from runtime application logic.

## Project Structure

```text
videoselz/
├── client/
│   └── src/
│       ├── components/
│       ├── services/
│       └── styles/
│
├── server/
│   ├── database/
│   │   ├── schema.sql
│   │   ├── migrate.js
│   │   └── seed.js
│   │
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── app.js
│       └── server.js
│
├── AI_PROMPTING.md
└── README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/shivammchaudhary1/videoselz.git
cd videoselz
```

## Backend

Install dependencies:

```bash
cd server
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

The backend environment uses:

```env
PORT=5000
```

Create the SQLite tables:

```bash
npm run db:migrate
```

Seed sample data:

```bash
npm run db:seed
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

## Frontend

Open another terminal:

```bash
cd client
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

The frontend environment uses:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

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

The endpoint returns video and product information along with aggregated:

- Views
- Clicks
- Conversions
- Pagination metadata

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

The analytics query uses raw SQL with:

```text
JOIN
LEFT JOIN
SUM
CASE
GROUP BY
LIMIT
OFFSET
```

A `LEFT JOIN` is used so videos with no engagement events are still included in the analytics response.

## Conversion Rate

Conversion rate is intentionally calculated on the frontend:

```text
Conversion Rate = Conversions / Views × 100
```

When a video has zero views, the dashboard displays:

```text
0.00%
```

## Simulate Traffic

The **Simulate Traffic** button:

1. Selects a random video.
2. Selects a random event type.
3. Sends the event to `POST /api/events`.
4. Stores the event in SQLite.
5. Fetches the latest analytics.
6. Refreshes the dashboard.

## AI Collaboration

AI was used during development for planning, SQLite and SQL guidance, implementation review, debugging, edge-case analysis, and frontend improvements.

Major AI-assisted interactions are documented in:

[`AI_PROMPTING.md`](./AI_PROMPTING.md)

## Candidate Pitch

30-second private/unlisted YouTube pitch:

https://youtu.be/aR6iPRziiOM

## Technical Walkthrough

3–5 minute project and architecture walkthrough:

https://youtu.be/ErCzajkRJ0o

## Other Public Work

- [Enterprise Notion](https://github.com/shivammchaudhary1/enterprise-notion)
- [Flawless](https://github.com/shivammchaudhary1/flawless)
- [Skin Care](https://github.com/shivammchaudhary1/skin-care)
- [Trip to Heaven](https://github.com/shivammchaudhary1/trip-to-heaven)
- [Natural Language Task Manager](https://github.com/shivammchaudhary1/natural-language-task-manager)

## Repository

https://github.com/shivammchaudhary1/videoselz

## Author

Shivam Chaudhary
