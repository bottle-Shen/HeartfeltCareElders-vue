// 截断文本
export function truncateText(selector: string, lineCount: number): void {
  const elements = document.querySelectorAll(selector); // 获取所有匹配的元素
  elements.forEach((el) => {
    const element = el as HTMLElement;
    const originalText = element.innerText;
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight || '1em'); // 默认值防止 undefined
    const maxHeight = lineHeight * lineCount;

    element.style.overflow = 'hidden';
    element.style.textOverflow = 'ellipsis';
    element.style.display = '-webkit-box';
    element.style.webkitLineClamp = lineCount.toString();
    element.style.webkitBoxOrient = 'vertical';

    // 如果文本超出指定行数，截断并添加省略号
    if (element.scrollHeight > maxHeight) {
      element.innerText = originalText;
      element.style.overflow = 'hidden';
      element.style.textOverflow = 'ellipsis';
      element.style.display = '-webkit-box';
      element.style.webkitLineClamp = lineCount.toString();
    }
  });
}