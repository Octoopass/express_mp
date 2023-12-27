const express = require("express");
const router = express.Router();

const {
    authorization,
    checkRole,
} = require("../middleware/auth");

const {
  getHubs,
  createHub,
  updateHub,
  deleteHub,
} = require("../controllers/hubController");

router.get("/", getHubs);
router.post("/", createHub);
router.put("/:id", updateHub);
router.delete("/:id", deleteHub);

module.exports = router;