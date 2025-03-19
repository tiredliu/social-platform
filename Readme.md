# 环境

编译器

VScode



前端项目文件夹project，后端项目文件夹socialbackend，前后端分离的



前端环境需要Node.js  v22.14.0

后端环境建议使用虚拟环境，

python 3.12或以上 

django5.1.7





操作命令

返回上级目录

```
cd ../
```

前端命令

```
cd project

//运行
npm run dev
```

后端命令

```
cd socialbackend

如果不是全局环境，那请激活虚拟环境,例如conda管理的虚拟环境
激活环境命令
conda activate <环境名称>


//运行
python manage.py runserver

//创建迁移文件
python manage.py makemigrations
//迁移
python manage.py migrate


//安装django-cors-headers，允许跨域请求
pip install django-cors-headers
```

取消运行

Ctrl + C





前后端联调的时候建议开两个powershell终端，一个负责前端，一个负责后端