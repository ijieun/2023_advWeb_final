const express = require("express");
const passport = require("passport");

const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
// const { login, logout } = require("../controllers/auth");

const router = express.Router();

// 회원가입
router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    // 이미 존재하는 이메일인지 확인
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    // 비밀번호를 해싱하여 사용자 생성
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
// '/join'에 대한 POST 요청을 처리하는 라우터.
// isNotLoggedIn 미들웨어를 통해 사용자가 로그인되어 있지 않은지 확인한 후 join 컨트롤러를 실행한다.

// 로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    // 로그인 성공 시 로그인 처리
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});
// '/login'에 대한 POST 요청을 처리하는 라우터.
// isNotLoggedIn 미들웨어를 통해 사용자가 로그인되어 있지 않은지 확인한 후 login 컨트롤러를 실행한다.

// 로그아웃
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});
// '/logout'에 대한 GET 요청을 처리하는 라우터.
// isLoggedIn 미들웨어를 통해 사용자가 로그인되어 있는지 확인한 후 logout 컨트롤러를 실행한다.

// 카카오 로그인 라우터
router.get("/kakao", passport.authenticate("kakao"));
// '/kakao'에 대한 GET 요청을 처리하는 라우터.
// passport.authenticate('kakao')를 사용하여 카카오 인증을 처리한다.
// 사용자를 카카오 로그인 페이지로 리다이렉션한다.

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

module.exports = router;
// 라우터 객체를 모듈로 내보낸다.
