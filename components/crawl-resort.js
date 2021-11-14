const { propertyCrawler } = require("../base/base-properties");


(async () => {
  const resortUrls = [
    "https://www.tripadvisor.com.vn/Hotels-g293921-zff8-Vietnam-Hotels.html"
  ]
  await propertyCrawler(resortUrls, "resorts");
})();
