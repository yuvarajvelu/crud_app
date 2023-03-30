import prisma from "../db";

//get all products
export const getAllProducts = async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      products: true,
    },
  });
  res.json({ data: user.products });
};

//get product based on id
export const getUniqueProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      belongsToId: req.user.id,
    },
  });
  res.json({ data: product });
};

//create new product
export const addNewProduct = async (req, res) => {
  const new_product = await prisma.product.create({
    data: {
      name: req.body.name,
      belongsToId: req.user.id,
    },
  });
  res.json({ data: new_product });
};

//modify a existing product
export const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = await prisma.product.update({
    where: {
      id_belongsToId: {
        id: productId,
        belongsToId: req.user.id,
      },
    },
    data: {
      name: req.body.name,
    },
  });
  res.json({ data: updatedProduct });
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const deletedProduct = await prisma.product.delete({
    where: {
      id_belongsToId: {
        id: productId,
        belongsToId: req.user.id,
      },
    },
  });
  res.json({ data: deletedProduct });
};
