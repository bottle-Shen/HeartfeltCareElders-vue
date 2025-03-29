// 定义用户共有信息
export interface user {
  id: number;// 用户id
  user_type: number;// 用户类型
  avatar: string;// 头像
  username: string;// 用户昵称
  real_name: string;// 真实姓名
  id_card: string;// 身份证号
  sex: string;// 性别
  birthday: string;// 生日
  phone: string;// 绑定手机号
  common_phone: string;// 常用手机号
  account: string;// 账号
  age: number;// 年龄
  background_image: string;// 背景图片
  signature: string;// 个性签名
  last_login: string;
  address:string;// 地址
}

// 定义用户请求参数类型
export interface UserInfoFormType {
  user: user;
  //老人
  elderly_id: number;
  emergency_contact: string;// 紧急联系人姓名
  emergency_phone: string;// 紧急联系人电话
  caregiver: string;// 护理人员
  //家属
  family_id: number;
  relation: string;// 与老人关系
  common_address: string;// 现在家庭住址
  elderly_real_name: string;// 绑定老人验证
  elderly_id_card: string;// 绑定老人验证
  //机构人员
  caregiver_id: number;
  department: string;// 部门
  position: string;// 职位
}

//老人信息表单
export type elderlyInfoResponse = user & {
  emergency_contact: string;
  emergency_phone: string;
  caregiver: string;
  elderly_id: number;
}

//家属信息表单
export type familyInfoResponse = user &{
  relation: string;
  common_address: string;
  family_id: number;
}

//机构人员信息表单
export type caregiverInfoResponse = user &{
  department: string;
  position: string;
  caregiver_id: number;
}

// 定义一个联合类型，包含所有可能的用户响应类型
export type IUserInfo =
  | elderlyInfoResponse
  | familyInfoResponse
  | caregiverInfoResponse
