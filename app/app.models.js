const db = require("../db/connection");
const fs = require("fs")


exports.readEndpoints = (callback) => {
  fs.readFile(`${__dirname}/../endpoints.json`, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading endpoints file:", err);
      callback(err, null);
      return;
    }
    callback(null, JSON.parse(data));
  });
};


exports.selectTopics = () => {
  let queryString = `
  SELECT *
  FROM topics;`;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};
