const imageContainer = document.getElementById("image-container") as HTMLElement;

function createImageBox() {
    const box = document.createElement("div");
    box.classList.add("image-box");
    box.style.width = "300px";
    box.style.height = "300px";

    const spinner = document.createElement("div");
    spinner.classList.add("loading");
    box.appendChild(spinner);

    const img = document.createElement("img");
    box.appendChild(img);

    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error");
    errorMessage.style.display = "none";
    box.appendChild(errorMessage);

    const retryButton = document.createElement("button");
    retryButton.classList.add("retry-button");
    retryButton.textContent = "Spróbuj ponownie";
    retryButton.style.display = "none";
    retryButton.onclick = () => fetchImage(box);
    box.appendChild(retryButton);

    return box;
}

function fetchImage(box: HTMLElement) {
    const spinner = box.querySelector(".loading") as HTMLElement;
    const img = box.querySelector("img") as HTMLImageElement;
    const errorMessage = box.querySelector(".error") as HTMLElement;
    const retryButton = box.querySelector(".retry-button") as HTMLButtonElement;

    spinner.style.display = "block";
    img.style.display = "none";
    errorMessage.style.display = "none";
    retryButton.style.display = "none";

    fetch("http://localhost:8000/image")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            spinner.style.display = "none";
            img.src = data.image;
            img.style.display = "block";
        })
        .catch(error => {
            spinner.style.display = "none";
            errorMessage.textContent = "Błąd ładowania obrazka";
            errorMessage.style.display = "block";
            retryButton.style.display = "block";
        });
}

for (let i = 0; i < 6; i++) {
    const box = createImageBox();
    imageContainer.appendChild(box);
    fetchImage(box);
}
