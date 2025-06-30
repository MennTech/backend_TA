const Joi = require("joi");

const returSupplierSchema = Joi.object({
  no_retur_supplier: Joi.string().required().messages({
    "string.base": "No Retur Supplier harus berupa string",
    "string.empty": "No Retur Supplier tidak boleh kosong",
    "any.required": "No Retur Supplier harus diisi",
  }),
  id_supplier: Joi.number().integer().required().messages({
    "number.base": "ID Supplier harus berupa angka",
    "number.integer": "ID Supplier harus berupa angka bulat",
    "any.required": "ID Supplier harus diisi",
  }),
  tanggal: Joi.date().required().messages({
    "date.base": "Tanggal harus berupa tanggal yang valid",
    "any.required": "Tanggal harus diisi",
  }),
  keterangan: Joi.string().required().messages({
    "string.base": "Keterangan harus berupa string",
    "string.empty": "Keterangan tidak boleh kosong",
    "any.required": "Keterangan harus diisi",
  }),
  barang: Joi.array()
    .items(
      Joi.object({
        no_barang_rusak: Joi.string().required().messages({
          "string.base": "No Barang Rusak harus berupa string",
          "string.empty": "No Barang Rusak tidak boleh kosong",
          "any.required": "No Barang Rusak harus diisi",
        }),
        kode_barang: Joi.number().required().messages({
          "number.base": "Kode Barang harus berupa angka",
          "number.empty": "Kode Barang tidak boleh kosong",
          "any.required": "Kode Barang harus diisi",
        }),
        jumlah: Joi.number().min(1).required().messages({
          "number.base": "Jumlah harus diisi dengan angka",
          "number.empty": "Jumlah tidak boleh kosong",
          "any.required": "Jumlah harus diisi",
          "number.min": "Jumlah Retur minimal 1",
        }),
        status: Joi.string()
          .valid("potong-nota", "tukar-barang")
          .required()
          .messages({
            "string.base": "Status harus berupa string",
            "any.only":
              "Status harus salah satu dari 'potong-nota' atau 'tukar-barang'",
            "any.required": "Status harus diisi",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Barang harus berupa array",
      "array.empty": "Barang tidak boleh kosong",
      "any.required": "Barang harus diisi",
      "array.min": "Minimal data barang 1",
    }),
});

module.exports = returSupplierSchema;
