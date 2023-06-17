const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User, Hashtag } = require("../models");

const router = express.Router();

router.use((req, res, next) => {
  // 템플릿 렌더링을 위한 공통 로컬 변수 설정을 위한 미들웨어
  res.locals.user = req.user; // 현재 사용자
  res.locals.followerCount = req.user ? req.user.Followers.length : 0; // 팔로워 수
  res.locals.followingCount = req.user ? req.user.Followings.length : 0; // 팔로잉 수
  res.locals.followingIdList = req.user
    ? req.user.Followings.map((f) => f.id)
    : []; // 팔로잉 중인 사용자의 ID 목록
  next();
});

router.get("/profile", isLoggedIn, (req, res) => {
  // 사용자 프로필을 표시하는 라우트
  res.render("profile", { title: "마켓컬리 - 내 프로필" });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  // 회원가입 페이지를 표시하는 라우트
  res.render("join", { title: "마켓컬리 - 회원가입" });
});

router.get("/", async (req, res, next) => {
  // 메인 페이지(로그인 페이지)를 표시하는 라우트
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "마켓컬리 - 로그인",
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/hashtag", async (req, res, next) => {
  // 특정 해시태그와 관련된 게시글을 표시하는 라우트
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/");
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render("main", {
      title: `${query} | 마켓컬리`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
