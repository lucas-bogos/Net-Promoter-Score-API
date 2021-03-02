import request from 'supertest';
import { getConnection } from 'typeorm';
import {app} from '../app'
import createConnection from "../database"

describe("Surveys", ()=>{
    beforeAll(async()=> {
        const connection = await createConnection();
        await connection.runMigrations();
    });

afterAll(async()=>{
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
})
   
it("Should be able to create a new survey", async()=>{
    const response = request(app).post("/surveys")
    .send(
        {
            title:"title test",
            description:"description test"
        });
    expect ((await response).status).toBe(201);
    expect ((await response).body).toHaveProperty("id");
});

it("Should be able to get all surveys", async()=>{
    request(app).post("/surveys")
    .send(
        {
            title:"title test3",
            description:"description test3"
        });
    const response = await request(app).get("/surveys");
    expect(response.body.length).toBe(2);
});

});