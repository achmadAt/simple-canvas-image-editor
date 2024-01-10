import cv from '@techstark/opencv-js';

declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number);
    mul(factor: number): Color;
    add(other: Color): Color;
    clamp(): void;
}
declare class RGBAImage {
    type: string;
    w: number;
    h: number;
    data: Uint8Array;
    imageData: ImageData;
    constructor(w: number, h: number, data?: Uint8Array, imageData?: ImageData);
    getPixel(x: number, y: number): Color;
    sample(x: number, y: number): Color;
    setPixel(x: number, y: number, c: Color): void;
    apply(f: (color: Color) => Color): this;
    formatUint8Array(f: (data: Uint8Array, idx: number, w: number, h: number, x: number, y: number) => void): RGBAImage;
    convolution(kernel: number[][]): RGBAImage;
    resize(w: number, h: number): RGBAImage;
    resize_longedge(L: number): this;
    uploadTexture(ctx: WebGLRenderingContext, texId: WebGLTexture): void;
    toImageData(ctx: CanvasRenderingContext2D): ImageData;
    calculateBrightness(r: number, g: number, b: number): number;
    clamp: (num: number, min: number, max: number) => number;
    isWhite(r: number, g: number, b: number): boolean;
    isBlacks(r: number, g: number, b: number): boolean;
    temperature(value: number, src: cv.Mat): cv.Mat;
    exposure(value: number, src: cv.Mat): cv.Mat;
    hightlight(value: number, src: cv.Mat): cv.Mat;
    brightness(value: number, src: cv.Mat): cv.Mat;
    contrast(value: number, src: cv.Mat): cv.Mat;
    adjustOpenCV(param: {
        brightness: number;
        exposure: number;
        contrast: number;
        temperature: number;
        hightlight: number;
        cvsId: string;
    }): void;
    shadow(value: number): RGBAImage;
    white(value: number): RGBAImage;
    black(value: number): RGBAImage;
    tint(value: number): RGBAImage;
    saturationRGB(value: number): RGBAImage;
    hue(value: number): RGBAImage;
    gamma(value: number): RGBAImage;
    sepia(value: number): RGBAImage;
    noise(value: number): RGBAImage;
    clip(value: number): RGBAImage;
    clarity(value: number): RGBAImage;
    sharpness(value: number): RGBAImage;
    render(cvs: HTMLCanvasElement): void;
    static fromImage(img: any, cvs: HTMLCanvasElement): RGBAImage;
}

declare class CanvasImageEdit {
    result: RGBAImage | undefined;
    constructor();
    ImageLoader(cvs: HTMLCanvasElement, imageSrc: string, // Image base64 or url
    maxEdge?: number): void;
}

export { CanvasImageEdit };
