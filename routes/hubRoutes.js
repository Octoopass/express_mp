const express = require("express");
const router = express.Router();

const {
  authorization,
  authorizePermissions,
} = require("../middleware/auth")

const {
  getHubs,
  createHub,
  updateHub,
  deleteHub,
} = require("../controllers/hubController");

router.get("/", getHubs); // http://localhost:8080/hub
router.post("/", createHub); // http://localhost:8080/hub
router.put("/:id", updateHub); // http://localhost:8080/hub/id
router.delete("/:id", deleteHub); // http://localhost:8080/hub/id

module.exports = router;