const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

const propertyCrawler = async (urls, fileName) => {
  let listDetailObjectData = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
  );
  for (const url of urls) {
    let fullListObjectData = [];
    for (let i = 0; i < 5; i++) {
      console.log("Crawling: " + url + " Page " + (i+1));
      await navigateToMainPage(page, url);
      let listObjectData = await _crawlListPage(page);
      fullListObjectData.push(listObjectData);
      await _nextPage(page);
    }
    console.log("Got all links, detail crawl init");
    fullListObjectData = _.flattenDeep(fullListObjectData);
    let detailObjectData = await _crawlDetailPage(page, fullListObjectData);
    listDetailObjectData.push(detailObjectData);
  }
  listDetailObjectData = _.flattenDeep(listDetailObjectData);
  await browser.close();
  const exportData = {};
  for (let i = 0; i < listDetailObjectData.length; i++) {
    exportData[i] = listDetailObjectData[i];
  }
  fs.writeFileSync(`./export/${fileName}-` + Date.now() + ".json", JSON.stringify(exportData), "utf-8");
}
const _nextPage = async (page) => {
  return page.evaluate(async () => {
    document.querySelector("[data-trackingstring='pagination_h'] > span:nth-child(2)").click();
  })
}
const navigateToMainPage = async (page, url) => {
  await page.goto(url);
  await page.waitForTimeout(10000);
};

const _crawlListPage = async (page) => {
  return page.evaluate(async () => {
    const objectData = [];
    const linkElements = document.querySelectorAll("[data-prwidget-name='meta_hsx_responsive_listing'] > div > div:nth-child(1)");
    for (let element of linkElements) {
      const url = element.childNodes[0].querySelector("div:nth-child(1) > a").href;
      let thumbnail = element.childNodes[0].querySelector("div:nth-child(1) > a > div > div > div > div > img");
      if (thumbnail) {
        thumbnail = thumbnail.src;
      }
      let price = element.querySelector(".price-wrap > div:last-child").innerText
      objectData.push({ url, price, thumbnail });
    }
    return objectData;
  });
};

const _crawlDetailPage = async (page, listData) => {
  listData = _.flattenDeep(listData);
  const listDetailPage = [];
  // We will ignore some of the objects that have different data
  const ignoreList = [
    "https://www.tripadvisor.com.vn/Attraction_Review-g1009804-d8300014-Reviews-RIDS_Surf_Club-Mui_Ne_Phan_Thiet_Binh_Thuan_Province.html",
    "https://www.tripadvisor.com.vn/Attraction_Review-g1184679-d10844270-Reviews-PTA_Travel-Duong_Dong_Phu_Quoc_Island_Kien_Giang_Province.html"
  ]
  for (const [index, object] of listData.entries()) {
    if(object.url && !ignoreList.includes(object.url)) {
      console.log(`Crawling item ${index+1}: ` + object.url);
      console.log(`[REMAINING-ITEM-COUNT]: ${listData.length - (index+1)}`)
      const detailData = await _getDetailPageInfo(page, object.url);
      listDetailPage.push({ ...detailData, ...object });
    }
  }
  return listDetailPage;
};

const _getDetailPageInfo = async (page, detailUrl) => {
  await page.goto(detailUrl);
  await page.waitForSelector("#HEADING");
  return page.evaluate(() => {
    const title = document.querySelector("#HEADING").innerText;
    // Fetch location detail
    let locations = [];
    const breadCrumb = document.querySelector("[data-test-target='breadcrumbs']");
    locations.push(breadCrumb.childNodes[2].innerText)
    if(breadCrumb.childNodes[3].innerText && !breadCrumb.childNodes[3].innerText.includes("Khách sạn")) {
      locations.push(breadCrumb.childNodes[3].innerText);
    }
    // Fetch images
    let images = [];
    const nextPhotoButton = document.querySelectorAll("[data-clicksource='CarouselArrow']")[1];
    if (nextPhotoButton) {
      nextPhotoButton.click();
      nextPhotoButton.click();
      nextPhotoButton.click();
      nextPhotoButton.click();
      nextPhotoButton.click();
    }
    const imageListNodes = document.querySelector(".carousel > ul")?.childNodes
    if (imageListNodes && imageListNodes.length > 0) {
      for (let i = 0; i < 5; i++) {
        const node = imageListNodes[i];
        const url = node?.querySelector("div > img")?.src;
        if(url) {
          images.push(url);
        }
      }
    }
    // Craw extra data
    const infoSections = document.querySelector("[data-test-target='hr-aft-info'] > div > div:nth-child(2) > div > div:nth-child(2) > div")
    const fullAddress = infoSections.querySelector("div:nth-child(1) > div > span:nth-child(2) > span").innerText
    const phoneNumber = infoSections.querySelector("div:nth-child(2) > div > a > span:nth-child(2)")?.innerText
    const amenities = [];
    const allAmenitiesElements = document.querySelectorAll("[data-test-target='amenity_text']");
    for (let i = 0; i < allAmenitiesElements.length; i++) {
      const ame = allAmenitiesElements[i]?.innerText;
      if(ame) {
        amenities.push(ame);
      }
    }
    return { title, locations, images, fullAddress, phoneNumber, amenities };
  })
}

module.exports = {
  propertyCrawler,
}