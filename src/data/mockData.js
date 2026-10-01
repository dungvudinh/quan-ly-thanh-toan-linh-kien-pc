// Dữ liệu mẫu — thay bằng dữ liệu thật hoặc gọi API backend khi có.

// Số liệu bảng giá khách hàng là placeholder (bảng gốc bị lỗi định dạng cột khi
// trích xuất từ PDF) — chỉnh lại trong tab "Bảng giá" hoặc trực tiếp ở đây.
export const initialClientPrices = {
  VGA: { new: 105, similar1: 47, similar2: 20, bonus: 25, modular: 60 },
  Mainboard: { new: 89, similar1: 47, similar2: 20, bonus: 15, modular: 60 },
  Case: { new: 131, similar1: 47, similar2: 20, bonus: 15, modular: 60 },
  Fan: { new: 58, similar1: 16, similar2: 12, bonus: 0, modular: 0 },
  "CPU Cooler": { new: 63, similar1: 26, similar2: 15, bonus: 0, modular: 40 },
  AIO: { new: 84, similar1: 21, similar2: 15, bonus: 0, modular: 0 },
  PSU: { new: 79, similar1: 26, similar2: 15, bonus: 0, modular: 0 },
};

// Bảng giá freelancer (Lạc Việt Studio) lấy đúng số liệu trong file gốc.
export const initialFreelancerPrices = {
  VGA: { new: 1300000, bonus: 300000, similar1: 600000, similar2: 247000,modular:0 },
  Mainboard: { new: 1055000, bonus: 255000, similar1: 600000, similar2: 247000,modular:0 },
  Case: { new: 1300000, bonus: 300000, similar1: 600000, similar2: 247000,modular:0 },
  Fan: { new: 494000, bonus: 0, similar1: 0, similar2: 247000,modular:0 },
  "CPU Cooler": { new: 500000, bonus: 0, similar1: 0, similar2: 247000,modular:0 },
  AIO: { new: 900000, bonus: 0, similar1: 0, similar2: 247000, modular:0 },
  PSU: { new: 550000, bonus: 0, similar1: 0, similar2: 247000, modular:0 },
};

// Loại linh kiện được cộng bonus khi: trạng thái New + Deadline OK.
export const BONUS_TYPES = ["Mainboard", "Case", "VGA"];

export const initialModels = [
  { id: 1, name: "ZOTAC RTX 5090 TURBO OC 16G", type: "VGA", milestone: 20, status: "New", deadline: "OK", staff: "Trịnh", clientPaid: false, freelancerPaid: false },
  { id: 2, name: "ZOTAC RTX 5090 SOLID OC 16G", type: "VGA", milestone: 24, status: "Similar1", deadline: "OK", staff: "Trịnh", clientPaid: false, freelancerPaid: false },
  { id: 3, name: "ASROCK B650 Mainboard (tái sử dụng)", type: "Mainboard", milestone: 27, status: "New", deadline: "OK", staff: "Thịnh", clientPaid: true, freelancerPaid: true },
  { id: 4, name: "NZXT H9 Flow Black Case", type: "Case", milestone: 29, status: "New", deadline: "Miss", staff: "Thịnh", clientPaid: false, freelancerPaid: false },
  { id: 5, name: "Corsair iCUE Link AIO 280", type: "AIO", milestone: 33, status: "Similar2", deadline: "OK", staff: "Thịnh", clientPaid: false, freelancerPaid: false },
  { id: 6, name: "Noctua NF-A12 Fan Kit", type: "Fan", milestone: 35, status: "New", deadline: "OK", staff: "Vinh", clientPaid: false, freelancerPaid: false },
  { id: 7, name: "be quiet! Dark Rock Pro 5", type: "CPU Cooler", milestone: 36, status: "New", deadline: "OK", staff: "Vinh", clientPaid: false, freelancerPaid: false },
  { id: 8, name: "Corsair RM850x PSU", type: "PSU", milestone: 37, status: "Similar1", deadline: "OK", staff: "Vinh", clientPaid: false, freelancerPaid: false },
];


const DEFAULT_FROM = {
  name: 'Lạc Việt Studio',
  email: 'lacvietstu@gmail.com',
  address: 'Lk16.29 Hinode Royal Park city, Ha Noi, Viet Nam',
};

// Chia nhỏ initialModels thành vài hóa đơn giả để có dữ liệu phân trang
export const initialInvoices = [
  {
    id: 'inv-1001',
    invoiceNumber: 1001,
    createdAt: '2025-06-02',
    from: DEFAULT_FROM,
    to: { name: 'Công ty PC Gear', email: 'contact@pcgear.vn', address: 'Cầu Giấy, Hà Nội' },
    models: initialModels.slice(0, 3),
    paid: true,
  },
  {
    id: 'inv-1002',
    invoiceNumber: 1002,
    createdAt: '2025-06-10',
    from: DEFAULT_FROM,
    to: { name: 'Việt Tech Store', email: 'sales@viettech.vn', address: 'Q1, TP.HCM' },
    models: initialModels.slice(3, 6),
    paid: false,
  },
  {
    id: 'inv-1003',
    invoiceNumber: 1003,
    createdAt: '2025-06-18',
    from: DEFAULT_FROM,
    to: { name: 'Anh Khoa Computer', email: 'khoa@akcomputer.vn', address: 'Đà Nẵng' },
    models: initialModels.slice(6, 8),
    paid: false,
  },
  // thêm vài hóa đơn giả nữa để test phân trang
  ...Array.from({ length: 9 }).map((_, i) => ({
    id: `inv-${2001 + i}`,
    invoiceNumber: 2001 + i,
    createdAt: `2025-07-${String(i + 1).padStart(2, '0')}`,
    from: DEFAULT_FROM,
    to: { name: `Khách hàng ${i + 1}`, email: `khach${i + 1}@example.com`, address: 'Hà Nội' },
    models: initialModels.slice(0, (i % 3) + 1),
    paid: i % 2 === 0,
  })),
];