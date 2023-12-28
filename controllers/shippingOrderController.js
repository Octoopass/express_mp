const {
  ShippingOrder,
  shippingOrderService,
} = require("../models/shippingOrder");

const { orderService } = require("../models/order");

const getShippingOrders = async (req, res) => {
  let { transactionId, hubId } = req.query;
  const shippingOrders = await shippingOrderService.getShippingOrders({
    transactionId,
    hubId,
  });

  res.send({
    data: shippingOrders,
  });
};

// get shippingOrder detail BY orderID
const getSingleShippingOrder = async (req, res) => {
  const id = req.params.id;
  let isExisted = await orderService.checkOrderIdExists(id);

  if (!isExisted) {
    res.status(404).send({ message: "Order not found" });
    return;
  }
  const shippingOrder = await shippingOrderService.getSingleShippingOrder({
    id,
  });

  res.send({
    data: shippingOrder,
  });
};

const createShippingOrder = async (req, res, next) => {
  try {
    const { transactionID, orderID, shippingEmployeeName, sendDate } = req.body;
    if (!(transactionID && orderID && shippingEmployeeName && sendDate)) {
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

const updateShippingOrder = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    let isExisted = await orderService.checkOrderIdExists(categoryId);

    if (!isExisted) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    const updateShippingOrder = new ShippingOrder(req.body);
    shippingOrderService.updateProductShippingOrder(
      categoryId,
      updateShippingOrder,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ message: "Edit order detail" });
        }
      }
    );
  } catch (error) {}
};

const deleteShippingOrder = async (req, res) => {
  try {
    const categoryId = req.params.id;
    let isExisted = await orderService.checkOrderIdExists(categoryId);
    if (!isExisted) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    await shippingOrderService.deleteShippingOrder(
      categoryId,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ msg: "Delete succesful" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getShippingOrders,
  getSingleShippingOrder,
  createShippingOrder,
  updateShippingOrder,
  deleteShippingOrder,
};
