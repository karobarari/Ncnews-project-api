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
exports.selectArticlesById = (article_id) => {
  let queryValue = [];
  let queryString = `
  SELECT *
  FROM articles
  WHERE article_id = $1;`;
  if (article_id) {
    queryValue.push(article_id);
  }

  return db.query(queryString, queryValue).then((result) => {
    return result.rows[0];
  });
};


exports.selectArticle = () => {
  const queryString = `
    SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.author) AS comment_count
    FROM articles
    JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC
  `;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

