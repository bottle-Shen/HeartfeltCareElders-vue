<script setup lang="ts">
import type { CascaderProps } from 'element-plus'
import areaData from '@/assets/area.json'

const selectedAddress = ref([]); // 用于绑定级联选择器的选中值
// let id = 0
const props: CascaderProps = {
  lazy: true,
  lazyLoad(node, resolve) {
    const { level, value } = node
    setTimeout(() => {
      let nodes = []
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
            const districts = areaData[node.parent.value][value];
            nodes = districts.map((district:string) => ({
              value: district,
              label: district,
              leaf: true,
            }));
      }
      
      resolve(nodes)
    }, 1000)
  },
}
// clearInterval(id)
</script>
<template>
  <div>
    <!-- 所在地 -->
     <el-form-item label="所在地" prop="address">
       <el-cascader 
       :props="props"
       v-model="selectedAddress"
       placeholder="请选择所在地"
        />
    </el-form-item>
  </div>
</template>
<style scoped lang="scss">

</style>