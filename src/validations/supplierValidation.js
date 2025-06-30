const Joi = require("joi");

const supplierSchema = Joi.object({
  nama: Joi.string().required().messages({
    "string.base": "Nama harus berupa string",
    "string.empty": "Nama tidak boleh kosong",
    "any.required": "Nama harus diisi",
  }),
  kode_supplier: Joi.string().max(10).required().messages({
    "string.base": "Kode Supplier harus berupa string",
    "string.empty": "Kode Supplier tidak boleh kosong",
    "any.required": "Kode Supplier harus diisi",
    "string.max": "Kode Supplier tidak boleh lebih dari 10 karakter",
  }),
  no_telpon: Joi.string().required().messages({
    "string.base": "No Telpon harus berupa string",
    "string.empty": "No Telpon tidak boleh kosong",
    "any.required": "No Telpon harus diisi",
  }),
  alamat: Joi.string().required().messages({
    "string.base": "Alamat harus berupa string",
    "string.empty": "Alamat tidak boleh kosong",
    "any.required": "Alamat harus diisi",
  }),
});

module.exports = supplierSchema;
