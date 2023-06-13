const express = require("express");

const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

// 팔로우 기능
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
      res.status(404).send("사용자를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 언팔로우 기능
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("언팔로우가 불가능합니다!");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 닉네임 수정 기능
router.route("/edit").patch(async (req, res, next) => {
  try {
    const result = await User.update(
      {
        nick: req.body.nick,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
