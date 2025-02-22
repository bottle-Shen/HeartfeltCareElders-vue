// import CryptoJS from 'crypto-js';

export function hidePhoneNumber(phoneNumber: string): string {
  if (!phoneNumber || phoneNumber.length !== 11) {
    throw new Error('Invalid phone number');
  }
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

// 使用示例
// const phoneNumber = '13812345678';
// const hiddenPhoneNumber = hidePhoneNumber(phoneNumber);
// console.log(hiddenPhoneNumber); // 输出: 138****5678



// 加密手机号
// export function encryptPhoneNumber(phoneNumber: string, publicKey: string): string {
//   const encrypted = CryptoJS.RSA.encrypt(phoneNumber, publicKey);
//   return encrypted.toString();
// }