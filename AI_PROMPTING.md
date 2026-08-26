# AI Prompting Log

## Overview

I used AI as a development assistant during this take-home assignment to speed up implementation, validate architectural decisions, debug issues, and reduce time spent researching unfamiliar areas.

My primary background is with the MERN stack, so I was already comfortable with React, Node.js, Express, and API development. I used AI more heavily for SQLite-specific implementation details, SQL aggregation, database seeding, and reviewing edge cases.

I did not use AI to blindly generate the entire project. I implemented the application incrementally, tested each feature locally, reviewed generated suggestions, and adjusted the code when issues appeared.

> Note: The prompts below are reconstructed from the actual AI-assisted development sessions because every original message was not separately saved during development.

---

## Interaction 1 — Planning the Project

### Tool Used

ChatGPT

### Context / Task

I wanted to break the assignment into small development phases so I could complete the project quickly without overengineering it.

### Prompt

> I am working on a full-stack take-home assignment for a shoppable video analytics dashboard. My background is mainly MERN. Help me break the assignment into small implementation phases. I want to use React, Node.js, Express, and SQLite. Keep the architecture simple, interview-friendly, and avoid unnecessary things like authentication, Redux, Docker, or microservices.

### Outcome

The project was divided into small phases:

- Backend setup
- SQLite database setup
- Database seeding
- Engagement event API
- Analytics API
- React frontend
- Dashboard table
- Pagination
- Traffic simulation
- Responsive styling
- Final testing and documentation

This helped me work incrementally and create meaningful Git commits instead of building everything in one large change.

### Manual Adjustments

I intentionally kept the project smaller than a typical production MERN application and avoided introducing an ORM or state management library because they were unnecessary for the assignment.

---

## Interaction 2 — Learning SQLite Setup

### Tool Used

ChatGPT

### Context / Task

My main experience is with MongoDB through MERN applications, so I wanted help setting up SQLite correctly in Node.js.

### Prompt

> My background is MERN and I normally use MongoDB. For this assignment I need to use SQLite with Node.js and Express. Show me a simple way to configure better-sqlite3, enable foreign keys, create a database file, and run a schema migration. I do not want to use Prisma, Sequelize, or another ORM because I want to understand and explain the SQL directly.

### Outcome

I used:

- `better-sqlite3`
- raw SQL
- a dedicated `db.js`
- `schema.sql`
- a migration script
- SQLite foreign key enforcement

The connection also enabled SQLite foreign key support.

### Manual Adjustments

I kept the database configuration inside:

```text
server/src/config/database/
```

instead of creating a more complex database layer.

---

## Interaction 3 — Designing the Relational Schema

### Tool Used

ChatGPT

### Context / Task

I needed to convert the assignment requirements into normalized SQL tables.

### Prompt

> Help me design a simple normalized SQLite schema for Products, Videos, and EngagementEvents. A product can have multiple videos and a video can have multiple engagement events. Event types should only allow view, click, and add_to_cart. Please also suggest only the indexes that are useful for the analytics query.

### Outcome

The database was designed with three related tables:

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

Foreign keys were used to maintain relational integrity.

Indexes were added around engagement event video lookups and event type aggregation.

### Manual Adjustments

I avoided adding unnecessary tables and kept the schema close to the assignment requirements.

Later, I added `image_url` and `category` to the product table to support more realistic seeded product data in the dashboard.

---

## Interaction 4 — Creating Seed Data

### Tool Used

ChatGPT

### Context / Task

I wanted enough sample data to properly test joins, aggregation, pagination, and videos with zero engagement.

### Prompt

> Help me create a reusable SQLite seed script using better-sqlite3. I want products, videos, and random engagement events. The seed should be safe to run multiple times. Do not assume generated IDs are always 1, 2, 3. Save lastInsertRowid and use the real IDs when inserting related records. Also leave one video with zero engagement so I can verify the LEFT JOIN analytics query.

### Outcome

The seed script:

- clears existing seed data
- deletes child records before parent records
- resets SQLite auto-increment counters
- stores actual generated IDs
- creates product/video relationships
- generates random engagement events
- intentionally leaves one video with no engagement

### Issue Found

The first approach relied too much on predictable IDs and failed when the seed script was run again.

### Adjustment

The seed logic was changed to use:

```text
lastInsertRowid
```

instead of assuming IDs.

This made the seed reusable.

---

## Interaction 5 — Using Realistic Product Seed Data

### Tool Used

ChatGPT

### Context / Task

The original seed data had generic product names. I wanted the dashboard to look more like a real e-commerce analytics application without adding an external runtime dependency.

