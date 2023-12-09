const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/push", require("./functions/push"));

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
// Compare this snippet from src/services/push.service.js:
// },
// });
