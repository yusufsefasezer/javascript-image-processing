'use strict';

var wrapper = {},
    area = {},
    canvas = {},
    context = {},
    file = {},
    imageMIMETypes = [],
    footer = {},
    imageFilter = null;

function filter() {
    var currentFilter = null;

    switch (this.textContent) {
        case 'BlackAndWhite':
            currentFilter = imageFilter.blackAndWhite();
            break;
        case 'Brightness':
            currentFilter = imageFilter.brightness();
            break;
        case 'Contrast':
            currentFilter = imageFilter.contrast();
            break;
        case 'Grayscale':
            currentFilter = imageFilter.grayscale();
            break;
        case 'Invert':
            currentFilter = imageFilter.invert();
            break;
        case 'Noise':
            currentFilter = imageFilter.noise();
            break;
        case 'Sepia':
            currentFilter = imageFilter.sepia();
            break;
        case 'Threshold':
            currentFilter = imageFilter.threshold();
            break;
        case 'Vintage':
            currentFilter = imageFilter.vintage();
            break;
        case 'Blur':
            currentFilter = imageFilter.blur();
            break;
        case 'Sharpen':
            currentFilter = imageFilter.sharpen();
            break;
        case 'Sobel':
            currentFilter = imageFilter.sobel();
            break;
        case 'Prewitt':
            currentFilter = imageFilter.prewitt();
            break;
        default:
            return imageToCanvas(file.files[0]);
            break;
    }

    context.putImageData(currentFilter.getImageData(), 0, 0);
}

function initElem() {
    wrapper = document.getElementById('wrapper');
    area = document.getElementById('area');
    canvas = document.getElementById('image');
    context = canvas.getContext('2d');
    file = document.getElementById('file');
    imageMIMETypes = ['image/jpeg', 'image/png', 'image/gif'];
    var filters = ['BlackAndWhite', 'Brightness', 'Contrast', 'Grayscale', 'Invert', 'Noise', 'Sepia', 'Threshold', 'Vintage', 'Blur', 'Sharpen', 'Sobel', 'Prewitt', 'Reset'];
    footer = document.querySelector('footer');
    imageFilter = new ysFilters();

    var fragment = document.createDocumentFragment();
    for (var index = 0, length = filters.length; index < length; index++) {
        var newButton = document.createElement('button');
        newButton.textContent = filters[index];
        newButton.addEventListener('click', filter);
        fragment.appendChild(newButton);
    }
    footer.appendChild(fragment);
}

function onWrapperClick() {
    file.click();
}

function onWrapperDrop(evt) {
    file.files = evt.dataTransfer.files;
    evt.preventDefault();
}

function onWrapperDragOver() {
    return false;
}

function checkMimeType(fileType, allowedTypes) {
    var check = false;

    for (var index = 0, length = allowedTypes.length; index < length; index++) {
        var currentType = allowedTypes[index];
        if (fileType == currentType) {
            return true;
        }
    }

    return check;
}

function onImageLoad() {
    var maxWidth = 600;
    if (this.width < maxWidth) maxWidth = this.width;
    var ratio = this.height / maxWidth;

    canvas.width = this.width / ratio;
    canvas.height = this.height / ratio;

    wrapper.style.width = canvas.width + 'px';
    wrapper.style.height = canvas.height + 'px';

    context.drawImage(this, 0, 0, canvas.width, canvas.height);
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    imageFilter.setImageData(imageData);
}

function onReaderLoad() {
    var image = new Image();
    image.src = this.result;
    image.addEventListener('load', onImageLoad);
}

function imageToCanvas(currentFile) {
    var reader = new FileReader();
    reader.readAsDataURL(currentFile);
    reader.addEventListener('load', onReaderLoad);
}

function onFileChange() {
    if (this.files.length != 1) return;

    var currentFile = this.files[0];
    if (!checkMimeType(currentFile.type, imageMIMETypes)) return;
    imageToCanvas(currentFile);

    area.style.display = 'none';
    footer.style.display = 'block';
}

function initEvent() {
    wrapper.addEventListener('click', onWrapperClick);
    wrapper.addEventListener('drop', onWrapperDrop);
    wrapper.addEventListener('dragover', onWrapperDragOver);
    file.addEventListener('change', onFileChange);
}

function init() {
    initElem();
    initEvent();
}

window.addEventListener('DOMContentLoaded', init);
