/*
 *    ysFilters.js - YS JavaScript Filters
 *    Author: Yusuf SEZER <yusufsezer@mail.com>
 *    Version: v0.1.0
 *    Url: https://github.com/yusufsefasezer
 *    License(s): MIT
 */
"use strict";

var ysFilters = function () {
    var imageData = null;
    var adjustment = 10;
    var thresholdVal = 128;
    var contrastVal = 10;
    var convoluteMatrix = [];

    this.setImageData = function (iData) {
        imageData = iData;
        return this;
    };

    this.getImageData = function () {
        return imageData;
    };

    this.setAdjustment = function (adj) {
        adjustment = adj;
        return this;
    };

    this.setThreshold = function (thr) {
        thresholdVal = thr;
        return this;
    };

    this.setContrast = function (cont) {
        contrastVal = cont;
        return this;
    };

    this.setMatrix = function (matrix) {
        convoluteMatrix = matrix;
        return this;
    }

    this.blackAndWhite = function () {

        for (var index = 0; index < imageData.data.length; index += 4) {
            var v = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
            imageData.data[index] = v;
            imageData.data[index + 1] = v;
            imageData.data[index + 2] = v;
        }

        return this;
    };

    this.brightness = function () {

        for (var index = 0; index < imageData.data.length; index += 4) {
            imageData.data[index] += adjustment;
            imageData.data[index + 1] += adjustment;
            imageData.data[index + 2] += adjustment;
        }

        return this;
    };

    this.contrast = function () {
        var value = (255.0 + contrastVal) / 255.0;
        value *= value

        for (var index = 0; index < imageData.data.length; index += 4) {
            var r = imageData.data[index] / 255.0;
            var g = imageData.data[index + 1] / 255.0;
            var b = imageData.data[index + 2] / 255.0;

            imageData.data[index] = (((r - 0.5) * value) + 0.5) * 255;
            imageData.data[index + 1] = (((g - 0.5) * value) + 0.5) * 255;
            imageData.data[index + 2] = (((b - 0.5) * value) + 0.5) * 255;
        }

        return this;
    };

    this.grayscale = function () {

        for (var index = 0; index < imageData.data.length; index += 4) {
            var v = 0.3 * imageData.data[index] + 0.59 * imageData.data[index + 1] + 0.11 * imageData.data[index + 2];
            imageData.data[index] = v;
            imageData.data[index + 1] = v;
            imageData.data[index + 2] = v;
        }

        return this;
    };

    this.invert = function () {

        for (var index = 0; index < imageData.data.length; index += 4) {
            imageData.data[index] = 255 - imageData.data[index];
            imageData.data[index + 1] = 255 - imageData.data[index + 1];
            imageData.data[index + 2] = 255 - imageData.data[index + 2];
        }

        return this;
    };

    this.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.noise = function () {

        for (var index = 0; index < imageData.data.length; index += 4) {
            imageData.data[index] = (imageData.data[index] + this.random(0, 255)) / 2;
            imageData.data[index + 1] = (imageData.data[index + 1] + this.random(0, 255)) / 2;
            imageData.data[index + 2] = (imageData.data[index + 2] + this.random(0, 255)) / 2;
        }

        return this;
    };

    this.sepia = function () {

        for (var index = 0; index < imageData.data.length; index += 4) {
            var r = imageData.data[index];
            var g = imageData.data[index + 1];
            var b = imageData.data[index + 2];

            imageData.data[index] = (r * 0.393) + (g * 0.769) + (b * 0.189);
            imageData.data[index + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
            imageData.data[index + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
        }

        return this;
    };

    this.threshold = function () {

        for (var index = 0; index < imageData.data.length; index += 4) {
            var v = (0.2126 * imageData.data[index] + 0.7152 * imageData.data[index + 1] + 0.0722 * imageData.data[index + 2] >= thresholdVal) ? 255 : 0;
            imageData.data[index] = v;
            imageData.data[index + 1] = v;
            imageData.data[index + 2] = v;
        }

        return this;
    };

    this.vintage = function () {

        for (var index = 0; index < imageData.data.length; index += 4) {
            imageData.data[index] = imageData.data[index + 1];
            imageData.data[index + 1] = imageData.data[index];
            imageData.data[index + 2] = 150;
        }

        this.setContrast(50).contrast();

        return this;
    };

    this.convolute = function () {

        var side = Math.round(Math.sqrt(convoluteMatrix.length));
        var halfSide = Math.floor(side / 2);
        var src = imageData.data;
        var sw = imageData.width;
        var sh = imageData.height;

        var w = sw;
        var h = sh;

        var output = new ImageData(w, h);
        var dst = output.data;

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {

                var sy = y;
                var sx = x;
                var dstOff = (y * w + x) * 4;
                var r = 0, g = 0, b = 0, a = 0;

                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {

                        var scy = sy + cy - halfSide;
                        var scx = sx + cx - halfSide;

                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {

                            var srcOff = (scy * sw + scx) * 4;
                            var wt = convoluteMatrix[cy * side + cx];

                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a = src[srcOff + 3];

                        }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff + 1] = g;
                dst[dstOff + 2] = b;
                dst[dstOff + 3] = a;
            }
        }

        imageData = output;

        return this;
    };

    this.blur = function () {
        return this.setMatrix([
            1 / 9, 1 / 9, 1 / 9,
            1 / 9, 1 / 9, 1 / 9,
            1 / 9, 1 / 9, 1 / 9
        ]).convolute();
    };

    this.sharpen = function () {
        return this.setMatrix([
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
        ]).convolute();
    };

    this.sobel = function () {
        return this.setMatrix([
            -1, -2, -1,
            0, 0, 0,
            1, 2, 1
        ]).convolute().setMatrix([
            -1, 0, 1,
            -2, 0, 2,
            -1, 0, 1
        ]).convolute();
    };

    this.prewitt = function () {
        return this.setMatrix([
            -1, 0, 1,
            -1, 0, 1,
            -1, 0, 1
        ]).convolute().setMatrix([
            -1, -1, -1,
            0, 0, 0,
            1, 0, 1
        ]).convolute();
    };

}