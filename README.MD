﻿<center>

![CSharp-OpenBMCLAPI](https://github.com/SALTWOOD/CSharp-OpenBMCLAPI/assets/105980161/20b4b593-4ab9-445b-8a4b-6e329aa041c2)

# CSharp-OpenBMCLAPI
🎉 基于 [OpenBMCLAPI](https://github.com/bangbang93/openbmclapi) 的 C# 实现 🎉

</center>

<p align="center">
  <a href="https://raw.githubusercontent.com/Mrs4s/go-cqhttp/master/LICENSE">
    <img src="https://img.shields.io/github/license/SALTWOOD/CSharp-OpenBMCLAPI" alt="license">
  </a>
  <a href="https://github.com/Mrs4s/go-cqhttp/releases">
    <img src="https://img.shields.io/github/v/release/SALTWOOD/CSharp-OpenBMCLAPI?color=blueviolet&include_prereleases" alt="release">
  </a>
  <a href="https://github.com/SALTWOOD/CSharp-OpenBMCLAPI/actions">
    <img src="https://github.com/SALTWOOD/CSharp-OpenBMCLAPI/workflows/.NET/badge.svg" alt="action">
  </a>
</p>

> 注：本仓库的代码参照 [OpenBMCLAPI](https://github.com/bangbang93/openbmclapi) 的思路编写，部分特性、Bug 可能部分、甚至完全与 [OpenBMCLAPI](https://github.com/bangbang93/openbmclapi) 撞车。

# 项目说明

本项目是 [OpenBMCLAPI](https://github.com/bangbang93/openbmclapi) 的 C# 版本，OpenBMCLAPI 是通过分布式集群帮助 [BMCLAPI](https://bmclapidoc.bangbang93.com/) 进行文件分发、加速中国大陆 Minecraft 下载的公益项目。

如果你想加入 OpenBMCLAPI，可以寻找 [bangbang93](https://github.com/bangbang93) 索取 `CLUSTER_ID` 和 `CLUSTER_SECRET`

# 特性

- 还没做完（甚至基本不可用），暂无任何特性

# 使用

## 从源码启动

1. 克隆仓库
2. 在 `CSharp-OpenBMCLAPI/CSharp-OpenBMCLAPI` 下新建 `.env.json`，按照如下方式填入 `ClusterId` 和 `ClusterSecret`：
```
{
	"ClusterId": "************************",
	"ClusterSecret": "********************************"
}
```
3. 运行 `dotnet build` 或打开项目，运行构建好的程序

# TODO

- [ ] 上线节点，能够被主控登记为在线
- [ ] 提供服务
- [ ] *[优先级低]* 插件功能，支持通过第三方插件做各种事情
- [ ] *[优先级低]* 高级控制台，在控制台中调整设置、查看监控信息而不只是看日志

# 鸣谢

**Newtonsoft**
- [Newtonsoft.Json](https://www.newtonsoft.com/json) - 使用 Newtonsoft.Json 解析 Json

**Behzad Khosravifar**
- [Downloader](https://github.com/bezzad/Downloader) - 使用 Downloader 下载文件

**@doghappy**
- [SocketIOCLient](https://github.com/doghappy/socket.io-client-csharp) - 使用 SocketIOClient 与主控通信

**Apache**
- [Avro](https://avro.apache.org/) - 使用 Avro 包解析主控返回的解压缩过的文件列表
- [log4net](https://logging.apache.org/log4net/) - 使用 log4net 记录日志（虽然目前没用到）

**@oleg-st (Oleg Stepanischev)**
- [ZstdSharp.Port](https://github.com/oleg-st/ZstdSharp) - 使用 ZstdSharp.Port 解压主控下发的压缩过的文件列表

**SALTWOOD**
- [TeraIO](https://github.com/SALTWOOD/TeraIO) - 其实也没用到多少（目前是废物一个），以后会抽空把一些 utils 丢进去的