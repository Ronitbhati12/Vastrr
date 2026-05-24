import prisma from '../config/db.js';

export const getContent = async (req, res, next) => {
  try {
    let content = await prisma.content.findFirst();
    if (!content) {
      content = await prisma.content.create({ data: {} });
    }
    res.json(content);
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    let content = await prisma.content.findFirst();
    if (!content) {
      content = await prisma.content.create({ data: req.body });
    } else {
      content = await prisma.content.update({
        where: { id: content.id },
        data: req.body,
      });
    }
    res.json(content);
  } catch (error) {
    next(error);
  }
};
