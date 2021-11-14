const { propertyCrawler } = require("../base/base-properties");

(async () => {
  const homestayUrls = [
    "https://www.tripadvisor.com.vn/Hotels-g293921-c3-zff17-Vietnam-Hotels.html"
  ]
  await propertyCrawler(homestayUrls, "homestays");
})();