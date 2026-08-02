import React, { useState, useEffect } from 'react';
import {
  getOrders,
  updateOrderStatus,
  confirmPaymentReceived,
  getReservations,
  updateReservationStatus,
  getContactMessages,
  markMessageRead,
  getShopConfig,
  saveShopConfig,
  sendFreeNotificationToOwner,
  playNewOrderBellSound
} from '../utils/orderService';

import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Bell,
  PhoneCall,
  ShieldCheck,
  Printer,
  Download,
  Settings,
  RefreshCw,
  Volume2,
  AlertCircle,
  Truck,
  Coffee,
  Check,
  X,
  Calendar,
  MessageSquare,
  UserCheck,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function AdminOrderManager({ onClose }) {
  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // 'orders' | 'reservations' | 'messages'
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [shopConfig, setShopConfigState] = useState(getShopConfig());

  // Filter & Search State
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const loadData = () => {
    setOrders(getOrders());
    setReservations(getReservations());
    setMessages(getContactMessages());
    setShopConfigState(getShopConfig());
  };

  // Real-time Event Listener & Multi-tab Sync via 'storage'
  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    const handleStorageChange = (e) => {
      if (
        e.key === 'AN_NHIEN_ORDERS_LEDGER_V1' ||
        e.key === 'AN_NHIEN_RESERVATIONS_LEDGER_V1' ||
        e.key === 'AN_NHIEN_MESSAGES_LEDGER_V1' ||
        e.key === 'AN_NHIEN_SHOP_CONFIG_V1'
      ) {
        loadData();
      }
    };

    window.addEventListener('new_order_placed', handleUpdate);
    window.addEventListener('order_status_updated', handleUpdate);
    window.addEventListener('new_reservation_placed', handleUpdate);
    window.addEventListener('reservation_status_updated', handleUpdate);
    window.addEventListener('new_contact_message', handleUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('new_order_placed', handleUpdate);
      window.removeEventListener('order_status_updated', handleUpdate);
      window.removeEventListener('new_reservation_placed', handleUpdate);
      window.removeEventListener('reservation_status_updated', handleUpdate);
      window.removeEventListener('new_contact_message', handleUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
  };

  const handleConfirmPayment = (orderId) => {
    const updated = confirmPaymentReceived(orderId);
    setOrders(updated);
  };

  const handleResStatusChange = (resId, newStatus) => {
    const updated = updateReservationStatus(resId, newStatus);
    setReservations(updated);
  };

  const handleMarkMsgRead = (msgId) => {
    const updated = markMessageRead(msgId);
    setMessages(updated);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    saveShopConfig(shopConfig);
    setIsConfigOpen(false);
    alert('Đã lưu cấu hình shop & báo đơn tự động thành công!');
  };

  const testFreeNotification = () => {
    playNewOrderBellSound();
    const testMockOrder = {
      id: 'TEST9999',
      items: [{ item: { name: 'Matcha Test Notification' }, quantity: 1, totalPrice: 68000 }],
      customer: { fullName: 'Chủ Quán Test (Chị Linh)', phone: shopConfig.ownerPhone || '0585596789', address: 'Valeo Đầm Sen, Tân Phú' },
      payment: { method: 'momo', grandTotal: 68000 }
    };
    sendFreeNotificationToOwner(testMockOrder, shopConfig);
    alert(`Đã phát tiếng chuông báo đơn & gửi tin nhắn thử nghiệm về máy: ${shopConfig.ownerPhone || '0585596789'}`);
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString('vi-VN');
    } catch (e) {
      return isoString;
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'ALL' || order.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(q) ||
      order.customer.fullName.toLowerCase().includes(q) ||
      order.customer.phone.includes(q) ||
      order.customer.address.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // KPI Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'HUY')
    .reduce((sum, o) => sum + (o.payment?.grandTotal || 0), 0);

  const pendingCount = orders.filter(o => o.status === 'MOI').length;
  const preparingCount = orders.filter(o => o.status === 'XAC_NHAN').length;
  const shippingCount = orders.filter(o => o.status === 'DANG_GIAO').length;
  const completedCount = orders.filter(o => o.status === 'HOAN_THANH').length;
  const unreadMsgCount = messages.filter(m => !m.isRead).length;

  const exportCSV = () => {
    const BOM = '\uFEFF';
    const headers = 'Mã Đơn,Ngày Đặt,Giờ Đặt,Khách Hàng,Số ĐT,Địa Chỉ Giao,Số Món,Tổng Tiền (VNĐ),Thanh Toán,Trạng Thái\n';
    const safeStr = (s) => `"${String(s || '').replace(/"/g, '\'\'')}"`;
    const rows = orders.map(o => {
      const d = new Date(o.createdAt);
      const dateStr = d.toLocaleDateString('vi-VN');
      const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const statusMap = { MOI: 'Mới', XAC_NHAN: 'Xác Nhận', DANG_GIAO: 'Đang Giao', HOAN_THANH: 'Hoàn Thành', HUY: 'Đã Hủy' };
      return [
        safeStr(o.id),
        safeStr(dateStr),
        safeStr(timeStr),
        safeStr(o.customer.fullName),
        safeStr(o.customer.phone),
        safeStr(o.customer.address),
        safeStr(o.items?.length || 0),
        safeStr(o.payment.grandTotal),
        safeStr(o.payment.method?.toUpperCase()),
        safeStr(statusMap[o.status] || o.status)
      ].join(',');
    }).join('\n');
    const csv = BOM + headers + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AN_NHIEN_ORDERS_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#1f2721] text-[#f7f4ef] font-sans p-4 md:p-8 animate-fadeIn">

      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#3d633b]/40">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3d633b] text-white flex items-center justify-center font-serif-zen text-xl font-bold">
              安
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                Hệ Thống Quản Lý An Nhiên Trà Quán
              </h1>
              <p className="text-xs text-[#8fb388] mt-0.5 flex items-center gap-2">
                <span>Chủ quán: <strong>Chị Linh</strong> ({shopConfig.ownerPhone || '0585596789'})</span>
                <span>·</span>
                <span>Chung cư Valeo Đầm Sen, Q. Tân Phú, TP.HCM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsConfigOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#3d633b]/40 hover:bg-[#3d633b] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 border border-[#3d633b]/60"
          >
            <Settings className="w-4 h-4 text-[#8fb388]" />
            <span>Cài Đặt Shop</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#7c674e]/40 hover:bg-[#7c674e] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 border border-[#7c674e]/60"
          >
            <Download className="w-4 h-4 text-[#e2ebe0]" />
            <span>Xuất Báo Cáo CSV</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-xs font-semibold text-red-200 transition-colors border border-red-800/60"
          >
            Thoát POS
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-4 my-6">
        <div className="bg-[#2a362d] border border-[#3d633b]/30 p-4 rounded-2xl">
          <span className="text-[11px] text-[#8fb388] font-bold uppercase tracking-wider block">Tổng Doanh Thu</span>
          <p className="font-display text-xl font-bold text-white mt-1">{formatVND(totalRevenue)}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Toàn bộ đơn thành công</span>
        </div>

        <div className="bg-[#2a362d] border border-[#3d633b]/30 p-4 rounded-2xl">
          <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">Đơn Mới Cần Xử Lý</span>
          <p className="font-display text-xl font-bold text-amber-400 mt-1">{pendingCount} đơn</p>
          <span className="text-[10px] text-amber-300/70 mt-1 block">Cần bấm xác nhận</span>
        </div>

        <div className="bg-[#2a362d] border border-[#3d633b]/30 p-4 rounded-2xl">
          <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider block">Đang Pha Chế / Giao</span>
          <p className="font-display text-xl font-bold text-blue-400 mt-1">{preparingCount + shippingCount} đơn</p>
          <span className="text-[10px] text-blue-300/70 mt-1 block">Đang vận chuyển</span>
        </div>

        <div className="bg-[#2a362d] border border-[#3d633b]/30 p-4 rounded-2xl">
          <span className="text-[11px] text-[#4ade80] font-bold uppercase tracking-wider block">Đã Đặt Bàn</span>
          <p className="font-display text-xl font-bold text-[#4ade80] mt-1">{reservations.length} lượt</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Lịch giữ bàn Zen</span>
        </div>

        <div className="bg-[#2a362d] border border-[#3d633b]/30 p-4 rounded-2xl">
          <span className="text-[11px] text-purple-400 font-bold uppercase tracking-wider block">Lời Nhắn Khách Hàng</span>
          <p className="font-display text-xl font-bold text-purple-300 mt-1">{unreadMsgCount} mới</p>
          <span className="text-[10px] text-purple-300/70 mt-1 block">Phản hồi góp ý</span>
        </div>
      </div>

      {/* Main Admin Tab Navigation */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 mb-6 border-b border-[#3d633b]/30 pb-3">
        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeAdminTab === 'orders'
              ? 'bg-[#3d633b] text-white shadow-md'
              : 'bg-[#2a362d] text-gray-300 hover:bg-[#3d633b]/40'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Quản Lý Đơn Hàng ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('reservations')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeAdminTab === 'reservations'
              ? 'bg-[#3d633b] text-white shadow-md'
              : 'bg-[#2a362d] text-gray-300 hover:bg-[#3d633b]/40'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Quản Lý Đặt Bàn ({reservations.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('messages')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeAdminTab === 'messages'
              ? 'bg-[#3d633b] text-white shadow-md'
              : 'bg-[#2a362d] text-gray-300 hover:bg-[#3d633b]/40'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Lời Nhắn Khách Hàng {unreadMsgCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px]">{unreadMsgCount}</span>}</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeAdminTab === 'orders' && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Controls: Search & Status Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#2a362d] p-4 rounded-2xl border border-[#3d633b]/30">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn, tên khách, số điện thoại..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1f2721] border border-[#3d633b]/40 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#3d633b]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
              {[
                { id: 'ALL', label: 'Tất Cả' },
                { id: 'MOI', label: '🔴 Đơn Mới' },
                { id: 'XAC_NHAN', label: '🟡 Đã Xác Nhận' },
                { id: 'DANG_GIAO', label: '🔵 Đang Giao' },
                { id: 'HOAN_THANH', label: '🟢 Hoàn Thành' },
                { id: 'HUY', label: '⚪ Đã Hủy' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeFilter === f.id
                      ? 'bg-[#3d633b] text-white shadow-sm'
                      : 'bg-[#1f2721] text-gray-300 hover:bg-[#3d633b]/30'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#2a362d] rounded-2xl border border-[#3d633b]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1f2721] text-gray-400 uppercase tracking-wider text-[10px] border-b border-[#3d633b]/30">
                  <tr>
                    <th className="py-3.5 px-4">Mã Đơn</th>
                    <th className="py-3.5 px-4">Thời Gian</th>
                    <th className="py-3.5 px-4">Khách Hàng & SĐT</th>
                    <th className="py-3.5 px-4">Địa Chỉ Giao</th>
                    <th className="py-3.5 px-4">Chi Tiết Món Trà</th>
                    <th className="py-3.5 px-4">Tổng Tiền</th>
                    <th className="py-3.5 px-4">Thanh Toán</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác Chuyện Đơn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3d633b]/20">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-12 text-gray-400">
                        Không có đơn hàng nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#334237] transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-amber-400">
                          #{order.id}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-gray-400">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-white">{order.customer.fullName}</p>
                          <a href={`tel:${order.customer.phone}`} className="text-[#8fb388] hover:underline flex items-center gap-1 mt-0.5">
                            <PhoneCall className="w-3 h-3" />
                            <span>{order.customer.phone}</span>
                          </a>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <p className="line-clamp-2 text-gray-300">{order.customer.address}</p>
                          {order.customer.notes && (
                            <p className="text-[10px] text-amber-300/80 italic mt-0.5">📝 "{order.customer.notes}"</p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <ul className="space-y-1 max-w-xs">
                            {order.items?.map((it, idx) => (
                              <li key={idx} className="text-[11px]">
                                <strong className="text-white">{it.quantity}x</strong> {it.item?.name} ({it.size?.name})
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                          {formatVND(order.payment?.grandTotal)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="space-y-1.5">
                            <span className={`block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              order.payment?.method === 'momo' ? 'bg-[#a50064]/30 text-pink-300 border border-[#a50064]/40' :
                              order.payment?.method === 'bank' ? 'bg-blue-900/30 text-blue-300 border border-blue-700/40' :
                              'bg-amber-900/30 text-amber-300 border border-amber-700/40'
                            }`}>
                              {order.payment?.method === 'bank' ? '🏦 MB Bank QR' :
                               order.payment?.method === 'momo' ? '👛 MoMo' : '💵 COD'}
                            </span>
                            {/* Payment verification badge */}
                            {order.payment?.isPaid ? (
                              <span className="block px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-900/40 text-green-300 border border-green-600/40">
                                ✅ Đã Nhận Tiền
                                {order.payment?.confirmedAt && (
                                  <span className="block text-[9px] text-green-400/70 mt-0.5">
                                    {new Date(order.payment.confirmedAt).toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'})}
                                  </span>
                                )}
                              </span>
                            ) : order.payment?.method === 'cod' ? (
                              <span className="block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-900/30 text-amber-300 border border-amber-600/40">
                                💵 Thu Khi Giao
                              </span>
                            ) : (
                              <span className="block px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-900/30 text-red-300 border border-red-600/40 animate-pulse">
                                ⏳ Chờ Chuyển Khoản
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'MOI' ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' :
                            order.status === 'XAC_NHAN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            order.status === 'DANG_GIAO' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                            order.status === 'HOAN_THANH' ? 'bg-green-500/20 text-green-300 border border-green-500/40' :
                            'bg-gray-700 text-gray-400'
                          }`}>
                            {order.status === 'MOI' && '🔴 Đơn Mới'}
                            {order.status === 'XAC_NHAN' && '🟡 Đã Xác Nhận'}
                            {order.status === 'DANG_GIAO' && '🔵 Đang Giao'}
                            {order.status === 'HOAN_THANH' && '🟢 Hoàn Thành'}
                            {order.status === 'HUY' && '⚪ Đã Hủy'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex flex-col items-end gap-1.5">
                            {/* Payment confirm button — shown before Chị Linh verifies SePay alert */}
                            {!order.payment?.isPaid && order.payment?.method !== 'cod' && order.status !== 'HUY' && (
                              <button
                                onClick={() => handleConfirmPayment(order.id)}
                                className="px-2.5 py-1 rounded-lg bg-green-700 hover:bg-green-600 text-white font-bold text-[10px] flex items-center gap-1 border border-green-500/40"
                                title="Bấm sau khi SePay/bank báo tiền vào"
                              >
                                ✅ Đã Nhận Tiền
                              </button>
                            )}
                            <div className="flex items-center gap-1.5">
                              {order.status === 'MOI' && (
                                <button
                                  onClick={() => handleStatusChange(order.id, 'XAC_NHAN')}
                                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px]"
                                >
                                  Nhận Đơn
                                </button>
                              )}
                              {order.status === 'XAC_NHAN' && (
                                <button
                                  onClick={() => handleStatusChange(order.id, 'DANG_GIAO')}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px]"
                                >
                                  Giao Trà
                                </button>
                              )}
                              {order.status === 'DANG_GIAO' && (
                                <button
                                  onClick={() => handleStatusChange(order.id, 'HOAN_THANH')}
                                  className="px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-[10px]"
                                >
                                  Hoàn Thành
                                </button>
                              )}
                              {order.status !== 'HOAN_THANH' && order.status !== 'HUY' && (
                                <button
                                  onClick={() => handleStatusChange(order.id, 'HUY')}
                                  className="px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-[10px]"
                                >
                                  Hủy
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESERVATIONS MANAGEMENT */}
      {activeAdminTab === 'reservations' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-[#2a362d] rounded-2xl border border-[#3d633b]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1f2721] text-gray-400 uppercase tracking-wider text-[10px] border-b border-[#3d633b]/30">
                  <tr>
                    <th className="py-3.5 px-4">Mã Đặt Bàn</th>
                    <th className="py-3.5 px-4">Khách Hàng & SĐT</th>
                    <th className="py-3.5 px-4">Lịch Ghé Quán</th>
                    <th className="py-3.5 px-4">Số Khách</th>
                    <th className="py-3.5 px-4">Không Gian Ưa Thích</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4 text-right">Xác Nhận Lịch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3d633b]/20">
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-gray-400">
                        Chưa có lịch đặt bàn nào.
                      </td>
                    </tr>
                  ) : (
                    reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-[#334237] transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-amber-400">
                          #{res.id}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-white">{res.name}</p>
                          <a href={`tel:${res.phone}`} className="text-[#8fb388] hover:underline flex items-center gap-1 mt-0.5">
                            <PhoneCall className="w-3 h-3" />
                            <span>{res.phone}</span>
                          </a>
                        </td>
                        <td className="py-4 px-4 font-bold text-amber-300">
                          📅 {res.date} lúc {res.time}
                        </td>
                        <td className="py-4 px-4 font-bold text-white">
                          👥 {res.guests} Khách
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          ⛩️ {res.roomType}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            res.status === 'CHO_XAC_NHAN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            res.status === 'DA_XAC_NHAN' ? 'bg-green-500/20 text-green-300 border border-green-500/40' :
                            'bg-gray-700 text-gray-400'
                          }`}>
                            {res.status === 'CHO_XAC_NHAN' ? '🟡 Chờ Xác Nhận' : res.status === 'DA_XAC_NHAN' ? '🟢 Đã Xác Nhận' : '⚪ Đã Hủy'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {res.status === 'CHO_XAC_NHAN' && (
                            <button
                              onClick={() => handleResStatusChange(res.id, 'DA_XAC_NHAN')}
                              className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-[10px]"
                            >
                              Giữ Bàn Ngay
                            </button>
                          )}
                          {res.status !== 'DA_HUY' && (
                            <button
                              onClick={() => handleResStatusChange(res.id, 'DA_HUY')}
                              className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-[10px] ml-1.5"
                            >
                              Hủy
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER MESSAGES */}
      {activeAdminTab === 'messages' && (
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-400 bg-[#2a362d] rounded-2xl">
                Chưa có lời nhắn nào từ khách hàng.
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`p-4 rounded-2xl border transition-all ${
                  msg.isRead ? 'bg-[#2a362d] border-[#3d633b]/20 text-gray-300' : 'bg-[#334237] border-purple-500/50 text-white shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold">Mới</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-xs leading-relaxed italic bg-[#1f2721]/50 p-3 rounded-xl border border-white/5 mb-3">
                    "{msg.message}"
                  </p>
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkMsgRead(msg.id)}
                      className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-[10px] font-bold flex items-center gap-1 ml-auto"
                    >
                      <Check className="w-3 h-3" />
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CONFIG MODAL */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#2a362d] border border-[#3d633b]/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3d633b]/40">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#8fb388]" />
                Cấu Hình Báo Đơn Tự Động
              </h3>
              <button onClick={() => setIsConfigOpen(false)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Số Điện Thoại Chủ Quán (Chị Linh)</label>
                <input
                  type="text"
                  value={shopConfig.ownerPhone}
                  onChange={(e) => setShopConfigState({ ...shopConfig, ownerPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#1f2721] border border-[#3d633b]/40 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Telegram Bot Token (Miễn phí)</label>
                <input
                  type="text"
                  value={shopConfig.notifyTelegramBotToken || ''}
                  onChange={(e) => setShopConfigState({ ...shopConfig, notifyTelegramBotToken: e.target.value })}
                  placeholder="Ví dụ: 789123456:AAFxYz..."
                  className="w-full px-3 py-2 rounded-xl bg-[#1f2721] border border-[#3d633b]/40 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Telegram Chat ID (Điện thoại Chị Linh)</label>
                <input
                  type="text"
                  value={shopConfig.notifyTelegramChatId || ''}
                  onChange={(e) => setShopConfigState({ ...shopConfig, notifyTelegramChatId: e.target.value })}
                  placeholder="Ví dụ: 987654321"
                  className="w-full px-3 py-2 rounded-xl bg-[#1f2721] border border-[#3d633b]/40 text-white font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 border-t border-[#3d633b]/30 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={testFreeNotification}
                  className="py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold"
                >
                  🔔 Test Chuông & Tin Nhắn
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#3d633b] hover:bg-green-600 text-white font-bold"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
