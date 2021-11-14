const { foodyCrawler } = require("../base/base-restaurants");

(async () => {
  const vietnameseRestaurantUrls = [
    // Ho Chi Minh
    "https://www.tripadvisor.com.vn/Restaurants-g293925-c10591-Ho_Chi_Minh_City.html",
    // Ha Noi
    "https://www.tripadvisor.com.vn/Restaurants-g293924-c10591-Hanoi.html",
    // Da Nang
    "https://www.tripadvisor.com.vn/Restaurants-g298085-c10591-Da_Nang.html",
    // Quang Nam, Hoi An
    "https://www.tripadvisor.com.vn/Restaurants-g298082-c10591-Hoi_An_Quang_Nam_Province.html",
    // Nha Trang
    "https://www.tripadvisor.com.vn/Restaurants-g293928-c10591--Nha_Trang_Khanh_Hoa_Province.html",
  ];
  await foodyCrawler(vietnameseRestaurantUrls, "restaurants");
})();