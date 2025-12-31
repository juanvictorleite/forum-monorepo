import {
  OnAnswerCreated,
  OnBestAnswerChosen,
  SendNotificationUseCase,
} from '@forum/domain';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [OnAnswerCreated, OnBestAnswerChosen, SendNotificationUseCase],
})
export class EventsModule {}
