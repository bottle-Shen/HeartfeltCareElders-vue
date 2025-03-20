// 格式化日期
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "未知时间"; // 如果日期为空，返回默认值
  const date = new Date(dateString);

  // 获取年、月、日、小时、分钟
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  // 拼接成“YYYY年MM月DD日 HH:mm”的格式
  return `${year}年${month}月${day}日 ${hour}:${minute}`;
};
// 将日期格式化为ISO8601格式
export const formatDateToISO = (dateString: string) => {
  const datePattern = /(\d{4})年(\d{2})月(\d{2})日 (\d{2}):(\d{2})/;
  const match = dateString.match(datePattern);
  if (match) {
    const [_, year, month, day, hour, minute] = match;
    return `${year}-${month}-${day}T${hour}:${minute}:00`;
  }
  return dateString; // 如果格式不匹配，返回原始字符串
};