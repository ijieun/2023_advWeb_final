// 주제: 마켓컬리 홈페이지에서 상품 사진 리뷰를 작성하고, 검색할 수 있는 기능을 제공합니다.

// 핵심 기능:
// 로그인 기능, 리뷰 올리기 기능(post), 리뷰 검색하기 기능(get), 회원 팔로우 기능(post)

// 추가 기능:
// 이미지 업로드 기능(upload) 및 이미지를 로컬에서 찾아서 삭제하는 기능(delete),
// 작성한 리뷰 삭제 기능(delete 요청),
// 회원 언팔로우 기능(delete 요청),
// 회원 닉네임 수정 기능(update),
// 태그를 이용한 리뷰 검색 기능(get),
// 마켓컬리 홈페이지 기능(slide banner구현 등)

// 기능 파일 위치
// 리뷰 삭제 기능 (/routes/post.js)
// 언팔로우 기능 (/routes/user.js)
// 닉네임 변경 기능 (/routes/user.js)
// 마켓컬리 홈페이지 구현 (/views/home.html)

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");

// 필요한 모듈 및 설정을 가져옵니다.
dotenv.config();
const homeRouter = require("./routes/home");
const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();

// 패스포트 설정
passportConfig();

// Express 앱의 설정을 수행합니다.
app.set("port", process.env.PORT || 3000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

// 데이터베이스 연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

// 미들웨어를 등록합니다.
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 라우터를 등록합니다.
app.use("/", pageRouter);
app.use("/home", homeRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

// 없는 라우터에 대한 처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러 핸들러 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// 서버 실행
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
