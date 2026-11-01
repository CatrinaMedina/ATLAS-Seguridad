
const request = require("supertest");
const express = require("express");

jest.mock("../db", () => ({
  pool: { query: jest.fn() }
}));

const { pool } = require("../db");
const empresaUsuariosRoutes = require("../routes/empresa_usuarios");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/empresa-usuarios", empresaUsuariosRoutes);
  return app;
}

describe("SEC-01: Control de acceso a empresa-usuarios", () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test("SEC-01: rechaza modificar vínculos sin token", async () => {
    const response = await request(buildApp())
      .put("/empresa-usuarios/1")
      .send({
        empresa_id: 1,
        usuario_id: 2,
        rol_id: 1
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("No autorizado");
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("SEC-02: rechaza modificar vínculos con token inválido", async () => {
    const response = await request(buildApp())
      .put("/empresa-usuarios/1")
      .set("Authorization", "Bearer token_invalido")
      .send({
        empresa_id: 1,
        usuario_id: 2,
        rol_id: 1
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("No autorizado");
    expect(pool.query).not.toHaveBeenCalled();
  });
  
    test("SEC-03: editor no puede modificar roles de usuarios", async () => {
    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
        {
        usuarioId: 2,
        nombreUsuario: "editor",
        empresaUsuarioId: 2,
        empresaId: 1
        },
        process.env.JWT_SECRET || "inseguro",
        { expiresIn: "1h" }
    );

    pool.query.mockResolvedValueOnce({
        rows: [{ rol_nombre: "editor" }]
    });

    const response = await request(buildApp())
        .put("/empresa-usuarios/1")
        .set("Authorization", `Bearer ${token}`)
        .send({
        empresa_id: 1,
        usuario_id: 2,
        rol_id: 1
        });

    expect(response.status).toBe(403);
    });

    
    test("SEC-04: administrador puede modificar vínculos de su empresa", async () => {
    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
        {
        usuarioId: 1,
        nombreUsuario: "admin",
        empresaUsuarioId: 1,
        empresaId: 1
        },
        process.env.JWT_SECRET || "inseguro",
        { expiresIn: "1h" }
    );

    pool.query
        .mockResolvedValueOnce({
        rows: [{ rol_nombre: "administrador" }]
        })
        .mockResolvedValueOnce({
        rows: [{
            id: 2,
            empresa_id: 1,
            usuario_id: 2,
            rol_id: 2
        }]
        })
        .mockResolvedValueOnce({ rows: [] });

    const response = await request(buildApp())
        .put("/empresa-usuarios/2")
        .set("Authorization", `Bearer ${token}`)
        .send({
        empresa_id: 1,
        usuario_id: 2,
        rol_id: 2
        });

    expect(response.status).toBe(200);
    expect(response.body.empresa_id).toBe(1);
    expect(response.body.rol_id).toBe(2);
    expect(pool.query).toHaveBeenCalledTimes(3);
    });

    test("SEC-05: administrador no puede modificar otra empresa", async () => {
    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
        {
        usuarioId: 1,
        nombreUsuario: "admin",
        empresaUsuarioId: 1,
        empresaId: 1
        },
        process.env.JWT_SECRET || "inseguro",
        { expiresIn: "1h" }
    );

    pool.query.mockResolvedValueOnce({
        rows: [{ rol_nombre: "administrador" }]
    });

    const response = await request(buildApp())
        .put("/empresa-usuarios/2")
        .set("Authorization", `Bearer ${token}`)
        .send({
        empresa_id: 2,
        usuario_id: 2,
        rol_id: 1
        });

    expect(response.status).toBe(403);
    expect(pool.query).toHaveBeenCalledTimes(1);
    });

    
    test("SEC-06: administrador no puede modificar un vínculo de otra empresa", async () => {
    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
        {
        usuarioId: 1,
        nombreUsuario: "admin",
        empresaUsuarioId: 1,
        empresaId: 1
        },
        process.env.JWT_SECRET || "inseguro",
        { expiresIn: "1h" }
    );

    pool.query
        .mockResolvedValueOnce({
        rows: [{ rol_nombre: "administrador" }]
        })
        .mockResolvedValueOnce({
        rows: []
        });

    const response = await request(buildApp())
        .put("/empresa-usuarios/99")
        .set("Authorization", `Bearer ${token}`)
        .send({
        empresa_id: 1,
        usuario_id: 2,
        rol_id: 2
        });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No encontrado");
    expect(pool.query).toHaveBeenCalledTimes(2);

    const updateCall = pool.query.mock.calls[1];

    expect(updateCall[0]).toMatch(/WHERE id\s*=\s*\$3 AND empresa_id\s*=\s*\$4/i);
    expect(updateCall[1]).toEqual([2, 2, "99", 1]);
    });

    
    test("SEC-07: rechaza consultar vínculos sin autenticación", async () => {
    pool.query.mockResolvedValueOnce({
        rows: [{
        id: 1,
        empresa_id: 1,
        usuario_id: 2,
        rol_id: 2
        }]
    });

    const response = await request(buildApp())
        .get("/empresa-usuarios/1");

    expect(response.status).toBe(401);
    expect(pool.query).not.toHaveBeenCalled();
    });

    test("SEC-08: rechaza eliminar vínculos sin autenticación", async () => {
    pool.query
        .mockResolvedValueOnce({
        rows: [{
            id: 1,
            empresa_id: 1,
            usuario_id: 2,
            rol_id: 2
        }]
        })
        .mockResolvedValueOnce({ rows: [] });

    const response = await request(buildApp())
        .delete("/empresa-usuarios/1");

    expect(response.status).toBe(401);
    expect(pool.query).not.toHaveBeenCalled();
    });

    
    test("SEC-09: editor no puede crear vínculos de usuarios", async () => {
    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
        {
        usuarioId: 2,
        nombreUsuario: "editor",
        empresaUsuarioId: 2,
        empresaId: 1
        },
        process.env.JWT_SECRET || "inseguro",
        { expiresIn: "1h" }
    );

    pool.query.mockImplementation(async (sql) => {
        if (/^\s*SELECT\b/i.test(sql)) {
        return { rows: [{ rol_nombre: "editor" }] };
        }

        if (/^\s*INSERT\s+INTO\s+empresa_usuarios\b/i.test(sql)) {
        return {
            rows: [{
            id: 99,
            empresa_id: 1,
            usuario_id: 2,
            rol_id: 1
            }]
        };
        }

        return { rows: [] };
    });

    const response = await request(buildApp())
        .post("/empresa-usuarios")
        .set("Authorization", `Bearer ${token}`)
        .send({
        usuario_id: 2,
        rol_id: 1
        });

    expect(response.status).toBe(403);

    const inserciones = pool.query.mock.calls.filter(
        ([sql]) => /^\s*INSERT\s+INTO\s+empresa_usuarios\b/i.test(sql)
    );

    expect(inserciones).toHaveLength(0);
    });

});
