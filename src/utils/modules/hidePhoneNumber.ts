// 隐藏手机号格式
export function hidePhoneNumber(phone: string): string {
  if (!phone) {
    return ''; // 如果手机号为空，返回空字符串
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
// 隐藏姓名格式
export function encryptName(name: string): string {
  if (!name) {
    return '';
  }
  const nameLength = name.length;

  if (nameLength === 2) {
    // 如果名字只有两个字，第二个字显示为 *
    return `${name.charAt(0)}**`;
  } else if (nameLength === 3) {
    // 如果名字有三个字，第二个和第三个字显示为 *
    return `${name.charAt(0)}**`;
  } else if (nameLength === 4) {
    // 如果名字有四个字，前两个字保留，后两个字显示为 *
    return `${name.slice(0, 2)}**`;
  } else {
    // 如果名字超过四个字，前两个字保留，其余部分显示为 *
    // const stars = '*'.repeat(nameLength - 2);
    return `${name.slice(0, 2)}**`;
  }
}