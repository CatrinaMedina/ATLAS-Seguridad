const request = require("supertest");
const express = require("express");

jest.mock("../db", () => ({
  pool: { query: jest.fn() },
}));
const { pool } = require("../db");

const rolesRoutes = require("../routes/roles");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/roles", rolesRoutes);
  return app;
}

describe("UT-05 y UT-06: Endpoint /roles (unitario, sin BD real)", () => {

  beforeEach(() => {
    pool.query.mockReset();
  });

  test("UT-05 [HALLAZGO DE SEGURIDAD - NFR-SEG-4]: se puede CREAR un rol sin enviar ningún token de autenticación", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 99, nombre: "rol_no_autorizado" }] })
      .mockResolvedValueOnce({ rows: [] }); 

    const res = await request(buildApp())
      .post("/roles")
      .send({ nombre: "rol_no_autorizado" });

    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe("rol_no_autorizado");
  });

  test("UT-06 [HALLAZGO DE SEGURIDAD - NFR-SEG-4]: se puede ELIMINAR un rol sin enviar ningún token de autenticación", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, nombre: "administrador" }] }) 
      .mockResolvedValueOnce({ rows: [] }); 

    const res = await request(buildApp())
      .delete("/roles/1")
      .send();

    expect(res.status).toBe(200);
    expect(res.body.deleted).toBe(true);
  });
});