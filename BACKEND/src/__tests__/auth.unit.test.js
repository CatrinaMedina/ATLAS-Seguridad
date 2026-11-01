const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");


jest.mock("../db", () => ({
  pool: { query: jest.fn() },
}));
const { pool } = require("../db");

const authRoutes = require("../routes/auth");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/autenticacion", authRoutes);
  return app;
}

describe("UT-01 a UT-04: Endpoint /autenticacion/login (unitario, sin BD real)", () => {

  beforeEach(() => {
    pool.query.mockReset();
  });

  test("UT-01: retorna 200 y un token JWT cuando la contraseña coincide (comparación en texto plano)", async () => {

    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, nombre_usuario: "admin", contrasena_hash: "admin" }] }) 
      .mockResolvedValueOnce({ rows: [{ id: 1, empresa_id: 1 }] }) 
      .mockResolvedValueOnce({ rows: [] }); 

    const res = await request(buildApp())
      .post("/autenticacion/login")
      .send({ nombre_usuario: "admin", password: "admin" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    const decoded = jwt.decode(res.body.token);
    expect(decoded.nombreUsuario).toBe("admin");
  }, 10000);

  test("UT-02: retorna 401 cuando la contraseña no coincide", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, nombre_usuario: "admin", contrasena_hash: "admin" }],
    });

    const res = await request(buildApp())
      .post("/autenticacion/login")
      .send({ nombre_usuario: "admin", password: "otraClave" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Credenciales inválidas");
  }, 10000);

  test("UT-03: retorna 401 cuando el usuario no existe en la base de datos", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); 

    const res = await request(buildApp())
      .post("/autenticacion/login")
      .send({ nombre_usuario: "noexiste", password: "x" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Credenciales inválidas");
  }, 10000);

  test("UT-04 [HALLAZGO DE SEGURIDAD - NFR-SEG-2]: la comparación de contraseñas es texto-plano-contra-texto-plano, no usa bcrypt.compare", async () => {

    const hashBcryptDeEjemplo = "$2b$10$abcdefghijklmnopqrstuv.abcdefghijklmnopqrstuvwx1234";
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, nombre_usuario: "admin", contrasena_hash: hashBcryptDeEjemplo }],
    });

    const res = await request(buildApp())
      .post("/autenticacion/login")
      .send({ nombre_usuario: "admin", password: "admin" });
    expect(res.status).toBe(401);
  }, 10000);
});