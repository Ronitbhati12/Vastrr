import prisma from '../config/db.js';

export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const totalOrders = await prisma.order.count();
    const activeCustomers = await prisma.user.count({ where: { role: 'Customer' } });
    
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: { totalAmount: true }
    });
    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { name: true, email: true } } }
    });

    // For monthly revenue, Prisma doesn't have native GroupBy for dates yet in MySQL easily,
    // so we'll fetch orders and group them in JS (fine for MVP).
    const orders = await prisma.order.findMany({
      select: { createdAt: true, totalAmount: true }
    });
    
    const monthlyMap = {};
    orders.forEach(order => {
      const month = order.createdAt.getMonth() + 1; // 1-12
      monthlyMap[month] = (monthlyMap[month] || 0) + order.totalAmount;
    });

    const monthlyRevenue = Object.keys(monthlyMap).map(m => ({
      _id: parseInt(m),
      total: monthlyMap[m]
    })).sort((a, b) => a._id - b._id);

    res.json({
      totalRevenue,
      totalOrders,
      activeCustomers,
      recentOrders,
      monthlyRevenue
    });
  } catch (error) {
    next(error);
  }
};
