const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const path = require("path");

const router = express.Router();

// "/" 경로에 대한 GET 요청 핸들러
router.get("/", (req, res) => {
  res.render("home", { title: "마켓컬리 - 로그인" });
});

// "/join" 경로에 대한 GET 요청 핸들러
router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", { title: "마켓컬리 - 회원가입" });
});

module.exports = router;
