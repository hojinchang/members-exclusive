const hamburger = document.querySelector(".menu");
const nav = document.querySelector(".site-navigation");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("show");
});

function handleResize() {
    if (window.innerWidth > 800) {
        nav.classList.remove("show");
        hamburger.classList.remove("opened");
    }
}

window.addEventListener("resize", handleResize);