# About The Project

This is a competitive math quiz website where users can solve questions and compete with each other to get the highest score.

## Tech Stack

- Next.js
- TailwindCSS
- Postgres with Prisma as ORM

## Features

- Dynamic Question Generation
  - When there are no questions left, a new question is generated and added to the database.
- Leaderboard to track high scores
  - Users can see the leaderboard on the home page.
- Account for network latency
  - When multiple users solve the question at the same time, the first user to submit the answer is declared as the winner.
  - But due to network latency, the request from some users may be delayed. So we give a 5 second window before declaring the next user as the winner.
  - Here we use client's timestamp to detect who submitted first. ** This is not a most secure way to get the accurate time because the client time can be easily manipulated.** We need a claver approach here (which needs to be brainstormed).
- Concurrency Control
  - We use database transactions to ensure that only one user can solve the question at a time.

## Start The Project

```bash
# Install dependencies
yarn install

# Start the project
yarn dev
```

## Deploy the project

- The project is deployed on Vercel. 
- Because we are using Prisma, we need to generate the Prisma client before deploying the project. Build command in package.json is configured to do that.
- Make sure to set the DATABASE_URL in the Vercel project dashboard.
