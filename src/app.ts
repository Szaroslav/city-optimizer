import Express from "express";
import "dotenv/config";

const PORT = process.env.PORT ?? 9333;

const app = Express();

app.get("/", (_, res) => {
  res.send("Pot Holding");
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
