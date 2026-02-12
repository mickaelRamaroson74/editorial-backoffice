import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const dashboardController = {
  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [articles, categories, networks, notifications] = await Promise.all([
        prisma.article.findMany({
          include: { categories: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.category.findMany(),
        prisma.network.findMany(),
        prisma.emailNotification.findMany({
          orderBy: { sentAt: 'desc' },
          take: 10,
        }),
      ]);

      res.json({
        success: true,
        data: {
          articles,
          categories,
          networks,
          notifications,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
