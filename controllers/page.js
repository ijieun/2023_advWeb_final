const { User, Post, Hashtag } = require("../models");

// 프로필 페이지 렌더링
exports.renderProfile = (req, res) => {
  res.render("profile", { title: "마켓컬리 - 내 정보" });
};

// 회원가입 페이지 렌더링
exports.renderJoin = (req, res) => {
  res.render("join", { title: "마켓컬리 - 회원가입" });
};

// 메인 페이지 렌더링
exports.renderMain = async (req, res, next) => {
  try {
    // 최신 게시물 조회
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "컬리 - 마켓컬리/뷰티컬리",
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// 해시태그 페이지 렌더링
exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/");
  }
  try {
    // 주어진 해시태그로 게시물 검색
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
};
