import cors from "cors";
import { createObjectCsvWriter } from "csv-writer";
import express, { Request, Response } from "express";
import path from "path";
import db from "./db";
import demandRoutes from "./routes/demands";
import developerRoutes from "./routes/developers";
import { allocateDemandsToDevelopers } from "./services/allocation";
import { Demand, Developer } from "./utils/interfaces";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/demands", demandRoutes);
app.use("/developers", developerRoutes);

app.post("/allocate", (req: Request, res: Response) => {
  db.all("SELECT * FROM demands", [], (err, demands: Demand[]) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all("SELECT * FROM developers", [], (err, developers: Developer[]) => {
      if (err) return res.status(500).json({ error: err.message });

      if (demands.length === 0 || developers.length === 0) {
        return res.status(400).json({
          error: "Nenhuma demanda ou desenvolvedor disponível para alocação.",
        });
      }

      const result = allocateDemandsToDevelopers(demands, developers);

      const csvPath = path.join(__dirname, "../public/allocation_result.csv");
      const csvWriter = createObjectCsvWriter({
        path: csvPath,
        header: [
          { id: "developer", title: "Developer" },
          { id: "demand", title: "Demand" },
          { id: "hours", title: "Hours" },
          { id: "remainingHours", title: "Remaining Hours" },
        ],
      });

      const csvData = result.flatMap((alloc) =>
        alloc.allocatedDemands.map((demand) => ({
          developer: alloc.developer.name,
          demand: demand.name,
          hours: demand.hours,
          remainingHours: alloc.remainingHours,
        }))
      );

      if (csvData.length === 0) {
        return res
          .status(400)
          .json({ error: "Nenhuma alocação disponível para gerar o CSV." });
      }

      csvWriter
        .writeRecords(csvData)
        .then(() => {
          console.log("Arquivo CSV gerado com sucesso.");
          res.json({ result, csvPath: "/allocation_result.csv" });
        })
        .catch((err) => {
          console.error("Erro ao gerar o arquivo CSV:", err);
          res.status(500).json({ error: "Erro ao gerar o arquivo CSV" });
        });
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
