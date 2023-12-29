const {
  ShippingOrder,
  shippingOrderService,
} = require("../services/shippingOrder");

const { hubOrderService } = require("../services/hubOrder");

const getShippingOrders = async (req, res) => {
  let { page, limit } = req.query;
  let { transactionId, hubId } = req.body;
  const shippingOrders = await shippingOrderService.getShippingOrders(
    { page, limit },
    { transactionId, hubId }
  );

  res.send({
    data: shippingOrders,
  });
};

// get shippingOrder detail BY orderID
const getSingleShippingOrder = async (req, res) => {
  const id = req.params.id;
  let isExisted = await shippingOrderService.checkShippingOrderIdExists(id);

  if (!isExisted) {
    res.status(404).send({ message: "Order not found on shippingOrder" });
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
    const { endpointID, orderID, shippingEmployeeName, sendDate } = req.body;
    if (!(endpointID && orderID && shippingEmployeeName && sendDate)) {
      res.status(400).json({
        message: "Not enough required informations",
      });
      return;
    }
    let isExisted = await shippingOrderService.checkShippingOrderIdExists(orderID);
    if (isExisted) {
      res.status(403).send({ message: "ShippingOrder for orderID already existed" });
      return;
    }
    isExisted = await hubOrderService.checkHubOrderIdExists(orderID);
    if (!isExisted) {
      res
        .status(404)
        .send({ message: "order doesnt exist on hubOrder/not shipped to endpointTransaction" });
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
    // check orderID exists
    let isExisted = await shippingOrderService.checkShippingOrderIdExists(categoryId);
    if (!isExisted) {
      res.status(404).send({ message: "Order not found on shippingOrder" });
      return;
    }
    const updateShippingOrder = new ShippingOrder(req.body);
    shippingOrderService.updateShippingOrder(
      categoryId,
      updateShippingOrder,
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

const deleteShippingOrder = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    // check orderID exists
    let isExisted = await shippingOrderService.checkShippingOrderIdExists(categoryId);
    if (!isExisted) {
      res.status(404).send({ message: "Order not found on shippingOrder" });
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
