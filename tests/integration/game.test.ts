import supertest from "supertest";
import app from "../../src/app";
import createConsole from "../factories/console-factory";
import createGame from "../factories/game-factory";
import { cleanDb, disconnectDatabase } from "../helpers";

beforeEach(async () => {
  await cleanDb();
});

afterAll(async () => {
  await disconnectDatabase();
});

const server = supertest(app);

describe("GET /games", () => {
  it("shoulde respond with status 200 and games data", async () => {
    const consoles = await createConsole();
    const game = await createGame(consoles.id);

    const responses = await server.get("/games");

    expect(responses.status).toBe(200);
    expect(responses.body).toEqual([
      {
        id: game.id,
        title: game.title,
        consoleId: game.consoleId,
        Console: {
          id: consoles.id,
          name: consoles.name,
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
    const consoles = await createConsole();
    const game = await createGame(consoles.id);

    const response = await server.get(`/games/${game.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: game.id,
      title: game.title,
      consoleId: game.consoleId,
    });
  });
});
