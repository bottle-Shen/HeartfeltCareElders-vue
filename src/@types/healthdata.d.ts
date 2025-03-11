export interface HealthData {
  id: number;
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
  health_status: string;//健康状态
}