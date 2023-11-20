const db = require("../db/connection");

exports.selectTopics = (table) => {
  let queryString = `
  SELECT *
  FROM ${table};`;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};
