// import CryptoJS from 'crypto-js';

export function hidePhoneNumber(phone: string): string {
  if (!phone) {
    return ''; // 如果手机号为空，返回空字符串
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}


// 加密手机号
// export function encryptPhoneNumber(phoneNumber: string, publicKey: string): string {
//   const encrypted = CryptoJS.RSA.encrypt(phoneNumber, publicKey);
//   return encrypted.toString();
// }