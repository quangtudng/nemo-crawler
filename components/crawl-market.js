const { activityCrawler } = require("../base/base-activites");


(async () => {
  const marketUrls = [
    "https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c26-t142-Vietnam.html",
    "https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c26-t142-oa30-Vietnam.html",
    "https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c26-t142-oa60-Vietnam.html"
  ]
  await activityCrawler(marketUrls, "market");
})();