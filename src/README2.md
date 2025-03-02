PyCharm-django-vue
 1. 安装django库
 pip install django
 2. 创建django项目- 配置环境
 django-admin startproject mysite
 3. 创建app
 python manage.py startapp 应用名称(app)
 4. 配置路由-路由分发
mysite目录下settings.py和urls.py
settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'carousel',
]
urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('carousel/', include('carousel.urls')),
]
5. 创建模板文件models.py
app目录下models.py
#创建轮播图模型，用于存储轮播图信息
class Carousel:
    title = models.CharField(max_length=50)
    ...
6. 创建视图函数views.py
app目录下views.py
python -m pip install Pillow
pip install django-simpleui
7. 解决scss错误
使用@use替代@import
additionalData: `@use "@/styles/variables.scss" as *;`, // 使用 as * 来避免命名空间冲突
8. 解决ElementMessage样式不生效went
在main.ts中按需导入样式，也可改为自动导入网址https://blog.csdn.net/weixin_59916662/article/details/127334196
//Element Plus消息弹出框样式
// import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
// import "element-plus/theme-chalk/el-notification.css";
import "element-plus/theme-chalk/el-message-box.css";
9. 解决el-form和el-form-item的label宽度自适应报错with:0问题
在el-form标签中删除属性：label-width="auto"，不会出现with:0的情况。
10. django--daphne服务器
daphne -b 0.0.0.0 -p 8000 business.asgi:application 
11.通过以下命令自动生成 requirements.txt 文件
pip freeze > requirements.txt
12.自定义网络business_network
docker network create --subnet 172.38.0.0/16 business_network
13.PowerShell运行多行命令docker-镜像redis，并配置本地目录
docker run -d --name redis `
  -v D:/docker/redis/conf/redis.conf:/usr/local/etc/redis/redis.conf `
  -v D:/docker/redis/data:/data `
  --network business_network `
  --restart unless-stopped `
  -p 6379:6379 `
  redis:latest redis-server /usr/local/etc/redis/redis.conf
14.启动容器
docker-compose up -d 以 detached 模式启动服务，即在后台运行服务。
docker-compose up 启动服务，但不会重新构建镜像
docker-compose up --build 构建（或重新构建）服务的镜像，然后启动服务
15.登录到 MySQL 服务器
mysql -u root -p
--创建用户--换为自己mysql的用户名和密码
CREATE USER '用户名'@'DESKTOP-1CJF0UR.mshome.net' IDENTIFIED BY '密码';
--允许指定主机访问SQL
CREATE USER 'root'@'宿主机地址' IDENTIFIED BY '密码';
--获取宿主机地址
ipconfig--windows命令
查找 IPv4 地址为宿主机地址
--授予权限
GRANT ALL PRIVILEGES ON *.* TO 'root'@'DESKTOP-1CJF0UR.mshome.net';或者
GRANT ALL PRIVILEGES ON *.* TO 'root'@'宿主机地址';
--刷新权限
FLUSH PRIVILEGES;
--创建用户并授予权限
CREATE USER 'root'@'宿主机地址' IDENTIFIED BY '密码';
GRANT ALL PRIVILEGES ON business.* TO 'root'@'宿主机地址';
FLUSH PRIVILEGES;
11.django
python manage.py startapp 应用名称 
python manage.py makemigrations 应用名称
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic#调到生产模式否则simpleui的样式不生效
12.nginx(docker)
--PowerShell 命令
docker run --name nginx -d -p 80:80 `
    -v D:/nginx/nginx_conf/nginx.conf:/etc/nginx/nginx.conf:ro `
    -v D:/nginx/nginx_logs:/var/log/nginx `
    -v D:/nginx/nginx_web:/usr/share/nginx/html `
    nginx
13.创建自定义网络(docker)
docker network create --subnet=不同的子网 网络名称
子网不要跟其他网络重叠，否则会报错

docker exec -it heartfeltcareelders-redis-1 redis-cli -h redis -p 6379 -u bottle -a PZ1a3s1d4f5g2h0j PING
14.MySQL连接Django不是本地localhost权限问题
-- 显示所有数据库
SHOW DATABASES;
-- 切换到 mysql 数据库
USE mysql;
-- 查询 root 用户的 host 信息
SELECT host FROM user WHERE user = 'root';
-- 创建用户（如果尚未创建）
CREATE USER '用户名'@'IP地址/宿主机地址' IDENTIFIED BY '密码';
-- 授予权限
GRANT ALL PRIVILEGES ON *.* TO 'root'@'IP地址/宿主机地址';
-- 刷新权限
FLUSH PRIVILEGES;
15.构建镜像
仅构建镜像，不启动服务。
docker-compose build
构建镜像并启动服务。
docker-compose up --build
16.自动生成requirements.txt
pip freeze > requirements.txt
--验证清理依赖
pip install -r requirements.txt
17.进入数据库
mysql -u 数据库用户名 -p
mysql -u root -p
18.数据库用户权限不够
可以为远程连接的 root 用户授予权限，可以尝试显式创建用户，然后再授予权限
--创建用户--换为自己mysql的用户名和密码
CREATE USER 'root'@'%' IDENTIFIED BY 'your_password';
--授予权限
GRANT ALL PRIVILEGES ON business.* TO 'root'@'%';
FLUSH PRIVILEGES;
--确认 root 用户是否已经存在，并检查其权限
SELECT user, host FROM mysql.user WHERE user = 'root';
--如果用户已存在，直接授予权限GRANT ALL PRIVILEGES ON business.* TO 'root'@'%';
FLUSH PRIVILEGES;
--检查 MySQL 版本
SELECT VERSION();
--删除测试数据库
DROP DATABASE IF EXISTS test_business;
