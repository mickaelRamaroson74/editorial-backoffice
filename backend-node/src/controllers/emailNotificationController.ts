import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { CreateEmailNotificationInput } from '../types';

export const emailNotificationController = {
  // Get all notifications
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await prisma.emailNotification.findMany({
        orderBy: { sentAt: 'desc' },
      });
      res.json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  },

  // Create (simulate sending) notification
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipients, ...data } = req.body as CreateEmailNotificationInput;
      
      // Simulate sending email (in a real app, you'd use a mailer service here)
      // For now, we just save the record.
      // Recipients array is serialised to JSON string for SQLite storage
      
      const notification = await prisma.emailNotification.create({
        data: {
          ...data,
          recipients: JSON.stringify(recipients),
          status: 'sent', // Assume success for simulation
        },
      });

      res.status(201).json({ success: true, data: notification });
    } catch (error) {
      next(error);
    }
  },
};
