const { Hub, hubService } = require("../models/hub");

const getHubs = async (req, res) => {
  const Hubs = await hubService.getHubs();

  res.send({
    data: Hubs,
  });
};

const createHub = async (req, res, next) => {
  try {
    const { hubName, hubAddress } = req.body;
    if (!(hubName && hubAddress)) {
      res.status(400).json({
        message: "hubName, hubAddress are required",
      });
      return;
    }
    hubService.createHub(req.body, (err, result) => {
      if (err) {
        next(err);
      } else {
      }
      res.send({ message: "Success!" });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateHub = async (req, res, next) => {
  const hubId = req.params.id;
  try {
    let isExisted = await hubService.checkHubIdExists(hubId);

    if (!isExisted) {
      res.status(404).send({ message: "Hub not found" });
      return;
    }
    const updateHub = new Hub(req.body);
    hubService.updateHub(hubId, updateHub, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ message: "Edit Success!" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteHub = async (req, res, next) => {
  const hubId = req.params.id;
  try {
    let isExisted = await hubService.checkHubIdExists(hubId);

    if (!isExisted) {
      res.status(404).send({ message: "Hub not found" });
      return;
    }
    await hubService.deleteHub(hubId, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ message: "Delete Success!" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getHubs,
  createHub,
  updateHub,
  deleteHub,
};