### Prompt

> I have sample product JSON from Fake Store API containing title, price, category, image, description, and rating. I want to use this only as local seed data, not make my application depend on the API at runtime. Which fields should I store and how should I modify my SQLite seed script?

### Outcome

I decided to store only the fields needed by the dashboard:

```text
name
price
image_url
category
```

The full sample data was stored in a local:

```text
server/src/utility/products.json
```

file.

The seed script reads the JSON locally and inserts products into SQLite.

### Manual Adjustments

I intentionally did not store description and rating because the dashboard does not use them.

This kept the database focused on the assignment instead of copying the complete external API model.

---

## Interaction 6 — Building the Engagement Event API

### Tool Used

ChatGPT

### Context / Task

I needed an API endpoint to simulate incoming video engagement events.

### Prompt

> Help me implement POST /api/events in Express using better-sqlite3. The request should contain videoId and eventType. Validate that videoId is a positive integer, eventType is one of view, click, or add_to_cart, and the video exists before inserting the event. Keep the controller simple.

### Outcome

The endpoint validates:

- required values
- valid integer video ID
- allowed event types
- video existence

It then inserts the engagement event into SQLite.

### Manual Testing

I tested:

```text
Valid view event
Invalid event type
Unknown video ID
```

The endpoint returned the appropriate success and error responses.

---

## Interaction 7 — Building the Analytics SQL Query

### Tool Used

ChatGPT

### Context / Task

This was one of the areas where AI was most useful because my normal MERN projects rely more heavily on MongoDB queries than SQL aggregation.

### Prompt

> I need a SQLite query for GET /api/analytics/videos. Return every video with its product, total views, clicks, and add_to_cart conversions. A video with zero events must still appear. Please use raw SQL with JOIN, LEFT JOIN, CASE, SUM, and GROUP BY. Also add LIMIT and OFFSET pagination. Do not calculate conversion rate in the backend because the assignment requires that calculation on the frontend.

### Outcome

The analytics query uses:

```text
JOIN
LEFT JOIN
SUM
CASE
GROUP BY
LIMIT
OFFSET
```

The `LEFT JOIN` ensures that videos with no engagement events still appear.

### What I Learned

This helped reinforce why:

```text
INNER JOIN
```

would not be correct for engagement events because it could exclude videos that have no event records.

---

## Interaction 8 — Debugging Analytics Route Registration

### Tool Used

ChatGPT

### Context / Task

The analytics controller existed, but calling the endpoint returned:

```text
Cannot GET /api/analytics/videos
```

### Prompt

> My Express analytics controller and router exist, but GET /api/analytics/videos returns Cannot GET. Help me trace how the router should be registered in my existing app.routes.js structure instead of changing the whole backend architecture.

### Outcome

The issue was not the SQL query.

The analytics router had not been registered in the main route setup.

I added the analytics router under:

```text
/api/analytics
```

and the endpoint started working.

### Manual Adjustment

I kept the existing centralized `app.routes.js` structure instead of registering routes directly in `app.js`.

---

## Interaction 9 — Fixing Pagination Validation

### Tool Used

ChatGPT

### Context / Task

While testing pagination I found that:

```text
page=0
```

was unexpectedly being treated as page 1.

### Prompt

> My pagination code uses Number(req.query.page) || 1. When I send page=0, it falls back to page 1 instead of returning a validation error. Explain why and show me a simple fix that still defaults to 1 only when the query parameter is missing.

### Outcome

The problem was caused by JavaScript treating:

```text
0
```

as a falsy value.

The parsing logic was changed so the default is applied only when the query parameter is absent.

After the fix:

```text
page=0
```

correctly returns an invalid pagination response.

---

## Interaction 10 — Setting Up the React Frontend

### Tool Used

ChatGPT

### Context / Task

I wanted a minimal React frontend with a clean structure and no unnecessary dependencies.

### Prompt

> Help me set up the React/Vite frontend for this dashboard. I want a small API service using fetch, CSS Modules for styling, and simple components. Do not use Tailwind, Redux, Axios, or other dependencies unless they are necessary.

### Outcome

The frontend was organized around:

```text
App.jsx
services/
components/
styles/
```

A small service handles communication with the backend API.

### Manual Adjustments

I removed unnecessary Vite starter styling and kept CSS Modules as the only styling approach.

---

## Interaction 11 — Building the Analytics Dashboard

### Tool Used

ChatGPT

### Context / Task

I needed to display the backend analytics results in a readable table.

### Prompt

