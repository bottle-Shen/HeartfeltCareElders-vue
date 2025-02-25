<script setup lang="ts">
import { getHealthData } from '@/api/healthData'
import { useStore } from 'vuex'
import * as echarts from 'echarts';
const store = useStore()
interface HealthData {
  blood_cholesterol: number;//总胆固醇 (mmol/L)
  blood_glucose: number;//血糖 (mmol/L)
  blood_triglyceride: number;//甘油三酯 (mmol/L)
  systolic_pressure: number;//收缩压
  diastolic_pressure: number;//舒张压
  body_temperature: number;//体温 (°C)
  high_density_cholesterol: number;//高密度脂蛋白 (mmol/L)
  low_density_cholesterol: number;//低密度脂蛋白 (mmol/L)
  muscle_mass: number;//肌肉量
  body_fat: number;//体脂率 (%)
  visceral_fat: number;//内脏脂肪面积 (cm²)
  blood_oxygen_saturation: number;//血氧饱和度 (%)
  elderly_id: number;
  elderly_name: string;
  height: number;
  heart_rate: number;//心率 (bpm)
  weight: number;
  measured_at: string;
}
const healthData = ref<HealthData[]>([]); // 用于存储健康数据
const cholesterolData = ref<number[]>([]);
const temperatureData = ref<number[]>([]);
const highdensityData = ref<number[]>([]);
const lowdensityData = ref<number[]>([]);
const musclemassData = ref<number[]>([]);
const visceralfatData = ref<number[]>([]);
const bodyfatData = ref<number[]>([]);
const bloodoxygenData = ref<number[]>([]);
const heightData = ref<number[]>([]); // 用于存储提取的身高和体重数据
const weightData = ref<number[]>([]);
const bmiData = ref<number[]>([]);
const systolicpressureData = ref<number[]>([])
const diastolicpressureData = ref<number[]>([])
const bloodglucoseData = ref<number[]>([]);
const bloodtriglycerideData = ref<number[]>([]);
const heartrateData = ref<number[]>([]);
const measuredYearData = ref<number[]>([]);
const measuredMonthData = ref<number[]>([]);
const measuredDayData = ref<number[]>([]);
const elderlyId = store.state.user.user.elderly_id// 从 Vuex 状态中获取老人 ID
console.log('elderlyId', elderlyId);
let BMIChart: echarts.ECharts
let bloodpressureChart: echarts.ECharts
let bloodglucoseChart: echarts.ECharts
const fetchHealthData = async () => {
  try {
    const response = await getHealthData({ elderly_id: elderlyId });
    console.log('获取健康数据成功:', response);
    healthData.value = response;
    // console.log('healthData.value', healthData.value);
    extractHealthData();
    // 使用图表
    useMyChart()
  } catch (error) {
    console.error('获取健康数据失败:', error);
  }
};
const extractHealthData = () => {
    // 提取年、月、日数据
    healthData.value.map(item => new Date(item.measured_at)).forEach(date => {
    measuredYearData.value.push(date.getFullYear());
    measuredMonthData.value.push(date.getMonth() + 1); // 月份从0开始，所以加1
    measuredDayData.value.push(date.getDate());
    });
    // 提取身高和体重
    heightData.value = healthData.value.map(item => item.height);
    weightData.value = healthData.value.map(item => item.weight);
    bmiData.value = healthData.value.map(item => Math.round((item.weight / (item.height / 100 * (item.height / 100))) * 10) / 10);
    systolicpressureData.value = healthData.value.map(item => item.systolic_pressure);
    diastolicpressureData.value = healthData.value.map(item => item.diastolic_pressure);
    bloodglucoseData.value = healthData.value.map(item => item.blood_glucose)
    bloodtriglycerideData.value = healthData.value.map(item => item.blood_triglyceride)
    heartrateData.value = healthData.value.map(item => item.heart_rate)
    cholesterolData.value = healthData.value.map(item => item.blood_cholesterol)
    temperatureData.value = healthData.value.map(item => item.body_temperature)
    highdensityData.value = healthData.value.map(item => item.high_density_cholesterol)
    lowdensityData .value = healthData.value.map(item => item.low_density_cholesterol)
    musclemassData.value = healthData.value.map(item => item.muscle_mass) 
    visceralfatData.value = healthData.value.map(item => item.visceral_fat)
    bodyfatData.value = healthData.value.map(item => item.body_fat)
    bloodoxygenData.value = healthData.value.map(item => item.blood_oxygen_saturation)
    console.log(systolicpressureData.value)
}
// console.log('heightWeightData.value', heightWeightData.value);
onMounted(() => {
  // 初始化图表
  BMIChart = echarts.init(document.getElementById('height-weight') as HTMLElement)
  bloodpressureChart = echarts.init(document.getElementById('blood-pressure') as HTMLElement)
  bloodglucoseChart = echarts.init(document.getElementById('blood-glucose') as HTMLElement)
  // window.addEventListener('resize', function() {
  //   myChart.resize();
  // });
  console.log('初始化图表成功')
});
function useMyChart() {
  // console.log('heChart',heightWeightData.value)
  BMIChart.setOption({
    tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
    },
    // legend: {
    //   orient: 'vertical',
    // right: 0,
    // top: 0,
    // },
    title: {
      text: '身体健康指数',
      // left: 'center'
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
        alignWithLabel: true
        },
        data:[1,2,3,4,5,6,7,8,9,10,11,12],
      }
    ],
    yAxis: [
      {
        // type: 'value',
        // name: '舒张压/mmHg',
        min: 15,
        max: 200,
        position:'left',
      },
    ],
    series: [
      {
        name: '身高cm',
        type: 'scatter',
        data: heightData.value,
        symbolSize: function(value: number) {
        return value / 10;
      },
        itemStyle: {
          color: '#FEC846',
          // borderColor: '#FEC846',
          // borderWidth: 1,
          shadowColor: 'rgba(254, 200, 70, 0.5)',
          shadowBlur: 5,// 增加模糊效果，使阴影更柔和
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        }
      },
      {
        name: '体重kg',
        type: 'line',
        data: weightData.value,
      },
      {
        name: 'BMI',
        type: 'bar',
        data:bmiData.value,
      },
      {
        name: '体脂率%',
        type: 'line',
        data:bodyfatData.value,
      },
      {
        name: '肌肉量kg',
        type: 'bar',
        data:musclemassData.value,
      }, {
        name: '内脏脂肪面积',
        type: 'line',
        data:visceralfatData.value,
      }
    ]
  })
  bloodpressureChart.setOption({
    tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
    },
    legend: {
      // orient: 'vertical',
    // right: 10,
      // top: 'center'
    },
    title: {
      text: '心血管健康指标',
      // left: 'center'
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
        alignWithLabel: true
        },
        data:[1,2,3,4,5,6,7,8,9,10,11,12],
      }
    ],
    yAxis: [
      {
        min: 30,
        max: 180,
        position:'left',
      },
    ],
    series: [
      {
        name:'体温°C',
        type: 'bar',
        smooth: true,
        yAxisIndex: 0,
        data: temperatureData.value,
      },
      {
        name:'舒张压mmHg',
        type: 'bar',
        smooth: true,
        data: diastolicpressureData.value,
      },
      {
        name:'收缩压mmHg',
        type: 'bar',
        smooth: true,
        data: systolicpressureData.value, 
      },
      {
        name:'心率bpm',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: systolicpressureData.value,
      },
      {
        name:'血氧饱和度%',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: bloodoxygenData.value,
      }
    ]
  })
  bloodglucoseChart.setOption({
    tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
    },
    legend: {
      // orient: 'vertical',
    // right: 10,
    // top: 'center'
    },
    title: {
      text: '血糖血脂',
      // left: 'center'
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
        alignWithLabel: true
        },
        data:[1,2,3,4,5,6,7,8,9,10,11,12],
      }
    ],
    yAxis: [
      {
        // type: 'value',
        // name: '舒张压/mmHg',
        min: 0,
        max: 7,
        position:'left',
      },
    ],
    series: [
      {
        name: '总胆固醇',
        type: 'line',
        data: cholesterolData.value,
        areaStyle: {
          // opacity: 0.8,
        },
        itemStyle: {
          color: '#14C382',
        },
      },
      {
        name: '空腹血糖',
        type: 'line',
        data: bloodglucoseData.value,
      },
      {
        name: '甘油三酯',
        type: 'line',
        data: bloodtriglycerideData.value,
        areaStyle: {
          // color: {
          //   type: 'linear',
          //   x: 0,
          //   y: 0,
          //   x2: 0,
          //   y2: 1,
          //   colorStops: [
          //     { offset: 0, color: 'rgba(254, 200, 70, 0.3)' },
          //     { offset: 1, color: '#FEC846' },
          //  ],
          // }
        },
        itemStyle: {
          color: '#FEC846',
        },
      },
      {
        name: '高密度脂蛋白胆固醇',
        type: 'line',
        data: highdensityData.value,
        itemStyle: {
          color: '#FFA500',
        },
      },
      {
        name: '低密度脂蛋白胆固醇',
        type: 'line',
        data: lowdensityData.value,
        areaStyle:{},
        itemStyle: {
          color: '#1695DE',
        },
      },
      {
        name: '内脏脂肪面积cm2',
        type: 'line',
        data:visceralfatData.value,
      }
    ]
  })

}
// 在组件加载时获取健康数据
fetchHealthData();
const number = ref(1);
const backBtn = () => {
  number.value--;
  if (number.value === 0) {
    number.value = 3;
  }
};
const nextBtn = () => {
  number.value++;
  if (number.value === 4) {
    number.value = 1;
  }
};
</script>

