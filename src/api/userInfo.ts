import request from '@/utils/request'
// import type { UserInfoFormType } from '@/@types/userinfo'
import type { IUserInfo,UserInfoFormType} from '@/@types/userInfo'
export const getUserInfo = (params: UserInfoFormType): Promise<IUserInfo> => {
  let url = '';
  let specificId: number | undefined;
  switch (params.user.user_type) {
    case 1: // 老人
      url = 'api/users/elderly/';
      specificId = params.elderly_id;
      break;
    case 2: // 家属
      url = 'api/users/family/';
      specificId = params.family_id;
      break;
    case 3: // 机构人员
      url = 'api/users/caregiver/';
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
      url = `api/users/elderly/`;
      specificId = params.elderly_id;
      break;
    case 2:
      url = `api/users/family/`;
      specificId = params.family_id;
      break;
    case 3:
      url = `api/users/caregiver/`;
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

// 用户头像上传
export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return request({
    url: `api/users/upload_avatar/`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => {
      if (response.status === 200) {
        // ElMessage.success('头像上传成功');
        return response.data.data.avatar;
      } else {
        // ElMessage.error('上传失败');
        return Promise.reject(new Error('上传失败'));
      }
  }).catch(error => {
    throw error; // 抛出错误，以便在调用方处理
  });
}
// 用户上传背景图
export const uploadBackground = (file: File) => {
  const formData = new FormData();
  formData.append('background_image', file);
  return request({
    url: `api/users/upload_background/`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => {
      if (response.status === 200) {
        // ElMessage.success('头像上传成功');
        return response.data.data.background_image;
      } else {
        // ElMessage.error('上传失败');
        return Promise.reject(new Error('上传失败'));
      }
  }).catch(error => {
    throw error; // 抛出错误，以便在调用方处理
  });
}