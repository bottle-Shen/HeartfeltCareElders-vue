export const currentThemeIndex = ref(0); // 默认选择第一个主题
// 主题颜色
export const themeColors = ref([
  {
    text: '蓝色',
    bgOne: '#E5F3FF',
    bgTwo: '#F0F2FF',
    hover: 'rgba(202, 238, 255, 0.5)',
    color:'#1C7FC7'
  },
  {
    text: '绿色',
    bgOne:'#94f4c9',
    bgTwo: '#f6c138',
    hover: 'rgba(103, 194, 58, 0.5)',
    color:'#0db166'
  },
  {
    text: '橙色',
    bgOne:'#f8d39c',
    bgTwo: '#FFA78F',
    hover: 'rgba(230, 162, 60, 0.5)',
    color:'#F68D14'
  },
  {
    text: '红色',
    bgOne: '#FFA78F',
    bgTwo: '#E6A23C',
    hover: 'rgba(245, 108, 108, 0.5)',
    color:'#F56C6C'
  },
  {
    text: '灰色',
    bgOne:'#bdc0c6',
    bgTwo: '#B3B3B3',
    hover: 'rgba(144, 147, 150, 0.5)',
    color:'#909399'
  },
  {
    text: '紫色',
    bgOne:'#d8bdf4',
    bgTwo: '#FFA78F',
    hover: 'rgba(179, 127, 235, 0.5)',
    color:'#B37FEB'
  }
]);

// 更新主题颜色
export const updateTheme = (currentThemeIndex: number) => {
  const currentTheme = themeColors.value[currentThemeIndex];
  if (!currentTheme) {
    // 设置默认主题
    currentThemeIndex = 0;
    // console.error('Current theme is undefined:', currentThemeIndex);
    return;
  }
  const root = document.documentElement;

  // 直接使用 currentTheme.bgOne 和 currentTheme.bgTwo 的值
  root.style.setProperty('--bg-one', currentTheme.bgOne);
  root.style.setProperty('--bg-two', currentTheme.bgTwo);
  root.style.setProperty('--white-blue-rgb', currentTheme.hover);
  root.style.setProperty('--blue', currentTheme.color);
};