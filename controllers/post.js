const { Post, Hashtag } = require("../models");

// 이미지 업로드 후 처리
exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

// 게시물 업로드 처리
exports.uploadPost = async (req, res, next) => {
  try {
    // 게시물 생성
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });

    // 게시물 내 해시태그 추출
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      // 해시태그 검색 또는 생성
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      // 게시물과 해시태그 간의 관계 설정
      await post.addHashtags(result.map((r) => r[0]));
    }

    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
