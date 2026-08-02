// Real-Time Order, Reservation & Message Management Engine
// Compliant with Vietnam Data Protection Regulations (Luật số 91/2025/QH15 & NĐ 356/2025/NĐ-CP)

const STORAGE_KEY = 'AN_NHIEN_ORDERS_LEDGER_V1';
const RESERVATIONS_KEY = 'AN_NHIEN_RESERVATIONS_LEDGER_V1';
const MESSAGES_KEY = 'AN_NHIEN_MESSAGES_LEDGER_V1';
const CONFIG_KEY = 'AN_NHIEN_SHOP_CONFIG_V1';

// Default Owner Configuration — @TradaoLinhbot (Bryant/Chị Linh)
export const defaultShopConfig = {
  ownerName: 'Chị Linh',
  ownerPhone: '0585596789',
  shopAddress: 'Chung cư Valeo Đầm Sen, 318/5 Trịnh Đình Trọng, P. Hòa Thạnh, Q. Tân Phú, TP.HCM',
  notifyTelegramBotToken: '***TELEGRAM_TOKEN_REVOKED***',
  notifyTelegramChatId: '7946238337',
  enableSoundAlert: true,
  enableAutoNotify: true
};

export function getShopConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? { ...defaultShopConfig, ...JSON.parse(saved) } : defaultShopConfig;
  } catch (e) {
    return defaultShopConfig;
  }
}

export function saveShopConfig(config) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving shop config:', e);
  }
}

/* ────────────────────────────────────────────────────
   ORDERS LEDGER SERVICE
──────────────────────────────────────────────────── */

export function getOrders() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getInitialMockOrders();
    return JSON.parse(data);
  } catch (e) {
    return getInitialMockOrders();
  }
}

export function saveOrder(newOrderData) {
  const currentOrders = getOrders();
  const shopConfig = getShopConfig();

  const newOrder = {
    id: 'AN' + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toISOString(),
    status: 'MOI', // MOI, XAC_NHAN, DANG_GIAO, HOAN_THANH, HUY
    items: newOrderData.cartItems,
    customer: {
      fullName: newOrderData.fullName,
      phone: newOrderData.phone,
      address: newOrderData.address,
      notes: newOrderData.notes || ''
    },
    payment: {
      method: newOrderData.paymentMethod, // momo, bank, cod
      // isPaid: false until owner manually confirms receipt (bank/momo)
      // COD: pending until delivery
      isPaid: false,
      paymentStatus: newOrderData.paymentMethod === 'cod' ? 'cod_pending' : 'waiting_transfer',
      grandTotal: newOrderData.totals.grandTotal,
      subtotal: newOrderData.totals.subtotal,
      discount: newOrderData.totals.discount,
      shippingFee: newOrderData.totals.shippingFee
    },
    ownerAlertPhone: shopConfig.ownerPhone || '0585596789',
    notifiedFreeChannel: 'Telegram @TradaoLinhbot + SePay biến động số dư'
  };

  const updatedOrders = [newOrder, ...currentOrders];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));

  // Dispatch custom browser event for live UI update across tabs
  window.dispatchEvent(new CustomEvent('new_order_placed', { detail: newOrder }));

  // Send zero-cost notification to owner phone (0585596789)
  sendFreeNotificationToOwner(newOrder, shopConfig);

  return newOrder;
}

export function updateOrderStatus(orderId, newStatus) {
  const currentOrders = getOrders();
  const updated = currentOrders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
    }
    return order;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('order_status_updated', { detail: { orderId, newStatus } }));
  return updated;
}

// Chị Linh bấm xác nhận đã nhận tiền từ SePay/bank alert
export function confirmPaymentReceived(orderId) {
  const currentOrders = getOrders();
  const updated = currentOrders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        payment: {
          ...order.payment,
          isPaid: true,
          paymentStatus: 'confirmed',
          confirmedAt: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      };
    }
    return order;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('order_payment_confirmed', { detail: { orderId } }));
  return updated;
}

export function searchOrders(query) {
  if (!query) return [];
  const q = query.trim().toLowerCase();
  const allOrders = getOrders();
  return allOrders.filter(o =>
    o.id.toLowerCase().includes(q) ||
    o.customer.phone.includes(q) ||
    o.customer.fullName.toLowerCase().includes(q)
  );
}

/* ────────────────────────────────────────────────────
   RESERVATIONS LEDGER SERVICE
──────────────────────────────────────────────────── */

export function getReservations() {
  try {
    const data = localStorage.getItem(RESERVATIONS_KEY);
    if (!data) return getInitialMockReservations();
    return JSON.parse(data);
  } catch (e) {
    return getInitialMockReservations();
  }
}

