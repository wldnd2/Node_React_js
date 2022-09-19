// local로 할지, Deploy할지에 따라 키를 어떻게 관리하는 if문
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}