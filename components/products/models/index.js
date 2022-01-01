const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports.prisma = prisma;
module.exports.productModel = prisma.product;
module.exports.categoryModel = prisma.category;
module.exports.productInventoryModel = prisma.productInventory;