export function saveReservation(reservationData) {
  const currentReservations = getReservations();
  const shopConfig = getShopConfig();

  const newReservation = {
    id: 'RES' + Math.floor(10000 + Math.random() * 90000),
    createdAt: new Date().toISOString(),
    status: 'CHO_XAC_NHAN', // CHO_XAC_NHAN, DA_XAC_NHAN, DA_HUY
    name: reservationData.name,
    phone: reservationData.phone,
    date: reservationData.date,
    time: reservationData.time,
    guests: reservationData.guests,
    roomType: reservationData.roomType,
    ownerAlertPhone: shopConfig.ownerPhone || '0585596789'
  };

  const updated = [newReservation, ...currentReservations];
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));

  window.dispatchEvent(new CustomEvent('new_reservation_placed', { detail: newReservation }));

  sendFreeReservationNotificationToOwner(newReservation, shopConfig);

  return newReservation;
}

export function updateReservationStatus(resId, newStatus) {
  const current = getReservations();
  const updated = current.map(r => r.id === resId ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r);
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('reservation_status_updated', { detail: { resId, newStatus } }));
  return updated;
}

/* ────────────────────────────────────────────────────
   CONTACT MESSAGES LEDGER SERVICE
──────────────────────────────────────────────────── */

export function getContactMessages() {
  try {
    const data = localStorage.getItem(MESSAGES_KEY);
    if (!data) return getInitialMockMessages();
    return JSON.parse(data);
  } catch (e) {
    return getInitialMockMessages();
  }
}

export function saveContactMessage(msgData) {
  const current = getContactMessages();
  const newMsg = {
    id: 'MSG' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    name: msgData.name,
    message: msgData.message,
    isRead: false
  };
  const updated = [newMsg, ...current];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('new_contact_message', { detail: newMsg }));
  return newMsg;
}

export function markMessageRead(msgId) {
  const current = getContactMessages();
  const updated = current.map(m => m.id === msgId ? { ...m, isRead: true } : m);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  return updated;
}

/* ────────────────────────────────────────────────────
   NOTIFICATIONS SERVICE
──────────────────────────────────────────────────── */

