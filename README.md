# Quiz API

## Assignment

The assignment is to build a light weight restful API server to power a quiz UI.

## Functional requirements

- Implement 2 API resources
  - A Quiz resource, providing at a minimum a title, description and candidate instructions.
  - A Question resource. This should support both free text and multiple choice questions.
  - Any additional resources you feel are necessary for a functional client experience.
- The API should follow the [OpenAPI v3](https://swagger.io/specification/) and [JSON:API](https://jsonapi.org/) Specifications.
- Provide implementations for CRUD operations for all resources.
- The server should persist data records to a NoSQL database.

## Tech stack

Your solution should be written in typescript. Preferably use an express powered server to host the API.

Feel free to use whatever tools you’re comfortable with (IDE, workflow, AI assistants/LLMs), just as you would in your normal day-to-day work.

This repository has already been bootstrapped to provide the basic project structure, extend it as you need.

## Timebox

You should aim to spend no more than 3 hours. If you don’t finish everything, that’s fine. We’ll talk about trade-offs during the interview.

## Submission

Send a link to the repo, which should contain a short README.md with:

- Instructions to run
- Time spent
- Any trade-offs made and what you would improve with more time

If you choose to use this repository as your base, please do not create a public fork.

## Using this repo

This repository provides a basic application containing an express server with stubbed routes for quiz and question.

To run:

```
npm install
npm run build
npm run start
```

To run in debug:

```
npm install
npm run debug
```

---

## Implementation Details

### Features Implemented

✅ **Core Requirements:**

- Quiz resource with title, description, and candidate instructions
- Question resource supporting both free-text and multiple-choice questions
- Full CRUD operations for both resources
- MongoDB Atlas for data persistence
- OpenAPI v3 specification with interactive Swagger UI
- JSON:API compliant responses

✅ **Additional Features:**

- Many-to-many relationship between quizzes and questions
- Questions can belong to multiple quizzes
- Relationship endpoints for fetching quiz questions
- Environment variable configuration for security
- Cascade cleanup when quizzes are deleted
- **Quiz play functionality** - Start a quiz, answer questions, get scored

## Instructions to Run

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB Atlas account

#### Using MongoDB Compass

You can use [MongoDB Compass](https://www.mongodb.com/products/compass) to visually explore and manage the database:

1. **Download and install MongoDB Compass** (if you haven't already)

2. **Connect to the Docker MongoDB instance**

   Use this connection string:

   ```
   mongodb://quiz_user:quiz_password@localhost:27017/quiz-api?authSource=quiz-api
   ```

   Or if you customized credentials in your `.env` file:

   ```
   mongodb://<MONGO_APP_USER>:<MONGO_APP_PASSWORD>@localhost:27017/<MONGO_DATABASE>?authSource=<MONGO_DATABASE>
   ```

3. **Browse collections**

   Once connected, you can:

   - View all quizzes and questions
   - Execute queries and aggregations
   - Analyze indexes and performance
   - Export/import data

4. **Access the API**
   - API Server: http://localhost:3001
   - Swagger UI Documentation: http://localhost:3001/api-docs

### API Endpoints

**Quizzes:**

- `POST /quizzes` - Create a new quiz
- `GET /quizzes` - Get all quizzes
- `GET /quizzes/:id` - Get a quiz by ID
- `GET /quizzes/:id/questions` - Get all questions for a specific quiz
- `PATCH /quizzes/:id` - Update a quiz
- `DELETE /quizzes/:id` - Delete a quiz

**Questions:**

- `POST /questions` - Create a new question
- `GET /questions` - Get all questions
- `GET /questions/:id` - Get a question by ID
- `PATCH /questions/:id` - Update a question
- `DELETE /questions/:id` - Delete a question

## Time Spent

**Total: ~3 hours**

- Project setup and MongoDB integration: 40 minutes
- CRUD operations implementation: 50 minutes
- JSON:API compliance and error handling: 20 minutes
- Swagger/OpenAPI documentation: 20 minutes
- Relationship endpoints and many-to-many support: 20 minutes
- Environment variables and MongoDB Atlas setup: 10 minutes
- Documentation updates (README guide): 10 minutes
- Jest testing setup and comprehensive integration tests: 30 minutes

## Trade-offs Made

Due to the 3-hour time constraint, the following trade-offs were made:

1. **Authentication/Authorization** - Not implemented. All endpoints are publicly accessible.

   - Would add: JWT-based authentication, role-based access control

2. **Input Validation** - Basic validation exists but could be more comprehensive.

   - Would add: joi or zod for schema validation, detailed error messages

3. **Testing** - ✅ **Comprehensive integration tests implemented**

   - Implemented: Complete integration test suite with Jest and Supertest covering:
     - Quiz and Question CRUD operations
     - Many-to-many relationships between quizzes and questions
     - JSON:API compliance verification
     - Cascade deletion behavior
     - Edge cases (2 quizzes, 5 questions each, 5 shared questions)
   - Would add: More granular unit tests for controllers and models, edge case testing, error scenario testing

4. **Pagination** - GET endpoints return all records without pagination.

   - Would add: Cursor-based or offset pagination with metadata

5. **Error Handling** - Basic error handling exists but could be more granular.
   - Would add: Custom error classes, detailed error codes, structured logging

## What I Would Improve With More Time

### Data Validation & Constraints

- Add mongoose validators for better data integrity
- Validate quiz IDs exist when creating/updating questions
- Add unique constraints where appropriate

### API Enhancements

- Add filtering, sorting, and search capabilities
- Implement sparse fieldsets (JSON:API feature)
- Add bulk operations (create/update multiple resources)
- Add question ordering within quizzes
- API versioning strategy

### Performance

- Add database indexing for commonly queried fields
- Implement caching (Redis) for frequently accessed data
- Add request rate limiting
- Connection pooling optimization

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Documentation:** Swagger UI with OpenAPI 3.0
- **Environment:** dotenv for configuration

