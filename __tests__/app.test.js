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
            comment_count: expect.any(String),
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
  test("returns comment count included in article ", () => {
    return request(app)
      .get("/api/articles/9")
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
            article_id: 9,
            comment_count: "2",
          });
        });
      });
  });
  test("GET /api/articles returns an array of articles with specific keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        res.body.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET /api/articles returns an array of articles in descending order of creation date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("created_at", {
          descending: true,
        });
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
  test("400: if article id is invalid", () => {
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
        expect(res.body).toEqual({
          users: [
            { username: "butter_bridge" },
            { username: "icellusedkars" },
            { username: "rogersop" },
            { username: "lurker" },
          ],
        });
      });
  });
  test("check length of array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users.length).toBe(4);
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200 returns array of comments of specific id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          article: [
            {
              comment_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              article_id: 9,
              author: "butter_bridge",
              votes: 16,
              created_at: "2020-04-06T12:17:00.000Z",
            },
            {
              comment_id: 17,
              body: "The owls are not what they seem.",
              article_id: 9,
              author: "icellusedkars",
              votes: 20,
              created_at: "2020-03-14T17:02:00.000Z",
            },
          ],
        });
      });
  });
  test("400 returns Not found when specific id is invalid", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("404 Not found request when path is invalid", () => {
    return request(app)
      .get("/api/articdles/9/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("200 returns posted comment", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({ username: "usernameTest", body: "bodyTest" })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ updatedComment: "bodyTest" });
      });
  });
  test("400: if article id is invalid", () => {
    return request(app)
      .post("/api/articles/notANumberSoInvalid/comments")
      .send({ username: "usernameTest", body: "bodyTest" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("400: if inc_votes is invalid", () => {
    return request(app)
      .post("/api/articles/notANumberSoInvalid/comments")
      .send({ Incorrentusername: "usernameTest", Incorrectbody: "bodyTest" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});
