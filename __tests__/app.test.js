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
        expect(body["GET /api"]).toMatchObject({
          description: expect.any(String),
        });
        expect(body["GET /api/topics"]).toMatchObject({
          description: expect.any(String),
          queries: expect.any(Array),
          exampleResponse: expect.any(Object),
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
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
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
        expect(body.msg).toBe("not found!");
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
            comment_count: expect.any(String),
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
