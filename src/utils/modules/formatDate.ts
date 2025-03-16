// 格式化日期
export const formatDate = (dateString?: string):string => {
  if (!dateString) return "未知时间"; // 如果日期为空，返回默认值
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }); // 根据本地语言格式化日期
};