const { activityCrawler } = require("../base/base-activites");

(async () => {
  const centerUrls = [
    "https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c26-t143-Vietnam.html",
    "https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c26-t143-oa30-Vietnam.html",
    "https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c26-t143-oa60-Vietnam.html"
  ]
  await activityCrawler(centerUrls, "center")
})();