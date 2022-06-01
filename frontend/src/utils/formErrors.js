import { isEmail } from "validator";

const formErrors = {
  username: function () {
    if (this.length < 2) return "at least 2 characters";
    if (this.length > 50) return "no longer than 50 characters";
  },
  email: function () {
    if (this.length < 3) return "at least 3 characters";
    if (this.length > 50) return "no longer than 50 characters";
    if (!isEmail(this)) return "please provide a valid email";
  },
  password: function () {
    if (this.length < 8) return "at least 8 characters";
  },
  passwordConfirm: function () {
    if (this.password !== this.passwordConfirm) return "no match";
  },
};

export default formErrors;
