const textArea = document.getElementById("message");

textArea.addEventListener("input", (e) => {
    const maxLength = e.target.getAttribute("maxlength");
    const currentLength = e.target.value.length;
    console.log(currentLength);
});