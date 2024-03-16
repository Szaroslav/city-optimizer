import Express from "express";
import "dotenv/config";

import { Calendarific } from "./api/Calendarific";
import { CalendarificHolidays } from "./models/calendarific/CalendarificHolidays";

const { CALENDARIFIC_API_KEY } = process.env;
if (CALENDARIFIC_API_KEY == undefined) {
  throw new Error("Calendarific API key is not defined");
}
const { CALENDARIFIC_HOLIDAYS_URL } = process.env;
if (CALENDARIFIC_HOLIDAYS_URL == undefined) {
  throw new Error("Calendarific holidays route URL is not defined");
}
const { CALENDARIFIC_COUNTRIES_URL } = process.env;
if (CALENDARIFIC_COUNTRIES_URL == undefined) {
  throw new Error("Calendarific countries route URL is not defined");
}
const PORT = process.env.PORT ?? 9333;

const app = Express();
const calendarific = new Calendarific(
  CALENDARIFIC_API_KEY,
  CALENDARIFIC_COUNTRIES_URL,
  CALENDARIFIC_HOLIDAYS_URL);

app.get("/", (_, res) => {
  res.send("Pot Holding");
});

app.get("/v1/country-calendar-info", async (req, res) => {
  const { countryId } = req.query;
  if (!countryId || typeof countryId !== "string") {
    let message: string;
    if (!countryId) {
      message = "Country ID is not defined";
    }
    else {
      message = "Country ID is not a string";
    }

    res.status(400);
    res.send({ message });
    return;
  }

  try {
    const holidaysDto = await calendarific.fetchHolidays(countryId),
          holidays    = new CalendarificHolidays(countryId, holidaysDto);

    res.send(holidays);
  }
  catch (error) {
    res.status(400);
    if (error instanceof Error) {
      res.send({ message: error.message });
    }
    else {
      res.send({ message: "Something went wrong" });
    }
  }

  res.send();
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
