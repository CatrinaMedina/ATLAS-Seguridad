const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

jest.mock("../db", () => ({
  pool: { query: jest.fn() },
}));
const { pool } = require("../db");

const clientRoutes = require("../routes/clients");

const JWT_SECRET = process.env.JWT_SECRET || "inseguro";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/clientes", clientRoutes);
  return app;
}

function tokenPara(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

describe("UT-07 y UT-08: Endpoint POST /clientes (unitario, sin BD real)", () => {

  beforeEach(() => {
    pool.query.mockReset();
  });

  test("UT-07: sin token de autenticación, la creación de cliente es rechazada (401)", async () => {
    const res = await request(buildApp())
      .post("/clientes")
      .send({ nombre: "Cliente X", correo: "x@x.com" });

    expect(res.status).toBe(401);
  });

  test("UT-08 [HALLAZGO DE SEGURIDAD - RF-3.2]: el token nunca lleva el rol del usuario, por lo que el backend NO puede distinguir un editor de un administrador", async () => {

    const tokenDeUnEditor = tokenPara({
      usuarioId: 2,
      nombreUsuario: "editor",
      empresaUsuarioId: 2,
      empresaId: 1,
    });

    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 10, nombre: "Cliente creado por editor" }] }) 
      .mockResolvedValueOnce({ rows: [] }); 

    const res = await request(buildApp())
      .post("/clientes")
      .set("Authorization", `Bearer ${tokenDeUnEditor}`)
      .send({ nombre: "Cliente creado por editor", correo: "editor-cliente@x.com" });

    expect(res.status).toBe(201);
  });
});