const fs = require("fs");
const _ = require("lodash");
const _formatLocation = (fullData) => {
  Object.values(fullData).forEach(data => {
    const locations = data.locations;
    locations[0] = locations[0]?.replace("Tỉnh", "");
    locations[0] = locations[0]?.replace("Thành phố", "");
    locations[0] = locations[0]?.trim();
    locations[1] = locations[1]?.trim();
  })
  return fullData;
};
const _exportAmenities = (fullData) => {
  const allAmenities = []
  Object.values(fullData).forEach(data => {
    if(data.amenities) {
      allAmenities.push(data.amenities);
    }
  })
  return allAmenities;
}
(async () => {
  // Format locations
  fs.readdirSync("./export").forEach(file => {
    if(file !== ".gitkeep") {
      const data = JSON.parse(fs.readFileSync(`./export/${file}`, 'utf8'));
      const newData = _formatLocation(data);
      fs.writeFileSync(`./export/${file}`, JSON.stringify(newData), "utf8");
    }
  });
  // Export all amenities
  let allAmenities = [];
  fs.readdirSync("./export").forEach(file => {
    if(file !== ".gitkeep") {
      const data = JSON.parse(fs.readFileSync(`./export/${file}`, 'utf8'));
      let amenities = _exportAmenities(data);
      amenities = _.flattenDeep(amenities)
      allAmenities.push(amenities);
    }
  });
  allAmenities = _.flattenDeep(allAmenities);
  allAmenities = [...new Set(allAmenities)];
  const amenityObject = {
    "results": allAmenities,
  };
  fs.writeFileSync(`./export/amenities.json`, JSON.stringify(amenityObject), "utf8");
})();
