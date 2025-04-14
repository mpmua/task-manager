const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send(`API is up and running! ${req.body}`);
});