<template>
  <div>
    <h1 style="font-size: 30px;padding:20px 0;">我的健康数据</h1>
    <div class="card-header-container">
        <span class="card-arrow" @click="backBtn"><</span>
      <ul v-if="number === 1" class="card-header">
        <li class="card-header-item">身高{{ heightData[0] }}cm</li>
        <li class="card-header-item">体重{{ weightData[0] }}kg</li>
        <li class="card-header-item">体脂率{{ bodyfatData[0]}}%</li>
        <li class="card-header-item">肌肉量{{ musclemassData[0] }}kg</li>
      </ul>
      <ul v-else-if="number === 2" class="card-header">
        <li class="card-header-item">体温{{ temperatureData[0] }}°C</li>
        <li class="card-header-item">心率{{ heartrateData[0] }}次/分</li>
        <li class="card-header-item">血压{{ systolicpressureData[0]}}/{{ diastolicpressureData[0] }}mmHg</li>
        <li class="card-header-item">血氧饱和度{{ bloodoxygenData[0] }}%</li>
      </ul>
      <ul v-else-if="number === 3" class="card-header">
        <li class="card-header-item">总胆固醇{{ cholesterolData[0] }}mmol/L</li>
        <li class="card-header-item">甘油三酯{{ bloodtriglycerideData[0] }}mmol/L</li>
        <li class="card-header-item">内脏脂肪{{ systolicpressureData[0]}}cm2</li>
        <li class="card-header-item">空腹血糖{{ visceralfatData[0] }}mmol/L</li>
      </ul>
       <span class="card-arrow" @click="nextBtn">></span>
    </div>
    <div class="card-body" style="width: 100%; height: 300px; display: flex;">
      <div id="blood-glucose" class="card-body-item" style="width: 300px; height: 300px;"></div>
      <div class="card-body-item" style="width: 700px; height: 100%;">
        <ul>
          <li id=""></li>
          <li></li>
        </ul>
      </div>
      <div class="card-body-item" style="width: 300px; height: 100%;"></div>
    </div>
    <div class="health-data-container">
      <ul class="health-data">
        <li id="height-weight" class="health-data-item height-weight"></li>
        <li id="blood-pressure" class="health-data-item blood-pressure"></li>
        <!-- <li id="blood-glucose" class="health-data-item blood-glucose"></li>
      <li id="blood-lipid" class="health-data-item blood-lipid"></li>
      <li id="heart-rate" class="health-data-item heart-rate"></li> -->
      </ul>
    </div>
    <!-- <CarouselCom class="carousel-com"></CarouselCom> -->
    <!-- <el-button @click="fetchHealthData">按钮</el-button> -->
  </div>
