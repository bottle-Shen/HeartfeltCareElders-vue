declare module 'element-plus/dist/locale/zh-cn.mjs';

declare module 'three/build/three.module.js' {
  const three: typeof Three;
  export default three;
}

declare global {
  interface Window {
    echarts: typeof import('echarts');
  }
}