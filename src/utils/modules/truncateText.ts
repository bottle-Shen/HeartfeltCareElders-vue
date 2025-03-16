// 截断文本
export function truncateText(selector: string, lineCount: number): void {
  const elements = document.querySelectorAll(selector); // 获取所有匹配的元素
  elements.forEach((el) => {
    const element = el as HTMLElement;
    const words = element.innerText.split(' ');
    let truncatedText = '';
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight || '1em'); // 默认值防止 undefined
    const maxHeight = lineHeight * lineCount;

    for (let i = 0; i < words.length; i++) {
      truncatedText += words[i] + ' ';
      element.innerText = truncatedText;
      if (element.scrollHeight > maxHeight) {
        truncatedText = truncatedText.trim() + '...';
        element.innerText = truncatedText;
        break;
      }
    }
  });
}