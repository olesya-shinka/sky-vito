/* eslint-disable no-useless-escape */
export function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateReg(user) {
  if (user === "") return true;
  var re = /^[A-ZА-Я]{1}[a-zа-я-]{1,20}$/;
  return re.test(user);
}
// /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;

export function validatePhone(phone) {
  var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(phone);
}

export function validatePrice(price) {
  var re = /^(\d*([.,](?=\d{3}))?\d+)+((?!\2)[.,]\d\d)?$/;
  return re.test(price);
}
