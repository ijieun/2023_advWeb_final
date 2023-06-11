const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const {
  renderProfile,
  renderJoin,
  renderMain,
  renderHashtag,
} = require("../controllers/page");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map((f) => f.id) || [];
  next();
});

router.get("/profile", isLoggedIn, renderProfile);
// '/profile'에 대한 GET 요청을 처리하는 라우터.
// isLoggedIn 미들웨어를 통해 사용자가 로그인되어 있는지 확인한 후 renderProfile 컨트롤러를 실행한다.

router.get("/join", isNotLoggedIn, renderJoin);
// '/join'에 대한 GET 요청을 처리하는 라우터.
// isNotLoggedIn 미들웨어를 통해 사용자가 로그인되어 있지 않은지 확인한 후 renderJoin 컨트롤러를 실행한다.

router.get("/", renderMain);
// '/'에 대한 GET 요청을 처리하는 라우터.
// renderMain 컨트롤러를 실행하여 메인 페이지를 렌더링한다.

router.get("/hashtag", renderHashtag);
// '/hashtag'에 대한 GET 요청을 처리하는 라우터.
// renderHashtag 컨트롤러를 실행하여 해시태그 페이지를 렌더링한다.

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("서버 에러");
});
// 에러 처리 미들웨어로, 이전의 미들웨어에서 에러가 발생한 경우 실행된다.
// 에러를 콘솔에 기록하고, 500 상태 코드와 함께 '서버 에러' 메시지를 응답으로 전송한다.

module.exports = router;
// 라우터 객체를 모듈로 내보낸다.
