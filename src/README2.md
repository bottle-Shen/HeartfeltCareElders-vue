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
