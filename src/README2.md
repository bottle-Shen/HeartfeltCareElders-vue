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
--检查用户是否存在
SELECT user, host FROM mysql.user WHERE user = 'root' AND host = '%';
--确认 root 用户是否已经存在，并检查其权限
SELECT user, host FROM mysql.user WHERE user = 'root';
+------+------+
| user | host |
+------+------+
| root | %    |
+------+------+
--创建用户--换为自己mysql的用户名和密码
CREATE USER 'root'@'%' IDENTIFIED BY 'your_password';
--授予权限
GRANT ALL PRIVILEGES ON business.* TO 'root'@'%';
FLUSH PRIVILEGES;
--如果用户已存在，直接授予权限
GRANT ALL PRIVILEGES ON business.* TO 'root'@'%';
FLUSH PRIVILEGES;
--检查 MySQL 版本
SELECT VERSION();
--删除测试数据库
DROP DATABASE IF EXISTS test_business;
--数据库本地启动失败
检查注册表中MySQL的右侧ImagePath,数据路径是否正确
检查my.ini是否路径正确
删除Data文件夹的数据
my.ini文件保留
--PowerShell命令
& "D:\MySQL\MySQL Server 9.2\bin\mysqld.exe" --defaults-file="D:\MySQL\MySQL Server 9.2Data\my.ini" --initialize --user=mysql --basedir="D:\MySQL\MySQL Server 9.2" --datadir="D:\MySQL\MySQL Server 9.2Data\Data" --console
启动mysql服务
如果数据表中的MySQL丢失或删除,mysql服务也会丢失
--重新安装MySQL服务
& "D:\MySQL\MySQL Server 9.2\bin\mysqld.exe" --install MySQL92 --defaults-file="D:\MySQL\MySQL Server 9.2Data\my.ini"
--会生成一个临时密码，之后不再显示注意保留！！！
如果命令成功执行-显示Service successfully installed.
--启动MySQL服务:
net start MySQL92
--使用临时密码登录 MySQL
mysql -u root -p
--输入临时密码，登录成功后修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword123!';
FLUSH PRIVILEGES;
EXIT;
19.Django 使用缓存功能，并且能够通过 Celery 进行异步任务处理
--使用 Django Shell
避免手动设置环境变量和加载设置,Django Shell 会自动加载项目的设置和上下文，可以直接访问 Django 的模型和缓存。
--启动 Django Shell
python manage.py shell
--在 Django Shell 中运行代码测试：
>>> from django.core.cache import cache
>>> print(cache.get('post:1:likes'))
-- 测试缓存功能
>>> from django.core.cache import cache
>>> cache.set('post:1:likes', 10)  # 设置缓存值
>>> print(cache.get('post:1:likes'))  # 读取缓存值
10
--检查数据库中的点赞数
>>> from business.apps.social.models import Post
>>> post = Post.objects.get(id=1)
>>> print(post.likes_count)# 输出 0
--检查缓存是否过期
>>> cache.set('post:1:likes', 10, timeout=60)  # 设置缓存值，过期时间为 60 秒
>>> print(cache.get('post:1:likes'))  # 读取缓存值
10
--测试是否实现了 Celery 功能
--在docker的django上运行命令
python manage.py shell
>>> from business.apps.social.tasks import sync_likes_to_db
>>> sync_likes_to_db.delay()
--成功后，查看celery日志
 docker logs -f heartfeltcareelders-celery-1
