let nav = document.querySelector(".header__main-nav");
let menu = document.querySelector(".main-nav__list");
let menuBtn = document.querySelector(".main-nav__toggle");

nav.classList.remove("header__main-nav--nojs");

menuBtn.addEventListener("click", function() {
  menu.classList.toggle("main-nav__list--open");
  this.classList.toggle("main-nav__toggle--close");
});

let orderBtn = document.querySelectorAll(".products__button");
let moreBtn = document.querySelector(".products__show-all");

if (orderBtn.length) {
    for (let i = 0; i < orderBtn.length; i++) {
      orderBtn[i].addEventListener("click", function (evt) {
        evt.preventDefault();
      });
    }
};

if (moreBtn) {
  moreBtn.addEventListener("click", function (evt) {
    evt.preventDefault();
  });
};
