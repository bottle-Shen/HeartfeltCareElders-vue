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
      { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
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
