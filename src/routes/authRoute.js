const express = require("express");
const authController = require("../controllers/authController");
const authValidation = require("../validations/authValidation");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/hash-password", authController.hashPassword);
router.post("/login", validate(authValidation), authController.login);

router.get("/logout", authenticate, authController.logout);
router.get("/cek-token", authenticate, authController.cekToken);

router.post("/verify-password", authenticate, authController.verifyPassword);

module.exports = router;
