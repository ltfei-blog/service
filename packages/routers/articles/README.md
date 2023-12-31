# 文章的编辑与发布

## 初始化编辑

用户打开编辑器时，会先进行初始化，目的是验证是否拥有编辑权限、获取编辑器相关配置，以及获取草稿内容。

初始化分为两种情况，修改和新增，如果是新增，可以直接读取上次的草稿，如果是新增，则需要判断作者是否为当前用户，然后读取文章内容或草稿内容

## 保存草稿

保存草稿时，要区分是否留存用户每次保存时的草稿，如果需要留存，用户每次保存都会插入一条新数据，但这样会造成数据量过多，这里不需要留存多余的草稿，因此保存时会判断是否有正在编辑的草稿，如果有，会将其直接覆盖

## 发布文章

发布文章时，不能直接发布到文章表，需要先进行审核，如果设置无需审核，会自动通过，无论如何，都需要生成一条审核记录

如果修改文章时有待审核的内容(有修改内容待审核的情况)，应先将之前的待审核作废，避免提交的同时审核通过

## 图片上传

图片上传分为很多种情况，包括头像上传，文章内图片上传，封面上传，这里主要先考虑文章内图片上传和封面上传。
上传目标位置的路径

在二代博客中，上传的路径为 `/用户id/YYYYMMDDHHmm-文件名.后缀`,为了区分文章的图片和用户头像等图片，这里修改为`/articles/hash.后缀`同时，为了保留图片信息，需要在数据库数据留存数据

- id
- filename
- path
- hash
- md5?
- content_type
- suffix
- time
- user
- upload_type 上传类型 封面/头像/文章图片

## 一对多查询

[https://www.litf.com.cn/p/21](https://www.litf.com.cn/p/21)

# 约定

标题长度为 2-40
正文长度为 (5 100)-四万
简介 10-100
简介为选填项，如果不填，则由前端自动截取前..字，长度为10~100个字符
