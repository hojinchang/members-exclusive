const message = document.querySelector(".admin-message");

if (message) {
    setTimeout(() => {
        message.classList.add("fade-out");
    }, 3000);
}