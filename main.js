const fs = require("fs");
const _ = require("lodash");
const _formatData = (fullData) => {
  Object.values(fullData).forEach((data) => {
    let locations = data?.locations;
    let price = data?.price;
    // Locations
    if (locations) {
      locations = locations.filter((n) => n);
      if (locations[0]) {
        locations[0] = locations[0]?.replace("Tỉnh", "");
        locations[0] = locations[0]?.replace("Thành phố", "");
        locations[0] = locations[0].replace("Bà Rịa-Vũng Tàu", "Vũng Tàu");
        locations[0] = locations[0].replace(
          "Thừa Thiên - Huế",
          "Thừa Thiên Huế"
        );
        locations[0] = locations[0].replace(
          "Ninh Thuan Province",
          "Ninh Thuận"
        );
        locations[0] = locations[0].replace("Ninh Kieu", "Cần Thơ");
        locations[0] = locations[0].replace("Cát Bà", "Hải Phòng");
        locations[0] = locations[0]?.trim();
      }
      if (locations[1]) {
        locations[1] = locations[1]?.replace("Tỉnh", "");
        locations[1] = locations[1]?.replace("Thành phố", "");
        locations[1] = locations[1].replace("Bà Rịa-Vũng Tàu", "Vũng Tàu");
        locations[1] = locations[1].replace(
          "Thừa Thiên - Huế",
          "Thừa Thiên Huế"
        );
        locations[1] = locations[1].replace(
          "Ninh Thuan Province",
          "Ninh Thuận"
        );
        locations[1] = locations[1].replace("Ninh Kieu", "Cần Thơ");
        locations[1] = locations[1].replace("Cát Bà", "Hải Phòng");
        locations[1] = locations[1]?.trim();
      }
      data.locations = locations;
    }
    if (price) {
      price = price.trim();
      price = price.replace("₫", "");
      price = price.replace(".", "");
      price = price.replace(".", "");
      price = price.trim();
      price = parseInt(price, 10);
      data.price = price > 1000 ? price : null;
    }
  });
  return fullData;
};
const _exportAmenities = (fullData) => {
  const allAmenities = [];
  Object.values(fullData).forEach((data) => {
    if (data.amenities) {
      allAmenities.push(data.amenities);
    }
  });
  return allAmenities;
};
(async () => {
  // Format data
  fs.readdirSync("./export").forEach((file) => {
    if (
      file !== ".gitkeep" &&
      file !== "formatted" &&
      file !== "amenities.json"
    ) {
      const data = JSON.parse(fs.readFileSync(`./export/${file}`).toString().normalize());
      const newData = _formatData(data);
      fs.writeFileSync(
        `./export/formatted/${file.substring(0, file.indexOf("-"))}.json`,
        JSON.stringify(newData)
      );
    }
  });
  // Export all amenities
  let allAmenities = [];
  fs.readdirSync("./export/formatted").forEach((file) => {
    if (file !== ".gitkeep") {
      const data = JSON.parse(fs.readFileSync(`./export/formatted/${file}`).toString().normalize());
      let amenities = _exportAmenities(data);
      amenities = _.flattenDeep(amenities);
      allAmenities.push(amenities);
    }
  });
  allAmenities = _.flattenDeep(allAmenities);
  allAmenities = [...new Set(allAmenities)];
  const amenityObject = {
    results: allAmenities,
  };
  fs.writeFileSync(`./export/amenities.json`, JSON.stringify(amenityObject));
})();
