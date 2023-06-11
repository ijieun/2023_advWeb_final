const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { afterUploadImage, uploadPost } = require("../controllers/post");
const { isLoggedIn } = require("../middlewares");

const router = express.Router();

// uploads 폴더가 없을 경우 생성한다.
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  console.error(`${uploadDir} 폴더가 없어 ${uploadDir} 폴더를 생성합니다.`);
  fs.mkdirSync(uploadDir);
}

// multer를 사용하여 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

// 파일 업로드 제한 설정 (최대 파일 크기: 5MB)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img
router.post("/img", isLoggedIn, upload.single("img"), afterUploadImage);
// '/post/img'에 대한 POST 요청을 처리하는 라우터.
// isLoggedIn 미들웨어를 통해 사용자가 로그인되어 있는지 확인한 후, upload 미들웨어를 사용하여 이미지 파일을 업로드한다.
// 업로드된 파일은 single() 메서드를 사용하여 'img' 필드에서 찾는다.
// 업로드 후에는 afterUploadImage 컨트롤러를 실행한다.

// POST /post
const upload2 = multer();
router.post("/", isLoggedIn, upload2.none(), uploadPost);
// '/post'에 대한 POST 요청을 처리하는 라우터.
// isLoggedIn 미들웨어를 통해 사용자가 로그인되어 있는지 확인한 후, upload2.none()을 사용하여 파일 업로드를 처리하지 않고, 다른 폼 데이터만 처리한다.
// 데이터 처리 후에는 uploadPost 컨트롤러를 실행한다.

module.exports = router;
// 라우터 객체를 모듈로 내보낸다.