--查看 Celery Worker 的日志输出
--任务接收：
[2025-03-03 13:06:16,304: INFO/MainProcess] Task business.apps.social.tasks.sync_likes_to_db[2cd1bb9d-7080-4cad-b31d-e9a906f56215] received
--任务执行成功：
[2025-03-03 13:06:16,321: INFO/ForkPoolWorker-8] Synced likes for post 1: 2
[2025-03-03 13:06:16,324: INFO/ForkPoolWorker-8] Task business.apps.social.tasks.sync_likes_to_db[2cd1bb9d-7080-4cad-b31d-e9a906f56215] succeeded in 0.01871448000019882s: None
这表明任务已经成功执行，并且日志中显示了任务的输出（Synced likes for post 1: 2）
--确认定时任务是否正常运行：
查看 Celery Beat 的日志，确认定时任务是否被正确调度。
手动触发任务以验证逻辑是否正确：
在docker的celery进入shell命令
python manage.py shell
from business.apps.social.tasks import sync_likes_to_db
sync_likes_to_db.delay()
--查看日志
 docker logs -f heartfeltcareelders-celery-1
 --日志任务接收和执行：
 [2025-03-03 13:06:16,304: INFO/MainProcess] Task business.apps.social.tasks.sync_likes_to_db[2cd1bb9d-7080-4cad-b31d-e9a906f56215] received
