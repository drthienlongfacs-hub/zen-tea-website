import React from 'react';
import { X, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export default function PolicyModal({ type, isOpen, onClose }) {
  if (!isOpen || !type) return null;

  const policyData = {
    privacy: {
      title: 'Chính Sách Bảo Mật Thông Tin',
      icon: <ShieldCheck className="w-6 h-6 text-[#3d633b]" />,
      content: `1. MỤC ĐÍCH THU THẬP THÔNG TIN
An Nhiên Trà Quán chỉ thu thập các thông tin cá nhân tối thiểu bao gồm: Họ tên, Số điện thoại, Địa chỉ giao trà nhằm mục đích phục vụ xử lý đơn hàng và giao trà tận nơi cho quý khách. Không thu thập thông tin vượt quá mục đích cần thiết.

2. CƠ SỞ PHÁP LÝ
Việc thu thập và xử lý thông tin cá nhân tuân theo Luật Bảo Vệ Dữ Liệu Cá Nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP của Chính phủ nước CHXHCN Việt Nam.

3. PHẠM VI SỬ DỤNG THÔNG TIN
Thông tin cá nhân của quý khách được bảo mật tuyệt đối. Chúng tôi cam kết KHÔNG chia sẻ, bán hoặc trao đổi thông tin cho bên thứ ba vì bất kỳ mục đích thương mại nào, trừ khi có yêu cầu của cơ quan nhà nước có thẩm quyền.

4. QUYỀN CỦA CHỦ THỂ DỮ LIỆU
Quý khách có quyền: Xem lại thông tin đã cung cấp; Yêu cầu chỉnh sửa thông tin sai; Yêu cầu xóa dữ liệu cá nhân. Liên hệ: 0585596789 để thực hiện các quyền này.

5. THỜI GIAN LƯU TRỮ
Dữ liệu đơn hàng được lưu trữ không quá 24 tháng kể từ ngày giao dịch cuối cùng, sau đó sẽ được xóa hoàn toàn theo đúng quy định pháp luật.`
    },
    refund: {
      title: 'Chính Sách Đổi Trả & Hoàn Tiền',
      icon: <RefreshCw className="w-6 h-6 text-[#3d633b]" />,
      content: `1. ĐIỀU KIỆN ĐỔI TRẢ
- Trà hoặc đồ uống giao đến bị rách seal, đổ vỡ hoặc sai loại món do lỗi người pha chế.
- Sản phẩm trà cụ / dụng cụ bị nứt vỡ trong quá trình vận chuyển.

2. THỜI GIAN ĐỔI TRẢ
Quý khách vui lòng thông báo cho hotline 0973 420 316 trong vòng 24h kể từ khi nhận hàng. Quán sẽ lập tức pha chế ly mới hoặc hoàn 100% tiền qua MoMo / Chuyển khoản trong vòng 15 phút.`
    },
    shipping: {
      title: 'Chính Sách Giao Nhận & Kiểm Hàng',
      icon: <Truck className="w-6 h-6 text-[#3d633b]" />,
      content: `1. PHẠM VI & THỜI GIAN GIAO HÀNG
An Nhiên Trà Quán phục vụ giao trà tận nơi trong bán kính 10km tại Hà Nội. Thời gian giao hàng từ 15 đến 35 phút để đảm bảo lớp bọt foam Matcha giữ nguyên độ tươi mịn.

2. PHÍ GIAO HÀNG
- Đơn hàng dưới 150.000đ: Phí ship đồng giá 20.000đ.
- Đơn hàng từ 150.000đ trở lên: MIỄN PHÍ GIAO HÀNG.

3. QUYỀN ĐƯỢC KIỂM HÀNG
Quý khách được quyền mở kiểm tra ly trà và quà tặng trước khi thanh toán cho shipper.`
    },
    payment: {
      title: 'Phương Thức Thanh Toán',
      icon: <CreditCard className="w-6 h-6 text-[#3d633b]" />,
      content: `An Nhiên Trà Quán chấp nhận các hình thức thanh toán linh hoạt:
1. Thanh toán tiền mặt khi nhận trà (COD).
2. Thanh toán qua Ví Điện Tử MoMo bằng quét mã QR tự động.
3. Chuyển khoản ngân hàng qua VietQR (Tự động xác nhận đơn hàng sau 10s).`
    }
  };

  const current = policyData[type] || policyData.privacy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f7f4ef] border border-[#7c674e]/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7c674e] hover:text-[#1f2721] rounded-full bg-[#ece3d7]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#7c674e]/15">
          <div className="p-3 rounded-2xl bg-[#e2ebe0]">
            {current.icon}
          </div>
          <h3 className="font-serif-zen text-xl font-bold text-[#1f2721]">
            {current.title}
          </h3>
        </div>

        <div className="text-xs text-[#1f2721] leading-relaxed whitespace-pre-line font-light bg-[#fcfbfa] p-4 rounded-2xl border border-[#7c674e]/15 max-h-[60vh] overflow-y-auto">
          {current.content}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-2xl bg-[#3d633b] text-white font-semibold text-sm hover:bg-[#254124] transition-colors shadow-md"
        >
          Đã Hiểu
        </button>

      </div>
    </div>
  );
}
