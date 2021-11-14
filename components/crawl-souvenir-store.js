const { activityCrawler } = require("../base/base-activites");

(async () => {
  const souvenirUrls = [];
  for (let i = 0; i < 15; i++) {
    const multipler = 30 * i;
    if(multipler) {
      souvenirUrls.push(`https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c26-t144-oa${multipler}-Vietnam.html`)
    } else {
      souvenirUrls.push("https://www.tripadvisor.com.vn/Attractions-g293921-Activities-c26-t144-Vietnam.html")
    }
  }
  await activityCrawler(souvenirUrls, "souvenir");
})();