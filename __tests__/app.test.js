const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const app = require("../app");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("200: responds with an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(
          res.body.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          })
        );
      });
  });
  test("an invalid endpoint returns error 404 path not found", () => {
    return request(app)
      .get("/api/toppics")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
  test("an object with correct keys is returned on a  article ID query", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((res) => {
        // console.log(res.body.article);
        res.body.article.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: 4,
          });
        });
      });
  });

  test("404 article does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article does not exist");
      });
  });

  test.only("400 article id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("article id is invalid");
      });
  });
});
