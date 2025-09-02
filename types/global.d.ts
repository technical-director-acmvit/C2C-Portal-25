export {};

declare module "*.glb";
declare module "*.png";

declare module "meshline" {
  export const meshLineGeometry: unknown;
  export const meshLineMaterial: unknown;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: unknown;
      meshLineMaterial: unknown;
    }
  }
}
