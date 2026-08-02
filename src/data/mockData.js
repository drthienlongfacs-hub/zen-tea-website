export const MENU_CATEGORIES = [
  { id: 'all', name: 'Tất Cả Món' },
  { id: 'matcha', name: '🍵 Uji Matcha & Hojicha' },
  { id: 'herbal', name: '🫖 Trà Thảo Mộc Thiền' },
  { id: 'sweets', name: '🍡 Bánh Trà & Đồ Nhắm Zen' },
  { id: 'gift', name: '🎁 Bộ Quà Tặng Trà Đạo' },
];

export const MENU_ITEMS = [
  {
    id: 'm1',
    name: 'Uji Matcha Ceremonial Latte',
    jpName: '宇治抹茶ラテ',
    category: 'matcha',
    price: 68000,
    rating: 4.9,
    reviewsCount: 128,
    tag: 'Chuẩn Uji - Bán Chạy',
    desc: 'Bột Matcha nghiền thủ công cối đá tại Kyoto, kết hợp sữa tươi nguyên kem béo ngậy. Hương vị chát nhẹ ngọt hậu thanh khiết.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800',
    prepTime: '5 phút',
    sizes: [
      { name: 'Vừa (M)', price: 0 },
      { name: 'Lớn (L)', price: 12000 }
    ],
    toppings: [
      { id: 't1', name: 'Kem Béo Matcha Foamy', price: 15000 },
      { id: 't2', name: 'Mochi Trà Xanh Dẻo', price: 12000 },
      { id: 't3', name: 'Trân Châu Trắng Thủy Tinh', price: 10000 }
    ]
  },
  {
    id: 'm2',
    name: 'Hojicha Roasted Coconut Latte',
    jpName: 'ほうじ茶ラテ',
    category: 'matcha',
    price: 65000,
    rating: 4.8,
    reviewsCount: 94,
    tag: 'Đậm Vị Răng Ấm',
    desc: 'Trà xanh Nhật Bản rang cháy thơm nức mùi gỗ phong và caramel, quyện nước cốt dừa tươi Bến Tre thanh mát.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    prepTime: '6 phút',
    sizes: [
      { name: 'Vừa (M)', price: 0 },
      { name: 'Lớn (L)', price: 12000 }
    ],
    toppings: [
      { id: 't1', name: 'Kem Béo Matcha Foamy', price: 15000 },
      { id: 't2', name: 'Mochi Trà Xanh Dẻo', price: 12000 }
    ]
  },
  {
    id: 'm3',
    name: 'Matcha Cold Brew Mật Ong Hoa Rừng',
    jpName: '水出し抹茶',
    category: 'matcha',
    price: 58000,
    rating: 4.9,
    reviewsCount: 76,
    tag: 'Thanh Lọc Thể Chái',
    desc: 'Matcha Uji ủ lạnh 12h kết hợp mật ong rừng Sơn La & chanh vàng sấy dẻo. Giúp tỉnh thức nhẹ nhàng không gây ép tim.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
    prepTime: '3 phút',
    sizes: [
      { name: 'Vừa (M)', price: 0 },
      { name: 'Lớn (L)', price: 10000 }
    ],
    toppings: []
  },
  {
    id: 'h1',
    name: 'Trà Tuyết Cúc Tây Tạng Thiền Định',
    jpName: '雪菊茶',
    category: 'herbal',
    price: 72000,
    rating: 5.0,
    reviewsCount: 110,
    tag: 'An Thần Ngủ Ngon',
    desc: 'Bông cúc tuyết mọc ở độ cao 3000m núi Côn Lôn, ủ ấm cùng kỷ tử hữu cơ, táo đỏ Tân Cương và cỏ ngọt. Giảm căng thẳng tuyệt đối.',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800',
    prepTime: '7 phút',
    sizes: [{ name: 'Ấm Thưởng Trà (2-3 người)', price: 0 }],
    toppings: []
  },
  {
    id: 'h2',
    name: 'Trà Bạc Hà Dưỡng Tâm Long Nhãn',
    jpName: 'ミント龍眼茶',
    category: 'herbal',
    price: 62000,
    rating: 4.7,
    reviewsCount: 53,
    tag: 'Tĩnh Tâm Làm Việc',
    desc: 'Bạc hà tươi hái tại vườn kết hợp long nhãn Hưng Yên bọc hạt sen sấy thơm phức. Thích hợp cho giờ đọc sách & thiền định.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    prepTime: '5 phút',
    sizes: [{ name: 'Vừa (M)', price: 0 }],
    toppings: []
  },
  {
    id: 's1',
    name: 'Bánh Mochi Matcha Nhân Đậu Đỏ Chasen',
    jpName: '抹茶大福',
    category: 'sweets',
    price: 35000,
    rating: 4.9,
    reviewsCount: 142,
    tag: 'Tự Làm Hàng Ngày',
    desc: 'Vỏ mochi dẻo mềm phủ bột matcha tươi, nhân đậu đỏ Azuki ninh nhuyễn ngọt dịu vừa phải. Ăn kèm khi thưởng trà.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800',
    prepTime: 'Sẵn sàng',
    sizes: [{ name: '1 Phần (2 Bánh)', price: 0 }],
    toppings: []
  },
  {
    id: 's2',
    name: 'Hạt Sen Huế Sấy Giòn Mật Ống',
    jpName: '蓮の実',
    category: 'sweets',
    price: 45000,
    rating: 4.8,
    reviewsCount: 88,
    tag: 'Món Nhắm Trà',
    desc: 'Hạt sen hồ Tịnh Tâm nướng giòn tơi, tẩm vị muối hồng Himalaya & dừa tươi. Giòn tan, bùi béo.',
    image: 'https://images.unsplash.com/photo-1608797178974-15b35a6405bb?auto=format&fit=crop&q=80&w=800',
    prepTime: 'Sẵn sàng',
    sizes: [{ name: 'Hũ 150g', price: 0 }],
    toppings: []
  },
  {
    id: 'g1',
    name: 'Bộ Trà Cụ Matcha Uji Wabi-Sabi Premium',
    jpName: '茶道具セット',
    category: 'gift',
    price: 450000,
    rating: 5.0,
    reviewsCount: 64,
    tag: 'Trà Cụ Độc Quyền',
    desc: 'Bao gồm: Chổi tre Chasen 100 răng, Bát gốm Chawan nung thủ công, Muỗng gạt bamboo Chashaku, Đô gốm đỡ chổi & 30g Uji Matcha.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
    prepTime: 'Đóng gói quà',
    sizes: [{ name: 'Hộp Quà Gỗ Thông', price: 0 }],
    toppings: []
  }
];

