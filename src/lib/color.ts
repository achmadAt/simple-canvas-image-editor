/* eslint-disable max-classes-per-file */
/* eslint-disable no-plusplus */

import Calculate from './calculate';
import cv, { Mat } from '@techstark/opencv-js';
class Color {
  r: number;

  g: number;

  b: number;

  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  mul(factor: number): Color {
    return new Color(
      this.r * factor,
      this.g * factor,
      this.b * factor,
      this.a * factor,
    );
  }

  add(other: Color): Color {
    return new Color(
      this.r + other.r,
      this.g + other.g,
      this.b + other.b,
      this.a + other.a,
    );
  }

  clamp() {
    this.r = Math.min(255, Math.max(0, this.r));
    this.g = Math.min(255, Math.max(0, this.g));
    this.b = Math.min(255, Math.max(0, this.b));
    this.a = Math.min(255, Math.max(0, this.a));
  }
}

export class RGBAImage {
  type: string;

  w: number;

  h: number;

  data: Uint8Array;
  imageData: ImageData;

  constructor(w: number, h: number, data?: Uint8Array, imageData?: ImageData) {
    this.type = 'RGBAImage';
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

  //Utility
  getPixel(x: number, y: number): Color {
    const idx = (y * this.w + x) * 4;
    return new Color(
      this.data[idx],
      this.data[idx + 1],
      this.data[idx + 2],
      this.data[idx + 3],
    );
  }

  sample(x: number, y: number): Color {
    const ty = Math.floor(y);
    const dy = Math.ceil(y);
    const lx = Math.floor(x);
    const rx = Math.ceil(x);
    const fx = x - lx;
    const fy = y - ty;

    const c = this.getPixel(lx, ty)
      .mul((1 - fy) * (1 - fx))
      .add(this.getPixel(lx, dy).mul(fy * (1 - fx)))
      .add(this.getPixel(rx, ty).mul((1 - fy) * fx))
      .add(this.getPixel(rx, dy).mul(fy * fx));

    c.clamp();

    return c;
  }

  setPixel(x: number, y: number, c: Color) {
    const idx = (y * this.w + x) * 4;
    this.data[idx] = c.r;
    this.data[idx + 1] = c.g;
    this.data[idx + 2] = c.b;
    this.data[idx + 3] = c.a;
  }

  apply(f: (color: Color) => Color): this {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        this.setPixel(x, y, f(this.getPixel(x, y)));
      }
    }
    return this;
  }

  formatUint8Array(
    f: (
      data: Uint8Array,
      idx: number,
      w: number,
      h: number,
      x: number,
      y: number,
    ) => void,
  ): RGBAImage {
    const dst = new RGBAImage(this.w, this.h, this.data.slice());
    const { data } = dst;
    for (let y = 0, idx = 0; y < this.h; ++y) {
      for (let x = 0; x < this.w; ++x, idx += 4) {
        f(data, idx, this.w, this.h, x, y);
      }
    }

    return dst;
  }

  resize(w: number, h: number): RGBAImage {
    const iw = this.w;
    const ih = this.h;
    const dst = new RGBAImage(w, h);
    const ystep = 1.0 / (h - 1);
    const xstep = 1.0 / (w - 1);
    for (let i = 0; i < h; i++) {
      const y = i * ystep;
      for (let j = 0; j < w; j++) {
        const x = j * xstep;
        dst.setPixel(j, i, this.sample(x * (iw - 1), y * (ih - 1)));
      }
    }
    return dst;
  }

  resize_longedge(L: number): this {
    let nw;
    let nh;
    if (this.w > this.h && this.w > L) {
      nw = L;
      nh = Math.round((L / this.w) * this.h);
      this.resize(nw, nh);
    }
    if (this.h > L) {
      nh = L;
      nw = Math.round((L / this.h) * this.w);
      this.resize(nw, nh);
    }
    return this;
  }

  uploadTexture(ctx: WebGLRenderingContext, texId: WebGLTexture) {
    ctx.bindTexture(ctx.TEXTURE_2D, texId);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texImage2D(
      ctx.TEXTURE_2D,
      0,
      ctx.RGBA,
      this.w,
      this.h,
      0,
      ctx.RGBA,
      ctx.UNSIGNED_BYTE,
      this.data,
    );
  }

  copyMat(src: cv.Mat, dst: cv.Mat) {
    for (let i = 0; i < src.rows; i++) {
      for (let j = 0; j < src.cols; j++) {
        // for (let k = 0; k < src.channels(); k++) {
        //     dst.ucharPtr(i, j)[k] = src.ucharPtr(i, j)[k];
        // }
        dst.ucharPtr(i, j)[0] = src.ucharPtr(i, j)[0];
        dst.ucharPtr(i, j)[1] = src.ucharPtr(i, j)[1];
        dst.ucharPtr(i, j)[2] = src.ucharPtr(i, j)[2];
      }
    }
  }

  toImageData(ctx: CanvasRenderingContext2D): ImageData {
    const imgData = ctx.createImageData(this.w, this.h);
    imgData.data.set(this.data);
    return imgData;
  }

  //image adjustment filter

  exposureWeighted(value: number, src: cv.Mat) {
    let dst = new cv.Mat();
    let src2 = new cv.Mat(src.rows, src.cols, src.type());
    let beta = 0;
    let gamma = value / 2;
    cv.addWeighted(src, 1, src2, beta, gamma, dst);
    // for (let i = 0; i < src.rows; i++) {
    //   for (let j = 0; j < src.cols; j++) {
    //     src.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0];
    //     src.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1];
    //     src.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2];
    //   }
    // }
    this.copyMat(dst, src);
    return src;
  }
  //temperature
  temperature(value: number, src: cv.Mat) {
    value /= 2;
    for (let i = 0; i < src.rows; i++) {
      for (let j = 0; j < src.cols; j++) {
        // Shift blue and red channels in opposite directions
        src.ptr(i, j)[0] = Math.min(Math.max(src.ptr(i, j)[0] + value, 0), 255);
        src.ptr(i, j)[2] = Math.min(Math.max(src.ptr(i, j)[2] - value, 0), 255);
      }
    }
    return src;
  }

  exposure(value: number, src: cv.Mat) {
    // let src = cv.matFromImageData(this.imageData);
    const rows = src.rows;
    const cols = src.cols;
    const channels = src.channels();
    if (value > 0) {
      value /= 110;
    }
    if (value < 0) {
      value /= 20;
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        for (let c = 0; c < channels; c++) {
          const pixel = src.ucharPtr(y, x)[c];
          const adjustedPixel = Math.min(
            255,
            Math.round(255 * Math.pow(pixel / 255.0, value * -1 + 1)),
          );
          src.ucharPtr(y, x)[c] = adjustedPixel;
        }
      }
    }
    return src;
  }
  hightlight(value: number, src: cv.Mat) {
    value /= 500;
    let labImage = new cv.Mat();
    cv.cvtColor(src, labImage, cv.COLOR_BGR2Lab);
    for (let i = 0; i < labImage.rows; i++) {
      for (let j = 0; j < labImage.cols; j++) {
        labImage.ucharPtr(i, j)[0] = Math.max(
          0,
          Math.min(255, labImage.ucharPtr(i, j)[0] * (1 + value)),
        );
      }
    }
    let bgr = new cv.Mat();
    cv.cvtColor(labImage, bgr, cv.COLOR_Lab2BGR);
    // for (let i = 0; i < src.rows; i++) {
    //   for (let j = 0; j < src.cols; j++) {
    //     src.ucharPtr(i, j)[0] = bgr.ucharPtr(i, j)[0];
    //     src.ucharPtr(i, j)[1] = bgr.ucharPtr(i, j)[1];
    //     src.ucharPtr(i, j)[2] = bgr.ucharPtr(i, j)[2];
    //   }
    // }
    this.copyMat(bgr, src);
    return src;
  }

  brightness(value: number, src: cv.Mat) {
    for (let i = 0; i < src.rows; i++) {
      for (let j = 0; j < src.cols; j++) {
        src.ucharPtr(i, j)[0] = Math.max(
          0,
          Math.min(255, src.ucharPtr(i, j)[0] + value),
        );
        src.ucharPtr(i, j)[1] = Math.max(
          0,
          Math.min(255, src.ucharPtr(i, j)[1] + value),
        );
        src.ucharPtr(i, j)[2] = Math.max(
          0,
          Math.min(255, src.ucharPtr(i, j)[2] + value),
        );
      }
    }
    return src;
  }
  contrast(value: number, src: cv.Mat) {
    let dst = new cv.Mat();
    let alpha = 1 + value / 200;
    let beta = 128 - alpha * 128;
    cv.convertScaleAbs(src, dst, alpha, beta);
    // for (let i = 0; i < src.rows; i++) {
    //   for (let j = 0; j < src.cols; j++) {
    //     src.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0];
    //     src.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1];
    //     src.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2];
    //   }
    // }
    this.copyMat(dst, src);
    return src;
  }

  shadow(value: number, src: cv.Mat) {
    value /= 2;
    let labImage = new cv.Mat();
    cv.cvtColor(src, labImage, cv.COLOR_BGR2Lab);
    for (let i = 0; i < labImage.rows; i++) {
      for (let j = 0; j < labImage.cols; j++) {
        labImage.ucharPtr(i, j)[0] = Math.min(
          255,
          Math.max(0, labImage.ucharPtr(i, j)[0] + value),
        );
      }
    }
    let dst = new cv.Mat();
    cv.cvtColor(labImage, dst, cv.COLOR_Lab2BGR);
    // for (let i = 0; i < src.rows; i++) {
    //   for (let j = 0; j < src.cols; j++) {
    //     src.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0];
    //     src.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1];
    //     src.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2];
    //   }
    // }
    this.copyMat(dst, src);
    return src;
  }

  white(value: number, src: cv.Mat) {
    value /= 400;
    let labImage = new cv.Mat();
    cv.cvtColor(src, labImage, cv.COLOR_BGR2Lab);
    for (let i = 0; i < labImage.rows; i++) {
      for (let j = 0; j < labImage.cols; j++) {
        labImage.ucharPtr(i, j)[0] = Math.min(
          255,
          Math.max(0, labImage.ucharPtr(i, j)[0] * (1 + value)),
        );
      }
    }
    let dst = new cv.Mat();
    cv.cvtColor(labImage, dst, cv.COLOR_Lab2BGR);
    // for (let i = 0; i < src.rows; i++) {
    //   for (let j = 0; j < src.cols; j++) {
    //     src.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0];
    //     src.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1];
    //     src.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2];
    //   }
    // }
    this.copyMat(dst, src);
    return src;
  }
  calculateMean(numbers: number[]): number {
    /**
     * Calculates the mean of a list of numbers.
     *
     * @param {number[]} numbers - A list of numbers.
     * @returns {number} The mean of the list of numbers.
     */
    let total = 0;
    for (const number of numbers) {
      total += number;
    }
    const mean = total / numbers.length;
    return mean;
  }

  black(value: number, src: cv.Mat) {
    let labImage = new cv.Mat();
    cv.cvtColor(src, labImage, cv.COLOR_BGR2Lab);
    let numbers: number[] = [];

    for (let i = 0; i < labImage.rows; i++) {
      for (let j = 0; j < labImage.cols; j++) {
        numbers.push(labImage.ucharPtr(i, j)[0]);
      }
    }
    const threshold = this.calculateMean(numbers);
    for (let i = 0; i < labImage.rows; i++) {
      for (let j = 0; j < labImage.cols; j++) {
        if (value > 0) {
          if (labImage.ucharPtr(i, j)[0] < threshold) {
            labImage.ucharPtr(i, j)[0] = Math.max(
              0,
              labImage.ucharPtr(i, j)[0] -
                (threshold - labImage.ucharPtr(i, j)[0]) * value,
            );
          }
        } else if (value < 0) {
          if (labImage.ucharPtr(i, j)[0] < threshold) {
            labImage.ucharPtr(i, j)[0] = Math.min(
              255,
              labImage.ucharPtr(i, j)[0] -
                (threshold - labImage.ucharPtr(i, j)[0]) * value,
            );
          }
        }
      }
    }
    let dst = new cv.Mat();
    cv.cvtColor(labImage, dst, cv.COLOR_Lab2BGR);
    // for (let i = 0; i < src.rows; i++) {
    //   for (let j = 0; j < src.cols; j++) {
    //     src.ucharPtr(i, j)[0] = dst.ucharPtr(i, j)[0];
    //     src.ucharPtr(i, j)[1] = dst.ucharPtr(i, j)[1];
    //     src.ucharPtr(i, j)[2] = dst.ucharPtr(i, j)[2];
    //   }
    // }
    this.copyMat(dst, src);
    return src;
  }

  saturationRGB(value: number, src: cv.Mat) {
    let hsvImage = new cv.Mat();
    cv.cvtColor(src, hsvImage, cv.COLOR_BGR2HSV);
    // Loop through each pixel and adjust the saturation channel
    for (let i = 0; i < hsvImage.rows; i++) {
      for (let j = 0; j < hsvImage.cols; j++) {
        hsvImage.ucharPtr(i, j)[1] = Math.max(
          0,
          Math.min(255, hsvImage.ucharPtr(i, j)[1] * (1 + value))
        );
      }
    }
    let dst = new cv.Mat();
    cv.cvtColor(hsvImage, dst, cv.COLOR_HSV2BGR);
    this.copyMat(dst, src)
  }

  clarity(value: number, src: cv.Mat) {
    let lab = new cv.Mat();
    cv.cvtColor(src, lab, cv.COLOR_BGR2Lab);

    //use this because encountering type error when used in cv.addWeighted
    let src2 = new cv.Mat();
    cv.cvtColor(lab, src2, cv.COLOR_Lab2BGR);
    // split the channels
    let channels = new cv.MatVector();
    cv.split(lab, channels);
    let clahe = new cv.CLAHE(2.0);
    clahe.apply(channels.get(0), channels.get(0));
    cv.merge(channels, lab);
    let bgr = new cv.Mat();
    cv.cvtColor(lab, bgr, cv.COLOR_Lab2BGR);
    let dst = new cv.Mat();
    // console.log(src.rows, src.cols, src2.type());
    // console.log(bgr.rows, bgr.cols, bgr.type());
    cv.addWeighted(src2, 1 - value, bgr, value, 0, dst);
    this.copyMat(dst, src)
  }
  sharpness(value: number, src: cv.Mat) {
    let gaussianBlur = new cv.Mat();
    let kernelSize = new cv.Size(5, 5);
    cv.GaussianBlur(src, gaussianBlur, kernelSize, 0, 0, cv.BORDER_DEFAULT);
    let _sharpened = new cv.Mat();
    cv.addWeighted(src, 1.5, gaussianBlur, -0.5, 0, _sharpened);
    let dst = new cv.Mat();
    cv.addWeighted(src, 1 - value, _sharpened, value, 0, dst);
    this.copyMat(dst, src)
  }

  adjustOpenCV(param: {
    brightness: number;
    exposure: number;
    contrast: number;
    temperature: number;
    hightlight: number;
    shadow: number;
    white: number;
    black: number;
    saturation: number;
    clarity: number;
    sharpness: number;
    cvsId: string;
  }) {
    const {
      brightness,
      exposure,
      contrast,
      temperature,
      hightlight,
      shadow,
      white,
      black,
      saturation,
      clarity,
      sharpness,
      cvsId,
    } = param;
    let src = cv.matFromImageData(this.imageData);
    this.brightness(brightness, src);
    this.contrast(contrast, src);
    this.temperature(temperature, src);
    this.hightlight(hightlight, src);
    this.shadow(shadow, src);
    this.white(white, src);
    this.black(black, src)
    cv.imshow(cvsId, src);
  }

  // tint
  tint(value: number) {
    const dst = this.formatUint8Array((data, idx, _, __, x, y) => {
      const { r, b } = this.getPixel(x, y);
      let { g } = this.getPixel(x, y);
      const green = g - value;
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

  render(cvs: HTMLCanvasElement) {
    // eslint-disable-next-line no-param-reassign
    cvs.width = this.w;
    // eslint-disable-next-line no-param-reassign
    cvs.height = this.h;
    const context = cvs.getContext('2d', {
      willReadFrequently: true,
    });
    if (context) {
      context.putImageData(this.toImageData(context), 0, 0);
    } else {
      // eslint-disable-next-line no-console
      console.error('Canvas 2D context not available.');
    }
  }

  static fromImage(img: any, cvs: HTMLCanvasElement): RGBAImage {
    const w = img.width;
    const h = img.height;
    // eslint-disable-next-line no-param-reassign
    cvs.width = w;
    // eslint-disable-next-line no-param-reassign
    cvs.height = h;

    const ctx = cvs.getContext('2d', {
      willReadFrequently: true,
      alpha: false,
    });
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const uint8Array = new Uint8Array(imgData.data);
      const newImage = new RGBAImage(w, h, uint8Array, imgData);
      return newImage;
    }
    // eslint-disable-next-line no-console
    console.error('Canvas 2D context not available.');
    return new RGBAImage(0, 0);
  }
}
