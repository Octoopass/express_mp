const {
  categoryService,
  ShippingOrder,
  shippingOrderService,
} = require("../models/shippingOrder");

const getShippingOrders = async (req, res) => {
  let { branchId } = req.query;
  const shippingOrders = await shippingOrderService.getShippingOrders({
    branchId,
  });

  res.send({
    data: shippingOrders,
  });
};

const getSingleShippingOrder = async (req, res) => {
  let { id } = req.query;
  const shippingOrders = await shippingOrderService.getSingleShippingOrder({
    id,
  });

  res.send({
    data: shippingOrders,
  });
};

const createShippingOrder = async (req, res, next) => {
  try {
    const {
      senderName,
      senderAddress,
      senderPhoneNumber,
      packageType,
      receiverName,
      receiverAddress,
      reveiverPhoneNumber,
    } = req.body;
    if (
      !(
        senderName &&
        senderAddress &&
        senderPhoneNumber &&
        packageType &&
        receiverName &&
        receiverAddress &&
        reveiverPhoneNumber
      )
    ) {
      res.status(400).json({
        message: "Not enough required informations",
      });
      return;
    }
    // const order = new ShippingOrder(req.body);
    shippingOrderService.createShippingOrder(req.body, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Error" });
      } else {
        res.send({ message: "Successful" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProductShippingOrder = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    let isExisted = await categoryService.checkShippingOrderIdExists(
      categoryId
    );

    if (!isExisted) {
      res.status(404).send({ message: "ShippingOrder not found" });
      return;
    }
    const updateShippingOrder = new ShippingOrder({
      ...req.body,
      categoryName: req.body?.categoryName,
    });
    categoryService.updateProductShippingOrder(
      categoryId,
      updateShippingOrder,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ message: "Edit product detail" });
        }
      }
    );
  } catch (error) {}
};

// Delete a product category by ID
const deleteShippingOrder = async (req, res) => {
  try {
    const categoryId = req.params.id;
    let isExisted = await categoryService.checkShippingOrderIdExists(
      categoryId
    );
    if (!isExisted) {
      res.status(404).send({ message: "ShippingOrder not found" });
      return;
    }
    await categoryService.deleteShippingOrder(categoryId, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ msg: "Delete succesful" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getShippingOrders,
  getSingleShippingOrder,
  createShippingOrder,
  updateProductShippingOrder,
  deleteShippingOrder,
};
