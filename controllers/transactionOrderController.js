const {
  transactionOrderService,
  TransactionOrder,
} = require("../services/transactionOrder");

const { orderService } = require("../services/order");

// Get all transaction order to hub
const getTransactionOrders = async (req, res) => {
  let { page, limit } = req.query;
  // select transactionId: all transactionOrder send from requestedId
  // select hubId: all transactionOrder receive at hub with requestedId
  let { transactionId, hubId } = req.body; 
  const transactionOrders = await transactionOrderService.getTransactionOrders(
    { page, limit },
    { transactionId, hubId }
  );

  res.send({
    data: transactionOrders,
  });
};

// get transactionOrder detail BY orderID
const getSingleTransactionOrder = async (req, res) => {
  const id = req.params.id;
  let isExisted = await transactionOrderService.checkTransactionOrderIdExists(id);

  if (!isExisted) {
    res.status(404).send({ message: "Order not found on transactionOrder" });
    return;
  }
  const transactionOrder =
    await transactionOrderService.getSingleTransactionOrder({
      id,
    });

  res.send({
    data: transactionOrder,
  });
};

// Create transaction order for existing order to send to hub
const createTransactionOrder = async (req, res, next) => {
  try {
    const { orderID, tShippingEmployeeName, tSendDate } = req.body;
    if (!(orderID && tShippingEmployeeName && tSendDate)) {
      res.status(400).json({
        message: "Not enough required informations",
      });
      return;
    }
    // check if already existing orderID in transactionOrder
    let isExisted = await transactionOrderService.checkTransactionOrderIdExists(
      orderID
    );
    if (isExisted) {
      res
        .status(403)
        .send({ message: "TransactionOrder for orderID already existed" });
      return;
    }
    // check if the order exists
    isExisted = await orderService.checkOrderIdExists(orderID);
    if (!isExisted) {
      res.status(404).send({ message: "order doesnt exist" });
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

// Update transaction order
const updateTransactionOrder = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    let isExisted = await transactionOrderService.checkTransactionOrderIdExists(
      categoryId
    );
    if (!isExisted) {
      res
        .status(403)
        .send({ message: "TransactionOrder for orderID doesnt exist" });
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
          res.send({ message: "Editted" });
        }
      }
    );
  } catch (error) {}
};

// Delete transaction order
const deleteTransactionOrder = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    let isExisted = await transactionOrderService.checkTransactionOrderIdExists(
      categoryId
    );
    if (!isExisted) {
      res
        .status(403)
        .send({ message: "TransactionOrder for orderID doesnt exist" });
      return;
    }
    await transactionOrderService.deleteTransactionOrder(
      categoryId,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ msg: "Delete success!" });
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
