const Joi = require("joi");

const returPenjualanSchema = Joi.object({
  no_retur_penjualan: Joi.string().required().messages({
    "string.base": "No Retur Penjualan harus berupa string",
    "string.empty": "No Retur Penjualan tidak boleh kosong",
    "any.required": "No Retur Penjualan harus diisi",
  }),
  no_penjualan: Joi.string().required().messages({
    "string.base": "No Penjualan harus berupa string",
    "string.empty": "No Penjualan tidak boleh kosong",
    "any.required": "No Penjualan harus diisi",
  }),
  tanggal: Joi.date().required().messages({
    "date.base": "Tanggal harus berupa tanggal yang valid",
    "date.empty": "Tanggal tidak boleh kosong",
    "any.required": "Tanggal harus diisi",
  }),
  total: Joi.number().required().messages({
    "number.base": "Total harus berupa angka",
    "number.empty": "Total tidak boleh kosong",
    "any.required": "Total harus diisi",
  }),
  barang: Joi.array()
    .items(
      Joi.object({
        kode_barang: Joi.number().required().messages({
          "number.base": "Kode Barang harus berupa angka",
          "number.empty": "Kode Barang tidak boleh kosong",
          "any.required": "Kode Barang harus diisi",
        }),
        jumlah: Joi.number().required().messages({
          "number.base": "Jumlah harus berupa angka",
          "number.empty": "Jumlah tidak boleh kosong",
          "any.required": "Jumlah harus diisi",
        }),
        subtotal: Joi.number().required().messages({
          "number.base": "Subtotal harus berupa angka",
          "number.empty": "Subtotal tidak boleh kosong",
          "any.required": "Subtotal harus diisi",
        }),
        alasan: Joi.string().required().messages({
          "string.base": "Alasan harus berupa string",
          "string.empty": "Alasan tidak boleh kosong",
          "any.required": "Alasan harus diisi",
        }),
        status: Joi.string()
          .valid("tukar-barang", "kembali-uang")
          .required()
          .messages({
            "string.base": "Status harus berupa string",
            "any.only":
              "Status harus berupa 'tukar-barang' atau 'kembali-uang'",
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

module.exports = returPenjualanSchema;
