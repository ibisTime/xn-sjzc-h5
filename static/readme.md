*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

require.js+es6+scss+fis3

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

fis3打包方式
    fis3 release -d F:/web/xn-demo-require/dist 

    "dist": "fis3 release -d ../dist -w",
    "prod": "fis3 release -d ../dist prod"

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

新增语言需添加的配置
 config.js -> LANGUAGECODELIST, LANGUAGELIST
 language.js 需给每个配置添加新增的语言配置
 
 需注意配置的一致性

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-