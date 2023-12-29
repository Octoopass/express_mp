const {
    hubOrderService,
    HubOrder,
  } = require("../services/hubOrder");
  
  const { orderService } = require("../services/order");
  
  const getHubOrders = async (req, res) => {
    let { page, limit } = req.query;
    let { transactionId, hubId } = req.body;
    const hubOrders = await hubOrderService.getHubOrders(
      { page, limit },
      { transactionId, hubId }
    );
  
    res.send({
      data: hubOrders,
    });
  };
  
  // get hubOrder detail BY orderID
  const getSingleHubOrder = async (req, res) => {
    const id = req.params.id;
    let isExisted = await orderService.checkOrderIdExists(id);
  
    if (!isExisted) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    const hubOrder =
      await hubOrderService.getSingleHubOrder({
        id,
      });
  
    res.send({
      data: hubOrder,
    });
  };
  
  const createHubOrder = async (req, res, next) => {
    try {
      const { orderID, tShippingEmployeeName, tSendDate } = req.body;
      if (!(orderID && tShippingEmployeeName && tSendDate)) {
        res.status(400).json({
          message: "Not enough required informations",
        });
        return;
      }
      // check if already existing orderID in hubOrder
      let isExisted = await hubOrderService.checkHubOrderIdExists(
        orderID
      );
      if (isExisted) {
        res
          .status(403)
          .send({ message: "HubOrder for orderID already existed" });
        return;
      }
      // check if the order exists
      isExisted = await orderService.checkOrderIdExists(orderID);
      if (!isExisted) {
        res.status(404).send({ message: "order doesnt exist" });
        return;
      }
      // const order = new HubOrder(req.body);
      hubOrderService.createHubOrder(req.body, (err, result) => {
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
  
  const updateHubOrder = async (req, res, next) => {
    const categoryId = req.params.id;
    try {
      let isExisted = await orderService.checkOrderIdExists(categoryId);
      if (!isExisted) {
        res.status(404).send({ message: "Order not found" });
        return;
      }
      isExisted = await hubOrderService.checkHubOrderIdExists(
        categoryId
      );
      if (!isExisted) {
        res
          .status(403)
          .send({ message: "HubOrder for orderID doesnt exist" });
        return;
      }
      const updateHubOrder = new HubOrder(req.body);
      hubOrderService.updateHubOrder(
        categoryId,
        updateHubOrder,
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
  
  const deleteHubOrder = async (req, res) => {
    const categoryId = req.params.id;
    try {
      let isExisted = await orderService.checkOrderIdExists(categoryId);
      if (!isExisted) {
        res.status(404).send({ message: "Order not found" });
        return;
      }
      isExisted = await hubOrderService.checkHubOrderIdExists(
        categoryId
      );
      if (!isExisted) {
        res
          .status(403)
          .send({ message: "HubOrder for orderID doesnt exist" });
        return;
      }
      await hubOrderService.deleteHubOrder(
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
    getHubOrders,
    getSingleHubOrder,
    createHubOrder,
    updateHubOrder,
    deleteHubOrder,
  };
  