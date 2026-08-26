# AI Collaboration Log

AI was used as a development assistant during this take-home project for planning, SQLite and SQL guidance, implementation review, debugging, and code organization.

For the major development sessions below, I reviewed the suggested approach, implemented or adjusted it in the project, and tested the resulting behavior locally.

---

## 1. Project Setup and Architecture

### Tool Used

ChatGPT

### Context / Task

Set up a simple full-stack structure for the take-home without adding unnecessary dependencies or architecture.

### Prompt Used

> now help me to setup frontend and backend and also by using concurrently to run client and server together only initial setup and folder structure and necessary dependencies

### Outcome & Adjustments

- Used React with Vite for the frontend.
- Used Node.js and Express for the backend.
- Used SQLite through `better-sqlite3`.
- Kept the frontend dependency set small and used native `fetch`.
- Avoided Tailwind, Redux, Axios, authentication, and other unnecessary dependencies.

---

## 2. SQLite Database Setup

### Tool Used

ChatGPT

### Context / Task

My previous projects primarily used MongoDB, so I needed guidance on structuring a small SQLite setup using raw SQL.

### Prompt Used

> My background is MERN and I normally use MongoDB. For this assignment I need to use SQLite with Node.js and Express. Show me a simple way to configure better-sqlite3, enable foreign keys, create a database file, and run a schema migration. I do not want to use Prisma, Sequelize, or another ORM because I want to understand and explain the SQL directly.

### Outcome & Adjustments

The database setup uses:

- `better-sqlite3`
- raw SQL
- a reusable database connection
- `schema.sql`
- a migration script
- SQLite foreign-key enforcement
- WAL journal mode

Database initialization was kept separate from the runtime API code.

---

## 3. Relational Schema Design

### Tool Used

ChatGPT

### Context / Task

Translate the assignment requirements into a normalized relational schema.

### Prompt Used

> Help me design a simple normalized SQLite schema for Products, Videos, and EngagementEvents. A product can have multiple videos and a video can have multiple engagement events. Event types should only allow view, click, and add_to_cart. Please also suggest only the indexes that are useful for the analytics query.

### Outcome & Adjustments

Created three related tables:

```text
products
videos
engagement_events
```

Relationships:

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

Foreign keys enforce the relationships and database constraints restrict event types to:

```text
view
click
add_to_cart
```

Indexes were added for event lookup and aggregation.

---

## 4. Database Seed Strategy

### Tool Used

ChatGPT

### Context / Task

Create reusable sample data for testing relationships, pagination, SQL aggregation, and videos with no engagement.

### Prompt Used

> Help me create a reusable SQLite seed script using better-sqlite3. I want products, videos, and random engagement events. The seed should be safe to run multiple times. Do not assume generated IDs are always 1, 2, 3. Save lastInsertRowid and use the real IDs when inserting related records. Also leave one video with zero engagement so I can verify the LEFT JOIN analytics query.

### Outcome & Adjustments

The seed script:

- recreates sample data safely
- deletes child records before parent records
- uses generated IDs through `lastInsertRowid`
- creates product/video relationships
- generates sample engagement events
- leaves one video without events to verify `LEFT JOIN` behavior

Product information is loaded from local JSON seed data so the application does not depend on an external product API at runtime.

---

## 5. Engagement Event API

### Tool Used

ChatGPT

### Context / Task

Implement the endpoint used to simulate incoming engagement events.

### Prompt Used

> Help me implement POST /api/events in Express using better-sqlite3. The request should contain videoId and eventType. Validate that videoId is a positive integer, eventType is one of view, click, or add_to_cart, and the video exists before inserting the event. Keep the controller simple.

### Outcome & Adjustments

Implemented:

```http
POST /api/events
```

The endpoint validates:

- `videoId`
- `eventType`
- allowed event types
- video existence

Valid events are inserted into SQLite.

I manually tested valid requests, invalid event types, and unknown video IDs.

---

## 6. Video Analytics Query

### Tool Used

ChatGPT

### Context / Task

Build the main analytics query using SQL aggregation and pagination.

### Prompt Used

> I need a SQLite query for GET /api/analytics/videos. Return every video with its product, total views, clicks, and add_to_cart conversions. A video with zero events must still appear. Please use raw SQL with JOIN, LEFT JOIN, CASE, SUM, and GROUP BY. Also add LIMIT and OFFSET pagination. Do not calculate conversion rate in the backend because the assignment requires that calculation on the frontend.

### Outcome & Adjustments

Implemented:

```http
GET /api/analytics/videos
```

The query uses:

```text
JOIN
LEFT JOIN
SUM
CASE
GROUP BY
LIMIT
OFFSET
```

`LEFT JOIN` keeps videos with no engagement events in the analytics result.

Conversion rate was intentionally not calculated in SQL because the assignment requires it on the frontend.

---

## 7. Analytics Route Debugging

### Tool Used

ChatGPT

### Context / Task

The analytics controller existed but the endpoint initially returned:

```text
Cannot GET /api/analytics/videos
```

### Prompt Used

> My Express analytics controller and router exist, but GET /api/analytics/videos returns Cannot GET. Help me trace how the router should be registered in my existing app.routes.js structure instead of changing the whole backend architecture.

