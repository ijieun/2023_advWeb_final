const express = require("express");
const passport = require("passport");

const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { join, login, logout } = require("../controllers/auth");

const router = express.Router();

// POST /auth/join
router.post("/join", isNotLoggedIn, join);
// '/join'에 대한 POST 요청을 처리하는 라우터.
// isNotLoggedIn 미들웨어를 통해 사용자가 로그인되어 있지 않은지 확인한 후 join 컨트롤러를 실행한다.

// POST /auth/login
router.post("/login", isNotLoggedIn, login);
// '/login'에 대한 POST 요청을 처리하는 라우터.
// isNotLoggedIn 미들웨어를 통해 사용자가 로그인되어 있지 않은지 확인한 후 login 컨트롤러를 실행한다.

// GET /auth/logout
router.get("/logout", isLoggedIn, logout);
// '/logout'에 대한 GET 요청을 처리하는 라우터.
// isLoggedIn 미들웨어를 통해 사용자가 로그인되어 있는지 확인한 후 logout 컨트롤러를 실행한다.

// GET /auth/kakao
router.get("/kakao", passport.authenticate("kakao"));
// '/kakao'에 대한 GET 요청을 처리하는 라우터.
// passport.authenticate('kakao')를 사용하여 카카오 인증을 처리한다.
// 사용자를 카카오 로그인 페이지로 리다이렉션한다.

// GET /auth/kakao/callback
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/?error=카카오로그인 실패",
  }),
  (req, res) => {
    res.redirect("/"); // 성공 시에는 /로 이동
  }
);
// '/kakao/callback'에 대한 GET 요청을 처리하는 라우터.
// passport.authenticate('kakao')를 사용하여 카카오 인증을 처리한다.
// 실패 시에는 failureRedirect에 지정된 URL로 리다이렉션하고, 성공 시에는 '/'로 리다이렉션한다.

module.exports = router;
// 라우터 객체를 모듈로 내보낸다.