export function sendFreeNotificationToOwner(order, shopConfig) {
  const phoneTarget = shopConfig.ownerPhone || '0585596789';
  const fmtVND = (v) => new Intl.NumberFormat('vi-VN').format(v) + 'd';
  const fmtDate = (iso) => { const d = new Date(iso); return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString('vi-VN'); };
  const payLabel = { momo: 'Vi MoMo', bank: 'MB Bank QR (0888999911)', cod: 'Tien Mat (COD)' };
  const paidLabel = order.payment.isPaid ? 'DA THANH TOAN' : 'CHUA THANH TOAN';

  const itemLines = (order.items || []).map((it, i) =>
    `  ${i + 1}. ${it.quantity}x ${it.item?.name || '?'} (${it.size?.name || ''}) - ${fmtVND(it.totalPrice)}`
  ).join('\n');

  const msg = [
    '🚨 DON HANG MOI — AN NHIEN TRA QUAN',
    '===========================',
    `Don: #${order.id} | ${fmtDate(order.createdAt)}`,
    '===========================',
    `Khach: ${order.customer.fullName}`,
    `SDT: ${order.customer.phone}`,
    `Giao den: ${order.customer.address}`,
    order.customer.notes ? `Ghi chu: ${order.customer.notes}` : null,
    '===========================',
    'Mon da dat:',
    itemLines,
    '===========================',
    `Tong tien: ${fmtVND(order.payment.grandTotal)}`,
    `Thanh toan: ${payLabel[order.payment.method] || order.payment.method} — ${paidLabel}`,
    '===========================',
    `Chu quan: ${shopConfig.ownerName || 'Chi Linh'} (${phoneTarget})`,
    '👉 Quan ly: https://drthienlongfacs-hub.github.io/zen-tea-website/'
  ].filter(Boolean).join('\n');

  console.log('--- TELEGRAM NOTIFICATION DISPATCHED ---');
  console.log(msg);

  if (shopConfig.notifyTelegramBotToken && shopConfig.notifyTelegramChatId) {
    fetch(`https://api.telegram.org/bot${shopConfig.notifyTelegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: shopConfig.notifyTelegramChatId,
        text: msg
      })
    }).catch(err => console.error('Telegram order notification error:', err));
  }

  if (shopConfig.enableSoundAlert) {
    playNewOrderBellSound();
  }
}

export function sendFreeReservationNotificationToOwner(reservation, shopConfig) {
  const phoneTarget = shopConfig.ownerPhone || '0585596789';

  const msg = [
    '📅 DAT BAN MOI — AN NHIEN TRA QUAN',
    '===========================',
    `Ma dat ban: #${reservation.id}`,
    '===========================',
    `Khach: ${reservation.name}`,
    `SDT: ${reservation.phone}`,
    `Ngay ghe: ${reservation.date} luc ${reservation.time}`,
    `So khach: ${reservation.guests} nguoi`,
    `Khong gian: ${reservation.roomType}`,
    '===========================',
    `Chu quan: ${shopConfig.ownerName || 'Chi Linh'} (${phoneTarget})`,
    '👉 Xac nhan ban: https://drthienlongfacs-hub.github.io/zen-tea-website/'
  ].join('\n');

  console.log('--- TELEGRAM RESERVATION NOTIFICATION ---');
  console.log(msg);

  if (shopConfig.notifyTelegramBotToken && shopConfig.notifyTelegramChatId) {
    fetch(`https://api.telegram.org/bot${shopConfig.notifyTelegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: shopConfig.notifyTelegramChatId,
        text: msg
      })
    }).catch(err => console.error('Telegram reservation notification error:', err));
  }

  if (shopConfig.enableSoundAlert) {
    playNewOrderBellSound();
  }
}

export function playNewOrderBellSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    
    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.frequency.setValueAtTime(880, now); // A5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Tone 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.frequency.setValueAtTime(1174.66, now + 0.2); // D6
    gain2.gain.setValueAtTime(0.4, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 1.0);
  } catch (e) {
    console.error('Audio alert error:', e);
  }
}

/* ────────────────────────────────────────────────────
   INITIAL MOCK DATA
──────────────────────────────────────────────────── */

function getInitialMockOrders() {
  return [
    {
      id: 'AN859210',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'MOI',
      items: [
        {
          item: { name: 'Uji Matcha Ceremonial Latte' },
          size: { name: 'Lớn (L)' },
          sweetness: '50% Ngọt Dịu',
          ice: 'Ít Đá',
          toppings: [{ name: 'Kem Béo Matcha Foamy' }],
          quantity: 2,
          totalPrice: 160000
        }
      ],
      customer: {
        fullName: 'Trần Hoàng Nam',
        phone: '0988123456',
        address: 'Block A - Chung cư Valeo Đầm Sen, 318/5 Trịnh Đình Trọng, P. Hòa Thạnh, Q. Tân Phú, TP.HCM',
        notes: 'Giao lên tầng 8 giúp mình để trà giữ foam mịn nhé!'
      },
      payment: {
        method: 'momo',
        isPaid: true,
        grandTotal: 160000,
        subtotal: 160000,
        discount: 0,
        shippingFee: 0
      },
      ownerAlertPhone: '0585596789'
    },
    {
      id: 'AN748192',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'XAC_NHAN',
      items: [
        {
          item: { name: 'Hojicha Roasted Coconut Latte' },
          size: { name: 'Vừa (M)' },
          sweetness: '50% Ngọt Dịu',
          ice: 'Ít Đá',
          toppings: [],
          quantity: 1,
          totalPrice: 65000
        },
        {
          item: { name: 'Bánh Mochi Matcha Nhân Đậu Đỏ' },
          size: { name: '1 Phần (2 Bánh)' },
          sweetness: 'Chuẩn Quán',
          ice: 'N/A',
          toppings: [],
          quantity: 1,
          totalPrice: 35000
        }
      ],
      customer: {
        fullName: 'Lê Thu Hương',
        phone: '0912345678',
        address: 'Số 45 Lạc Long Quân, Phường 3, Quận 11, TP.HCM',
        notes: ''
      },
      payment: {
        method: 'cod',
        isPaid: false,
        grandTotal: 120000,
        subtotal: 100000,
        discount: 0,
        shippingFee: 20000
      },
      ownerAlertPhone: '0585596789'
    }
  ];
}

function getInitialMockReservations() {
  return [
    {
      id: 'RES91823',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'DA_XAC_NHAN',
      name: 'Nguyễn Văn Minh',
      phone: '0903123456',
      date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      time: '14:00',
      guests: 4,
      roomType: 'Phòng Trà Tĩnh Lặng (Ấm cúng, thiền định)',
      ownerAlertPhone: '0585596789'
    }
  ];
}

function getInitialMockMessages() {
  return [
    {
      id: 'MSG101',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      name: 'Phạm Thanh Thảo',
      message: 'Quán có trà Uji Matcha dùng sữa hạt yến mạch không ạ? Mình dị ứng sữa bò.',
      isRead: false
    }
  ];
}
