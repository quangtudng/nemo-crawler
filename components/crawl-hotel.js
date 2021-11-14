const { propertyCrawler } = require("../base/base-properties");

(async () => {
  const hotelUrls = [
    "https://www.tripadvisor.com.vn/Hotels-g293921-Vietnam-Hotels.html"
  ]
  await propertyCrawler(hotelUrls, "hotels");
})();