import supertest from "supertest";
import app from "app";
import { cleanDb } from "../helpers";
import createConsole from "../factories/console-factory";
beforeAll(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /consoles", () => {
  it("should respond with status 200 with all consoles", async () => {
    await createConsole();
    const response = await server.get("/consoles");
    expect(response.status).toBe(200);
  });
});
