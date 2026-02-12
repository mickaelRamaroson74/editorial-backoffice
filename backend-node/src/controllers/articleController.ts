import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { CreateArticleInput, UpdateArticleInput } from '../types';

export const articleController = {
  // Get all articles with filtering and pagination
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        search,
        status,
        categories,
        network,
        featured,
        page = '1',
        perPage = '20',
      } = req.query;

      // Build where clause dynamically
      const where: any = {};

      // Search filter (title or content)
      if (search && typeof search === 'string') {
        where.OR = [
          { title: { contains: search } },
          { content: { contains: search } },
        ];
      }

      // Status filter
      if (status && typeof status === 'string') {
        where.status = status;
      }

      // Network filter
      if (network && typeof network === 'string') {
        where.network = network;
      }

      // Featured filter
      if (featured && typeof featured === 'string') {
        where.featured = featured === 'true';
      }

      // Categories filter (many-to-many)
      if (categories && typeof categories === 'string') {
        const categoryIds = categories.split(',').filter(Boolean);
        if (categoryIds.length > 0) {
          where.categories = {
            some: {
              id: { in: categoryIds },
            },
          };
        }
      }

      // Pagination
      const pageNum = parseInt(page as string, 10);
      const perPageNum = parseInt(perPage as string, 10);
      const skip = (pageNum - 1) * perPageNum;

      // Execute query with filters and pagination
      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          include: { categories: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: perPageNum,
        }),
        prisma.article.count({ where }),
      ]);

      const totalPages = Math.ceil(total / perPageNum);

      res.json({
        success: true,
        data: articles,
        meta: {
          total,
          page: pageNum,
          perPage: perPageNum,
          totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get one article
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const article = await prisma.article.findUnique({
        where: { id: id as string },
        include: { categories: true },
      });

      if (!article) {
        res.status(404).json({ success: false, message: 'Article not found' });
        return;
      }
      res.json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  },

  // Create article
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryIds, ...data } = req.body as CreateArticleInput;
      
      const article = await prisma.article.create({
        data: {
          ...data,
          categories: categoryIds ? {
            connect: categoryIds.map((id) => ({ id })),
          } : undefined,
        },
        include: { categories: true },
      });
      res.status(201).json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  },

  // Update article
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { categoryIds, publishedAt, ...data } = req.body as UpdateArticleInput;

      // Handle Date parsing if needed, though Zod checks string format
      const publishedAtDate = publishedAt ? new Date(publishedAt) : undefined;

      const article = await prisma.article.update({
        where: { id: id as string },
        data: {
          ...data,
          publishedAt: publishedAtDate,
          categories: categoryIds ? {
            set: categoryIds.map((id) => ({ id })),
          } : undefined,
        },
        include: { categories: true },
      });
      res.json({ success: true, data: article });
    } catch (error) {
      next(error);
    }
  },

  // Delete article
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.article.delete({ where: { id: id as string } });
      res.json({ success: true, message: 'Article deleted' });
    } catch (error) {
      next(error);
    }
  },
};
