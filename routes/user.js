const express = require("express");

const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// POST /user/:id/follow
router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    // 현재 로그인한 사용자 정보 조회
    const user = await User.findOne({ where: { id: req.user.id } });

    if (user) {
      // 현재 사용자를 팔로우하는 작업
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      // 사용자를 찾을 수 없는 경우
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
