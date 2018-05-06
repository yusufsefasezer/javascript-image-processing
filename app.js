"use strict";
var imageWrapper = null,
    imageArea = null,
    imageCanvas = null,
    imageContext = null,
    imageFile = null,
    imageMIMETypes = [],
    filterList = [],
    filterArea = null,
    imageFilter = null;

function init() {
    imageWrapper = document.querySelector("#wrapper");
    imageArea = document.querySelector("#area");
    imageCanvas = document.querySelector("#image");
    imageContext = imageCanvas.getContext("2d");
    imageFile = document.querySelector("#file");
    imageMIMETypes = ["image/jpeg", "image/png", "image/gif"];
    filterList = ["BlackAndWhite", "Brightness", "Contrast", "Grayscale", "Invert", "Noise", "Sepia", "Threshold", "Vintage", "Blur", "Sharpen", "Sobel", "Prewitt", "Reset"];
    filterArea = document.querySelector("footer");
    imageFilter = new ysFilters();

    imageWrapper.onclick = function () {
        imageFile.click();
    };

    imageWrapper.ondrop = function (evt) {
        imageFile.files = evt.dataTransfer.files;
        evt.preventDefault();
    }

    imageWrapper.ondragover = function (evt) {
        return false;
    }

    imageFile.onchange = checkAdd;

    addFilterButton();

}

function checkAdd() {
    if (this.files.length != 1) return;

    var currentFile = this.files[0];

    if (!checkMimeType(currentFile.type, imageMIMETypes)) {
        return;
    }

    imageToCanvas(currentFile);

    imageArea.style.display = "none";
    filterArea.style.display = "block";

    return;
}

function checkMimeType(currentType, allowedTypes) {
    var check = false;

    for (var index = 0, fileType; fileType = allowedTypes[index]; index++) {
        if (currentType == fileType) {
            return true;
        }
    }

    return check;
}

function imageToCanvas(currentFile) {

    var reader = new FileReader();
    reader.readAsDataURL(currentFile);

    reader.onload = function () {
        var img = new Image();
        img.src = this.result;

        img.onload = function () {
            var maxWidth = 600;
            if (img.width < maxWidth) maxWidth = img.width;
            var ratio = img.height / maxWidth;

            imageCanvas.width = img.width / ratio;
            imageCanvas.height = img.height / ratio;

            imageWrapper.style.width = imageCanvas.width + "px";
            imageWrapper.style.height = imageCanvas.height + "px";

            imageContext.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
            var imageData = imageContext.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
            imageFilter.setImageData(imageData);
        }

    }

    return;
}

function addFilterButton() {

    for (let index = 0; index < filterList.length; index++) {
        var btn = document.createElement("button");
        btn.innerHTML = filterList[index];
        btn.onclick = filterIt;
        filterArea.appendChild(btn);
    }

    return;
}

function filterIt() {
    var currentFilter = null;
    switch (this.innerHTML) {
        case "BlackAndWhite":
            currentFilter = imageFilter.blackAndWhite();
            break;
        case "Brightness":
            currentFilter = imageFilter.brightness();
            break;
        case "Contrast":
            currentFilter = imageFilter.contrast();
            break;
        case "Grayscale":
            currentFilter = imageFilter.grayscale();
            break;
        case "Invert":
            currentFilter = imageFilter.invert();
            break;
        case "Noise":
            currentFilter = imageFilter.noise();
            break;
        case "Sepia":
            currentFilter = imageFilter.sepia();
            break;
        case "Threshold":
            currentFilter = imageFilter.threshold();
            break;
        case "Vintage":
            currentFilter = imageFilter.vintage();
            break;
        case "Blur":
            currentFilter = imageFilter.blur();
            break;
        case "Sharpen":
            currentFilter = imageFilter.sharpen();
            break;
        case "Sobel":
            currentFilter = imageFilter.sobel();
            break;
        case "Prewitt":
            currentFilter = imageFilter.prewitt();
            break;
        default:
            imageToCanvas(imageFile.files[0]);
            return;
            break;
    }

    imageContext.putImageData(currentFilter.getImageData(), 0, 0);

    return;
}

window.onload = init;