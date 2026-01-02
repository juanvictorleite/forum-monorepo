import { Notification, NotificationProps } from '@forum/domain';
import { makeNotification } from '@forum/domain/test';
import { Injectable } from '@nestjs/common';
import { PrismaNotificationMapper } from 'src/database/prisma/mappers/prisma-notification-mapper';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data);

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
