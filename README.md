# Videoselz Shoppable Video Analytics Dashboard

A full-stack analytics dashboard for tracking engagement with shoppable product videos.

The application allows merchants to view video performance metrics such as views, clicks, add-to-cart conversions, and conversion rate. It also includes a traffic simulation feature that creates random engagement events and refreshes the dashboard.

---

## Tech Stack

### Frontend

- React
- Vite
- CSS Modules

### Backend

- Node.js
- Express

### Database

- SQLite
- better-sqlite3

---

## Features

- Video analytics dashboard
- Views, clicks, and add-to-cart conversions
- Conversion rate calculated on the frontend
- Backend pagination
- Frontend pagination controls
- Simulate Traffic button
- Responsive dashboard
- Loading state
- Error state
- Empty state
- SQLite seed data
- SQL aggregation using joins and grouping

---

## Architecture

```text
React Frontend
      |
      | REST API
      |
Express Backend
      |
      v
better-sqlite3
      |
      v
SQLite Database
```

Database relationships:

```text
Product
   |
   | 1 : many
   v
Video
   |
   | 1 : many
   v
EngagementEvent
```

---

## Project Structure

```text
videoselz/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database/
│   │   │   └── environments/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── README.md
├── AI_PROMPTING.md
└── .gitignore
```

---

## Database Schema

### Products

```text
id
name
price
created_at
```

### Videos

```text
id
product_id
video_url
title
```

### Engagement Events

```text
id
video_id
event_type
timestamp
```

Supported event types:

```text
view
click
add_to_cart
```

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shivammchaudhary1/videoselz.git
cd videoselz
```

---

## Backend Setup

Go to the backend directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create the SQLite database tables:

```bash
npm run db:migrate
```

Seed sample data:

```bash
npm run db:seed
```

Start the backend development server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal and go to the frontend directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Production Build

To verify the frontend production build:

```bash
cd client
npm run build
```

To start the backend without nodemon:

```bash
cd server
npm start
```

---

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

Supported values for `eventType`:

- `view`
- `click`
- `add_to_cart`

Example success response:

```json
{
  "success": true,
  "message": "Engagement event recorded",
  "data": {
    "id": 151,
    "videoId": 1,
    "eventType": "view"
  }
}
```

Example invalid event response:

```json
{
  "success": false,
  "message": "Invalid eventType"
}
```

---

### Get Video Analytics

```http
GET /api/analytics/videos?page=1&limit=5
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Running Shoes Demo",
      "videoUrl": "https://example.com/shoes-demo.mp4",
      "product": {
        "id": 1,
        "name": "Running Shoes",
        "price": 89.99
      },
      "views": 14,
      "clicks": 6,
      "conversions": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 10,
    "totalPages": 2
  }
}
```

Pagination rules:

```text
page >= 1
limit >= 1
limit <= 100
```

---

## Analytics Query

The analytics endpoint aggregates engagement data using SQL.

The query uses:

```text
JOIN
LEFT JOIN
GROUP BY
SUM
CASE
LIMIT
OFFSET
```

A `LEFT JOIN` is used between videos and engagement events so videos with zero engagement are still included in the response.

For example:

```text
Fitness Watch Review

Views: 0
Clicks: 0
Conversions: 0
```

will still appear in the dashboard.

---

## Conversion Rate

The conversion rate is intentionally calculated on the frontend.

Formula:

```text
Conversion Rate = Conversions / Views × 100
```

Example:

```text
Views = 20
Conversions = 4

Conversion Rate = 4 / 20 × 100
Conversion Rate = 20%
```

When views are zero, the application displays:

```text
0.00%
```

This avoids division-by-zero issues.

---

## Simulate Traffic

The dashboard includes a **Simulate Traffic** button.

When clicked:

```text
User clicks Simulate Traffic
        |
        v
Select random visible video
        |
        v
Select random event type
        |
        v
POST /api/events
        |
        v
SQLite database updated
        |
        v
GET /api/analytics/videos
        |
        v
