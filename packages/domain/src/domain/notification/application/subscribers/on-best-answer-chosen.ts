import type { DomainEvent } from "@/core/events/domain-event";
import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { BestAnswerChosenEvent } from "@/domain/forum/enterprise/events/best-answer-chosen-event";
import type { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";

export class OnBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendBestAnswerChosenNotification.bind(this),
      BestAnswerChosenEvent.name,
    );
  }

  private async sendBestAnswerChosenNotification(event: DomainEvent) {
    const { bestAnswerId, question } = event as BestAnswerChosenEvent;

    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: "Your answer has been chosen as the best answer!",
        content: `The answer you submitted for "${question.title
          .substring(0, 20)
          .concat("...")}" was chosen by the author!"`,
      });
    }
  }
}
