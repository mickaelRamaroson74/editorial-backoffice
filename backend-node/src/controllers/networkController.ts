import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { CreateNetworkInput, UpdateNetworkInput } from '../types';

export const networkController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const networks = await prisma.network.findMany();
      res.json({ success: true, data: networks });
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const network = await prisma.network.findUnique({ where: { id: id as string } });
      if (!network) {
        res.status(404).json({ success: false, message: 'Network not found' });
        return;
      }
      res.json({ success: true, data: network });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as CreateNetworkInput;
      const network = await prisma.network.create({ data });
      res.status(201).json({ success: true, data: network });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body as UpdateNetworkInput;
      const network = await prisma.network.update({
        where: { id: id as string },
        data,
      });
      res.json({ success: true, data: network });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.network.delete({ where: { id: id as string } });
      res.json({ success: true, message: 'Network deleted' });
    } catch (error) {
      next(error);
    }
  },
};
