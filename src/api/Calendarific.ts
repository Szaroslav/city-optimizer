import { FetchService } from "./FetchService";

import { CalendarificHolidaysDto } from "../dtos/calendarific/CalendarificHolidaysDto";
import { HttpResponseCode } from "../dtos/calendarific/CalendarificMetadata";
import { Holiday } from "../models/calendarific/CalendarificHolidays";

export class Calendarific extends FetchService {
  private readonly API_KEY: string;
  private readonly COUNTRIES_URL: string;
  private readonly HOLIDAYS_URL: string;

  constructor(apiKey: string, countriesUrl: string, holidaysUrl: string) {
    super();
    this.API_KEY       = apiKey;
    this.COUNTRIES_URL = countriesUrl;
    this.HOLIDAYS_URL  = holidaysUrl;
  }

  async fetchHolidays(countryId: string): Promise<CalendarificHolidaysDto> {
    const currentYear = new Date().getFullYear();
    const url = this.HOLIDAYS_URL
      + "?api_key=" + this.API_KEY
      + "&country=" + countryId
      + "&year=" + currentYear;

    const response = await this.fetchJson<CalendarificHolidaysDto>(url);
    if (response.meta.code !== HttpResponseCode.Success) {
      throw new Error("Fetch error: " + response.meta.code);
    }
    if (Array.isArray(response.response) && !response.response.length) {
      throw new Error(`Country ID "${countryId}" is invalid`);
    }

    return response;
  }

  countHolidays(holidays: Holiday[]): number {
    return holidays.length;
  }

  getRemainingHolidaysThisYear(holidays: Holiday[]): Holiday[] {
    const now = new Date();
    const nextHolidays = holidays.filter(h => h.date >= now);
    return nextHolidays;
  }
}
