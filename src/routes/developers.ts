import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  db.all("SELECT * FROM developers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post("/", (req: Request, res: Response) => {
  const { name, hoursAvailable } = req.body;
  db.run(
    "INSERT INTO developers (name, hoursAvailable) VALUES (?, ?)",
    [name, hoursAvailable],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, hoursAvailable });
    }
  );
});

export default router;
