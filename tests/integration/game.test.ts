import supertest from "supertest";
import app from "../../src/app";
import createConsole from "../factories/console-factory";
import createGame from "../factories/game-factory";
import { cleanDb, disconnectDatabase } from "../helpers";
import { faker } from "@faker-js/faker";

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await disconnectDatabase();
});

const server = supertest(app);

describe("GET /games", () => {
  it("shoulde respond with status 200 and games data", async () => {
    const console = await createConsole();
    const game = await createGame(console.id);

    const responses = await server.get("/games");

    expect(responses.status).toBe(200);
    expect(responses.body).toEqual([
      {
        id: game.id,
        title: game.title,
        consoleId: game.consoleId,
        Console: {
          id: console.id,
          name: console.name,
        },
      },
    ]);
  });
});

describe("GET /games/:id", () => {
  it("shoulde respond with status 404", async () => {
    const response = await server.get("/games/0");

    expect(response.status).toBe(404);
  });

  it("shoulde respond with status 200 and game data", async () => {
    const console = await createConsole();
    const game = await createGame(console.id);

    const response = await server.get(`/games/${game.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: game.id,
      title: game.title,
      consoleId: game.consoleId,
    });
  });
});

describe("POST /games", () => {
  it("should respond with status 409 if the given title already exists", async () => {
    const console = await createConsole();
    const game = await createGame(console.id);
    const body = { title: game.title, consoleId: console.id };

    const response = await server.post("/games").send(body);

    expect(response.status).toBe(409);
  });

  it("should respond with status 409 if the given console not exists", async () => {
    const body = { title: faker.name.firstName(), consoleId: 0 };

    const response = await server.post("/games").send(body);

    expect(response.status).toBe(409);
  });

  it("shoulde respond with status 201", async () => {
    const console = await createConsole();
    const body = { title: faker.name.firstName(), consoleId: console.id };

    const response = await server.post("/games").send(body);

    expect(response.status).toBe(201);
  });
});
