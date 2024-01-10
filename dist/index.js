"use strict";
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = function(to, from, except, desc) {
    if (from && typeof from === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toESM = function(mod, isNodeMode, target) {
    return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod);
};
var __toCommonJS = function(mod) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
};
// src/index.ts
var src_exports = {};
__export(src_exports, {
    CanvasImageEdit: function() {
        return canvasImageEdit_default;
    }
});
module.exports = __toCommonJS(src_exports);
// src/lib/calculate.ts
var Calculate = /*#__PURE__*/ function() {
    function _Calculate() {
        _class_call_check(this, _Calculate);
    }
    _create_class(_Calculate, null, [
        {
            key: "distance",
            value: // Calculates the distance between two points.
            // @param [Number] x1 1st point x-coordinate.
            // @param [Number] y1 1st point y-coordinate.
            // @param [Number] x2 2nd point x-coordinate.
            // @param [Number] y2 2nd point y-coordinate.
            // @return [Number] The distance between the two points.
            function distance(x1, y1, x2, y2) {
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            }
        },
        {
            key: "randomRange",
            value: // Generates a pseudorandom number that lies within the max - mix range. The number can be either 
            // an integer or a float depending on what the user specifies.
            // @param [Number] min The lower bound (inclusive).
            // @param [Number] max The upper bound (inclusive).
            // @param [Boolean] getFloat Return a Float or a rounded Integer?
            // @return [Number] The pseudorandom number, either as a float or integer.
            function randomRange(min, max) {
                var getFloat = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                var rand = min + Math.random() * (max - min);
                return getFloat ? parseFloat(rand.toFixed(1)) : Math.round(rand);
            }
        },
        {
            key: "luminance",
            value: // Calculates the luminance of a single pixel using a special weighted sum.
            // @param [Object] rgba RGBA object describing a single pixel.
            // @return [Number] The luminance value of the pixel.
            function luminance(rgba) {
                return 0.299 * rgba.r + 0.587 * rgba.g + 0.114 * rgba.b;
            }
        },
        {
            key: "bezier",
            value: // Generates a bezier curve given a start and end point, with control points in between.
            // Can also optionally bound the y values between a low and high bound.
            //
            // This is different than most bezier curve functions because it attempts to construct it in such 
            // a way that we can use it more like a simple input -> output system, or a one-to-one function. 
            // In other words we can provide an input color value, and immediately receive an output modified 
            // color value.
            //
            // Note that, by design, this does not force X values to be in the range [0..255]. This is to
            // generalize the function a bit more. If you give it a starting X value that isn't 0, and/or a
            // ending X value that isn't 255, you may run into problems with your filter!
            //
            // @param [Array] 2-item arrays describing the x, y coordinates of the control points. Minimum two.
            // @param [Number] lowBound (optional) Minimum possible value for any y-value in the curve.
            // @param [Number] highBound (optional) Maximum posisble value for any y-value in the curve.
            // @return [Array] Array whose index represents every x-value between start and end, and value
            //   represents the corresponding y-value.
            function bezier(start, ctrl1, ctrl2, end, lowBound, highBound) {
                var controlPoints;
                if (lowBound == null) {
                    lowBound = 0;
                }
                if (highBound == null) {
                    highBound = 255;
                }
                if (_instanceof(start[0], Array)) {
                    controlPoints = start;
                    lowBound = ctrl1;
                    highBound = ctrl2;
                } else {
                    controlPoints = [
                        start,
                        ctrl1,
                        ctrl2,
                        end
                    ];
                }
                if (controlPoints.length < 2) {
                    throw "Invalid number of arguments to bezier";
                }
                var bezier = {};
                var lerp = function(a, b, t) {
                    return a * (1 - t) + b * t;
                };
                var clamp = function(a, min, max) {
                    return Math.min(Math.max(a, min), max);
                };
                for(var i = 0; i < 1e3; i++){
                    var t = i / 1e3;
                    var prev = controlPoints;
                    while(prev.length > 1){
                        var next = [];
                        for(var j = 0, end1 = prev.length - 2, asc = 0 <= end1; asc ? j <= end1 : j >= end1; asc ? j++ : j--){
                            next.push([
                                lerp(prev[j][0], prev[j + 1][0], t),
                                lerp(prev[j][1], prev[j + 1][1], t)
                            ]);
                        }
                        prev = next;
                    }
                    bezier[Math.round(prev[0][0])] = Math.round(clamp(prev[0][1], lowBound, highBound));
                }
                var endX = controlPoints[controlPoints.length - 1][0];
                bezier = _Calculate.missingValues(bezier, endX);
                if (bezier[endX] == null) {
                    bezier[endX] = bezier[endX - 1];
                }
                return bezier;
            }
        },
        {
            key: "hermite",
            value: // Generates a hermite curve given a start and end point, with control points in between.
            // Can also optionally bound the y values between a low and high bound.
            //
            // This is different than most hermite curve functions because it attempts to construct it in such 
            // a way that we can use it more like a simple input -> output system, or a one-to-one function. 
            // In other words we can provide an input color value, and immediately receive an output modified 
            // color value.
            //
            // Note that, by design, this does not force X values to be in the range [0..255]. This is to
            // generalize the function a bit more. If you give it a starting X value that isn't 0, and/or a
            // ending X value that isn't 255, you may run into problems with your filter!
            //
            // @param [Array] 2-item arrays describing the x, y coordinates of the control points. Minimum two.
            // @param [Number] lowBound (optional) Minimum possible value for any y-value in the curve.
            // @param [Number] highBound (optional) Maximum possible value for any y-value in the curve.
            // @return [Array] Array whose index represents every x-value between start and end, and value
            //   represents the corresponding y-value.
            function hermite(controlPoints, lowBound, highBound) {
                if (controlPoints.length < 2) {
                    throw "Invalid number of arguments to hermite";
                }
                var ret = {};
                var lerp = function(a, b, t) {
                    return a * (1 - t) + b * t;
                };
                var add = function(a, b, c, d) {
                    return [
                        a[0] + b[0] + c[0] + d[0],
                        a[1] + b[1] + c[1] + d[1]
                    ];
                };
                var mul = function(a, b) {
                    return [
                        a[0] * b[0],
                        a[1] * b[1]
                    ];
                };
                var sub = function(a, b) {
                    return [
                        a[0] - b[0],
                        a[1] - b[1]
                    ];
                };
                var clamp = function(a, min, max) {
                    return Math.min(Math.max(a, min), max);
                };
                var count = 0;
                for(var i = 0, end = controlPoints.length - 2, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--){
                    var p0 = controlPoints[i];
                    var p1 = controlPoints[i + 1];
                    var pointsPerSegment = p1[0] - p0[0];
                    var pointsPerStep = 1 / pointsPerSegment;
                    if (i === controlPoints.length - 2) {
                        pointsPerStep = 1 / (pointsPerSegment - 1);
                    }
                    var p = i > 0 ? controlPoints[i - 1] : p0;
                    var m0 = mul(sub(p1, p), [
                        0.5,
                        0.5
                    ]);
                    p = i < controlPoints.length - 2 ? controlPoints[i + 2] : p1;
                    var m1 = mul(sub(p, p0), [
                        0.5,
                        0.5
                    ]);
                    for(var j = 0, end1 = pointsPerSegment, asc1 = 0 <= end1; asc1 ? j <= end1 : j >= end1; asc1 ? j++ : j--){
                        var t = j * pointsPerStep;
                        var fac0 = 2 * t * t * t - 3 * t * t + 1;
                        var fac1 = t * t * t - 2 * t * t + t;
                        var fac2 = -2 * t * t * t + 3 * t * t;
                        var fac3 = t * t * t - t * t;
                        var pos = add(mul(p0, [
                            fac0,
                            fac0
                        ]), mul(m0, [
                            fac1,
                            fac1
                        ]), mul(p1, [
                            fac2,
                            fac2
                        ]), mul(m1, [
                            fac3,
                            fac3
                        ]));
                        ret[Math.round(pos[0])] = Math.round(clamp(pos[1], lowBound, highBound));
                        count += 1;
                    }
                }
                var endX = controlPoints[controlPoints.length - 1][0];
                ret = _Calculate.missingValues(ret, endX);
                return ret;
            }
        },
        {
            key: "missingValues",
            value: // Calculates possible missing values from a given value array. Note that this returns a copy
            // and does not mutate the original. In case no values are missing the original array is
            // returned as that is convenient.
            //
            // @param [Array] 2-item arrays describing the x, y coordinates of the control points.
            // @param [Number] end x value of the array (maximum)
            // @return [Array] Array whose index represents every x-value between start and end, and value
            //   represents the corresponding y-value.
            function missingValues(values, endX) {
                if (Object.keys(values).length < endX + 1) {
                    var ret = {};
                    for(var i = 0, end = endX, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--){
                        if (values[i] != null) {
                            ret[i] = values[i];
                        } else {
                            var rightCoord = [
                                0,
                                0
                            ];
                            var leftCoord = [
                                i - 1,
                                ret[i - 1]
                            ];
                            for(var j = i, end1 = endX, asc1 = i <= end1; asc1 ? j <= end1 : j >= end1; asc1 ? j++ : j--){
                                if (values[j] != null) {
                                    rightCoord = [
                                        j,
                                        values[j]
                                    ];
                                    break;
                                }
                            }
                            ret[i] = leftCoord[1] + (rightCoord[1] - leftCoord[1]) / (rightCoord[0] - leftCoord[0]) * (i - leftCoord[0]);
                        }
                    }
                    return ret;
                }
                return values;
            }
        },
        {
            key: "convolution",
            value: function convolution(inputData, kernel, width, height) {
                var newData = Buffer.from(inputData);
                var kRows = kernel.length;
                var kCols = kernel[0].length;
                var rowEnd = Math.floor(kRows / 2);
                var colEnd = Math.floor(kCols / 2);
                var rowIni = -rowEnd;
                var colIni = -colEnd;
                var weight;
                var rSum;
                var gSum;
                var bSum;
                var ri;
                var gi;
                var bi;
                var xi;
                var yi;
                var idxi;
                for(var y = 0; y < height; y++){
                    for(var x = 0; x < width; x++){
                        var pixel = (y * width + x) * 4;
                        bSum = 0;
                        gSum = 0;
                        rSum = 0;
                        for(var row = rowIni; row <= rowEnd; row++){
                            for(var col = colIni; col <= colEnd; col++){
                                xi = x + col;
                                yi = y + row;
                                weight = kernel[row + rowEnd][col + colEnd];
                                idxi = _Calculate.getPixelIndex(xi, yi, width, height);
                                if (idxi === -1) {
                                    bi = 0;
                                    gi = 0;
                                    ri = 0;
                                } else {
                                    ri = inputData[idxi + 0];
                                    gi = inputData[idxi + 1];
                                    bi = inputData[idxi + 2];
                                }
                                rSum += weight * ri;
                                gSum += weight * gi;
                                bSum += weight * bi;
                            }
                        }
                        if (rSum < 0) {
                            rSum = 0;
                        }
                        if (gSum < 0) {
                            gSum = 0;
                        }
                        if (bSum < 0) {
                            bSum = 0;
                        }
                        if (rSum > 255) {
                            rSum = 255;
                        }
                        if (gSum > 255) {
                            gSum = 255;
                        }
                        if (bSum > 255) {
                            bSum = 255;
                        }
                        newData[pixel + 0] = rSum;
                        newData[pixel + 1] = gSum;
                        newData[pixel + 2] = bSum;
                    }
                }
                return newData;
            }
        },
        {
            key: "getPixelIndex",
            value: function getPixelIndex(x, y, width, height) {
                if (x < 0 || x >= width || y < 0 || y >= height) {
                    return -1;
                }
                return (y * width + x) * 4;
            }
        }
    ]);
    return _Calculate;
}();
var calculate_default = Calculate;
// src/lib/convert.ts
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    var h = 0;
    if (max === min) {
        h = 0;
    } else {
        switch(max){
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        v: v
    };
}
function hsvToRgb(h, s, v) {
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var _ref = {
        r: 0,
        g: 0,
        b: 0
    }, r = _ref.r, g = _ref.g, b = _ref.b;
    switch(i % 6){
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}
// src/lib/color.ts
var import_opencv_js = __toESM(require("@techstark/opencv-js"));
var Color = /*#__PURE__*/ function() {
    function _Color(r, g, b, a) {
        _class_call_check(this, _Color);
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    _create_class(_Color, [
        {
            key: "mul",
            value: function mul(factor) {
                return new _Color(this.r * factor, this.g * factor, this.b * factor, this.a * factor);
            }
        },
        {
            key: "add",
            value: function add(other) {
                return new _Color(this.r + other.r, this.g + other.g, this.b + other.b, this.a + other.a);
            }
        },
        {
            key: "clamp",
            value: function clamp() {
                this.r = Math.min(255, Math.max(0, this.r));
                this.g = Math.min(255, Math.max(0, this.g));
                this.b = Math.min(255, Math.max(0, this.b));
                this.a = Math.min(255, Math.max(0, this.a));
            }
        }
    ]);
    return _Color;
}();
var RGBAImage = /*#__PURE__*/ function() {
    function _RGBAImage(w, h, data, imageData) {
        _class_call_check(this, _RGBAImage);
        this.clamp = function(num, min, max) {
            return Math.min(Math.max(num, min), max);
        };
        this.type = "RGBAImage";
        this.w = w;
        this.h = h;
        this.imageData = new ImageData(w, h);
        this.data = new Uint8Array(w * h * 4);
        if (data) {
            this.data.set(data);
        }
        if (imageData) {
            this.imageData = imageData;
        }
    }
    _create_class(_RGBAImage, [
        {
            key: "getPixel",
            value: function getPixel(x, y) {
                var idx = (y * this.w + x) * 4;
                return new Color(this.data[idx], this.data[idx + 1], this.data[idx + 2], this.data[idx + 3]);
            }
        },
        {
            key: "sample",
            value: function sample(x, y) {
                var ty = Math.floor(y);
                var dy = Math.ceil(y);
                var lx = Math.floor(x);
                var rx = Math.ceil(x);
                var fx = x - lx;
                var fy = y - ty;
                var c = this.getPixel(lx, ty).mul((1 - fy) * (1 - fx)).add(this.getPixel(lx, dy).mul(fy * (1 - fx))).add(this.getPixel(rx, ty).mul((1 - fy) * fx)).add(this.getPixel(rx, dy).mul(fy * fx));
                c.clamp();
                return c;
            }
        },
        {
            key: "setPixel",
            value: function setPixel(x, y, c) {
                var idx = (y * this.w + x) * 4;
                this.data[idx] = c.r;
                this.data[idx + 1] = c.g;
                this.data[idx + 2] = c.b;
                this.data[idx + 3] = c.a;
            }
        },
        {
            key: "apply",
            value: function apply(f) {
                for(var y = 0; y < this.h; y++){
                    for(var x = 0; x < this.w; x++){
                        this.setPixel(x, y, f(this.getPixel(x, y)));
                    }
                }
                return this;
            }
        },
        {
            key: "formatUint8Array",
            value: function formatUint8Array(f) {
                var dst = new _RGBAImage(this.w, this.h, this.data.slice());
                var data = dst.data;
                for(var y = 0, idx = 0; y < this.h; ++y){
                    for(var x = 0; x < this.w; ++x, idx += 4){
                        f(data, idx, this.w, this.h, x, y);
                    }
                }
                return dst;
            }
        },
        {
            key: "convolution",
            value: function convolution(kernel) {
                var _this = this;
                var kRows = kernel.length;
                var kCols = kernel[0].length;
                var rowEnd = Math.floor(kRows / 2);
                var colEnd = Math.floor(kCols / 2);
                var rowIni = -rowEnd;
                var colIni = -colEnd;
                var width = this.w;
                var height = this.h;
                var weight;
                var rSum;
                var gSum;
                var bSum;
                var ri;
                var gi;
                var bi;
                var xi;
                var yi;
                var idxi;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var pixel = (y * width + x) * 4;
                    bSum = 0;
                    gSum = 0;
                    rSum = 0;
                    for(var row = rowIni; row <= rowEnd; row++){
                        for(var col = colIni; col <= colEnd; col++){
                            xi = x + col;
                            yi = y + row;
                            weight = kernel[row + rowEnd][col + colEnd];
                            idxi = calculate_default.getPixelIndex(xi, yi, width, height);
                            if (idxi === -1) {
                                bi = 0;
                                gi = 0;
                                ri = 0;
                            } else {
                                ri = _this.data[idxi + 0];
                                gi = _this.data[idxi + 1];
                                bi = _this.data[idxi + 2];
                            }
                            rSum += weight * ri;
                            gSum += weight * gi;
                            bSum += weight * bi;
                        }
                    }
                    if (rSum < 0) {
                        rSum = 0;
                    }
                    if (gSum < 0) {
                        gSum = 0;
                    }
                    if (bSum < 0) {
                        bSum = 0;
                    }
                    if (rSum > 255) {
                        rSum = 255;
                    }
                    if (gSum > 255) {
                        gSum = 255;
                    }
                    if (bSum > 255) {
                        bSum = 255;
                    }
                    data[pixel + 0] = rSum;
                    data[pixel + 1] = gSum;
                    data[pixel + 2] = bSum;
                    return data;
                });
                return dst;
            }
        },
        {
            key: "resize",
            value: function resize(w, h) {
                var iw = this.w;
                var ih = this.h;
                var dst = new _RGBAImage(w, h);
                var ystep = 1 / (h - 1);
                var xstep = 1 / (w - 1);
                for(var i = 0; i < h; i++){
                    var y = i * ystep;
                    for(var j = 0; j < w; j++){
                        var x = j * xstep;
                        dst.setPixel(j, i, this.sample(x * (iw - 1), y * (ih - 1)));
                    }
                }
                return dst;
            }
        },
        {
            key: "resize_longedge",
            value: function resize_longedge(L) {
                var nw;
                var nh;
                if (this.w > this.h && this.w > L) {
                    nw = L;
                    nh = Math.round(L / this.w * this.h);
                    this.resize(nw, nh);
                }
                if (this.h > L) {
                    nh = L;
                    nw = Math.round(L / this.h * this.w);
                    this.resize(nw, nh);
                }
                return this;
            }
        },
        {
            key: "uploadTexture",
            value: function uploadTexture(ctx, texId) {
                ctx.bindTexture(ctx.TEXTURE_2D, texId);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.w, this.h, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, this.data);
            }
        },
        {
            key: "toImageData",
            value: function toImageData(ctx) {
                var imgData = ctx.createImageData(this.w, this.h);
                imgData.data.set(this.data);
                return imgData;
            }
        },
        {
            // utility
            key: "calculateBrightness",
            value: function calculateBrightness(r, g, b) {
                var brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                return brightness;
            }
        },
        {
            key: "isWhite",
            value: function isWhite(r, g, b) {
                var treshold = 200;
                if (r >= treshold && g >= treshold && b >= treshold) {
                    return true;
                }
                return false;
            }
        },
        {
            key: "isBlacks",
            value: function isBlacks(r, g, b) {
                var treshold = 60;
                if (r <= treshold && g <= treshold && b <= treshold) {
                    return true;
                }
                return false;
            }
        },
        {
            //image adjustment filter
            //temperature
            key: "temperature",
            value: function temperature(value, src) {
                value /= 2;
                for(var i = 0; i < src.rows; i++){
                    for(var j = 0; j < src.cols; j++){
                        src.ptr(i, j)[0] = Math.min(Math.max(src.ptr(i, j)[0] + value, 0), 255);
                        src.ptr(i, j)[2] = Math.min(Math.max(src.ptr(i, j)[2] - value, 0), 255);
                    }
                }
                return src;
            }
        },
        {
            key: "exposure",
            value: function exposure(value, src) {
                var rows = src.rows;
                var cols = src.cols;
                var channels = src.channels();
                if (value > 0) {
                    value /= 110;
                }
                if (value < 0) {
                    value /= 20;
                }
                for(var y = 0; y < rows; y++){
                    for(var x = 0; x < cols; x++){
                        for(var c = 0; c < channels; c++){
                            var pixel = src.ucharPtr(y, x)[c];
                            var adjustedPixel = Math.min(255, Math.round(255 * Math.pow(pixel / 255, value * -1 + 1)));
                            src.ucharPtr(y, x)[c] = adjustedPixel;
                        }
                    }
                }
                console.log({
                    "src": src.data
                });
                return src;
            }
        },
        {
            key: "hightlight",
            value: function hightlight(value, src) {
                value /= 500;
                var labImage = new import_opencv_js.default.Mat();
                import_opencv_js.default.cvtColor(src, labImage, import_opencv_js.default.COLOR_BGR2Lab);
                for(var i = 0; i < labImage.rows; i++){
                    for(var j = 0; j < labImage.cols; j++){
                        labImage.ucharPtr(i, j)[0] = Math.max(0, Math.min(255, labImage.ucharPtr(i, j)[0] * (1 + value)));
                    }
                }
                var bgr = new import_opencv_js.default.Mat();
                import_opencv_js.default.cvtColor(labImage, bgr, import_opencv_js.default.COLOR_Lab2BGR);
                for(var i1 = 0; i1 < src.rows; i1++){
                    for(var j1 = 0; j1 < src.cols; j1++){
                        src.ucharPtr(i1, j1)[0] = bgr.ucharPtr(i1, j1)[0];
                        src.ucharPtr(i1, j1)[1] = bgr.ucharPtr(i1, j1)[1];
                        src.ucharPtr(i1, j1)[2] = bgr.ucharPtr(i1, j1)[2];
                    }
                }
                return src;
            }
        },
        {
            key: "brightness",
            value: function brightness(value, src) {
                for(var i = 0; i < src.rows; i++){
                    for(var j = 0; j < src.cols; j++){
                        src.ucharPtr(i, j)[0] = Math.max(0, Math.min(255, src.ucharPtr(i, j)[0] + value));
                        src.ucharPtr(i, j)[1] = Math.max(0, Math.min(255, src.ucharPtr(i, j)[1] + value));
                        src.ucharPtr(i, j)[2] = Math.max(0, Math.min(255, src.ucharPtr(i, j)[2] + value));
                    }
                }
                return src;
            }
        },
        {
            key: "contrast",
            value: function contrast(value, src) {
                var dst = new import_opencv_js.default.Mat();
                var alpha = 1 + value / 50;
                var beta = 128 - alpha * 128;
                import_opencv_js.default.convertScaleAbs(src, dst, alpha, beta);
                for(var i = 0; i < src.rows; i++){
                    for(var j = 0; j < src.cols; j++){
                        src.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0];
                        src.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1];
                        src.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2];
                    }
                }
                return src;
            }
        },
        {
            key: "adjustOpenCV",
            value: function adjustOpenCV(param) {
                var brightness = param.brightness, exposure = param.exposure, contrast = param.contrast, temperature = param.temperature, hightlight = param.hightlight, cvsId = param.cvsId;
                var src = import_opencv_js.default.matFromImageData(this.imageData);
                this.brightness(brightness, src);
                this.exposure(exposure, src);
                this.contrast(contrast, src);
                this.temperature(temperature, src);
                this.hightlight(hightlight, src);
                import_opencv_js.default.imshow(cvsId, src);
            }
        },
        {
            key: "shadow",
            value: function shadow(value) {
                var _this = this;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, g = _this_getPixel.g, b = _this_getPixel.b;
                    var maxFactor = 200;
                    var brightness = _this.calculateBrightness(r, g, b);
                    if (brightness < maxFactor) {
                        r = _this.clamp(r - value, 0, 255);
                        g = _this.clamp(g - value, 0, 255);
                        b = _this.clamp(b - value, 0, 255);
                    }
                    data[idx] = r;
                    ++idx;
                    data[idx] = g;
                    ++idx;
                    data[idx] = b;
                    return data;
                });
                return dst;
            }
        },
        {
            key: "white",
            value: function white(value) {
                var _this = this;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, g = _this_getPixel.g, b = _this_getPixel.b;
                    var luminance = _this.calculateBrightness(r, g, b);
                    if (luminance > 200) {
                        if (_this.isWhite(r, g, b)) {
                            r = _this.clamp(luminance + value, 0, 255);
                            g = _this.clamp(luminance + value, 0, 255);
                            b = _this.clamp(luminance + value, 0, 255);
                        }
                    }
                    data[idx] = r;
                    ++idx;
                    data[idx] = g;
                    ++idx;
                    data[idx] = b;
                    return data;
                });
                return dst;
            }
        },
        {
            key: "black",
            value: function black(value) {
                var _this = this;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, g = _this_getPixel.g, b = _this_getPixel.b;
                    var luminance = _this.calculateBrightness(r, g, b);
                    if (luminance < 60) {
                        if (_this.isBlacks(r, g, b)) {
                            r = _this.clamp(luminance - value, 0, 255);
                            g = _this.clamp(luminance - value, 0, 255);
                            b = _this.clamp(luminance - value, 0, 255);
                        }
                    }
                    data[idx] = r;
                    ++idx;
                    data[idx] = g;
                    ++idx;
                    data[idx] = b;
                    return data;
                });
                return dst;
            }
        },
        {
            // tint
            key: "tint",
            value: function tint(value) {
                var _this = this;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, b = _this_getPixel.b;
                    var g = _this.getPixel(x, y).g;
                    var green = g - value;
                    g = Math.min(255, Math.max(0, green));
                    data[idx] = r;
                    ++idx;
                    data[idx] = g;
                    ++idx;
                    data[idx] = b;
                    return data;
                });
                return dst;
            }
        },
        {
            key: "saturationRGB",
            value: function saturationRGB(value) {
                var _this = this;
                var saturationCorrection = value * -0.01;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, g = _this_getPixel.g, b = _this_getPixel.b;
                    var max = Math.max(r, g, b);
                    if (r !== max) r += (max - r) * saturationCorrection;
                    if (g !== max) g += (max - g) * saturationCorrection;
                    if (b !== max) b += (max - b) * saturationCorrection;
                    r = Math.min(255, Math.max(0, r));
                    g = Math.min(255, Math.max(0, g));
                    b = Math.min(255, Math.max(0, b));
                    data[idx] = r;
                    ++idx;
                    data[idx] = g;
                    ++idx;
                    data[idx] = b;
                    return data;
                });
                return dst;
            }
        },
        {
            // Detail
            key: "hue",
            value: function hue(value) {
                var _this = this;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, g = _this_getPixel.g, b = _this_getPixel.b;
                    var hsv = rgbToHsv(r, g, b);
                    hsv.h *= 100;
                    hsv.h += value;
                    hsv.h = hsv.h % 100;
                    hsv.h /= 100;
                    var newData = hsvToRgb(hsv.h, hsv.s, hsv.v);
                    data[idx] = newData.r;
                    ++idx;
                    data[idx] = newData.g;
                    ++idx;
                    data[idx] = newData.b;
                    return data;
                });
                return dst;
            }
        },
        {
            key: "gamma",
            value: function gamma(value) {
                var _this = this;
                value = Math.pow(2, value / 30.5);
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, g = _this_getPixel.g, b = _this_getPixel.b;
                    r = Math.pow(r / 255, value) * 255;
                    g = Math.pow(g / 255, value) * 255;
                    b = Math.pow(b / 255, value) * 255;
                    r = Math.min(255, Math.max(0, r));
                    g = Math.min(255, Math.max(0, g));
                    b = Math.min(255, Math.max(0, b));
                    data[idx] = r;
                    ++idx;
                    data[idx] = g;
                    ++idx;
                    data[idx] = b;
                    return data;
                });
                return dst;
            }
        },
        {
            //value between 0 - 100
            key: "sepia",
            value: function sepia(value) {
                var _this = this;
                var normalizedvalue = value / 100;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, g = _this_getPixel.g, b = _this_getPixel.b;
                    r = Math.min(255, r * (1 - 0.607 * normalizedvalue) + g * (0.769 * normalizedvalue) + b * (0.189 * normalizedvalue));
                    g = Math.min(255, r * (0.349 * normalizedvalue) + g * (1 - 0.314 * normalizedvalue) + b * (0.168 * normalizedvalue));
                    b = Math.min(255, r * (0.272 * normalizedvalue) + g * (0.534 * normalizedvalue) + b * (1 - 0.869 * normalizedvalue));
                    data[idx] = r;
                    ++idx;
                    data[idx] = g;
                    ++idx;
                    data[idx] = b;
                    return data;
                });
                return dst;
            }
        },
        {
            //value 0 - 100
            key: "noise",
            value: function noise(value) {
                var _this = this;
                var adjust = Math.abs(value) * 2.55;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, g = _this_getPixel.g, b = _this_getPixel.b;
                    var rand = calculate_default.randomRange(adjust * -1, adjust);
                    r += rand;
                    g += rand;
                    b += rand;
                    r = Math.min(255, Math.max(0, r));
                    g = Math.min(255, Math.max(0, g));
                    b = Math.min(255, Math.max(0, b));
                    data[idx] = r;
                    ++idx;
                    data[idx] = g;
                    ++idx;
                    data[idx] = b;
                    return data;
                });
                return dst;
            }
        },
        {
            //value between 0 - 100
            key: "clip",
            value: function clip(value) {
                var _this = this;
                var adjust = Math.abs(value) * 2.55;
                var dst = this.formatUint8Array(function(data, idx, _, __, x, y) {
                    var _this_getPixel = _this.getPixel(x, y), r = _this_getPixel.r, g = _this_getPixel.g, b = _this_getPixel.b;
                    if (r > 255 - adjust) {
                        r = 255;
                    } else if (r < adjust) {
                        r = 0;
                    }
                    if (g > 255 - adjust) {
                        g = 255;
                    } else if (g < adjust) {
                        g = 0;
                    }
                    if (b > 255 - adjust) {
                        b = 255;
                    } else if (b < adjust) {
                        b = 0;
                    }
                    data[idx] = r;
                    ++idx;
                    data[idx] = g;
                    ++idx;
                    data[idx] = b;
                    return data;
                });
                return dst;
            }
        },
        {
            key: "clarity",
            value: function clarity(value) {
                var clarityKernel;
                value /= 80;
                if (value === 0) {
                    clarityKernel = [
                        [
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            1,
                            0
                        ],
                        [
                            0,
                            0,
                            0
                        ]
                    ];
                } else if (value > 0) {
                    clarityKernel = [
                        [
                            0,
                            -0.5,
                            0 + Math.abs(value) / 5
                        ],
                        [
                            -0.5 + Math.abs(value) / 50,
                            2.9,
                            -0.5 + Math.abs(value) / 50
                        ],
                        [
                            0,
                            -0.5,
                            0
                        ]
                    ];
                } else {
                    clarityKernel = [
                        [
                            0.1,
                            0.1,
                            0.1
                        ],
                        [
                            0.1,
                            0.19 + Math.abs(value) / 50,
                            0.1
                        ],
                        [
                            0.1,
                            0.1,
                            0.1
                        ]
                    ];
                }
                var dst = this.convolution(clarityKernel);
                return dst;
            }
        },
        {
            key: "sharpness",
            value: function sharpness(value) {
                var sharpenKernel;
                switch(true){
                    case value < -10:
                        sharpenKernel = [
                            [
                                1 / 9,
                                1 / 9,
                                1 / 9
                            ],
                            [
                                1 / 9,
                                1 / 9,
                                1 / 9
                            ],
                            [
                                1 / 9,
                                1 / 9,
                                1 / 9
                            ]
                        ];
                        break;
                    case value < -20:
                        sharpenKernel = [
                            [
                                1 / 8,
                                1 / 4,
                                1 / 8
                            ],
                            [
                                1 / 4,
                                1 / 2,
                                1 / 4
                            ],
                            [
                                1 / 8,
                                1 / 4,
                                1 / 8
                            ]
                        ];
                        break;
                    case value > 0 && value <= 30:
                        sharpenKernel = [
                            [
                                0,
                                -0.5,
                                0
                            ],
                            [
                                -0.5,
                                3,
                                -0.5
                            ],
                            [
                                0,
                                -0.5,
                                0
                            ]
                        ];
                        break;
                    case value > 30 && value <= 70:
                        sharpenKernel = [
                            [
                                0,
                                -1,
                                0
                            ],
                            [
                                -1,
                                5,
                                -1
                            ],
                            [
                                0,
                                -1,
                                0
                            ]
                        ];
                        break;
                    case value > 70:
                        sharpenKernel = [
                            [
                                -1,
                                -1,
                                -1
                            ],
                            [
                                -1,
                                9,
                                -1
                            ],
                            [
                                -1,
                                -1,
                                -1
                            ]
                        ];
                        break;
                    default:
                        sharpenKernel = [
                            [
                                0,
                                0,
                                0
                            ],
                            [
                                0,
                                1,
                                0
                            ],
                            [
                                0,
                                0,
                                0
                            ]
                        ];
                        break;
                }
                var dst = this.convolution(sharpenKernel);
                return dst;
            }
        },
        {
            key: "render",
            value: function render(cvs) {
                cvs.width = this.w;
                cvs.height = this.h;
                var context = cvs.getContext("2d", {
                    willReadFrequently: true
                });
                if (context) {
                    context.putImageData(this.toImageData(context), 0, 0);
                } else {
                    console.error("Canvas 2D context not available.");
                }
            }
        }
    ], [
        {
            key: "fromImage",
            value: function fromImage(img, cvs) {
                var w = img.width;
                var h = img.height;
                cvs.width = w;
                cvs.height = h;
                var ctx = cvs.getContext("2d", {
                    willReadFrequently: true,
                    alpha: false
                });
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    var imgData = ctx.getImageData(0, 0, w, h);
                    var uint8Array = new Uint8Array(imgData.data);
                    var newImage = new _RGBAImage(w, h, uint8Array, imgData);
                    return newImage;
                }
                console.error("Canvas 2D context not available.");
                return new _RGBAImage(0, 0);
            }
        }
    ]);
    return _RGBAImage;
}();
// src/core/canvasImageEdit.ts
var CanvasImageEdit = /*#__PURE__*/ function() {
    function CanvasImageEdit() {
        _class_call_check(this, CanvasImageEdit);
    }
    _create_class(CanvasImageEdit, [
        {
            key: "ImageLoader",
            value: function ImageLoader(cvs, imageSrc, maxEdge) {
                var that = this;
                var image = new Image();
                image.src = imageSrc;
                image.setAttribute("crossOrigin", "anonymous");
                image.onload = function() {
                    var inImg = RGBAImage.fromImage(image, cvs);
                    that.result = inImg.resize_longedge(maxEdge || 640);
                    that.result.render(cvs);
                    var event = new Event("imageloaded");
                    document.dispatchEvent(event);
                };
            }
        }
    ]);
    return CanvasImageEdit;
}();
var canvasImageEdit_default = CanvasImageEdit;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    CanvasImageEdit: CanvasImageEdit
});
