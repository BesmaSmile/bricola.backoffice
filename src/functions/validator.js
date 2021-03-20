import _ from 'lodash';
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;
const phoneRegex = /^(\+213)(5|6|7)[0-9]{8}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validatePassword = (password) => {
  return (password?.length>=8 &&  passwordRegex.test(password)) || "Utilisez au moins 8 caractères de [a-z, A-Z, 0-9]";
}

const validatePhone = (phone) => {
  return phoneRegex.test(phone) || "N° de téléphone invalide"
}

const validateEmail = (email) => {
  return emailRegex.test(email) || "Email invalide"
}

const validateMax = (val, max) => {
  return parseInt(val) <= max  || `Valeur maximale ${max}`
}

export const validator = {
  validatePassword,
  validatePhone,
  validateEmail,
  validateMax
}