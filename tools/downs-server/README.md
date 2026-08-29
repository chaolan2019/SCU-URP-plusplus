# URP++ 下载计数服务部署

零依赖单文件 Node 服务。数据（假名，不含学号）落 `downs-db.json`，盐落 `salt.txt`（自动生成，勿删勿改——轮换会破坏终身去重）。

## 部署

```bash
sudo mkdir -p /opt/urppp-downs
sudo cp server.js /opt/urppp-downs/
sudo node -v   # 需要 Node 18+；没有则先装
```

systemd 单元 `/etc/systemd/system/urppp-downs.service`：

```ini
[Unit]
Description=URP++ download counter
After=network.target

[Service]
WorkingDirectory=/opt/urppp-downs
ExecStart=/usr/bin/node /opt/urppp-downs/server.js
Restart=always
RestartSec=3
Environment=DOWNS_PORT=8787

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now urppp-downs
```

## 验证

```bash
curl -s http://127.0.0.1:8787/downs/health          # → ok
curl -s http://127.0.0.1:8787/downs/salt            # → {"salt":"<64位hex>"}
curl -s -X POST http://127.0.0.1:8787/downs -d '{"id":"test","uid":"abcdef0123456789"}' -H 'Content-Type: application/json'   # → {"ok":true}
curl -s 'http://127.0.0.1:8787/downs?ids=test'      # → {"test":1}
```

测完清掉测试数据：`sudo systemctl stop urppp-downs && sudo rm /opt/urppp-downs/downs-db.json && sudo systemctl start urppp-downs`（保留 salt.txt！）。

## 暴露方式（二选一）

- **有域名+证书**：nginx 反代 `/downs/` → `127.0.0.1:8787`，对外 https。
- **无域名**：安全组/防火墙放行 8787，直接 `http://IP:8787`（GM_xmlhttpRequest 不受页面 http 限制）。

## 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `DOWNS_PORT` | 8787 | 监听端口 |
| `DOWNS_DATA_DIR` | 脚本目录 | 数据目录 |
| `DOWNS_IP_LIMIT` | 60 | 每 IP 每分钟请求上限（兜底防刷） |
