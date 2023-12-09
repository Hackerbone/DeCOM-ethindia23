import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pushRouter from "./functions/push.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.use("/api/push", pushRouter);
    app.post("/send-notification", async (req, res) => {
      try {
        console.log(req.body);
      } catch (error) {
        console.log(error);
      }
    });

    app.listen(8080, () => {
      console.log(`Example app listening at http://localhost:8080/`);
    });
  } catch (error) {
    console.log(error);
  }
})();

// Compare this snippet from src/services/push.service.js:
// },
// });
