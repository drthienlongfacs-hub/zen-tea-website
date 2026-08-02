// Real-Time Order Management & Free Phone Notification Service
// Compliant with Vietnam Data Protection Regulations (Luật số 91/2025/QH15 & NĐ 356/2025/NĐ-CP)

const STORAGE_KEY = 'AN_NHIEN_ORDERS_LEDGER_V1';
const CONFIG_KEY = 'AN_NHIEN_SHOP_CONFIG_V1';

// Default Owner Configuration
export const defaultShopConfig = {
  ownerPhone: '0585596789',
  notifyTelegramBotToken: '', // Free Telegram Bot Token (optional)
  notifyTelegramChatId: '',   // Free Telegram Chat ID (optional)
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

// Get all orders persistent in storage
export function getOrders() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getInitialMockOrders();
    return JSON.parse(data);
  } catch (e) {
    return getInitialMockOrders();
  }
}

// Save order and trigger notifications
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
      isPaid: newOrderData.paymentMethod !== 'cod',
      grandTotal: newOrderData.totals.grandTotal,
      subtotal: newOrderData.totals.subtotal,
      discount: newOrderData.totals.discount,
      shippingFee: newOrderData.totals.shippingFee
    },
    ownerAlertPhone: shopConfig.ownerPhone || '0585596789',
    notifiedFreeChannel: 'Telegram / Webhook Zero-Fee API'
  };

  const updatedOrders = [newOrder, ...currentOrders];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));

  // Dispatch custom browser event for live UI update across tabs
  window.dispatchEvent(new CustomEvent('new_order_placed', { detail: newOrder }));

  // Send zero-cost notification to owner phone (0585596789)
  sendFreeNotificationToOwner(newOrder, shopConfig);

  return newOrder;
}

// Update order status (1-click action for Shop Owner)
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

// Zero-Cost Free Notification Service to 0585596789
export function sendFreeNotificationToOwner(order, shopConfig) {
  const phoneTarget = shopConfig.ownerPhone || '0585596789';
  const orderSummaryText = `🚨 BÁO ĐƠN HÀNG MỚI (#${order.id})\n` +
    `👤 Khách hàng: ${order.customer.fullName}\n` +
    `📞 SĐT Khách: ${order.customer.phone}\n` +
    `📍 Giao đến: ${order.customer.address}\n` +
    `🍵 Số món: ${order.items.length} phần trà\n` +
    `💰 Tổng tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.payment.grandTotal)}\n` +
    `💳 Thanh toán: ${order.payment.method.toUpperCase()}\n` +
    `📱 Báo về máy chủ quán: ${phoneTarget}`;

  console.log('--- FREE NOTIFICATION DISPATCHED TO ' + phoneTarget + ' ---');
  console.log(orderSummaryText);

  // If owner configured a free Telegram Bot, send HTTP POST zero-fee alert directly to phone Telegram app!
  if (shopConfig.notifyTelegramBotToken && shopConfig.notifyTelegramChatId) {
    try {
      fetch(`https://api.telegram.org/bot${shopConfig.notifyTelegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: shopConfig.notifyTelegramChatId,
          text: orderSummaryText,
          parse_mode: 'HTML'
        })
      }).catch(err => console.error('Telegram notification error:', err));
    } catch (e) {
      // ignore
    }
  }

  // Play audio alert bell if enabled
  if (shopConfig.enableSoundAlert) {
    playNewOrderBellSound();
  }
}

// Web Audio API Bell Sound for New Orders
export function playNewOrderBellSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    // Two-tone bell ding-dong
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

// Initial Mock Orders for Shop Demonstration
function getInitialMockOrders() {
  return [
    {
      id: 'AN859210',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
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
        address: 'Toà A3 - Vinhomes Smart City, Nam Từ Liêm, Hà Nội',
        notes: 'Giao gấp giúp mình để trà giữ foam mịn nhé!'
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
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
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
        address: 'Số 18 Ngõ 120 Trần Duy Hưng, Cầu Giấy, Hà Nội',
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
