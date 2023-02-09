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
    const console = await createConsole();
    const game = await createGame(console.id);

    const response = await server.get("/games");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([
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
