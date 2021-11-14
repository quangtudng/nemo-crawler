const { activityCrawler } = require("../base/base-activites");

(async () => {
  const beachUrls = [
    "https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c61-t52-Vietnam.html",
    "https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c61-t52-oa30-Vietnam.html",
    "https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c61-t52-oa60-Vietnam.html"
  ];
  await activityCrawler(beachUrls, "beach");
})();