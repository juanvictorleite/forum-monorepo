import type { AggregateRoot } from "../entities/aggregate-root";
import type { UniqueEntityID } from "../entities/value-objects/unique-entity-id";
import type { DomainEvent } from "./domain-event";

type DomainEventCallback = (event: DomainEvent) => void;

// biome-ignore lint/complexity/noStaticOnlyClass: This class is intentionally designed with only static members to manage domain events globally.
export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: AggregateRoot<unknown>[] = [];

  public static shouldRun = true;

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!DomainEvents.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      DomainEvents.markedAggregates.push(aggregate);
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) => {
      DomainEvents.dispatch(event);
    });
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = DomainEvents.markedAggregates.findIndex((a) =>
      a.equals(aggregate),
    );

    DomainEvents.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return DomainEvents.markedAggregates.find((aggregate) =>
      aggregate.id.equals(id),
    );
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = DomainEvents.findMarkedAggregateByID(id);

    if (aggregate) {
      DomainEvents.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      DomainEvents.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in DomainEvents.handlersMap;

    if (!wasEventRegisteredBefore) {
      DomainEvents.handlersMap[eventClassName] = [];
    }

    DomainEvents.handlersMap[eventClassName]?.push(callback);
  }

  public static clearHandlers() {
    DomainEvents.handlersMap = {};
  }

  public static clearMarkedAggregates() {
    DomainEvents.markedAggregates = [];
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name;

    const isEventRegistered = eventClassName in DomainEvents.handlersMap;

    if (!DomainEvents.shouldRun) {
      return;
    }

    if (isEventRegistered) {
      const handlers = DomainEvents.handlersMap[eventClassName];

      if (!handlers) return;

      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
