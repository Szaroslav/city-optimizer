import Express from "express";
import "dotenv/config";

import { Calendarific } from "./api/Calendarific";
import { CalendarificHolidays } from "./models/calendarific/CalendarificHolidays";
import { Nameday } from "./api/Nameday";
import { NamedayModel } from "./models/nameday/NamedayModel";
import { CalendarificCountry } from "./models/calendarific/CalendarificCountry";

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
const { NAMEDAY_TODAY_URL } = process.env;
if (NAMEDAY_TODAY_URL == undefined) {
  throw new Error("Nameday today route URL is not defined");
}
const PORT = process.env.PORT ?? 9333;

const app = Express();
app.use(Express.static("public"));
app.set("views", "./src/templates");
app.set("view engine", "ejs");

let countries: CalendarificCountry[] | null = null;

const calendarific = new Calendarific(
  CALENDARIFIC_API_KEY,
  CALENDARIFIC_COUNTRIES_URL,
  CALENDARIFIC_HOLIDAYS_URL);
const nameday = new Nameday(NAMEDAY_TODAY_URL);


app.get("/", async (_, res) => {
  if (!countries) {
    countries = (await calendarific.fetchCountries()).response.countries
      .map(country => new CalendarificCountry(country));
  }

  res.render("home", { countries });
});

app.get("/v1/country-calendar-info", async (req, res) => {
  const { country } = req.query;
  if (!country || typeof country !== "string") {
    let message: string;
    if (!country) {
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
    const holidaysDto            = await calendarific.fetchHolidays(country),
          holidays               = new CalendarificHolidays(country, holidaysDto).holidays,
          holidaysCount          = calendarific.countHolidays(holidays),
          remainingHolidays      = calendarific.getRemainingHolidaysThisYear(holidays),
          remainingHolidaysCount = calendarific.countHolidays(remainingHolidays);

    let todayNameDay: NamedayModel | undefined;
    if (await nameday.isCountryIdSupported(country)) {
      const todayNamedayDto = await nameday.fetchTodayNameday(country);
      todayNameDay          = new NamedayModel(todayNamedayDto);
    }

    res.render("calendar-info", {
      totalHolidaysCount: holidaysCount,
      remainingHolidays,
      remainingHolidaysCount,
      nextHoliday: remainingHolidays[0],
      todayNameDay,
    });
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
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
