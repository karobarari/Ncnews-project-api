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

  test("getting all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const {body} = response
        expect(body).toHaveLength(3)
        body.forEach(topic=>{
          expect(topic).toMatchObject({
            slug : expect.any(String),
            description : expect.any(String)
          })

        })
        
      });
  });
});
