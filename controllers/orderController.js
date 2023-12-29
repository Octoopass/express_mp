const { Order, orderService } = require("../services/order");
const { transactionOrderService } = require("../services/transactionOrder");
const { hubOrderService } = require("../services/hubOrder");
const { shippingOrderService } = require("../services/shippingOrder");

const getOrders = async (req, res) => {
  let { page, limit } = req.query;
  let { transactionId, hubId } = req.body;
  const orders = await orderService.getOrders({page, limit}, {transactionId, hubId});
  
  res.send({
    data: orders,
  });
};

const getSingleOrder = async (req, res) => {
  const orderId = req.params.id;
  let isExisted = await orderService.checkOrderIdExists(orderId);

  if (!isExisted) {
    res.status(404).send({ message: "Order not found" });
    return;
  }
  const order = await orderService.getSingleOrder(orderId);

  res.send({
    data: order,
  });
};

const getSuperSingleOrder = async (req, res) => {
  const orderId = req.params.id;
  let isExisted = await orderService.checkOrderIdExists(orderId);

  if (!isExisted) {
    res.status(404).send({ message: "Order not found" });
    return;
  }
  const order = await orderService.getSingleOrder(orderId);

  isExisted = await transactionOrderService.checkTransactionOrderIdExists(orderId);
  const transactionOrder = undefined;
  if (isExisted) {
    transactionOrder = await transactionOrderService.getSingleTransactionOrder(orderId);
  }

  isExisted = await hubOrderService.checkHubOrderIdExists(orderId);
  const hubOrder = undefined;
  if (isExisted) {
    hubOrder = await hubOrderService.getSingleHubOrder(orderId);
  }

  isExisted = await shippingOrderService.checkShippingOrderIdExists(orderId);
  const shippingOrder = undefined;
  if (isExisted) {
    shippingOrder = await shippingOrderService.getSingleShippingOrder(orderId);
  }  

  res.send({
    order: order,
    transactionOrder: transactionOrder,
    hubOrder: hubOrder,
    shippingOrder: shippingOrder 
  });
};

const createOrder = async (req, res, next) => {
  try {
    const {
      transactionID,
      senderName,
      senderAddress,
      senderPhoneNumber,
      receiverName,
      receiverAddress,
      reveiverPhoneNumber,
      packageType,
      packageWeight,
      shippingFee,
      expectedSendDate,
    } = req.body;
    if (
      !(
        transactionID &&
        senderName &&
        senderAddress &&
        senderPhoneNumber &&
        receiverName &&
        receiverAddress &&
        reveiverPhoneNumber &&
        packageType &&
        packageWeight &&
        shippingFee &&
        expectedSendDate
      )
    ) {
      res.status(400).json({
        message: "Not enough required informations",
      });
      return;
    }
    // const order = new Order(req.body);
    orderService.createOrder(req.body, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Error" });
      } else {
        res.send({ message: "Success!" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateOrder = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    let isExisted = await orderService.checkOrderIdExists(orderId);

    if (!isExisted) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    const { shipStatus, receiveDate } = req.body;
    // const updateOrder = new Order(req.body);
    orderService.updateOrder(orderId, req.body, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ message: "Editted" });
      }
    });
  } catch (error) {}
};

// Delete an order by ID
const deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    let isExisted = await orderService.checkOrderIdExists(orderId);
    if (!isExisted) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    await orderService.deleteOrder(orderId, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ msg: "Delete Success!" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getOrders,
  getSingleOrder,
  getSuperSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};
