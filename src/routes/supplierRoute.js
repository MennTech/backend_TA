const express = require("express");
const supplierController = require("../controllers/supplierController.js");
const supplierValidation = require("../validations/supplierValidation.js");
const validate = require("../middleware/validate.js");
const authenticate = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");

const router = express.Router();

router.get("/", authenticate, isAdmin, supplierController.getAllSupplier);
router.get("/jumlah-supplier", authenticate, isAdmin, supplierController.getJumlahSupplier);
router.post(
  "/",
  authenticate,
  isAdmin,
  validate(supplierValidation),
  supplierController.createSupplier
);
router.put(
  "/:id",
  authenticate,
  isAdmin,
  validate(supplierValidation),
  supplierController.updateSupplier
);
router.delete("/:id", authenticate, isAdmin, supplierController.deleteSupplier);

module.exports = router;
