const express = require("express");
const kategoriController = require("../controllers/kategoriController.js");
const kategoriValidation = require("../validations/kategoriValidation.js");
const validate = require("../middleware/validate.js");
const authenticate = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");

const router = express.Router();

router.get("/", authenticate, isAdmin, kategoriController.getAllKategori);
router.get(
  "/terlaris/:filter",
  authenticate,
  isAdmin,
  kategoriController.getKategoriTerlaris
);
router.post(
  "/",
  authenticate,
  isAdmin,
  validate(kategoriValidation),
  kategoriController.createKategori
);
router.put(
  "/:id",
  authenticate,
  isAdmin,
  validate(kategoriValidation),
  kategoriController.updateKategori
);
router.delete("/:id", authenticate, isAdmin, kategoriController.deleteKategori);

module.exports = router;
