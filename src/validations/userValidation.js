const Joi = require("joi");

const createKaryawanSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required().messages({
    "string.base": "Username harus berupa teks",
    "string.alphanum": "Username hanya boleh berisi huruf dan angka",
    "string.min": "Username harus memiliki panjang minimal {#limit} karakter",
    "any.required": "Username tidak boleh kosong",
    "string.empty": "Username tidak boleh kosong",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password harus berupa teks",
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password harus memiliki panjang minimal {#limit} karakter",
    "any.required": "Password tidak boleh kosong",
  }),
});

const updateKaryawanSchema = Joi.object({
  username: Joi.string().alphanum().min(3).messages({
    "string.base": "Username harus berupa teks",
    "string.empty": "Username tidak boleh kosong",
    "string.alphanum": "Username hanya boleh berisi huruf dan angka",
    "string.min": "Username harus memiliki panjang minimal {#limit} karakter",
  }),
  password: Joi.string().empty("").min(6).messages({
    "string.base": "Password harus berupa teks",
    "string.min": "Password harus memiliki panjang minimal {#limit} karakter",
  }),
})
  .or("username", "password")
  .messages({
    "object.missing":
      "Data harus berisi setidaknya `username` atau `password` untuk diupdate.",
  });

module.exports = {
  createKaryawanSchema,
  updateKaryawanSchema,
};
