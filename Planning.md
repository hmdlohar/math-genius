## Planning out the `Math-Genius` Project

## Requirements

Create a Competitive Math Quiz website. A Url will display a math problem with a text field for the
answer. Multiple users can view the same problem on the site. The first user to provide the answer is
the winner. The question will keep changing once the winner is decided. Think about the following -
- How will you handle concurrency to detect the first solution?
- Can you dynamically generate the questions?
- It should account various network conditions and speeds
- Bonus: Track User High Scores


## Mindstorming

1. We will require a database to store the questions and Correct Answer. 
    - We will use postgres for this project. 
    - A table to store questions and the correct answer with the status of `solved`. 
    - Once the question is solved, It should not appear again. 

2. We need to also store users, We are not going to implement full authentication, but we will store a `username` Only. 

3. We will use Next.js api routes to create controllers for our endpoints. 

4. How will you handle concurrency to detect the first solution?
    - This is a tricky one, We need to use database transactions to ensure that only one user can solve the question.
5. Can you dynamically generate the questions?
    - By maintaining a state of question as `solved` we can avoid fetching the same question again.

6. It should account various network conditions and speeds
    - Here a problem can occur because of network speed. In realtime a user may submit first but due to network latency the request may be submitted last.
    - We will send server's timestamp when sending question to client. Then client will send relative milliseconds to server. This way we can detect who submitted first.
    - We also need to store `solved_at` timestamp in database to ensure that the user is the first one to submit the answer.
    - Before declaring the user as winner we need to wait for some time (5 seconds) to ensure that another entry is not submitted.


7. Bonus: Track User High Scores
    - We will maintain a table to store the username and the number of questions they have solved.
    - We will use this data to display the high scores on the home page.


## Tech Stack

- Next.js 
- TailwindCSS for styling
- Postgres with Prisma as ORM
- App Router for Pages and API Routes
