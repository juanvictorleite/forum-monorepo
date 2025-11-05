# Forum Project with DDD and Clean Architecture

This project implements a forum application using Node.js, adhering to Domain-Driven Design (DDD) principles and Clean Architecture. The goal is to create a robust, scalable, and maintainable application by clearly separating concerns and focusing on the core business domain.

## Architecture Overview

The project is structured to reflect Clean Architecture, with a clear separation between the core domain, application layer, and infrastructure concerns.

### Core Layer (`src/core`)

This layer contains foundational, reusable components that are independent of any specific domain logic.

*   **Entities**: Base classes for domain entities (`entity.ts`, `aggregate-root.ts`) and value objects (`unique-entity-id.ts`).
*   **WatchedList**: The `watched-list.ts` utility provides a mechanism to manage collections of items (e.g., attachments) within an aggregate, tracking additions, removals, and changes. This helps in efficiently persisting changes to related entities.
*   **Errors**: Custom error classes (`use-case-error.ts`, `not-allowed-error.ts`, `resource-not-found-error.ts`) for consistent error handling across use cases.
*   **Events**: Implementation of Domain Events (`domain-event.ts`, `domain-events.ts`, `event-handler.ts`) to enable decoupled communication and side effects within the domain.
*   **Repositories**: Defines common repository concerns like `pagination-params.ts`.
*   **Either Pattern**: The `either.ts` utility implements the `Either` monad, a functional programming pattern used for explicit error handling and representing operations that can result in success or failure.

### Domain Layer (`src/domain`)

This layer encapsulates the core business logic of the forum application, divided into distinct bounded contexts.

#### Forum Bounded Context (`src/domain/forum`)

This context handles all functionalities related to questions, answers, comments, and attachments.

*   **Enterprise Entities (`src/domain/forum/enterprise/entities`)**:
    *   **Aggregates**: `question.ts` (Question with its attachments and comments), `answer.ts` (Answer with its attachments and comments).
    *   **Entities**: `attachment.ts`, `comment.ts`, `instructor.ts`, `student.ts`.
    *   **Value Objects**: Specific value objects related to forum entities (e.g., `slug.ts` for question slugs).
*   **Application Layer (`src/domain/forum/application`)**:
    *   **Repositories (`src/domain/forum/application/repositories`)**: Interfaces defining contracts for data persistence for each aggregate root (e.g., `questions-repository.ts`, `answers-repository.ts`, `answer-attachments-repository.ts`). These interfaces are implemented in the infrastructure layer.
    *   **Use Cases (`src/domain/forum/application/use-cases`)**: Contains the application-specific business rules and orchestrates interactions between domain entities and repositories. Examples include `create-question.ts`, `answer-question.ts`, `choose-question-best-answer.ts`, `comment-on-question.ts`, `edit-question.ts`, `delete-question.ts`, and various fetch operations. Each use case is a single, atomic operation.

#### Notification Bounded Context (`src/domain/notification`)

This context manages all notification-related functionalities.

*   **Enterprise Entities (`src/domain/notification/enterprise/entities`)**:
    *   **Entities**: `notification.ts`.
*   **Application Layer (`src/domain/notification/application`)**:
    *   **Repositories (`src/domain/notification/application/repositories`)**: Interface for `notifications-repository.ts`.
    *   **Use Cases (`src/domain/notification/application/use-cases`)**: `send-notification.ts`, `read-notification.ts`.

## Design Patterns Used

*   **Domain-Driven Design (DDD)**: The entire project is structured around DDD principles, focusing on a rich domain model, ubiquitous language, bounded contexts, entities, value objects, and aggregates.
*   **Clean Architecture**: The project adheres to Clean Architecture by separating the application into distinct layers (Core, Domain, Application, Infrastructure - though Infrastructure is not fully detailed in this README, its presence is implied by repository interfaces). This ensures independence from frameworks, UI, and databases.
*   **Repository Pattern**: Used extensively to abstract data access, allowing the domain and application layers to remain independent of specific database implementations.
*   **Factory Pattern**: Utilized in the `test/factories` directory to create test data for entities, promoting consistent and reusable test setup.
*   **Either Monad**: Implemented in `src/core/either.ts` for robust and explicit error handling in use cases.
*   **Observer Pattern (via Domain Events)**: The `src/core/events` module implements a mechanism for domain events and event handlers, allowing for decoupled reactions to significant occurrences within the domain.
*   **Value Objects**: Used for concepts like `UniqueEntityId` and `Slug` to ensure immutability and encapsulate business rules.
*   **Aggregates**: Entities like `Question` and `Answer` act as aggregate roots, ensuring transactional consistency within their boundaries.

## Testing

The project emphasizes comprehensive testing to ensure the reliability and correctness of the application. Tests are written using Vitest and organized to reflect the project's layered architecture.

*   **Unit Tests**: Located alongside the code they test (e.g., `*.spec.ts` files within `src/`). These tests focus on individual units of code, such as entities, value objects, and use cases, ensuring their internal logic works as expected.
*   **In-Memory Repositories**: The `test/repositories` directory contains in-memory implementations of repository interfaces. These are used in unit and integration tests to isolate the application and domain layers from actual database interactions, making tests faster and more reliable.
*   **Test Factories**: The `test/factories` directory provides helper functions to create valid domain entities and aggregates for testing purposes, simplifying test setup and promoting consistency.

## About Domain-Driven Design (DDD)

**Domain-Driven Design (DDD)** is an approach to software design that focuses on understanding and modeling the **core business domain** through close collaboration between developers and domain experts.  
Its goal is to align software structures and language with real-world business concepts.

---

## Domain

The **domain** represents the core knowledge and activities that define a business or problem space.  
In DDD, everything revolves around understanding and modeling this domain accurately.

### Domain Experts
- Specialists who deeply understand the business or problem area.  
- Developers collaborate with them to translate knowledge into software models.

### Ubiquitous Language
- A shared vocabulary between developers and domain experts.  
- Used consistently in code, discussions, and documentation to avoid misunderstandings.

---

## Example Domain Actors

Different user types or roles can exist within a domain, such as:
- Client  
- Supplier  
- Attendant  
- Bartender

---

## Core Building Blocks

### Entities
- Have a unique identity that persists over time.  
- Example: `Customer`, `Order`.

### Value Objects
- Represent attributes or measurements without identity.  
- Example: `Money`, `Address`.

### Aggregates
- A cluster of entities and value objects treated as a single unit.  
- Defined by a root entity that controls access to the rest of the aggregate.

### Domain Events
- Represent something significant that happened within the domain.  
- Example: `OrderPlaced`, `PaymentReceived`.

---

## Subdomains and Bounded Contexts

### Subdomains
- Distinct parts of the overall domain, each with its own logic and rules.  
- Example: `Billing`, `Inventory`, `Customer Management`.

### Bounded Contexts
- Define clear boundaries where a particular model applies.  
- Prevents ambiguity when the same term means different things across contexts.

---

## Use Cases
- Define how the system’s domain logic solves real-world business problems.  
- Serve as the bridge between domain models and application behavior.