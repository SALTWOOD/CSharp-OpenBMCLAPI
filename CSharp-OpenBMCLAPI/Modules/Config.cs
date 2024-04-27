﻿using Newtonsoft.Json;
using System.ComponentModel;
using YamlDotNet.Serialization;

namespace CSharpOpenBMCLAPI.Modules
{
    /// <summary>
    /// 配置文件类
    /// </summary>
    public class Config
    {
        [YamlMember(Description = """
        0: None（不检查，不推荐）")]
        1: Exists（检查文件是否存在）")]
        2: SizeOnly（检查文件大小，推荐，默认）")]
        3: Hash（完整计算哈希，时间长，推荐不常重启或是分片节点使用）
        """, Order = 2)]
        public FileVerificationMode startupCheckMode;

        [YamlMember(Description = """
        跳过启动前检查
        这会导致无法发现文件错误，但是能够将内存占用压缩到很低！
        [注] 当此项启用时，"startupCheckMode"无效
        """, Order = 2)]
        public bool skipStartupCheck;

        [YamlMember(Description = "指示 token 应当在距离其失效前的多少毫秒进行刷新", Order = 1)]
        public int refreshTokenTime;

        [YamlMember(Description = "指示应该将要服务的文件放在哪里（服务路径）", Order = 1)]
        public string clusterFileDirectory;

        [YamlIgnore]
        [YamlMember(Description = "指示节点端的版本，不应由用户更改")]
        public string clusterVersion;

        [YamlMember(Alias = "host", Description = "用户访问时使用的 IP 或域名", Order = 0)]
        public string HOST { get; set; }

        [YamlMember(Alias = "port", Description = "对外服务端口", Order = 0)]
        public ushort PORT { get; set; }

        [YamlMember(Alias = "bringYourOwnCertificate", Description = "是否不使用主控分发的证书", Order = 1)]
        public bool bringYourOwnCertficate;


        [YamlMember(Description = "指示是否执行快速上线，若为 true 则每次都不执行", Order = 1)]
        public bool noFastEnable;

        [YamlMember(Description = "指示是否禁用访问日志输出", Order = 1)]
        public bool disableAccessLog;

        [YamlIgnore]
        public string cacheDirectory { get => Path.Combine(this.clusterFileDirectory, "cache"); }

        public Config()
        {
            this.startupCheckMode = FileVerificationMode.SizeOnly;
            this.skipStartupCheck = false;

            this.refreshTokenTime = 1800000;
            this.clusterFileDirectory = "./";
            this.clusterVersion = "1.10.4";

            this.HOST = "";
            this.PORT = 4000;
            this.bringYourOwnCertficate = false;
            this.noFastEnable = false;

            this.disableAccessLog = false;
        }
    }
}
