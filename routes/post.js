const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 리뷰 삭제 기능
router.route("/:id").delete(async (req, res, next) => {
  try {
    // 이미지가 있디면 로컬에서 find해서 unlinkSync해준다.
    const checkImage = await Post.findOne({ where: { id: req.params.id } });
    if (checkImage) {
      console.log(checkImage.img);
      try {
        fs.unlinkSync(`uploads/${checkImage.img.slice(5)}`);
      } catch (err) {
        if (err.code === "ENOENT") {
          console.log("파일이 존재하지 않습니다.");
        }
      }
    }
    const result = await Post.destroy({ where: { id: req.params.id } });
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("no post to delete");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