export const BLOG_ARTICLES = [
  {
    id: 'b1',
    title: 'Pha Một Ly Matcha Thư Thái: Khi Chổi Tre Chasen Chạm Vào Lòng Tĩnh Lặng',
    subtitle: 'Nghệ thuật thưởng thức trà không chỉ ở hương vị mà ở từng giây phút bạn chậm lại.',
    date: '02 Tháng 8, 2026',
    author: 'An Nhiên',
    readTime: '4 phút đọc',
    category: 'Nghệ Thuật Trà Đạo',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800',
    content: `Có những buổi sáng thành phố vội vã, mình chọn thức dậy sớm hơn 15 phút. Chỉ để đun một ấm nước sôi 80 độ, xúc hai muỗng bột Matcha xanh mướt vào bát gốm Chawan.

Khi chiếc chổi tre Chasen xoay tròn theo hình chữ W, lớp bọt mịn màng nổi lên như làn mây nhẹ. Mùi cỏ tươi thanh khiết lan tỏa khắp căn phòng nhỏ. Khoảnh khắc ấy, mọi lo toan về công việc dường như tan biến.

Thưởng trà không phải là điều gì quá xa xỉ. Đơn giản là việc bạn cho phép tâm trí mình có một khoảng nghỉ, hiện diện trọn vẹn với hơi thở và cảm nhận sự ấm áp của chén trà trong lòng bàn tay.`
  },
  {
    id: 'b2',
    title: 'Thiền Trà (Chado Meditation) — Phương Pháp Chữa Lành Tâm Trí Sau Giờ Làm',
    subtitle: 'Làm sao để giải tỏa áp lực công việc chỉ với 10 phút ngồi yên bên góc trà?',
    date: '28 Tháng 7, 2026',
    author: 'An Nhiên',
    readTime: '6 phút đọc',
    category: 'Sống Chậm & Thiền',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
    content: `Người ta thường nghĩ thiền là phải ngồi xếp bằng hàng giờ liền trên tọa cụ. Nhưng trong triết lý Trà Đạo Nhật Bản, "Nhất Kỳ Nhất Hội" (Ichigo Ichie) nhắc nhở chúng ta rằng mỗi buổi trà là một cơ duyên duy nhất trong đời.

Khi uống trà thiền, bạn hãy thử:
1. Nhìn vào màu sắc của nước trà.
2. Ngửi làn hương trầm dịu nhẹ quyện hương lá trà.
3. Cảm nhận hơi ấm truyền từ tách sứ qua các ngón tay.
4. Nhấp từng ngụm nhỏ, để vị chát thanh dịu biến thành vị ngọt hậu sâu lắng.

Đó chính là lúc năng lượng chữa lành tự nhiên hoạt động.`
  },
  {
    id: 'b3',
    title: 'Bí Quyết Chọn Trà Hojicha Chuẩn Vị Cho Người Nhạy Cảm Với Caffeine',
    subtitle: 'Tất tần tật về loại trà rang nức tiếng thơm dịu và cực kỳ êm bụng.',
    date: '20 Tháng 7, 2026',
    author: 'An Nhiên',
    readTime: '5 phút đọc',
    category: 'Bí Kíp Trà Đạo',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    content: `Nếu bạn rất yêu trà nhưng lại lo sợ bị mất ngủ hoặc cào ruột khi uống vào ban chiều, Hojicha chính là người bạn đồng hành hoàn hảo nhất.

Hojicha được chế biến bằng cách rang lá trà xanh trên lò than củi ở nhiệt độ cao. Quá trình này giúp giảm bớt hàm lượng caffeine và tannin, tạo nên sắc trà nâu hổ phách nức mùi thơm của gỗ nướng và caramel ngọt ngào.`
  }
];

