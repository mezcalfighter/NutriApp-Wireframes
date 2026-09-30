import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7bac5156/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== NUTRITIONIST ROUTES =====

// Get nutritionist info (including branding settings)
app.get("/make-server-7bac5156/nutritionist/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const nutritionist = await kv.get(`nutritionist:${id}`);
    
    if (!nutritionist) {
      return c.json({ error: "Nutritionist not found" }, 404);
    }
    
    return c.json(nutritionist);
  } catch (error) {
    console.log(`Error fetching nutritionist: ${error}`);
    return c.json({ error: "Failed to fetch nutritionist", details: String(error) }, 500);
  }
});

// Update nutritionist info (including branding)
app.put("/make-server-7bac5156/nutritionist/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    // Get existing nutritionist data
    const existing = await kv.get(`nutritionist:${id}`) || {};
    
    // Merge updates with existing data
    const updated = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`nutritionist:${id}`, updated);
    
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.log(`Error updating nutritionist: ${error}`);
    return c.json({ error: "Failed to update nutritionist", details: String(error) }, 500);
  }
});

// Get all patients for a nutritionist
app.get("/make-server-7bac5156/nutritionist/:id/patients", async (c) => {
  try {
    const nutritionistId = c.req.param("id");
    
    // Get list of patient IDs for this nutritionist
    const patientIds = await kv.get(`nutritionist:${nutritionistId}:patients`) || [];
    
    // Fetch all patient details
    const patients = await Promise.all(
      patientIds.map(async (patientId: string) => {
        const patient = await kv.get(`patient:${patientId}`);
        return patient;
      })
    );
    
    return c.json(patients.filter(p => p !== null));
  } catch (error) {
    console.log(`Error fetching nutritionist patients: ${error}`);
    return c.json({ error: "Failed to fetch patients", details: String(error) }, 500);
  }
});

// ===== PATIENT ROUTES =====

// Create a new patient
app.post("/make-server-7bac5156/patients", async (c) => {
  try {
    const patientData = await c.req.json();
    
    if (!patientData.nutritionistId) {
      return c.json({ error: "nutritionistId is required" }, 400);
    }
    
    // Generate a unique patient ID
    const patientId = `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const patient = {
      ...patientData,
      id: patientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Store patient data
    await kv.set(`patient:${patientId}`, patient);
    
    // Add patient to nutritionist's patient list
    const nutritionistPatients = await kv.get(`nutritionist:${patientData.nutritionistId}:patients`) || [];
    nutritionistPatients.push(patientId);
    await kv.set(`nutritionist:${patientData.nutritionistId}:patients`, nutritionistPatients);
    
    return c.json({ success: true, data: patient }, 201);
  } catch (error) {
    console.log(`Error creating patient: ${error}`);
    return c.json({ error: "Failed to create patient", details: String(error) }, 500);
  }
});

// Get patient info
app.get("/make-server-7bac5156/patients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const patient = await kv.get(`patient:${id}`);
    
    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }
    
    return c.json(patient);
  } catch (error) {
    console.log(`Error fetching patient: ${error}`);
    return c.json({ error: "Failed to fetch patient", details: String(error) }, 500);
  }
});

// Update patient info
app.put("/make-server-7bac5156/patients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    // Get existing patient data
    const existing = await kv.get(`patient:${id}`);
    
    if (!existing) {
      return c.json({ error: "Patient not found" }, 404);
    }
    
    // Merge updates (don't allow changing nutritionistId)
    const updated = {
      ...existing,
      ...updates,
      id,
      nutritionistId: existing.nutritionistId, // Keep original nutritionist
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`patient:${id}`, updated);
    
    return c.json({ success: true, data: updated });
  } catch (error) {
    console.log(`Error updating patient: ${error}`);
    return c.json({ error: "Failed to update patient", details: String(error) }, 500);
  }
});

// Delete patient
app.delete("/make-server-7bac5156/patients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    // Get patient to find nutritionist
    const patient = await kv.get(`patient:${id}`);
    
    if (!patient) {
      return c.json({ error: "Patient not found" }, 404);
    }
    
    // Remove patient from nutritionist's list
    const nutritionistPatients = await kv.get(`nutritionist:${patient.nutritionistId}:patients`) || [];
    const updatedList = nutritionistPatients.filter((pid: string) => pid !== id);
    await kv.set(`nutritionist:${patient.nutritionistId}:patients`, updatedList);
    
    // Delete patient data
    await kv.del(`patient:${id}`);
    
    return c.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    console.log(`Error deleting patient: ${error}`);
    return c.json({ error: "Failed to delete patient", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);