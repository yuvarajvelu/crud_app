import prisma from "../db";

//get all subupdates
export const getAllSubUpdates = async (req, res, next) => {
  try {
    const productsData = await prisma.product.findMany({
      where: {
        belongsToId: req.user.id,
      },
      include: {
        update: true,
      },
    });
    const updates_id = productsData.reduce((allupdates, productData) => {
      return [...allupdates, ...productData.update.map((el) => el.id)];
    }, []);
    const subupdates = await prisma.sub_Update.findMany({
      where: {
        updateId: { in: updates_id },
      },
    });
    res.json({ data: subupdates });
  } catch (e) {
    next(e);
  }
};

//get one subupdate
export const getOneSubUpdate = async (req, res, next) => {
  const id = req.params.id;
  const sub_Update = await prisma.sub_Update.findUnique({
    where: {
      id,
    },
  });
  res.json({ data: sub_Update });
};

//create sub update
export const createSubUpdate = async (req, res, next) => {
  try {
    const checkUpdateId = await prisma.product.findFirst({
      where: {
        belongsToId: req.user.id,
      },
      include: {
        update: {
          where: {
            id: req.body.updateId,
          },
        },
      },
    });
    if (!checkUpdateId) {
      return res.json({ message: "Wrong Id" }).status(404);
    }
    const newSubUpdate = await prisma.sub_Update.create({
      data: req.body,
    });
    res.json({ data: newSubUpdate });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//modify a sub update
export const modifySubUpdate = async (req, res, next) => {
  try {
    const subupdateId = req.params.id;
    const checkUpdate = await prisma.sub_Update.findFirst({
      where: {
        id: subupdateId,
      },
    });
    const checkProduct = await prisma.product.findFirst({
      where: {
        belongsToId: req.user.id,
      },
      include: {
        update: {
          where: {
            id: checkUpdate.id,
          },
        },
      },
    });
    if (!checkProduct) {
      return res.json({ message: "Product/update match not found" });
    }
    const updatedData = await prisma.sub_Update.update({
      where: { id: subupdateId },
      data: req.body,
    });
    res.json({ data: updatedData });
  } catch (error) {
    next(error);
  }
};

//delete a sub update
export const deleteSubUpdate = async (req, res, next) => {
  try {
    const subupdateId = req.params.id;
    const checkUpdate = await prisma.sub_Update.findFirst({
      where: {
        id: subupdateId,
      },
    });
    const checkProduct = await prisma.product.findFirst({
      where: {
        belongsToId: req.user.id,
      },
      include: {
        update: {
          where: {
            id: checkUpdate.id,
          },
        },
      },
    });
    if (!checkProduct) {
      return res.json({
        message: "Product/update match not found for the user",
      });
    }
    const deletedSubUpdate = await prisma.sub_Update.delete({
      where: {
        id: subupdateId,
      },
    });
    res.json({ data: deleteSubUpdate });
  } catch (e) {
    next(e);
  }
};
