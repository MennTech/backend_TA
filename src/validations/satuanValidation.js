const Joi = require("joi");

const satuanSchema = Joi.object({
  nama: Joi.string().required().messages({
    "string.base": "Nama harus berupa string",
    "string.empty": "Nama tidak boleh kosong",
    "any.required": "Nama harus diisi",
  }),
  jumlah_satuan: Joi.number().min(1).required().messages({
    "number.base": "Jumlah Satuan harus berupa angka",
    "number.empty": "Jumlah Satuan tidak boleh kosong",
    "number.min": "Jumlah Satuan minimal 1",
    "any.required": "Jumlah Satuan harus diisi",
  }),
});

module.exports = satuanSchema;