export const ZEN_ITEMS = [
  {
    id: 'z1',
    title: 'Chổi Tre Chasen 100 Răng Thủ Công Kyoto',
    desc: 'Được vót thủ công từ tre già 3 năm, bọt matcha tan mịn màng như mây.',
    price: 185000,
    shopeeUrl: 'https://shopee.vn',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600',
    tag: 'Đồ Cần Có'
  },
  {
    id: 'z2',
    title: 'Bát Trà Chawan Gốm Men Hỏa Biến Wabi-Sabi',
    desc: 'Mỗi chiếc bát là một bản thể duy nhất với đường men chảy ngẫu nhiên tuyệt đẹp.',
    price: 240000,
    shopeeUrl: 'https://shopee.vn',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600',
    tag: 'Gốm Thủ Công'
  },
  {
    id: 'z3',
    title: 'Nến Thơm Gỗ Đàn Hương & Matcha Tĩnh Tâm',
    desc: 'Sáp đậu nành thiên nhiên tỏa hương dịu nhẹ, giúp thư giãn tinh thần.',
    price: 165000,
    shopeeUrl: 'https://shopee.vn',
    image: 'https://images.unsplash.com/photo-1608797178974-15b35a6405bb?auto=format&fit=crop&q=80&w=600',
    tag: 'Relax'
  },
  {
    id: 'z4',
    title: 'Chuông Xoay Tây Tạng Sing Bowl Chữa Lành 10cm',
    desc: 'Tần số âm thanh 432Hz xua tan năng lượng tiêu cực, hỗ trợ thiền định sâu.',
    price: 320000,
    shopeeUrl: 'https://shopee.vn',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
    tag: 'Thiền Định'
  }
];

export const RECIPES = [
  {
    id: 'r1',
    title: 'Công Thức Uji Matcha Coco Latte "Mây Tĩnh Lặng"',
    difficulty: 'Dễ làm',
    time: '5 phút',
    ingredients: [
      '3g Bột Uji Matcha Thượng Hạng',
      '50ml Nước ấm (80°C)',
      '120ml Nước cốt dừa tươi thanh nhẹ',
      '15ml Mật ong rừng hoặc siro phong',
      'Đá viên lạnh (Tùy chọn)'
    ],
    steps: [
      'Bước 1: Rây 3g bột Matcha qua lưới vào bát gốm Chawan.',
      'Bước 2: Rót 50ml nước ấm (80°C). Dùng chổi Chasen đánh phẩy nhanh tay theo hình chữ W trong 30 giây đến khi tạo lớp bọt mịn.',
      'Bước 3: Cho nước cốt dừa và mật ong vào ly, khuấy đều cùng đá.',
      'Bước 4: Rót từ từ lớp Matcha mịn màng lên trên cùng để tạo tầng mây xanh tuyệt đẹp.'
    ],
    proTip: 'Không dùng nước quá sôi (100°C) sẽ làm matcha bị đắng chát quá mức!'
  },
  {
    id: 'r2',
    title: 'Trà Tuyết Cúc Ủ Lạnh (Cold Brew Herbal Tea)',
    difficulty: 'Rất dễ',
    time: ' Ủ 8 tiếng',
    ingredients: [
      '10 Bông Tuyết Cúc Tây Tạng',
      '5 Trái Kỷ tử đỏ',
      '500ml Nước khoáng tinh khiết'
    ],
    steps: [
      'Bước 1: Tráng nhẹ hoa cúc và kỷ tử bằng nước ấm sạch.',
      'Bước 2: Cho nguyên liệu vào bình thủy tinh 500ml, rót nước khoáng lạnh vào.',
      'Bước 3: Đậy kín nắp và để ngăn mát tủ lạnh 6-8 tiếng.',
      'Bước 4: Thưởng thức ly trà mát lạnh thơm mùi thảo mộc thiên nhiên.'
    ],
    proTip: 'Ủ lạnh giúp trà giữ nguyên hoạt chất chống oxy hóa và vị ngọt tự nhiên không cần thêm đường.'
  }
];

export const REVIEWS = [
  {
    id: 'rv1',
    author: 'Nguyễn Thanh Hà',
    role: 'Khách hàng thân thiết',
    comment: 'Trà matcha ở An Nhiên có vị thơm ngậy đặc trưng không nơi nào có. Không gian quán mang lại cảm giác vô cùng bình yên.',
    rating: 5,
    date: 'Hôm qua'
  },
  {
    id: 'rv2',
    author: 'Trần Minh Anh',
    role: 'Thành viên Thiền Trà',
    comment: 'Giao hàng siêu nhanh, ly trà được bọc kỹ càng vẫn giữ được lớp kem foam mịn màng. Sẽ ủng hộ dài lâu!',
    rating: 5,
    date: '3 ngày trước'
  }
];