[2025-03-03 13:06:16,321: INFO/ForkPoolWorker-8] Synced likes for post 1: 2
[2025-03-03 13:06:16,324: INFO/ForkPoolWorker-8] Task business.apps.social.tasks.sync_likes_to_db[2cd1bb9d-7080-4cad-b31d-e9a906f56215] succeeded in 0.01871448000019882s: None
这表明第一个任务已经被接收、执行，并且成功完成。
同样，第二个任务也被成功调度和执行：
[2025-03-03 13:23:18,838: INFO/MainProcess] Task business.apps.social.tasks.sync_likes_to_db[a0c22de6-6dd3-484b-b413-94239d8882f6] received
[2025-03-03 13:23:18,849: INFO/ForkPoolWorker-8] Synced likes for post 1: 2
[2025-03-03 13:23:18,851: INFO/ForkPoolWorker-8] Task business.apps.social.tasks.sync_likes_to_db[a0c22de6-6dd3-484b-b413-94239d8882f6] succeeded in 0.011599079996813089s: None
警告信息：
[2025-03-03 13:05:41,283: WARNING/MainProcess] CPendingDeprecationWarning: The broker_connection_retry configuration setting will no longer determine whether broker connection retries are made during startup in Celery 6.0 and above.
这是一个关于未来版本的警告，表明在 Celery 6.0 及以上版本中，broker_connection_retry 配置项将不再影响启动时的连接重试行为。如果希望保留当前的行为，需要显式设置 broker_connection_retry_on_startup 为 True。
--检查数据库中的点赞数是否更新
登录到数据库mysql -u 用户名 -p
mysql -u root -p
输入密码后，选择你的数据库：
USE 数据库名;
USE business;
--检查表中点赞数，tb_post表名要跟数据库完全一致区分大小写
SELECT id, likes_count FROM tb_post;
--如果返回的结果是：
+----+-------------+
| id | likes_count |
+----+-------------+
|  1 |           2 |
+----+-------------+
那么说明任务逻辑正确，点赞数已经成功更新到数据库。
对比任务日志中的输出，确认数据库中的点赞数是否与任务执行的结果一致。
--确认 Redis 缓存中的点赞数
连接到 Redis
在docker的redis-redis-cli -h redis -p 6379 -a 密码
redis-cli -h redis -p 6379 -a PZ1a3s1d4f5g2h0j
查询缓存中的点赞数
GET post:1:likes
如果返回为(nil)
这表明 Redis 中没有找到键 post:1:likes，返回了 nil
检查缓存键是否存在
进入redis-cli -h redis -p 6379 -a <your_redis_password>
redis-cli -h redis -p 6379 -a PZ1a3s1d4f5g2h0j
KEYS post:*:likes
redis:6379> KEYS post:*:likes
(empty array)
这表明 Redis 中没有找到任何以 post:*:likes 为前缀的键。
--手动设置测试键：
进入redis-cli -h redis -p 6379 -a <your_redis_password>
redis-cli -h redis -p 6379 -a PZ1a3s1d4f5g2h0j
SET post:1:likes 5
检查设置键
GET post:1:likes
"5"
带有数据库编号的查询
GET :1:post:1:likes
查询所有键
KEYS *
清除特定键
DEL ":1:test_key"
清除当前数据库中的所有键：
FLUSHDB
清除所有数据库中的所有键：
FLUSHALL
退出redis-cli，ctrl+C退出命令
然后在docker的celery进入shell
python manage.py shell
再次运行任务：
from business.apps.social.tasks import sync_likes_to_db
sync_likes_to_db.delay()
查看 Celery Worker任务日志，确认任务是否成功同步点赞数到数据库。
本机终端命令
docker logs -f heartfeltcareelders-celery-1
成功后进入数据库
检查数据库中数据表的点赞数
SELECT id, likes_count FROM tb_post WHERE id = 1;
+----+-------------+
| id | likes_count |
+----+-------------+
|  1 |           2 |
+----+-------------+
说明任务逻辑正确，点赞数已经成功同步到数据库。
检查 Redis 缓存中的点赞数
redis-cli -h redis -p 6379 -a <your_redis_password>
GET post:1:likes
--验证数据库中的点赞数
--在任务执行后，检查数据库中的 likes_count 是否更新：
post = Post.objects.get(id=1)
print(post.likes_count)  # 应该输出 10
--报错PermissionError: [WinError 5] 拒绝访问
--Cannot connect to redis://redis:6379/0: Error 11001 connecting to redis:6379. getaddrinfo failed
这表明 Celery 无法连接到 Redis 服务器。这可能是由于 Redis 服务未运行，或者 Redis 的地址和端口配置不正确
--解决
--检查容器内部是否安装了redis-tools工具
--进入容器，如django容器，celery容器
docker exec -it --user root heartfeltcareelders-django-1 /bin/bash
docker exec -it --user root heartfeltcareelders-celery-1 /bin/bash
--安装redis-tools工具
apt-get update && apt-get install -y redis-tools
--验证是否安装成功
redis-cli --version
--如果安装成功，类似以下输出：
redis-cli 7.x.x
20.django缓存配置
在docker-django中运行命令
进入Shell
python manage.py shell
from django.core.cache import cache
print(cache._cache)  # 查看实际的缓存后端实例
--如果 Redis 缓存生效，输出应该类似于：
<django_redis.cache.RedisCache object at 0x...>
如果输出是 RedisCache，说明 Redis 缓存已经生效。如果是 LocMemCache，说明仍然在使用本地内存缓存。
--确保django-redis 已安装
--未安装在django的Dockerfile 中添加以下内容：
# 安装 django-redis
RUN pip install django-redis -i https://pypi.tuna.tsinghua.edu.cn/simple
--重新构建 Docker 镜像
docker-compose down
docker-compose up --build
--检查是否安装django-redis成功
docker中的django-进入shell
python manage.py shell
后运行
import django_redis
print(django_redis.__version__)
输出版本号则安装django-redis成功
--检查缓存后的类型
--检查缓存后端的类名
docker中的django-进入shell
python manage.py shell
后运行
from django.core.cache import cache
print(cache.__class__.__name__)
如果输出是：
RedisCache
说明已经成功使用了 Redis 缓存后端。
--检查缓存实例的属性-确认 Redis 缓存是否已经正确初始化
print(cache.client)  # 打印 Redis 客户端实例
print(cache.client._client)  # 打印底层的 Redis 客户端连接
-- 测试缓存操作
cache.set("test_key", "test_value", timeout=60)  # 设置一个测试键值对
print(cache.get("test_key"))  # 获取并打印该键的值
如果输出是：
test_value
那么说明 Redis 缓存已经正常工作。
如果输出ConnectionProxy
表明你访问的 cache 对象是 Django 的 ConnectionProxy，这是一个代理类，用于动态选择实际的缓存后端。这本身是正常的，但它并没有直接说明当前使用的缓存后端类型。
为了确认实际使用的缓存后端，需要进一步检查 cache 对象的内部实现。由于 ConnectionProxy 是一个代理类，需要通过它访问实际的缓存后端实例。
--如何确认实际使用的缓存后端
--使用 _connections 属性
from django.core.cache import cache
print(cache._connections["default"].__class__.__name__)
如果输出是：
RedisCache
那么说明已经成功使用了 Redis 缓存后端。如果是：
LocMemCache
那么说明仍然在使用本地内存缓存。

