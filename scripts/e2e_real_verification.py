#!/usr/bin/env python3
"""
An Nhiên Trà Quán — Full E2E & Real-Evidence Test Runner
Kiểm thử toàn diện 5 lằn ranh (5 Lanes Verification):
1. Build Frontend & Static Assets Check
2. VietQR MB Bank Live Image API Check
3. Telegram Bot Alert Real Message Delivery Check
4. Backup Vault SHA-256 & Schema Integrity Check
5. Live GitHub Pages Deployment Health Check
"""
import os
import sys
import json
import urllib.request
import urllib.error
import subprocess
import hashlib
from datetime import datetime

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKUP_DIR = os.path.join(REPO_ROOT, "data_backup")
MANIFEST_FILE = os.path.join(BACKUP_DIR, "manifest.json")

results = []

def record(lane, name, status, detail=""):
    results.append({"lane": lane, "name": name, "status": status, "detail": detail})
    symbol = "✅ PASS" if status == "PASS" else "❌ FAIL"
    print(f"[{symbol}] Lane {lane} — {name}: {detail}")

print("===============================================================")
print("🍵 AN NHIÊN TRÀ QUÁN — FULL E2E REAL-EVIDENCE TEST SUITE")
print(f"   Executed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("===============================================================\n")

# ── LANE 1: BUILD FRONTEND & SYNTAX ──────────────────────────────────────────
try:
    t0 = datetime.now()
    res = subprocess.run(["npm", "run", "build"], cwd=REPO_ROOT, capture_output=True, text=True, timeout=30)
    elapsed_ms = round((datetime.now() - t0).total_seconds() * 1000)
    if res.returncode == 0:
        record(1, "Vite Production Build", "PASS", f"Built successfully in ~{elapsed_ms}ms with 0 errors")
    else:
        record(1, "Vite Production Build", "FAIL", f"Build error: {res.stderr[:200]}")
except Exception as e:
    record(1, "Vite Production Build", "FAIL", str(e))

# ── LANE 2: VIETQR MB BANK LIVE API ──────────────────────────────────────────
try:
    bank_acc = "0888999911"
    amount = 136000
    order_id = "AN859210"
    qr_url = f"https://img.vietqr.io/image/MB-{bank_acc}-compact2.png?amount={amount}&addInfo=ANNHIEN+{order_id}+TRA&accountName=LE+TRONG+THIEN+LONG"
    
    req = urllib.request.Request(qr_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        content_type = resp.headers.get("Content-Type", "")
        img_bytes = resp.read()
        size_kb = round(len(img_bytes) / 1024, 1)
        
    if resp.status == 200 and "image" in content_type and len(img_bytes) > 20000:
        record(2, "VietQR MB Bank 0888999911", "PASS", f"HTTP 200, {content_type}, {size_kb} KB PNG generated live")
    else:
        record(2, "VietQR MB Bank 0888999911", "FAIL", f"Unexpected response: HTTP {resp.status}, size={len(img_bytes)}")
except Exception as e:
    record(2, "VietQR MB Bank 0888999911", "FAIL", str(e))

# ── LANE 3: TELEGRAM BOT ALERT ───────────────────────────────────────────────
try:
    bot_token = os.environ.get("AN_NHIEN_TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("AN_NHIEN_TELEGRAM_CHAT_ID", "")
    if not bot_token or not chat_id:
        raise RuntimeError("Chưa đặt biến môi trường AN_NHIEN_TELEGRAM_BOT_TOKEN / AN_NHIEN_TELEGRAM_CHAT_ID — bỏ qua để tránh lộ token trong code")
    now_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    
    test_msg = (
        "🧪 *KIỂM THỬ TỰ ĐỘNG REAL EVIDENCE BASE*\n"
        "━━━━━━━━━━━━━━━━━━\n"
        f"⏰ Thời gian: {now_str}\n"
        "✅ Kiểm thử kết nối Telegram Bot @TradaoLinhbot\n"
        "📍 Cửa hàng: An Nhiên Trà Quán — Valeo Đầm Sen\n"
        "👤 Chủ quán: Chị Linh (0585 596 789)\n"
        "━━━━━━━━━━━━━━━━━━\n"
        "Hệ thống báo đơn tự động sẵn sàng 100%!"
    )
    
    payload = json.dumps({
        "chat_id": chat_id,
        "text": test_msg,
        "parse_mode": "Markdown"
    }).encode("utf-8")
    
    tg_req = urllib.request.Request(
        f"https://api.telegram.org/bot{bot_token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(tg_req, timeout=10) as resp:
        tg_res = json.loads(resp.read().decode("utf-8"))
        
    if tg_res.get("ok"):
        msg_id = tg_res["result"]["message_id"]
        record(3, "Telegram Bot @TradaoLinhbot", "PASS", f"Sent live message to Chat ID {chat_id} (msg_id #{msg_id})")
    else:
        record(3, "Telegram Bot @TradaoLinhbot", "FAIL", f"Telegram API error: {tg_res}")
except Exception as e:
    record(3, "Telegram Bot @TradaoLinhbot", "FAIL", str(e))

# ── LANE 4: LOCAL BACKUP VAULT & SHA-256 INTEGRITY ──────────────────────────
# Lưu ý: từ khi sửa (xem báo cáo kiểm duyệt), bản sao lưu THẬT (có đơn hàng)
# chỉ được lưu cục bộ trong data_backup/ (không commit lên GitHub công khai).
try:
    if not os.path.exists(MANIFEST_FILE):
        record(4, "Local Backup Vault SHA-256 Integrity", "FAIL",
               "Chưa có bản sao lưu nào trong data_backup/ — chạy scripts/backup_vault_sync.py với file tải từ Admin POS trước")
    else:
        with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        if not manifest:
            record(4, "Local Backup Vault SHA-256 Integrity", "FAIL", "manifest.json rỗng")
        else:
            latest = manifest[-1]
            backup_path = os.path.join(BACKUP_DIR, latest["file"])
            if not os.path.exists(backup_path):
                record(4, "Local Backup Vault SHA-256 Integrity", "FAIL", f"File {latest['file']} bị thiếu trên đĩa")
            else:
                h = hashlib.sha256()
                with open(backup_path, "rb") as bf:
                    h.update(bf.read())
                recalculated = h.hexdigest()
                if recalculated == latest["fileSha256"]:
                    record(4, "Local Backup Vault SHA-256 Integrity", "PASS",
                           f"Checksum khớp: {recalculated[:16]}... ({latest['counts']['orders']} đơn hàng)")
                else:
                    record(4, "Local Backup Vault SHA-256 Integrity", "FAIL",
                           f"Checksum KHÔNG khớp — file {latest['file']} có thể đã bị sửa/hỏng sau khi lưu")
except Exception as e:
    record(4, "Local Backup Vault SHA-256 Integrity", "FAIL", str(e))

# ── LANE 5: LIVE GITHUB PAGES DEPLOYMENT ─────────────────────────────────────
try:
    live_url = "https://drthienlongfacs-hub.github.io/zen-tea-website/"
    req = urllib.request.Request(live_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = resp.read().decode("utf-8")
        
    if resp.status == 200 and "<html" in body.lower():
        record(5, "Live GitHub Pages URL", "PASS", f"HTTP 200 OK — Published at {live_url}")
    else:
        record(5, "Live GitHub Pages URL", "FAIL", f"HTTP status: {resp.status}")
except Exception as e:
    record(5, "Live GitHub Pages URL", "FAIL", str(e))

# ── SUMMARY ──────────────────────────────────────────────────────────────────
print("\n===============================================================")
total_pass = sum(1 for r in results if r["status"] == "PASS")
total_tests = len(results)
pct = round(100 * total_pass / total_tests) if total_tests else 0
print(f"📊 KIỂM THỬ THỰC TẾ XÁC NHẬN: {total_pass}/{total_tests} LANES PASSED ({pct}%)")
print("===============================================================\n")

summary_file = os.path.join(REPO_ROOT, "src", "data", "LAST_TEST_RUN.json")
with open(summary_file, "w", encoding="utf-8") as f:
    json.dump({
        "timestamp": datetime.now().isoformat(),
        "total": total_tests,
        "passed": total_pass,
        "results": results
    }, f, ensure_ascii=False, indent=2)

if total_pass == total_tests:
    sys.exit(0)
else:
    sys.exit(1)
