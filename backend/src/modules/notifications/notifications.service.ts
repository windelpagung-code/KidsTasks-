import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async create(data: {
    userId?: string;
    childId?: string;
    type: string;
    title: string;
    body: string;
    channels?: string[];
  }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        childId: data.childId,
        type: data.type,
        title: data.title,
        body: data.body,
        sentChannels: (data.channels || ['in_app']).join(','),
      },
    });
  }
}
