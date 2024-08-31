import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  db.all('SELECT * FROM demands ORDER BY "order" ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post("/", (req: Request, res: Response) => {
  const { name, hours, order } = req.body;
  db.run(
    'INSERT INTO demands (name, hours, "order") VALUES (?, ?, ?)',
    [name, hours, order],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, hours, order });
    }
  );
});

export default router;
