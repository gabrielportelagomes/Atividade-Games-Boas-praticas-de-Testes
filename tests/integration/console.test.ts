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
    const consoles =await createConsole();
    const response = await server.get("/consoles");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{id: consoles.id,name:consoles.name}]);
  });
});

describe("GET /consoles/:id",()=>{
    it("should respond with satus 200 if console with id exist",async ()=>{
        const console = await createConsole();
        const response = await server.get(`/consoles/${console.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({id: console.id,name:console.name});
    });
    it("should respond with status 404 when the id given no exist",async()=>{
        const response = await server.get("/consoles/0");
        expect(response.status).toBe(404);
    });

})

