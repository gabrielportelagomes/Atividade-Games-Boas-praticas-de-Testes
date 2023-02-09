import supertest from "supertest";
import app from "app";
import { cleanDb } from "../helpers";
import createConsole from "../factories/console-factory";
import { faker } from "@faker-js/faker";

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


describe("POST /consoles",()=>{
    it("should respond with status 201 when created",async ()=>{
        const body = {name: faker.name.firstName()};
        const response = await server.post("/consoles").send(body);
        expect(response.status).toBe(201);
    });

    it("should respond with status 409 if the given name already exists",async()=>{
        const console = await createConsole();
        const body = {name: console.name};
        const response = await server.post("/consoles").send(body);
        expect(response.status).toBe(409);
    });
});