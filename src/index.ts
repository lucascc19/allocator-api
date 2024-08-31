import cors from "cors";
import express, { Request, Response } from "express";
import db from "./db";
import demandRoutes from "./routes/demands";
import developerRoutes from "./routes/developers";
import { allocateDemandsToDevelopers } from "./services/allocation";
import { Demand, Developer } from "./utils/interfaces";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/demands", demandRoutes);
app.use("/developers", developerRoutes);

app.post("/allocate", (req: Request, res: Response) => {
  db.all("SELECT * FROM demands", [], (err, demands: Demand[]) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all("SELECT * FROM developers", [], (err, developers: Developer[]) => {
      if (err) return res.status(500).json({ error: err.message });

      const result = allocateDemandsToDevelopers(demands, developers);
      res.json(result);
    });
  });
});

app.delete("/reset", (req: Request, res: Response) => {
  db.run("DELETE FROM demands", (err) => {
    if (err) return res.status(500).json({ error: err.message });
  });

  db.run("DELETE FROM developers", (err) => {
    if (err) return res.status(500).json({ error: err.message });
  });

  res
    .status(200)
    .json({ message: "Todas as alocações foram removidas com sucesso!" });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
