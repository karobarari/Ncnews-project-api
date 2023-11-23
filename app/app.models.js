const db = require("../db/connection");
const fs = require("fs");

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
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404 });
    }
    return result.rows[0];
  });
};

exports.selectComment = (article_id, order = "ASC", sort_by = "created_at") => {
  queryString = `SELECT * FROM comments`;
  queryValue = [];

  if (article_id) {
    queryString += ` WHERE article_id = ${article_id} 
    ORDER BY ${sort_by} ${order}
`;
  }

  return db.query(queryString).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404 });
    }
    return result.rows;
  });
};

exports.createComment = (comment) => {
  const { article_id, username, body } = comment;

  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, username, body]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};

exports.updateArticleVotes = (comment) => {
  const { inc_votes, article_id } = comment;
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $1
       WHERE article_id = $2
       RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404 });
      }
      return result.rows[0]; 
    })
};

exports.removeComment = (commentId) => {
  return db
    .query(
      `DELETE FROM comments
       WHERE comment_id = $1
       RETURNING *;`,
      [commentId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404 });
      }
      return result.rows;
    });
};