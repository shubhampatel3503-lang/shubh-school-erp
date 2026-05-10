// Type shim for jsqr (BarcodeDetector-based approach used instead of npm package)
declare module "jsqr" {
  interface QRCode {
    data: string;
    binaryData: number[];
    chunks: unknown[];
    version: number;
    location: {
      topRightCorner: { x: number; y: number };
      topLeftCorner: { x: number; y: number };
      bottomRightCorner: { x: number; y: number };
      bottomLeftCorner: { x: number; y: number };
    };
  }
  function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options?: {
      inversionAttempts?:
        | "dontInvert"
        | "onlyInvert"
        | "attemptBoth"
        | "invertFirst";
    },
  ): QRCode | null;
  export = jsQR;
}
