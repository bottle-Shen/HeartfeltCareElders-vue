<script setup lang="ts">
import type { CascaderProps, CascaderNode, CascaderOption } from 'element-plus'
import areaData from '@/assets/area.json'
// 定义 areaData 的类型
interface AreaData {
  [key: string]: {
    [key: string]: string[];
  };
}
// 显式声明 areaData 的类型
const areaDataTyped: AreaData = areaData;

// 定义 props
const props = defineProps({
  address: {
    type: String,
    default: '',
  },
})

// 定义 emit
const emit = defineEmits(['update:address'])

// 用于绑定级联选择器的选中值
const selectedAddress = ref<string[]>(props.address ? props.address.split('/') : []);

// 监听 selectedAddress 的变化，并通过 emit 更新父组件的值
watch(selectedAddress, (newValue: string[]) => {
  // 将数组转换为以 '/' 分隔的字符串
  const addressString = newValue.join('/');
  emit('update:address', addressString);
});

const propsCascader: CascaderProps = {
  lazy: true,
  lazyLoad(node:CascaderNode, resolve: (nodes: CascaderOption[]) => void) {
    const { level, value } = node
    setTimeout(() => {
      let nodes: CascaderOption[] = []
      if (level === 0) {
        // 第一层：加载省份
        nodes = Object.keys(areaData).map((province) => ({
          value: province,
          label: province,
          leaf: false,
        }))}else if(level === 1) {
            // 第二层：加载城市
            const cities = areaData[value as keyof typeof areaData];
            nodes = Object.keys(cities).map((city) => ({
              value: city,
              label: city,
              leaf: false,
            }))}else if (level === 2) {
            // 第三层：加载区县
            if (!node.parent) {
              console.error("node.parent is undefined");
              resolve([]);
              return;
            }
            const parentValue = node.parent.value?.toString();
            if (!parentValue) {
              console.error("node.parent.value is undefined or not a string");
              resolve([]);
              return;
            }
            // 确保 parentValue 的类型是 keyof AreaData
            const parentCities = areaDataTyped[parentValue as keyof AreaData];
            if (!parentCities) {
              console.error("Invalid parentValue");
              resolve([]);
              return;
            }
            // 确保 value 的类型是 parentCities 的键类型
            const districts = parentCities[value as keyof typeof parentCities];
            nodes = districts.map((district: string) => ({
              value: district,
              label: district,
              leaf: true,
            }));
          }
      resolve(nodes)
    }, 1000)
  },
}
</script>
<template>
  <div>
    <!-- 所在地 -->
     <el-form-item prop="address">
       <el-cascader 
       :teleported="false"
       :props="propsCascader"
       v-model="selectedAddress"
       placeholder="请选择所在地"
        />
    </el-form-item>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-cascader-panel){// 地址级联选择器
    @include mobile{
        flex-direction: column;
        .el-cascader-menu{
          padding-bottom: rem(10);
          border-bottom: 1px solid var(--gray-rgb);
        }
    }
}
</style>