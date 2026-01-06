# Q&A Forum API

A Questions & Answers forum API built with **NestJS**, following **Clean Architecture** and **Domain-Driven Design** principles.

## Overview

This project is the back-end for a Q&A forum platform similar to Stack Overflow. Users can register, create questions, post answers, comment on questions and answers, and receive notifications.

The application was designed with **scalability**, **maintainability**, and **testability** in mind, using Clean Architecture to clearly separate concerns and keep business rules independent from frameworks and infrastructure.

## Tech Stack

### API

- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Jest
- **Cache:** Redis
- **File Uploads:** Attachment upload support (e.g. R2 Storage)
- **Linting:** ESLint
- **Validation:** Zod

### Domain

  - **Language:** TypeScript
  - **Testing:** Vitest
  - **Linting:** Biome
  - **Utility:** Day.js
  - **Design Patterns:** Repository Pattern, Factory Pattern, Either Monad, Observer Pattern (via Domain Events), Value Objects, Aggregates

## Architecture

The project follows **Clean Architecture**, organizing the codebase into clear and well-defined layers:

- `packages/domain/src/core`  

  Contains the most generic business rules and core domain building blocks (Entities, Value Objects, Use Cases, etc.).

- `packages/domain/src/domain`  

  Contains application-specific business logic, organized by bounded contexts (e.g. `forum`, `notification`).

- `apps/api`  

  Contains infrastructure and framework-specific implementations such as HTTP controllers, NestJS modules, database access, and external services.

- `packages/domain/test` and `apps/api/test`
  
  Contains unit tests, end-to-end (E2E) tests and some testing utilities.

This structure helps keep the business logic independent, easy to test, and resilient to changes in frameworks or external tools.

## API Endpoints

### Authentication

- `POST /sessions`  
  Authenticates a user and returns an `access_token`.

- `POST /accounts`  
  Creates a new user account.

### Questions

- `POST /questions`  
  Creates a new question.

- `GET /questions`  
  Lists the most recent questions.

- `GET /questions/:slug`  
  Retrieves a question by its slug.

- `PUT /questions/:id`  
  Updates a question.

- `DELETE /questions/:id`  
  Deletes a question.

### Answers

- `POST /questions/:questionId/answers`  
  Adds an answer to a question.

- `GET /questions/:questionId/answers`  
  Lists all answers for a question.

- `PUT /answers/:id`  
  Updates an answer.

- `DELETE /answers/:id`  
  Deletes an answer.

- `PATCH /answers/:answerId/choose-as-best`  
  Marks an answer as the accepted (best) answer.

### Comments

- `POST /questions/:questionId/comments`  
  Adds a comment to a question.

- `GET /questions/:questionId/comments`  
  Lists comments for a question.

- `DELETE /questions/comments/:id`  
  Deletes a comment from a question.

- `POST /answers/:answerId/comments`  
  Adds a comment to an answer.

- `GET /answers/:answerId/comments`  
  Lists comments for an answer.

- `DELETE /answers/comments/:id`  
  Deletes a comment from an answer.

### Attachments

- `POST /attachments`  
  Uploads an attachment.

### Notifications

- `PATCH /notifications/:notificationId/read`  
  Marks a notification as read.
