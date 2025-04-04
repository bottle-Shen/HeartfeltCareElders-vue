import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'; // 使用 ES 模块导入
import postcssScss from 'postcss-scss'; // 引入 postcss-scss
import AutoImport from "unplugin-auto-import/vite"
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// Element自动导入 图标
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import Inspect from 'vite-plugin-inspect'

import { visualizer } from 'rollup-plugin-visualizer'// 引入 rollup-plugin-visualizer打包分析


const pathSrc = path.resolve(__dirname, 'src')

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  plugins: [//插件
    vue(),
    visualizer(),// 打包分析
    AutoImport ({
      imports: ["vue", "vue-router", "pinia"], //自动引入vue的ref、toRefs、onmounted等，无需在页面中再次引入
      dts: path.resolve(pathSrc, 'auto-imports.d.ts'), // 生成 `auto-import.d.ts` 全局声明
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver(),
      ],
    }),
    Components({
      resolvers: [
        //自动导入 Element Plus 组件
        ElementPlusResolver(),
        // 自动注册图标组件
        // IconsResolver({
        //   // prefix: 'i',  前缀默认是 ‘i’
        //   // prefix: 'icon',   可以改成其他前缀
        //   enabledCollections: ['ep'],
        // }),
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
    }),
    Inspect(),
  ],
  build: {
    target: 'esnext',
    minify: 'terser', // 使用 Terser 进行压缩
    // terserOptions: {
    //   compress: {
    //     drop_console: true, // 删除所有 console.* 语句
    //     drop_debugger: true, // 删除所有 debugger 语句
    //   },
    //   output: {
    //     comments: false,// 删除所有注释
    //   },
    // },
    chunkSizeWarningLimit: 1024 * 1024 * 2, // 分块大小警告设置为 2MB
    rollupOptions: {
      output: {
        // 分块配置
        manualChunks: {
          // 静态配置
          'vue': ['vue'], // Vue 核心库
          'vue-router': ['vue-router'], // Vue Router
          'vuex': ['vuex'], // Vuex
          'element-plus': ['element-plus'], // Element Plus
          'lodash-es': ['lodash-es'],
          'compressorjs': ['compressorjs'],// Compressor.js图片压缩
          // 'echarts': ['echarts'], // ECharts
          'axios': ['axios'], // Axios
          'crypto-js': ['crypto-js'], // CryptoJS
          'secure-ls': ['secure-ls'], // Secure LS
          'jsrsasign': ['jsrsasign'], // jsrsasign
          'three': ['three'], // Three.js
          'vanta': ['vanta'], // Vanta
          'bootstrap': ['bootstrap'], // Bootstrap
          'unplugin-icons': ['unplugin-icons'], // Unplugin Icons
          'sentry': ['@sentry/tracing', '@sentry/vue'], // Sentry
          'echarts': [path.resolve(__dirname, 'src/echarts.min.js')], // ECharts
        }
      },
    }
  },
  css: {
    postcss: {
      plugins: [autoprefixer], // 使用 ES 模块导入的 autoprefixer
      syntax: postcssScss, // 使用 postcss-scss 作为语法解析器
    },
    preprocessorOptions: {
      scss: {
      javascriptEnabled: true,
        additionalData: `
        @use "@/styles/index.scss" as *;
         @use '@/styles/base.scss' as *;`,
      api: 'modern-compiler'
      },
  }
},
  server: {
    host: '0.0.0.0',//显示当前局域网
    open: false,//是否自动启动浏览器
    // port: 5173, // 修改为其他端口
    port: 8080, // 修改为其他端口
  },
})