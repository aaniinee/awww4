"use strict";
var imageContainer = document.getElementById("image-container");
function createImageBox() {
    var box = document.createElement("div");
    box.classList.add("image-box");
    box.style.width = "300px";
    box.style.height = "300px";
    var spinner = document.createElement("div");
    spinner.classList.add("loading");
    box.appendChild(spinner);
    var img = document.createElement("img");
    box.appendChild(img);
    var errorMessage = document.createElement("div");
    errorMessage.classList.add("error");
    errorMessage.style.display = "none";
    box.appendChild(errorMessage);
    var retryButton = document.createElement("button");
    retryButton.classList.add("retry-button");
    retryButton.textContent = "Spróbuj ponownie";
    retryButton.style.display = "none";
    retryButton.onclick = function () { return fetchImage(box); };
    box.appendChild(retryButton);
    return box;
}
function fetchImage(box) {
    var spinner = box.querySelector(".loading");
    var img = box.querySelector("img");
    var errorMessage = box.querySelector(".error");
    var retryButton = box.querySelector(".retry-button");
    spinner.style.display = "block";
    img.style.display = "none";
    errorMessage.style.display = "none";
    retryButton.style.display = "none";
    fetch("http://localhost:8000/image")
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
        .then(function (data) {
        spinner.style.display = "none";
        img.src = data.image;
        img.style.display = "block";
    })
        .catch(function (error) {
        spinner.style.display = "none";
        errorMessage.textContent = "Błąd ładowania obrazka";
        errorMessage.style.display = "block";
        retryButton.style.display = "block";
    });
}
for (var i = 0; i < 6; i++) {
    var box = createImageBox();
    imageContainer.appendChild(box);
    fetchImage(box);
}
