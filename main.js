const fs = require("fs");
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

(async () => {
  fs.readdirSync("./export").forEach(file => {
    if(file !== ".gitkeep") {
      const data = JSON.parse(fs.readFileSync(`./export/${file}`, 'utf8'));
      const newData = _formatLocation(data);
      fs.writeFileSync(`./export/${file}`, JSON.stringify(newData), "utf8");
    }
  });
})();
