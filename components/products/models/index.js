const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports.withModels = (models) => (service) => service();

module.exports.productModel = prisma.product;
module.exports.categoryModel = prisma.category;
module.exports.productInventoryModel = prisma.productInventory;
