const puppeteer = require("puppeteer");
const _ = require("lodash");
const fs = require("fs");

const activityCrawler = async (urls, fileName) => {
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
  await page.waitForSelector(
    "[data-automation='AppPresentation_SingleFlexCardSection']"
  );
};

const _crawlListPage = async (page) => {
  return page.evaluate(() => {
    const objectData = [];
    const linkElements = document.querySelectorAll(
      "[data-automation='AppPresentation_SingleFlexCardSection'] > div > span > div > article > div:nth-child(1) > div > div > div > div:nth-child(1) > a"
    );
    for (let element of linkElements) {
      const url = element.href;
      let thumbnail = element.querySelectorAll(
        "div > div > div > div > div:nth-child(1) > ul > li:nth-child(1) > picture > img"
      )[0];
      if (thumbnail) {
        thumbnail = thumbnail.src;
      }
      objectData.push({ url, thumbnail });
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
  await page.waitForSelector("[data-automation='mainH1']");
  return page.evaluate(() => {
    const title = document.querySelector("[data-automation='mainH1']").innerText;
    // Fetch location detail
    let locations = [];
    const breadCrumb = document.querySelector("[data-automation='breadcrumbs']");
    locations.push(breadCrumb.childNodes[2].innerText.trim())
    if(breadCrumb.childNodes[3].innerText && !breadCrumb.childNodes[3].innerText.includes("Hoạt động")) {
      locations.push(breadCrumb.childNodes[3].innerText.trim());
    }
    // Fetch images
    let images = [];
    const nextPhotoButton = document.querySelector("[aria-label='Next Photo']");
    if (nextPhotoButton) {
      nextPhotoButton.click();
      nextPhotoButton.click();
      nextPhotoButton.click();
    }
    const imageListNodes = document.querySelector("[aria-label='Vòng quay ảnh'] > div:nth-child(1) > ul")?.childNodes
    if (imageListNodes && imageListNodes.length > 0) {
      for (let i = 0; i < 5; i++) {
        const node = imageListNodes[i];
        const url = node?.querySelector("div")?.style?.backgroundImage.split('"')[1];
        if(url) {
          images.push(url);
        }
      }
    }
    return { title, locations, images };
  })
}

module.exports = {
  activityCrawler,
}