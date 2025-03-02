# 使用官方 Node.js 镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . /app

# 安装依赖
RUN npm install

# 构建 Vue 项目
RUN npm run build

# 将构建结果复制到静态文件目录
RUN cp -R dist /usr/share/nginx/html