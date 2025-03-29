import type { FormRules } from "element-plus";
import { form } from '@/utils/form'

export const formRules: FormRules = reactive({
    //真实姓名
    real_name: [
        { required: true, message: "请输入真实姓名", trigger: "blur" },
        { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
    ],
    //身份证号码
    id_card: [
        { required: true, message: "请输入身份证号码", trigger: "blur" },
        { min: 18, max: 18, message: "请输入18位身份证号", trigger: "blur" },
    ],
    //手机号码
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
    //账号
    account: [
      { required: true, message: "请输入账号", trigger: "blur" },
      { min: 20, max: 35, message: "长度在 20 到 35 个字符", trigger: "blur" },
    ],
    //用户名
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      { min: 1, max: 35, message: "长度在 1 到 35 个字符", trigger: "blur" },
    ],
    //密码
    password1: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 20, message: "长度在 6 到 20" ,trigger: "blur"},
    ],
    //确认密码
    password2: [
        { required: true, message: "请再次输入密码", trigger: "blur" },
        { min: 6, max: 20, message: "长度在 6 到 20" ,trigger: "blur"},
        { validator: (rule, value, callback) => {
            if (value !== form.password1) {
                callback(new Error("两次输入密码不一致"))
            } else {
                callback()
            }
        },trigger: "blur" }
    ],
    //验证码
    captcha: [
        { required: true, message: "请输入验证码", trigger: "blur" },
        { min: 6, max: 6, message: "请输入6位验证码", trigger: "blur" },
    ],
    //邮箱
    email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }
    ],
    //性别
    sex: [
        { required: true, message: "请选择性别", trigger: "blur" }
    ],
    //生日
    birthday: [
        { required: true, message: "请选择生日", trigger: "blur" }
    ],
    //地址
    address: [
        { required: true, message: "请输入地址", trigger: "blur" }
    ],

})
export const formRules2: FormRules = reactive({
    height: [{ required: true, message: '请输入身高', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入体重', trigger: 'blur' }],
  systolic_pressure: [{ required: true, message: '请输入收缩压', trigger: 'blur' }],
  diastolic_pressure: [{ required: true, message: '请输入舒张压', trigger: 'blur' }],
  body_fat: [{ required: true, message: '请输入体脂率', trigger: 'blur' }],
  muscle_mass: [{ required: true, message: '请输入肌肉量', trigger: 'blur' }],
  visceral_fat: [{ required: true, message: '请输入内脏脂肪面积', trigger: 'blur' }],
  body_temperature: [{ required: true, message: '请输入体温', trigger: 'blur' }],
  blood_oxygen_saturation: [{ required: true, message: '请输入血氧饱和度', trigger: 'blur' }],
  heart_rate: [{ required: true, message: '请输入心率', trigger: 'blur' }],
  blood_cholesterol: [{ required: true, message: '请输入总胆固醇', trigger: 'blur' }],
  blood_triglyceride: [{ required: true, message: '请输入甘油三酯', trigger: 'blur' }],
  high_density_cholesterol: [{ required: true, message: '请输入高密度脂蛋白胆固醇', trigger: 'blur' }],
  low_density_cholesterol: [{ required: true, message: '请输入低密度脂蛋白胆固醇', trigger: 'blur' }],
  blood_glucose: [{ required: true, message: '请输入空腹血糖', trigger: 'blur' }],
  measured_at: [{ required: true, message: '请选择测量时间', trigger: 'blur' }]
})
export const formRules3: FormRules = reactive({
  //常用手机号码
    common_phone: [
        { required: false, message: '请输入常用手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
    //紧急联系人手机号码
    emergency_phone: [
        { required: false, message: '请输入紧急联系人手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
})