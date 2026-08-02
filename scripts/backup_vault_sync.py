#!/usr/bin/env python3
"""
An Nhiên Trà Quán — Sao Lưu Dữ Liệu Thật Về Máy (Local-Only Vault Copy)

CÁCH DÙNG:
  1. Trên web, vào Admin POS, bấm "📥 Sao Lưu Dữ Liệu" — trình duyệt sẽ tải một
     file .json thật (chứa đơn hàng/đặt bàn/tin nhắn) về thư mục Downloads.
  2. Chạy: python3 scripts/backup_vault_sync.py ~/Downloads/AN_NHIEN_SAO_LUI_DU_LIEU_....json
  3. Script sẽ kiểm tra file hợp lệ rồi copy vào thư mục data_backup/ (KHÔNG commit
     lên GitHub vì repo này đang ở chế độ public — xem .gitignore).

Lưu ý quan trọng: script này KHÔNG tự lấy được dữ liệu trực tiếp từ trình duyệt
(localStorage của web chỉ trình duyệt mới đọc được) — bắt buộc phải tải file
từ nút "📥 Sao Lưu Dữ Liệu" trên Admin POS trước, rồi mới đưa vào script này.
"""
import os
import sys
import json
import shutil
import hashlib
from datetime import datetime

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKUP_DIR = os.path.join(REPO_ROOT, "data_backup")


def sha256_of_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        h.update(f.read())
    return h.hexdigest()


def main():
    if len(sys.argv) < 2:
        print("❌ Thiếu đường dẫn file backup.")
        print("Cách dùng: python3 scripts/backup_vault_sync.py <đường-dẫn-file.json>")
        sys.exit(1)

    src_path = os.path.expanduser(sys.argv[1])
    if not os.path.exists(src_path):
        print(f"❌ Không tìm thấy file: {src_path}")
        sys.exit(1)

    with open(src_path, "r", encoding="utf-8") as f:
        try:
            vault = json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ File không phải JSON hợp lệ: {e}")
            sys.exit(1)

    data = vault.get("data", vault)
    orders = data.get("orders", [])
    reservations = data.get("reservations", [])
    messages = data.get("messages", [])

    if not orders and not reservations and not messages:
        print("⚠️ File hợp lệ nhưng KHÔNG có đơn hàng/đặt bàn/tin nhắn nào — kiểm tra lại có đúng file xuất từ Admin POS không.")

    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest_filename = f"AN_NHIEN_FULL_BACKUP_{timestamp}.json"
    dest_path = os.path.join(BACKUP_DIR, dest_filename)
    shutil.copyfile(src_path, dest_path)

    file_checksum = sha256_of_file(dest_path)
    app_checksum = vault.get("checksum", "")

    manifest_path = os.path.join(BACKUP_DIR, "manifest.json")
    manifest = []
    if os.path.exists(manifest_path):
        with open(manifest_path, "r", encoding="utf-8") as f:
            try:
                manifest = json.load(f)
            except json.JSONDecodeError:
                manifest = []

    manifest.append({
        "savedAt": datetime.now().isoformat(),
        "file": dest_filename,
        "fileSha256": file_checksum,
        "appChecksumInFile": app_checksum,
        "counts": {
            "orders": len(orders),
            "reservations": len(reservations),
            "messages": len(messages)
        }
    })
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print("✅ [VAULT] Đã sao lưu dữ liệu THẬT vào máy (không đưa lên GitHub công khai):")
    print(f"   Nơi lưu: {dest_path}")
    print(f"   SHA-256 (toàn file): {file_checksum}")
    print(f"   Số đơn hàng: {len(orders)} | Đặt bàn: {len(reservations)} | Tin nhắn: {len(messages)}")
    print(f"   Nhật ký các lần sao lưu: {manifest_path}")


if __name__ == "__main__":
    main()
