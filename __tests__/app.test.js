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
});

describe("GET /api/articles", () => {
  test("an invalid endpoint returns error 404 path not found", () => {
    return request(app)
      .get("/api/toppics")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });

  describe("GET /api/articles/:article_id", () => {
    test("an object with correct keys is returned on a  article ID query", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then((res) => {
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
  });

  test("404 article does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });

  test("400 article id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/articles", () => {
  test("200: responds with updated article (incremented)", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ votes_inc: 10 })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          updatedArticle: {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 110,
          },
        });
      });
  });
  test("200: responds with updated article (decremented)", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ votes_inc: -10 })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          updatedArticle: {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 90,
          },
        });
      });
  });
  test("404: if article is invalid", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ votes_inc: 10 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid article ID");
      });
  });
  test("400: if inc_votes is invalid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ votes_inc: "notANumberSoInvalid" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("404: if article id is invalid", () => {
    return request(app)
      .patch("/api/articles/notANumberSoInvalid")
      .send({ votes_inc: 5 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200 gets array of objects of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual([
          { username: "butter_bridge" },
          { username: "icellusedkars" },
          { username: "rogersop" },
          { username: "lurker" },
        ]);
      });
  });
  test("404 endpoint unknown", () => {
    return request(app)
      .get("/api/uzers")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
});