### Outcome & Adjustments

The issue was route registration rather than the SQL query.

The analytics router was registered under:

```text
/api/analytics
```

I kept the existing centralized `app.routes.js` structure.

---

## 8. Pagination Validation

### Tool Used

ChatGPT

### Context / Task

During manual testing, `page=0` was incorrectly falling back to page 1.

### Prompt Used

> My pagination code uses Number(req.query.page) || 1. When I send page=0, it falls back to page 1 instead of returning a validation error. Explain why and show me a simple fix that still defaults to 1 only when the query parameter is missing.

### Outcome & Adjustments

The issue was caused by JavaScript treating `0` as falsy.

Pagination parsing was updated so defaults are used only when the query parameter is absent.

Invalid values such as:

```text
page=0
```

now return a validation error.

---

## 9. React Analytics Dashboard

### Tool Used

ChatGPT

### Context / Task

Display backend analytics data and calculate conversion rate in React.

### Prompt Used

> Help me create a React analytics table that displays video title, product information, views, clicks, conversions, and conversion rate. Conversion rate must be calculated in React using conversions / views. Handle zero views without producing NaN or Infinity.

### Outcome & Adjustments

The dashboard displays:

- video title
- product details
- views
- clicks
- conversions
- conversion rate

Conversion rate is calculated in React:

```text
Conversions / Views × 100
```

Videos with zero views display:

```text
0.00%
```

---

## 10. Frontend Pagination

### Tool Used

ChatGPT

### Context / Task

Connect the backend pagination response to simple frontend controls.

### Prompt Used

> My analytics API returns page, limit, total, and totalPages. Help me create a simple React pagination component with Previous and Next buttons. Previous should be disabled on page 1 and Next should be disabled on the last page. Changing the page should refetch analytics.

### Outcome & Adjustments

Added reusable Previous and Next pagination controls.

Changing pages updates React state and fetches the corresponding analytics page.

---

## 11. Simulate Traffic

### Tool Used

ChatGPT

### Context / Task

Implement the assignment's traffic simulation flow.

### Prompt Used

> Help me implement the Simulate Traffic requirement. When the user clicks the button, select a random video, select one random event type from view, click, and add_to_cart, POST it to /api/events, then fetch the analytics again. Disable the button while the request is running.

### Outcome & Adjustments

The final flow is:

```text
Select random video
        ↓
Select random event type
        ↓
POST /api/events
        ↓
Store event in SQLite
        ↓
Refetch analytics
        ↓
Refresh dashboard
```

The button is disabled while the request is running.

---

## 12. React Effect / Lint Debugging

### Tool Used

ChatGPT

### Context / Task

ESLint reported `react-hooks/set-state-in-effect` and an `exhaustive-deps` warning around the analytics-loading effect.

### Prompt / Error Provided

```text
Error: Calling setState synchronously within an effect can trigger cascading renders

react-hooks/set-state-in-effect

React Hook useEffect has a missing dependency: 'loadAnalytics'
```

### Outcome & Adjustments

The initial analytics fetch was separated from the reusable refresh function.

The effect now starts the asynchronous request and ignores stale responses during cleanup.

After the change, the frontend was checked again with:

```bash
npm run lint
npm run build
```

---

## 13. Backend Structure Review

### Tool Used

ChatGPT

### Context / Task

Review whether the raw-SQL backend should follow an MVC-style organization similar to my MERN projects.

### Prompt Used

> ek bbat batao mere dusre mern project me dekho mai models view controller wala use karta hu , models me s chema rakhta hu toh kya isme bhi yese kar sakte hai ? database folder me se schema alag kar do or usko models me daal do kya services me seed ya migrate use kar sakte hai jisse better folder structure lage

### Outcome & Adjustments

I kept database setup concerns separate from runtime models:

```text
database/
├── schema.sql
├── migrate.js
└── seed.js
```

Runtime backend responsibilities use a lightweight flow:

```text
Route
  ↓
Controller
  ↓
Model
  ↓
SQLite
```

Raw SQL data-access logic can live in model files, while migration and seed scripts remain database infrastructure.

I did not add a service layer because the current business logic does not justify another abstraction.

---

## 14. Final Repository Review

### Tool Used

ChatGPT

### Context / Task

Review the completed repository against the take-home requirements and identify remaining submission issues.

### Prompt Used

> oaky according to task description will you check this entirely and tell me what is left in thiws https://github.com/shivammchaudhary1/videoselz.git

### Outcome & Adjustments

The review identified final cleanup and submission items, including:

- documenting other public projects in the README
- removing generated SQLite runtime files from version control
- checking frontend lint/build
- reviewing AI collaboration documentation
- verifying candidate-pitch and walkthrough links
- testing database migration and seed from a clean state

---

## Final Review

Before submission I manually reviewed or tested:

- database migration
- database seeding
- foreign-key relationships
- engagement-event validation
- analytics SQL aggregation
- zero-event video behavior
- API pagination
- frontend conversion-rate calculation
- Simulate Traffic behavior
- error/loading states
- responsive layout
- frontend linting
- production frontend build

AI was used as an implementation and review aid; final code decisions and testing remained part of my development process.
