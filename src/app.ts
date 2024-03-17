import { HttpStatusCode } from "./HttpStatusCode";
import Express, {
  Request,
  Response,
  NextFunction
} from "express";
import "dotenv/config";

import { Calendarific } from "./api/Calendarific";
import { CalendarificHolidays } from "./models/calendarific/CalendarificHolidays";
import { Nameday } from "./api/Nameday";
import { NamedayModel } from "./models/nameday/NamedayModel";
import { CalendarificCountry } from "./models/calendarific/CalendarificCountry";
import { ServerError } from "./ServerError";

const { AUTH_TOKEN } = process.env;
if (AUTH_TOKEN == undefined) {
  throw new Error("Auth token is not defined");
}
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

app.get("/v1/country-calendar-info", async (req, res, next) => {
  const { country, token } = req.query;
  if (token !== AUTH_TOKEN) {
    return next(new ServerError(HttpStatusCode.BadRequest, "Your authorization token is invalid"));
  }
  if (!country || typeof country !== "string") {
    let message: string;
    if (!country) {
      message = "Country code is not defined";
    }
    else {
      message = "Country code is not a string";
    }

    return next(new ServerError(HttpStatusCode.BadRequest, message));
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
    if (error instanceof Error) {
      next(error);
    }
    else {
      next(new ServerError(HttpStatusCode.InternalError, "Something went wrong"));
    }
  }
});

app.use((err: Error, _: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode: HttpStatusCode;
  if (err instanceof ServerError) {
    statusCode = err.statusCode;
  }
  else {
    statusCode = HttpStatusCode.InternalError;
  }

  res
    .status(statusCode)
    .render("error", { errorCode: statusCode, error: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
