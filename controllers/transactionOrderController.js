const {
  transactionOrderService,
  TransactionOrder,
} = require("../models/transactionOrder");

const { orderService } = require("../models/order");

const getTransactionOrders = async (req, res) => {
  let { transactionId, hubId } = req.query;
  const transactionOrders = await transactionOrderService.getTransactionOrders({
    transactionId,
    hubId,
  });

  res.send({
    data: transactionOrders,
  });
};

// get transactionOrder detail BY orderID
const getSingleTransactionOrder = async (req, res) => {
  const id = req.params.id;
  let isExisted = await orderService.checkOrderIdExists(id);

  if (!isExisted) {
    res.status(404).send({ message: "Order not found" });
    return;
  }
  const transactionOrder = await transactionOrderService.getSingleTransactionOrder({
    id,
  });

  res.send({
    data: transactionOrder,
  });
};

const createTransactionOrder = async (req, res, next) => {
  try {
    const { transactionID, orderID, shippingEmployeeName, sendDate } = req.body;
    if (!(transactionID && orderID && shippingEmployeeName && sendDate)) {
      res.status(400).json({
        message: "Not enough required informations",
      });
      return;
    }
    let isExisted = await orderService.checkOrderIdExists(orderID);

    if (isExisted) {
      res
        .status(403)
        .send({ message: "TransactionOrder for orderID already existed" });
      return;
    }
    // const order = new TransactionOrder(req.body);
    transactionOrderService.createTransactionOrder(req.body, (err, result) => {
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

const updateTransactionOrder = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    let isExisted = await orderService.checkOrderIdExists(categoryId);

    if (!isExisted) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    const updateTransactionOrder = new TransactionOrder(req.body);
    transactionOrderService.updateTransactionOrder(
      categoryId,
      updateTransactionOrder,
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

const deleteTransactionOrder = async (req, res) => {
  try {
    const categoryId = req.params.id;
    let isExisted = await orderService.checkOrderIdExists(categoryId);
    if (!isExisted) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    await transactionOrderService.deleteTransactionOrder(
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
  getTransactionOrders,
  getSingleTransactionOrder,
  createTransactionOrder,
  updateTransactionOrder,
  deleteTransactionOrder,
};
