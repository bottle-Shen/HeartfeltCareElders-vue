import store from '@/store'
import request from '@/utils/request'
// :headers="{ Authorization: `Bearer ${store.state.user.token}` }"
export const uploadAvatar = (file:File):Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);

  return request({
    headers: {
      'Authorization': `Bearer ${store.state.user.token}`,
    },
    url: 'api//users/upload_avatar/',
    method: 'POST',
    data: formData
  })
}