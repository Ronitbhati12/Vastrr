import prisma from '../config/db.js';

export const getProducts = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || '';
    const collectionId = req.query.collectionId ? parseInt(req.query.collectionId) : undefined;

    const products = await prisma.product.findMany({
      where: {
        name: { contains: keyword },
        ...(collectionId && { collectionId }),
      },
      include: { collection: { select: { name: true } } },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { collection: { select: { name: true } } },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.collectionId) data.collectionId = parseInt(data.collectionId);
    
    const product = await prisma.product.create({ data });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.collectionId) data.collectionId = parseInt(data.collectionId);

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};
