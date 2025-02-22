import request from '@/utils/request'
// 定义请求参数类型
interface getRealNameParams {
    real_name: string,
    id_card: string,
}

export const getRealName =(data: getRealNameParams)=> {
    return request({
        url: 'users/realname_auth/',
        method: 'POST',
        data,
    }).then(response => {
      console.log('实名认证成功',response);
        return response.data;
    }).catch((error) => {
        if (error.response && error.response.status === 400) {
      // 手动处理 400 错误
            // console.error('不用拦截器同意处理400错误，手动处理 400 错误', error.response.data.message.non_field_errors);
            throw new Error(error.response.data.message.non_field_errors[0]);
    } else {
      // 其他错误
      throw error;
    }
  });
}