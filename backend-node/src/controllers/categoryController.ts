import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { CreateCategoryInput, UpdateCategoryInput } from '../types';

export const categoryController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await prisma.category.findUnique({ where: { id: id as string } });
      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as CreateCategoryInput;
      const category = await prisma.category.create({ data });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body as UpdateCategoryInput;
      const category = await prisma.category.update({
        where: { id: id as string },
        data,
      });
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.category.delete({ where: { id: id as string } });
      res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  },
};
