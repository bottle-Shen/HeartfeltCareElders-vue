import request from '@/utils/request'
// import type { UserInfoFormType } from '@/@types/userinfo'
import type { IUserInfo,UserInfoFormType} from '@/@types/userInfo'
export const getUserInfo = (params: UserInfoFormType): Promise<IUserInfo> => {
  let url = '';
  let specificId: number | undefined;
  switch (params.user.user_type) {
    case 1: // 老人
      url = 'users/elderly/';
      specificId = params.elderly_id;
      break;
    case 2: // 家属
      url = 'users/family/';
      specificId = params.family_id;
      break;
    case 3: // 机构人员
      url = 'users/caregiver/';
      specificId = params.caregiver_id;
      break;
    default:
      throw new Error('未知用户类型');
  }
  if (specificId === undefined) {
    throw new Error('特定用户ID未定义');
  }
  url += specificId + '/';// 添加特定用户ID
  return request({
    url,
    method: 'GET',
    params,
  }).then(response => {
    if (response.status === 200) {
        return response.data;
    }
  }).catch(error => {
    throw error; // 抛出错误，以便在调用方处理
  });
};

export const updateUserInfo = (params: UserInfoFormType): Promise<IUserInfo> => {
  let url = '';
  let specificId: number | undefined;
  switch (params.user.user_type) {
    case 1:
      url = `users/elderly/`;
      specificId = params.elderly_id;
      break;
    case 2:
      url = `users/family/`;
      specificId = params.family_id;
      break;
    case 3:
      url = `users/caregiver/`;
      specificId = params.caregiver_id;
      break;
    default:
      throw new Error('未知用户类型');
  }
  if (specificId === undefined) {
    throw new Error('特定用户ID未定义');
  }
  url += specificId + '/';// 添加特定用户ID
  return request({
    url,
    method: 'PUT',
    data:params,
  }).then(response => {
    // console.log('更新:', response); // 检查返回的数据
    return response.data;
  }).catch(error => {
    throw error; // 抛出错误，以便在调用方处理
  });
};