const textArea = document.getElementById("message");
const charactersRemaining = document.querySelector(".nCharacters");

textArea.addEventListener("input", (e) => {
    const maxLength = e.target.getAttribute("maxlength");
    const currentLength = e.target.value.length;
    
    console.log(maxLength - currentLength);
    charactersRemaining.textContent = maxLength - currentLength;
});