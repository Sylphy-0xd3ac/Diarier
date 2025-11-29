import Router from '@koa/router';
import type { Context } from 'koa';
import { Diary } from '../models/Diary.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = new Router({ prefix: '/api/diaries' });

// Get all diaries
router.get('/', authMiddleware, async (ctx: Context) => {
  try {
    const diaries = await Diary.find().sort({ updatedAt: -1 });
    ctx.body = {
      success: true,
      data: diaries.map(d => ({
        id: d.id,
        title: d.title,
        content: d.content,
        date: d.date,
        createdAt: d.createdAt.getTime(),
        updatedAt: d.updatedAt.getTime(),
      })),
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { success: false, error: 'Failed to fetch diaries' };
  }
});

// Save diary (create or update)
router.post('/', authMiddleware, async (ctx: Context) => {
  try {
    const { id, title, content, date } = ctx.request.body as {
      id: string;
      title: string;
      content: string;
      date: string;
    };

    if (!id || !title || !content || !date) {
      ctx.status = 400;
      ctx.body = { success: false, error: 'Missing required fields' };
      return;
    }

    let diary = await Diary.findOne({ id });
    if (diary) {
      diary.title = title;
      diary.content = content;
      diary.date = date;
      diary.updatedAt = new Date();
    } else {
      diary = new Diary({
        id,
        title,
        content,
        date,
      });
    }

    await diary.save();

    ctx.body = {
      success: true,
      data: {
        id: diary.id,
        title: diary.title,
        content: diary.content,
        date: diary.date,
        createdAt: diary.createdAt.getTime(),
        updatedAt: diary.updatedAt.getTime(),
      },
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { success: false, error: 'Failed to save diary' };
  }
});

// Delete diary
router.delete('/:id', authMiddleware, async (ctx: Context) => {
  try {
    const { id } = ctx.params;

    const result = await Diary.deleteOne({ id });

    if (result.deletedCount === 0) {
      ctx.status = 404;
      ctx.body = { success: false, error: 'Diary not found' };
      return;
    }

    ctx.body = { success: true };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { success: false, error: 'Failed to delete diary' };
  }
});

export default router;
