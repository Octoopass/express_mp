const {
  TransactionPoint,
  transactionPointService,
} = require("../services/transactionPoint");

const { hubService } = require("../services/hub");

// Get all transaction points
const getTransactionPoints = async (req, res) => {
  const transactionPoints =
    await transactionPointService.getTransactionPoints();

  res.send({
    data: transactionPoints,
  });
};

// Create transaction point
const createTransactionPoint = async (req, res, next) => {
  try {
    const { transactionName, transactionAddress, hubID } = req.body;
    if (!(transactionName && transactionAddress && hubID)) {
      res.status(400).json({
        message: "transactionName, transactionAddress, hubID are required",
      });
      return;
    }
    // check if hubID exist
    let isExisted = await hubService.checkHubIdExists(hubID);

    if (!isExisted) {
      res.status(404).send({ message: "Hub not found" });
      return;
    }

    transactionPointService.createTransactionPoint(req.body, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ message: "Success!" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update transaction point
const updateTransactionPoint = async (req, res, next) => {
  const transactionId = req.params.id;
  try {
    let isExisted = await transactionPointService.checkTransactionIdExists(
      transactionId
    );
    // check if transactionID exists
    if (!isExisted) {
      res.status(404).send({ message: "TransactionPoint not found" });
      return;
    }

    const updateTransactionPoint = new TransactionPoint(req.body);

    if (updateTransactionPoint.hubId) {
      isExisted = await hubService.checkHubIdExists(
        updateTransactionPoint.hubId
      );

      if (!isExisted) {
        res.status(404).send({ message: "Hub not found" });
        return;
      }
    }

    transactionPointService.updateTransactionPoint(
      transactionId,
      updateTransactionPoint,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ message: "Edit Success!" });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete transaction point
const deleteTransactionPoint = async (req, res, next) => {
  try {
    const transactionId = req.params.id;
    let isExisted = await transactionPointService.checkTransactionIdExists(
      transactionId
    );
    // check if transactionID exists
    if (!isExisted) {
      res.status(404).send({ message: "TransactionPoint not found" });
      return;
    }
    await transactionPointService.deleteTransactionPoint(
      transactionId,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ message: "Delete Success!" });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTransactionPoints,
  createTransactionPoint,
  updateTransactionPoint,
  deleteTransactionPoint,
};
