const db = require("../db/connection");
const fs = require("fs");
const { values } = require("../db/data/test-data/articles");

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
};exports.selectArticle = (
  topic = "mitch",
  sort_by = "created_at",
  order = "DESC",
  p = 1,
  limit = 10
) => {
  const validTopics = ["mitch", "cats", "paper"];

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let queryString = `
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
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  const queryValues = [];

  if (topic) {
    queryString += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  queryString += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
  `;

  const offset = (p - 1) * limit;

  queryString += `
    LIMIT $${queryValues.length + 1}
    OFFSET $${queryValues.length + 2}
  `;
  queryValues.push(limit, offset);

  return db.query(queryString, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "not found!" });
    }
    return result.rows;
  });
};



exports.selectArticlesById = (article_id) => {
  const queryValue = [article_id];
  const queryString = `
    SELECT articles.*, COUNT(comments.author) AS comment_count
    FROM articles
    JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id

  `;

  return db.query(queryString, queryValue).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "not found!" });
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
      return Promise.reject({ status: 404, msg: "not found!" });
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

exports.updateArticleVotes = (article) => {
  const { inc_votes, article_id } = article;
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
        return Promise.reject({ status: 404, msg: "not found!" });
      }
      return result.rows[0];
    });
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
        return Promise.reject({ status: 404, msg: "not found!" });
      }
      return result.rows;
    });
};

exports.selectUsers = () => {
  let queryString = `
  SELECT *
  FROM users;`;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};
exports.selectUserByUsername = (username) => {
  let queryValue = [];
  let queryString = `
    SELECT *
    FROM users
    WHERE username = $1;`;

  if (username) {
    queryValue.push(username);
  }

  return db.query(queryString, queryValue).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "not found!" });
    }
    return result.rows[0];
  });
};
exports.updateCommentsVotes = (comment) => {
  const { inc_votes, comment_id } = comment;
  return db
    .query(
      `UPDATE comments
       SET votes = votes + $1
       WHERE comment_id = $2
       RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found!" });
      }
      return result.rows[0];
    });
};
exports.createArticle = (article) => {
  const { title, topic, author, body, article_img_url } = article;
  const inserting = db
    .query(
      `INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, topic, author, body, article_img_url]
    )
    
    const commentCounting = inserting.then((result) => {
      const insertedArticle = result.rows[0];
      return db.query(
        `SELECT COUNT(author) AS comment_count FROM comments WHERE article_id = $1`,
        [insertedArticle.article_id]
      );
    });
return Promise.all([inserting, commentCounting]).then(
  ([insertResult, commentResult]) => {
    const insertedArticle = insertResult.rows[0];
    const commentCount = commentResult.rows[0].comment_count;

    return {
      ...insertedArticle,
      comment_count: commentCount,
    };
  }
);
};
