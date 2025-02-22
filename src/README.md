vite.config.ts配置
server: {
    host: '0.0.0.0',//显示当前局域网
    open:false,//是否自动启动浏览器
  }
//自动引入插件npm i -D unplugin-auto-import
import AutoImport from "unplugin-auto-import/vite"
 plugins: [
    vue(),
    AutoImport ({
      imports: ["vue", "vue-router", "pinia"], //自动引入vue的ref、toRefs、onmounted等，无需在页面中再次引入
      dts: "src/auto-import.d.ts", // 生成 `auto-import.d.ts` 全局声明
    })
  ],
  Sass
  css: {
  preprocessorOptions: {
    scss: { api: 'modern-compiler' },
  }
}
  Element Plus安装
  yarn add element-plus
  自动导入插件
  npm install -D unplugin-vue-components unplugin-auto-import
  import Components from 'unplugin-vue-components/vite'
  import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
  AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
//Icon图标
yarn add @element-plus/icons-vue
// Element自动导入 图标
npm install @element-plus/icons-vue  unplugin-icons
vite配置
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
AutoImport ({
      imports: ["vue", "vue-router", "pinia"], //自动引入vue的ref、toRefs、onmounted等，无需在页面中再次引入
      dts: "src/auto-import.d.ts", // 生成 `auto-import.d.ts` 全局声明
      resolvers: [ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        //自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        //自动导入 Element Plus 组件
        ElementPlusResolver()],
    }),
    Icons({
      autoInstall: true,
    }),
安装scss npm install -D sass-embedded
安装Inspect npm i -D vite-plugin-inspect
安装axios npm install axios
安装gsap
yarn add gsap
npm i --save-dev @types/gsap
安装three
npm install three  
定义three类型
npm install --save-dev @types/three
安装typings-for-css-modules-loader
网址https://www.npmjs.com/package/typings-for-scss-modules-loader#typings-for-css-modules-loader
npm install --save-dev typings-for-css-modules-loader