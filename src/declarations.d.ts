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

declare module '@ffmpeg/ffmpeg' {
  // 声明模块的类型
  export function createFFmpeg(options: { log: boolean }): FFmegIstance;
  export function fetchFile(file: File): Promise<ArrayBuffer>;
}

// 手动声明 vuex 模块
declare module 'vuex' {
  export * from 'vuex/types/index.d.ts';
}