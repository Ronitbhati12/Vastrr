import prisma from '../config/db.js';

export const addOrderItems = async (req, res, next) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    if (items && items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = await prisma.order.create({
        data: {
          customerId: req.user.id,
          totalAmount,
          shippingStreet: shippingAddress.street,
          shippingCity: shippingAddress.city,
          shippingPostal: shippingAddress.postalCode,
          shippingCountry: shippingAddress.country,
          items: {
            create: items.map((item) => ({
              productId: parseInt(item.product),
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });

      res.status(201).json(order);
    }
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        customer: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true, image: true, price: true } } } },
      },
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: { select: { name: true, email: true } } },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status },
    });
    res.json(order);
  } catch (error) {
    next(error);
  }
};