> Help me create a React analytics table that displays video title, product information, views, clicks, conversions, and conversion rate. Conversion rate must be calculated in React using conversions / views. Handle zero views without producing NaN or Infinity.

### Outcome

The conversion rate is calculated with:

```text
conversions / views * 100
```

and returns:

```text
0.00%
```

when views are zero.

### Manual Adjustments

Later I added product image, category, and price presentation after improving the seed data.

---

## Interaction 12 — Adding Pagination to React

### Tool Used

ChatGPT

### Context / Task

The backend already supported pagination, so I needed simple Previous and Next controls in React.

### Prompt

> My analytics API returns page, limit, total, and totalPages. Help me create a simple React pagination component with Previous and Next buttons. Previous should be disabled on page 1 and Next should be disabled on the last page. Changing the page should refetch analytics.

### Outcome

A reusable pagination component was created.

The current page is stored in React state and triggers a new analytics request when changed.

---

## Interaction 13 — Implementing Simulate Traffic

### Tool Used

ChatGPT

### Context / Task

The assignment required a button that creates a random engagement event and refreshes analytics.

### Prompt

> Help me implement the Simulate Traffic requirement. When the user clicks the button, select a random video, select one random event type from view, click, and add_to_cart, POST it to /api/events, then fetch the analytics again. Disable the button while the request is running.

### Outcome

The flow became:

```text
Simulate Traffic
      |
      v
Choose random video
      |
      v
Choose random event
      |
      v
POST /api/events
      |
      v
Database updated
      |
      v
Refetch analytics
      |
      v
Dashboard updates
```

This was also useful for manually demonstrating the complete frontend-to-database flow.

---

## Interaction 14 — Cleaning Duplicate CSS and Responsiveness

### Tool Used

ChatGPT

### Context / Task

After multiple UI iterations, several CSS Module files contained repeated selectors and older styling.

### Prompt

> Review my latest frontend styles and help me remove duplicate CSS rules. Also improve responsiveness without redesigning the dashboard. The table has six analytics columns, so on smaller screens it is okay to scroll horizontally instead of squeezing everything together.

### Outcome

Duplicate rules were removed from:

```text
App.module.css
AnalyticsTable.module.css
DashboardHeader.module.css
Pagination.module.css
TrafficSimulator.module.css
```

The old unused Vite `index.css` was also removed.

Responsive behavior was improved for:

- dashboard spacing
- header layout
- Simulate Traffic button
- pagination
- analytics table

### Manual Adjustment

I kept horizontal scrolling for the analytics table on small screens because displaying six compressed columns would reduce readability.

---

## Interaction 15 — Adding Product Images to Analytics

### Tool Used

ChatGPT

### Context / Task

After switching to more realistic product seed data, I wanted the dashboard to display product thumbnails.

### Prompt

> I added image_url and category to my products table and seeded the values from a local products.json file. Help me return those fields from the analytics SQL query and display a small product image, name, category, and price in the existing analytics table. Keep the table responsive.

### Outcome

The analytics response now includes:

```json
{
  "product": {
    "id": 1,
    "name": "Product Name",
    "price": 109.95,
    "imageUrl": "https://...",
    "category": "category"
  }
}
```

The React table displays the product thumbnail with its associated metadata.

---

## How AI Was Used

AI was mainly used for:

- speeding up architecture planning
- learning SQLite patterns that were less familiar to me than MongoDB
- reviewing SQL aggregation queries
- debugging implementation issues
- checking edge cases
- reducing repetitive boilerplate work
- reviewing frontend responsiveness
- improving development speed within the time limit

I still tested each major feature locally before moving to the next phase.

---

## Key Areas I Reviewed Manually

Before keeping AI-assisted code, I specifically reviewed and tested:

- SQLite foreign key relationships
- table creation
- seed reusability
- generated database IDs
- event validation
- SQL joins
- SQL aggregation
- zero-event video behavior
- pagination
- frontend conversion calculation
- API error states
- Simulate Traffic behavior
- responsive layout
- production frontend build

---

## Main Learning From AI Collaboration

The most useful AI assistance was around SQLite and relational SQL because my previous development experience is primarily MERN-based.

Instead of adding an ORM to hide the SQL, I chose to work directly with:

```text
better-sqlite3
JOIN
LEFT JOIN
GROUP BY
SUM
CASE
LIMIT
OFFSET
```

This made the implementation easier to understand and also gave me a clearer understanding of how the analytics data is aggregated at the database level.

AI helped reduce research and boilerplate time, while I remained responsible for testing, debugging, architectural decisions, and the final implementation.