</template>

<style lang="scss" scoped>
// .carousel-com {
//   border: 1px solid red;
// }
// .health-data {
//   width: 300px;
//   height: 200px;
//   border: 1px solid red;
// }
.card-header-container{
  width: 100%; 
  height: 100px;
  display: flex;
  // justify-content: space-around;
  align-items: center;
}
.card-body-item{
  border-radius: 20px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}
.card-header{
  width: 100%;
  height: 100%;
  // display: flex;
}
.card-header-item{
  width: 300px;
  height: 100%;
  float: left;
  // flex:1;
  // border: 1px solid red;
  background: radial-gradient(farthest-corner at center, #FAF2CB, rgba(255, 204, 0, 0));
  border-radius: 30px;
  margin-right: 10px;
}
.health-data-container{
  // width: 600px;
  // height: 500px;
.health-data{
  width: 100%;
  // height: 380px;
  // display: flex;
  // justify-content: space-around;
  border: 1px solid red;
  // background-color: #fff;
  border-radius:  0 5px;
   margin-bottom: 30px;
  .health-data-item {
    padding: 0px 10px;
  float: left;
  width: 650px;
  height: 380px;
  // border: 1px solid red;
  border-radius: 20px;
  box-shadow: 3px 4px 2px rgba(0, 0, 0, 0.8);
}
}
}
</style>
