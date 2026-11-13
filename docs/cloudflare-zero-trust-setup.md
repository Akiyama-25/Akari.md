# Cloudflare Zero Trust (Access) 配置指南

本指南指导如何通过 Cloudflare Zero Trust 为博客后台（`anon-akari.top/admin/`）开启企业级身份验证拦截，确保只有特定管理员邮箱（如 `cb88yyds@gmail.com`）能通过一次性验证码访问后台。

---

## 一、登录与进入 Zero Trust

1. 使用 Cloudflare 账户（`cb88yyds@gmail.com`）登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 在左侧全局导航菜单中，点击 **Zero Trust**。
3. （如果是首次进入）：
   - 系统会提示输入团队组织名称（Team Name），例如输入 `akari-lab`（可随意设定）。
   - 计划选择 **Free**（完全免费，最多支持 50 名用户，永久 0 元）。

---

## 二、创建 Access 应用程序

1. 在 Zero Trust 控制台左侧菜单中，依次展开 **Access** -> 点击 **Applications**。
2. 点击右上角蓝色的 **Add an application** 按钮。
3. 在应用类型中，选择 **Self-hosted**（自托管应用）。

---

## 三、配置应用程序信息 (Application Configuration)

1. **Application name**（应用名称）：
   填入 `Akari Admin` 或 `博客后台管理`。
2. **Session Duration**（会话持续时长）：
   默认选择 `24 hours`（24小时内同一浏览器无需重复验证）或自定义。
3. **Application domain**（受保护的域名与路径）：
   - **Subdomain**：留空（如果是主域名）。
   - **Domain**：下拉选择 `anon-akari.top`。
   - **Path**：填入 `admin*`（**至关重要**：末尾必须带星号，这样可以全量覆盖保护 `/admin`、`/admin/` 及后台子资源）。
4. 页面底部点击 **Next** 进入下一步。

---

## 四、配置访问策略 (Add Policies)

1. **Policy name**（策略名称）：
   填入 `Admin Only`。
2. **Action**（操作）：
   选择 **Allow**（允许通过）。
3. **Configure rules**（规则定义）：
   - 在 **Include** 区域：
     - **Selector**：下拉选择 `Emails`。
     - **Value**：输入主人的管理员邮箱 `cb88yyds@gmail.com`（输入后按回车确认）。
4. 页面底部点击 **Next**。
5. （可选）后续设置页面保持默认选项，直接滑到底部点击 **Save application** 完成保存。

---

## 五、验证保护效果

1. 打开浏览器无痕模式，访问：
   `https://anon-akari.top/admin/`
2. 页面将被 Cloudflare Access 自动拦截，展示验证页面并提示输入邮箱接收一次性 PIN 码。
3. 输入 `cb88yyds@gmail.com`，查收邮箱收到的 6 位数字验证码并填入，即可无缝解锁进入后台。
4. 任何非白名单人员均会被直接拒绝，完全无法加载后台页面。
