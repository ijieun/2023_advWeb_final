// main 슬라이드 이미지 구현

// 슬라이드 요소들을 선택
let slides = document.querySelector(".slides");
let slideImg = document.querySelectorAll(".slides li");

// 현재 슬라이드 인덱스와 슬라이드 개수 설정
let currentIdx = 0;
let slideCount = slideImg.length;

// 이전 버튼과 다음 버튼 선택
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

// 슬라이드 이미지의 넓이와 마진 설정
let slideWidth = 1900;
let slideMargin = 100;

// 처음 이미지와 마지막 이미지 복사 함수 호출
makeClone();

// 슬라이드 넓이와 위치값 초기화 함수 호출
initFunction();

// 처음 이미지와 마지막 이미지를 복사하여 슬라이드 요소에 추가하는 함수
function makeClone() {
  let cloneSlideFirst = slideImg[0].cloneNode(true);
  let cloneSlideLast = slides.lastElementChild.cloneNode(true);
  slides.append(cloneSlideFirst);
  slides.insertBefore(cloneSlideLast, slides.firstElementChild);
}

// 슬라이드 넓이와 위치값 초기화 함수
function initFunction() {
  slides.style.width = (slideWidth + slideMargin) * (slideCount + 2) + "px";
  slides.style.left = -(slideWidth + slideMargin) + "px";
}

// 다음 버튼 클릭 이벤트 처리
next.addEventListener("click", function () {
  if (currentIdx <= slideCount - 1) {
    slides.style.left = -(currentIdx + 2) * (slideWidth + slideMargin) + "px";
    slides.style.transition = `${0.5}s ease-out`;
  }
  if (currentIdx === slideCount - 1) {
    setTimeout(function () {
      slides.style.left = -(slideWidth + slideMargin) + "px";
      slides.style.transition = `${0}s ease-out`;
    }, 500);
    currentIdx = -1;
  }
  currentIdx += 1;
});

// 이전 버튼 클릭 이벤트 처리
prev.addEventListener("click", function () {
  if (currentIdx >= 0) {
    slides.style.left = -currentIdx * (slideWidth + slideMargin) + "px";
    slides.style.transition = `${0.5}s ease-out`;
  }
  if (currentIdx === 0) {
    setTimeout(function () {
      slides.style.left = -slideCount * (slideWidth + slideMargin) + "px";
      slides.style.transition = `${0}s ease-out`;
    }, 500);
    currentIdx = slideCount;
  }
  currentIdx -= 1;
});

// 비동기 처리 - 일정 시간마다 자동으로 슬라이드 변경
setInterval(async () => {
  if (currentIdx <= slideCount - 1) {
    slides.style.left = -(currentIdx + 2) * (slideWidth + slideMargin) + "px";
    slides.style.transition = `${0.5}s ease-out`;
  }
  if (currentIdx === slideCount - 1) {
    setTimeout(function () {
      slides.style.left = -(slideWidth + slideMargin) + "px";
      slides.style.transition = `${0}s ease-out`;
    }, 500);
    currentIdx = -1;
  }
  currentIdx += 1;
}, 5000);
