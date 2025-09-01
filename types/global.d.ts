export { };

declare module '*.glb';
declare module '*.png';

declare module 'meshline' {
  export const meshLineGeometry: any;
  export const meshLineMaterial: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}