const { foodyCrawler } = require("../base/base-restaurants");

(async () => {
  const vietnameseBarUrls = [
    // Ho Chi Minh
    "https://www.tripadvisor.com.vn/Restaurants-g293925-zfg11776-Ho_Chi_Minh_City.html",
    // Ha Noi
    "https://www.tripadvisor.com.vn/Restaurants-g293924-zfg11776-Hanoi.html",
    // Da Nang
    "https://www.tripadvisor.com.vn/Restaurants-g298082-zfg11776-Hoi_An_Quang_Nam_Province.html",
    // Quang Nam, Hoi An
    "https://www.tripadvisor.com.vn/Restaurants-g293928-zfg11776-Nha_Trang_Khanh_Hoa_Province.html",
    // Nha Trang
    "https://www.tripadvisor.com.vn/Restaurants-g293928-zfg11776-Nha_Trang_Khanh_Hoa_Province.html",
  ];
  await foodyCrawler(vietnameseBarUrls, "bars");
})();
