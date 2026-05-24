import prisma from '../config/db.js';

export const getCollections = async (req, res, next) => {
  try {
    const collections = await prisma.collection.findMany({
      include: { products: true },
    });
    res.json(collections);
  } catch (error) {
    next(error);
  }
};

export const getCollectionById = async (req, res, next) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { products: true },
    });
    if (collection) {
      res.json(collection);
    } else {
      res.status(404);
      throw new Error('Collection not found');
    }
  } catch (error) {
    next(error);
  }
};

export const createCollection = async (req, res, next) => {
  try {
    const collection = await prisma.collection.create({
      data: req.body,
    });
    res.status(201).json(collection);
  } catch (error) {
    next(error);
  }
};

export const updateCollection = async (req, res, next) => {
  try {
    const collection = await prisma.collection.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(collection);
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (req, res, next) => {
  try {
    await prisma.collection.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Collection removed' });
  } catch (error) {
    next(error);
  }
};
