import prisma from "../db";

export const getAllUpdates = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      update: true,
    },
  });
  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.update];
  }, []);
  res.json({ data: updates });
};
export const getOneUpdate = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = await prisma.update.findFirst({
      where: {
        id,
      },
    });
    res.json({ data: update });
  } catch (error) {
    next(error);
  }
};
export const createUpdate = async (req, res) => {
  const checkProductId = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });
  if (!checkProductId) {
    return res.json({ message: "Wrong Id" });
  }
  const newUpdate = await prisma.update.create({
    data: req.body,
  });
  res.json({ data: newUpdate });
};
export const modifyUpdate = async (req, res) => {
  const product = await prisma.product.findFirst({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      update: {
        where: {
          id: req.params.id,
        },
      },
    },
  });

  if (!product) {
    return res.json({ message: "product match not found" });
  }
  const changeUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });
  res.json({ data: changeUpdate });
};
export const deleteUpdate = async (req, res) => {
  const product = await prisma.product.findFirst({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      update: {
        where: {
          id: req.params.id,
        },
      },
    },
  });
  if (!product) {
    return res.json({ message: "product match not found" });
  }
  const deleted = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });
  res.json({ data: deleted });
};
