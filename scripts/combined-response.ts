import "dotenv/config";
import { CalendarificCountriesDto } from "../src/dtos/calendarific/CalendarificCountriesDto";

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

async function combinedResponse() {
  const rawResponse = await fetch(`${CALENDARIFIC_COUNTRIES_URL}?api_key=${CALENDARIFIC_API_KEY}`),
        response    = await rawResponse.json() as CalendarificCountriesDto,
        countries   = response.response.countries,
        currentYear = new Date().getFullYear();

  let result: object[] = [];
  for (const country of countries) {
    const id = country["iso-3166"];
    const url = CALENDARIFIC_HOLIDAYS_URL
      + "?api_key=" + CALENDARIFIC_API_KEY
      + "&country=" + id
      + "&year=" + currentYear;
    const rawResponse = await fetch(url),
          response    = await rawResponse.json(),
          holidays    = response.response.holidays;
    result = [ ...result, ...holidays ];
  }

  console.log(JSON.stringify(result, null, 2));
}

combinedResponse();
