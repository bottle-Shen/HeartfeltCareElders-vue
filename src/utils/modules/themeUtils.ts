// const currentThemeIndex = ref(0); // 默认选择第一个主题
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
    bgOne: '#0db166',
    bgTwo: '#f6c138',
    hover: 'rgba(103, 194, 58, 0.5)',
    color:'#0db166'
  },
  {
    text: '橙色',
    bgOne: '#E6A23C',
    bgTwo: '#F56C6C',
    hover: 'rgba(230, 162, 60, 0.5)',
    color:'#E6A23C'
  },
  {
    text: '红色',
    bgOne: '#F56C6C',
    bgTwo: '#E6A23C',
    hover: 'rgba(245, 108, 108, 0.5)',
    color:'#F56C6C'
  },
  {
    text: '灰色',
    bgOne: '#909399',
    bgTwo: '#B3B3B3',
    hover: 'rgba(144, 147, 150, 0.5)',
    color:'#909399'
  },
  {
    text: '紫色',
    bgOne: '#B37FEB',
    bgTwo: '#FFA78F',
    hover: 'rgba(179, 127, 235, 0.5)',
    color:'#B37FEB'
  }
]);

// 更新主题颜色
export const updateTheme = (currentThemeIndex: number) => {
  const currentTheme = themeColors.value[currentThemeIndex];
  if (!currentTheme) {
    console.error('Current theme is undefined:', currentThemeIndex);
    return;
  }
  const root = document.documentElement;

  // 直接使用 currentTheme.bgOne 和 currentTheme.bgTwo 的值
  root.style.setProperty('--bg-one', currentTheme.bgOne);
  root.style.setProperty('--bg-two', currentTheme.bgTwo);
  root.style.setProperty('--white-blue-rgb', currentTheme.hover);
  root.style.setProperty('--blue', currentTheme.color);
};