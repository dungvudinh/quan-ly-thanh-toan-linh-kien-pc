// Dữ liệu mẫu — thay bằng dữ liệu thật hoặc gọi API backend khi có.

// Số liệu bảng giá khách hàng là placeholder (bảng gốc bị lỗi định dạng cột khi
// trích xuất từ PDF) — chỉnh lại trong tab "Bảng giá" hoặc trực tiếp ở đây.
export const initialClientPrices = {
  VGA: { new: 105, similar1: 47, newModular: 20, bonus: 25, modularSimilar: 60 },
  Mainboard: { new: 89, similar1: 47, newModular: 20, bonus: 15, modularSimilar: 60 },
  Case: { new: 131, similar1: 47, newModular: 20, bonus: 15, modularSimilar: 60 },
  Fan: { new: 58, similar1: 16, newModular: 12, bonus: 0, modularSimilar: 0 },
  "CPU Cooler": { new: 63, similar1: 26, newModular: 15, bonus: 0, modularSimilar: 40 },
  AIO: { new: 84, similar1: 21, newModular: 15, bonus: 0, modularSimilar: 0 },
  PSU: { new: 79, similar1: 26, newModular: 15, bonus: 0, modularSimilar: 0 },
};

// Bảng giá freelancer (Lạc Việt Studio) lấy đúng số liệu trong file gốc.
export const initialFreelancerPrices = {
  VGA: { price: 1300000, bonus: 300000, similar1: 600000, similar2: 247000 },
  Mainboard: { price: 1055000, bonus: 255000, similar1: 600000, similar2: 247000 },
  Case: { price: 1300000, bonus: 300000, similar1: 600000, similar2: 247000 },
  Fan: { price: 494000, bonus: 0, similar1: 0, similar2: 247000 },
  "CPU Cooler": { price: 500000, bonus: 0, similar1: 0, similar2: 247000 },
  AIO: { price: 900000, bonus: 0, similar1: 0, similar2: 247000 },
  PSU: { price: 550000, bonus: 0, similar1: 0, similar2: 247000 },
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
