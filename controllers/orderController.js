const {
    Order,
    orderService,
} = require("../models/order");

const getOrders = async (req, res) => {
    let { branchId, hubId } = req.query;
    const orders = await orderService.getOrders({
      branchId, hubId
    });
  
    res.send({
      data: orders,
    });
  };
  
  const getSingleOrder = async (req, res) => {
    let { id } = req.query;
    const orders = await orderService.getSingleOrder({
      id,
    });
  
    res.send({
      data: orders,
    });
  };
  
  const createOrder = async (req, res, next) => {
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
      // const order = new Order(req.body);
      orderService.createOrder(req.body, (err, result) => {
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
  
  const updateProductOrder = async (req, res, next) => {
    const categoryId = req.params.id;
    try {
      let isExisted = await categoryService.checkOrderIdExists(
        categoryId
      );
  
      if (!isExisted) {
        res.status(404).send({ message: "Order not found" });
        return;
      }
      const updateOrder = new Order({
        ...req.body,
        categoryName: req.body?.categoryName,
      });
      categoryService.updateProductOrder(
        categoryId,
        updateOrder,
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
  const deleteOrder = async (req, res) => {
    try {
      const categoryId = req.params.id;
      let isExisted = await categoryService.checkOrderIdExists(
        categoryId
      );
      if (!isExisted) {
        res.status(404).send({ message: "Order not found" });
        return;
      }
      await categoryService.deleteOrder(categoryId, (err, result) => {
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
    getOrders,
    getSingleOrder,
    createOrder,
    updateProductOrder,
    deleteOrder,
  };
  