                ## OVERVIEW

- User authentication (register/login)
- Posting and managing questions and answers
- Subscribing to questions
- notifications for new answers to subscribed questions
- JWT-based authentication
- MongoDB for data storage



                ## Key Components:
- controllers/: Handles the business logic for the application (auth, questions, subscriptions, and notifications)

- models/: Contains data schema and models that interface with the database

- routes/: Defines the REST API endpoints for each resource

- config/: Centralized configuration for the service & environment variables

- middleware/: Function that process requests before they reach controllers, typically for security, validation or error handling

- database: MongoDB connection using Mongoose.

- app.ts: Express app initialization and route registration.




- Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npx ts-node src/app.ts` to start the server

- User Authentication:

1. signup and log in with JWT-based authentication
2. Users can register with unique usernames and emails
3. Password encryption using bcrypt

- Questions:

1. users with authentication can post questions
2. Each question can have a title, body, tags(id)
3. Users can view all questions

- Answer Posting:

1. Users can post answers to questions
2. Each answer is tied to a question and has timestamps

- Rating System:

1. Upvote or downvote questions and answers



 # STEPS 

1. User get's registered
2. Login with correct credentials  - email and password
3. Create a question - token, author id 
4. Get Questions 
5. subscribe/unscribe to a question - token, userid, and questionId 
7. Answer a specific question - token, questionId, author(id) 
8. upvote/downvote question - token, answerid
