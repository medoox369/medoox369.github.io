var typed = new Typed(".text", {
  strings: [
    "Data Analyst",
    "Data Scientist",
    "Programming",
    "Business Intelligence",
  ],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true,
});

const toTop = document.querySelector(".top");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});
function toggleMenu() {
  document.getElementById("myLinks").classList.toggle("active");
}
