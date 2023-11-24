const app = require("../app/app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index.js");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
  test("API healthcheck", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("GET 200:getting all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
describe("GET /api", () => {
  test("GET 200: be available on /api", () => {
    return request(app).get("/api").expect(200);
  });
  test("provide a description of all other endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("GET /api");
        expect(body).toHaveProperty("GET /api/topics");
        expect(body).toHaveProperty("GET /api/articles");
        expect(body).toHaveProperty("GET /api/articles");
        expect(body).toHaveProperty("GET /api/articles/:article_id");
        expect(body).toHaveProperty("GET /api/articles/:article_id/comments");
        expect(body).toHaveProperty("POST /api/articles/:article_id/comments");
        expect(body).toHaveProperty("PATCH /api/articles/:article_id");
        expect(body).toHaveProperty("DELETE /api/comments/:comment_id");
        expect(body).toHaveProperty("GET /api/users");

        expect(body["GET /api"]).toMatchObject({
          description: expect.any(String),
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("should be available on /api/articles/:article_id", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("should response with an article object, which should have the expected properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("status:400, responds with an error message when passed a bad user ID", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status:404, responds with an error message when user id does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found!");
      });
  });
});
describe("GET /api/articles", () => {
  test("should be available on /api/articles", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("should response with an articles array of article objects, each of which should have the expected properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(5);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });

  test("should respond with an articles array of article objects, each of which should be sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("should be available on /api/articles/:article_id/comments", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("should response with an array of comments for the given article_id of which each comment should have the expected properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveLength(11);
        expect(article).toBeSortedBy("created_at");
      });
  });
  test("should response with an array of comments for the given article_id of which each comment should have the expected properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveLength(2);
        expect(article).toBeSortedBy("created_at");
      });
  });
  test("status:400, responds with an error message when passed a bad user ID", () => {
    return request(app)
      .get("/api/articles/notAnID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status:404, responds with an error message when article id does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found!");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with 201", () => {
    const newComment = {
      username: "butter_bridge",
      body: "testing comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201);
  });
  test("should respond the posted conmment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "testing comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { postedCm } = body;
        expect(postedCm).toMatchObject({
          comment_id: expect.any(Number),
          body: "testing comment",
          article_id: expect.any(Number),
          author: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  test("status:400, responds with an error message when passed no user ID or no comment body", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status:404, responds with an error message when passed a unknown user ID", () => {
    const newComment = {
      username: "Karo",
      body: "testing comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found!");
      });
  });
  test("status:404, responds with an error message when passed a non existent article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "testing comment",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found!");
      });
  });

  test("status:400, responds with an error message when passed bad article request", () => {
    const newComment = {
      username: "Karo",
      body: "testing comment",
    };
    return request(app)
      .post("/api/articles/bad_request/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("should respond with 200", () => {
    const newComment = {
      inc_votes: 1,
    };
    return request(app).patch("/api/articles/1").send(newComment).expect(200);
  });
  test("should respond with the updated article", () => {
    const newComment = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(newComment)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: 101,
          article_img_url: expect.any(String),
        });
      });
  });
  test("status:400, responds with an error message when passed no update parameter", () => {
    const newComment = {};
    return request(app)
      .patch("/api/articles/1") // Use PATCH instead of POST
      .send(newComment)
      .expect(400);
  });
  test("status:400, responds with an error message when passed NaN", () => {
    const newComment = { inc_votes: "NotValid" };
    return request(app)
      .patch("/api/articles/1") //
      .send(newComment)
      .expect(400);
  });
  test("status:400, responds with an error message when passed a bad user ID", () => {
    const newComment = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/NaN") // Use PATCH instead of POST
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status:404, responds with an error message when article id does not exist", () => {
    const newComment = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/9999") // Use PATCH instead of POST
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found!");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("should delete the given comment by comment_id and respond with status 204 and no content", () => {
    const commentIdToDelete = 1;
    return request(app)
      .delete(`/api/comments/${commentIdToDelete}`)
      .expect(204);
  });
  test("status:400, responds with an error message when passed a bad comment ID", () => {
    const commentIdToDelete = "NaN";
    return request(app)
      .delete(`/api/comments/${commentIdToDelete}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status:404, responds with an error message when comment id does not exist", () => {
    const commentIdToDelete = 111111;
    return request(app)
      .delete(`/api/comments/${commentIdToDelete}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found!");
      });
  });
});
describe("GET /api/users", () => {
  test("should be available on /api/users", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("should response with an articles array of users objects, each of which should have the expected properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
describe("GET /api/articles topic query", () => {
  test("should be available on /api/articles?topic=mitch", () => {
    return request(app).get("/api/articles?topic=mitch").expect(200);
  });
  test("should respond with an array of article objects, each of which should have the expected properties", () => {
    const validTopic = "mitch";
    return request(app)
      .get(`/api/articles?topic=${validTopic}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(4);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: validTopic,
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("status:400, responds with an error message when the topic does not exist", () => {
    const nonExistingTopic = 888;
    return request(app)
      .get(`/api/articles?topic=${nonExistingTopic}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("status:404, responds with an error message when articles does not exist", () => {
    const topic = "paper";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found!");
      });
  });
});
describe("GET /api/articles (comment count)", () => {
  test("should response includes comment count key", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          comment_count: expect.any(String),
        });
      });
  });
});
describe("GET /api/articles (sorting queries)", () => {
  test("should response articles in expected order", () => {
    const sort_query = "created_at";
    return request(app)
      .get(`/api/articles?sort_by=${sort_query}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy(sort_query, { descending: true });
      });
  });
  test("should response articles in expected order", () => {
    const sort_query = "created_at";
    const order = "ASC";
    return request(app)
      .get(`/api/articles?sort_by=${sort_query}&order=${order}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy(sort_query);
      });
  });
  test("status:400, responds with an error message when articles does not exist", () => {
    const sort_query = "bad sort";
    const order = "ASC";
    return request(app)
      .get(`/api/articles?sort_by=${sort_query}&order=${order}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status:400, responds with an error message when articles does not exist", () => {
    const sort_query = "created_at";
    const order = "bad order";
    return request(app)
      .get(`/api/articles?sort_by=${sort_query}&order=${order}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
