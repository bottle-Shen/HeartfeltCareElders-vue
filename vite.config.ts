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

const pathSrc = path.resolve(__dirname, 'src')

// https://vite.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {//别名
  //     //ES模块
  //     '@': fileURLToPath(new URL('./src', import.meta.url))
  //     // "@":path.resolve(__dirname,"./src") CommonJS模块
  //   }
  // }
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  plugins: [//插件
    vue(),
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
  css: {
    postcss: {
      plugins: [autoprefixer], // 使用 ES 模块导入的 autoprefixer
      syntax: postcssScss // 使用 postcss-scss 作为语法解析器
    },
    preprocessorOptions: {
      scss: {
      javascriptEnabled: true,
      // additionalData: `@use "@/styles/index.scss" as *;`, // 使用 as * 来避免命名空间冲突
      additionalData: `@use "@/styles/index.scss" as *;`,
      api: 'modern-compiler'
      },
  }
},
  server: {
    host: '0.0.0.0',//显示当前局域网
    open:false,//是否自动启动浏览器
  },
})
