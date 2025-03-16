//注册登录表单
export interface FormType{
  userType: number;
  phone: string;
  password1: string;
  password2: string;
  captcha: string;
  account: string;
}
export const form = reactive<FormType>({
  userType: 1,//默认选中“老年用户”
  phone: '',//绑定手机号
  password1: '',//密码
  password2: '',//确认密码
  captcha: '',
  account: '',//账号
})
//清空表单
export const resetForm = () => {
  form.userType = 1; // userType 重置为默认值 1
  form.phone = ''; // 手机号重置为空字符串
  form.password1 = ''; // 密码重置为空字符串
  form.password2 = ''; // 确认密码重置为空字符串
  form.captcha = ''; // 验证码重置为空字符串
  form.account = ''; // 账号重置为空字符串
}

import type { IUserInfo, UserInfoFormType } from '@/@types/userInfo'
//个人信息表单
export const userInfo = reactive<UserInfoFormType>({
  user: {
    id: 0,
    user_type: 0,
    username: '', // 假设有用户名字段，可以根据实际情况添加更多字段
    sex: '女',//性别
    real_name: '',//真实姓名
    id_card: '',//身份证号
    birthday: '',//生日
    avatar: '',//头像
    common_phone: '',//常用电话
    phone: '',
    age: 0,
    account: '',
    background_image: '',//背景图片
    signature: '',//个性签名
    last_login: '',
    address:'',// 所在地
  },
  //老人
  elderly_id: 0,
  emergency_contact: '',//紧急联系人姓名
  emergency_phone: '',//紧急联系人电话
  health_status: '',//健康状况
  caregiver: '',//护工姓名
  //家属
  family_id: 0,
  relation: '',//与老人关系
  common_address: '',//现在家庭地址
  //机构人员
  caregiver_id: 0,
  department: '',//部门
  position: '',//职位
})

// 创建响应式引用
export const userInfoForm = ref<IUserInfo>({
  // status: 0,
    id: 0,
    user_type: 0,
    username: '',
    sex: '',
    id_card: '',
    birthday: '',
    avatar: '',
    common_phone: '',
  real_name: '',
  phone: '',
  background_image: '',
  signature: '',
    age: 0,
  account: '',
  last_login: '',
  address:'',
  elderly_id: 0, // 对于老人类型
  emergency_contact: '',
  emergency_phone: '',
  health_status: '',
  caregiver: '',
  relation: '', // 对于家属类型
  common_address: '',
  family_id: 0,
  caregiver_id: 0, // 对于机构人员类型
  department: '',
  position:'',
})