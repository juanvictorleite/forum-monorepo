import {
  AnswersRepository,
  NotificationsRepository,
  OnAnswerCreated,
  OnBestAnswerChosen,
  QuestionsRepository,
  SendNotificationUseCase,
} from '@forum/domain';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: OnAnswerCreated,
      useFactory: (
        questionsRepository: QuestionsRepository,
        sendNotificationUseCase: SendNotificationUseCase,
      ) => {
        return new OnAnswerCreated(
          questionsRepository,
          sendNotificationUseCase,
        );
      },
      inject: [QuestionsRepository, SendNotificationUseCase],
    },
    {
      provide: OnBestAnswerChosen,
      useFactory: (
        answersRepository: AnswersRepository,
        sendNotificationUseCase: SendNotificationUseCase,
      ) => {
        return new OnBestAnswerChosen(
          answersRepository,
          sendNotificationUseCase,
        );
      },
      inject: [AnswersRepository, SendNotificationUseCase],
    },
    {
      provide: SendNotificationUseCase,
      useFactory: (notificationsRepository: NotificationsRepository) => {
        return new SendNotificationUseCase(notificationsRepository);
      },
      inject: [NotificationsRepository],
    },
  ],
})
export class EventsModule {}