Dashboard refreshed
```

Possible randomly generated events:

```text
view
click
add_to_cart
```

The button is temporarily disabled while the request is running.

---

## Seed Data

The project includes a database seed script.

Run:

```bash
npm run db:seed
```

The current seed creates approximately:

```text
5 products
10 videos
150 engagement events
```

One video intentionally has zero engagement events.

This helps verify that the analytics query correctly handles videos without engagement using `LEFT JOIN`.

The seed script can be executed multiple times safely.

---

## Design Decisions

### Why SQLite?

SQLite was selected because the assignment requires a SQL database and specifically suggests SQLite.

It is a good fit for a small, self-contained take-home project because it does not require running a separate database server.

### Why better-sqlite3?

`better-sqlite3` provides a lightweight interface between Node.js and SQLite.

It allows the project to use raw SQL directly instead of introducing an ORM. This keeps the database layer small and makes the SQL queries easier to review and explain.

### Why No ORM?

Libraries such as Prisma, Sequelize, and TypeORM were intentionally not used.

The application is small enough that raw SQL keeps the implementation simple while demonstrating relational database concepts directly.

### Why CSS Modules?

CSS Modules were used instead of Tailwind CSS.

They provide scoped component styles while keeping the styling easy to read and maintain.

The assignment explicitly asks not to use Tailwind CSS.

### Why Backend Pagination?

The backend uses SQL `LIMIT` and `OFFSET` instead of loading every video into the frontend.

For example:

```text
page = 2
limit = 5

offset = (2 - 1) × 5
offset = 5
```

---

## Validation

The backend validates engagement requests before inserting them into the database.

Invalid event type:

```text
eventType = like
```

Returns:

```text
400 Bad Request
```

Unknown video:

```text
videoId = 9999
```

Returns:

```text
404 Not Found
```

Invalid pagination:

```text
page = 0
```

or:

```text
limit = 200
```

Returns:

```text
400 Bad Request
```

---

## Development Scripts

### Backend

Start the backend with nodemon:

```bash
npm run dev
```

Start the backend using Node.js:

```bash
npm start
```

Create database tables and indexes:

```bash
npm run db:migrate
```

Create sample products, videos, and engagement events:

```bash
npm run db:seed
```

### Frontend

Start the Vite development server:

```bash
npm run dev
```

Create a production frontend build:

```bash
npm run build
```

---

## Environment Variables

Frontend environment variable:

```env
VITE_API_URL=http://localhost:5000
```

For deployment, this value should point to the deployed backend URL.

Example:

```env
VITE_API_URL=https://your-backend-url.com
```

---

## Production Considerations

SQLite was intentionally chosen for this assignment because the application is small and self-contained.

For a larger production system with higher write concurrency, horizontal scaling, and multiple backend instances, PostgreSQL would be a stronger database choice.

Additional production improvements could include:

- Automated API tests
- Request rate limiting
- Structured logging
- Dedicated schema migration tooling
- Authentication and authorization
- PostgreSQL
- Monitoring
- CI/CD
- Containerization

These were intentionally kept outside the scope of the take-home assignment.

---

## AI Collaboration

AI tools were used during development for architecture planning, implementation assistance, debugging, and code review.

A detailed record of the major AI interactions is available in:

```text
AI_PROMPTING.md
```

The file contains:

- Tool used
- Context/task
- Exact prompts
- Outcomes
- Manual adjustments

---

## Public Repositories

Other public repositories where I have made meaningful personal or open-source contributions:

- ADD_PUBLIC_REPOSITORY_LINK_HERE
- ADD_PUBLIC_REPOSITORY_LINK_HERE

---

## Candidate Pitch

30-second private or unlisted YouTube candidate pitch:

```text
ADD_YOUTUBE_PITCH_LINK_HERE
```

---

## Technical Walkthrough

3–5 minute technical walkthrough demonstrating the finished project and architecture:

```text
ADD_TECHNICAL_WALKTHROUGH_LINK_HERE
```

---

## Repository

```text
https://github.com/shivammchaudhary1/videoselz
```

---

## Author

Shivam Chaudhary
