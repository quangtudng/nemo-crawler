const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

const foodyCrawler = async (urls, fileName) => {
  let listDetailObjectData = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
  );
  for (const url of urls) {
    console.log("Crawling: " + url);
    await navigateToMainPage(page, url);
    let listObjectData = await _crawlListPage(page);
    let detailObjectData = await _crawlDetailPage(page, listObjectData);
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

const navigateToMainPage = async (page, url) => {
  await page.goto(url);
  await page.waitForTimeout(10000);
};

const _crawlListPage = async (page) => {
  return page.evaluate(() => {
    const objectData = [];
    const restaurantLists = document.querySelector("[data-test-target='restaurants-list']")?.childNodes;
    for (let i = 0; i < restaurantLists.length; i++) {
      if(restaurantLists[i].getAttribute("data-test")) {
        let url = document.querySelector("[data-test-target='restaurants-list']")?.childNodes[i]?.querySelector("span > div > div:nth-child(1) > div:nth-child(1) > span > a")?.href;
        if(!url) {
          url = document.querySelector("[data-test-target='restaurants-list']")?.childNodes[i].querySelector("span > div > div > span > a")?.href;
        }
        let thumbnail = document.querySelector("[data-test-target='restaurants-list']")?.childNodes[i]?.querySelector("span > div > div:nth-child(1) > div:nth-child(1) > span > a")?.querySelector("div:nth-child(2) > div > div:nth-child(1) > ul > li > div")?.style.backgroundImage.split('"')[1];
        if(!thumbnail) {
          thumbnail = document.querySelector("[data-test-target='restaurants-list']")?.childNodes[i].querySelector("span > div > div > span > a")?.querySelector("div:nth-child(2) > div > div:nth-child(1) > ul > li > div")?.style.backgroundImage.split('"')[1];
        }
        objectData.push({ url, thumbnail });
      }
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
  await page.waitForSelector("[data-test-target='top-info-header']");
  return page.evaluate(() => {
    const title = document.querySelector("[data-test-target='top-info-header']").innerText;
    // Fetch location detail
    let locations = [];
    const breadCrumb = document.querySelector("[data-test-target='breadcrumbs']");
    locations.push(breadCrumb.childNodes[2].innerText.trim())
    if(breadCrumb.childNodes[3].innerText && !breadCrumb.childNodes[3].innerText.includes("nhà hàng")) {
      locations.push(breadCrumb.childNodes[3].innerText.trim());
    }
    // Fetch images
    let images = [];
    const imageListNodes = document.querySelectorAll("[data-prwidget-name='common_basic_image']")
    if (imageListNodes && imageListNodes.length > 0) {
      for (let i = 0; i < 50; i++) {
        if(images.length >= 5) {
          break;
        }
        const node = imageListNodes[i];
        const url = node?.querySelector("div > img")?.src;
        if(url && url.includes("tripadvisor.com")) {
          images.push(url);
        }
      }
    }
    // Crawl extra data
    const infoSections = document.querySelector("[data-test-target='restaurant-detail-info'] > div:nth-child(3)")
    const fullAddress = infoSections.querySelector("span:nth-child(1) > span > a")?.innerText
    const phoneNumber = infoSections.querySelector("span:nth-child(2) > span > span:nth-child(2)")?.innerText
    const priceLabel = Array.from(document.querySelectorAll('div')).find(el => el.textContent === 'KHOẢNG GIÁ');
    let price = priceLabel?.nextElementSibling?.innerText;
    if (price) {
      price = price.substr(0, price.indexOf('₫'));
    }
    return { title, locations, images, fullAddress, phoneNumber, price };
  })
}

module.exports = {
  foodyCrawler,
}

// Food: bar, restaurant, cafe
