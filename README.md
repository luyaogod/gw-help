# gw-help
顾问HELP是一个ERP顾问工具箱。

## 架构
- 前端：vue3、TS、vuetify、codemirror
- 后端：python、pywebview
- 用户界面由vue3打包后交由pywebview渲染、pywebview实现python和JS代码交互

## 小工具
- JSON5
  - JSON5/JSON格式化为JSON

- JSON差异
  - JSON差异对比

- QQ发票整理
  - 批量整理排序QQ邮箱导出的发票文件

- VISIO转PDF
  - 批量将VISIO文件转为PDF

## 打包
```
build.ps1
```