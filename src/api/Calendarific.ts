import { FetchService } from "./FetchService";

import { HttpStatusCode } from "../HttpStatusCode";
import { ServerError } from "../ServerError";

import { CalendarificHolidaysDto } from "../dtos/calendarific/CalendarificHolidaysDto";
import { CalendarificCountriesDto } from "../dtos/calendarific/CalendarificCountriesDto";
import { CalendarificHoliday } from "../models/calendarific/CalendarificHolidays";

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
    if (response.meta.code !== HttpStatusCode.Success) {
      throw new ServerError(response.meta.code, "Fetch error");
    }
    if (Array.isArray(response.response) && !response.response.length) {
      throw new ServerError(
        HttpStatusCode.UnprocessableContent, `Country ID "${countryId}" is invalid`);
    }

    return response;
  }

  async fetchCountries(): Promise<CalendarificCountriesDto> {
    const url = this.COUNTRIES_URL
      + "?api_key=" + this.API_KEY;

    const response = await this.fetchJson<CalendarificCountriesDto>(url);
    if (response.meta.code !== HttpStatusCode.Success) {
      throw new ServerError(response.meta.code, "Fetch error");
    }

    return response;
  }

  countHolidays(holidays: CalendarificHoliday[]): number {
    return holidays.length;
  }

  getRemainingHolidaysThisYear(holidays: CalendarificHoliday[]): CalendarificHoliday[] {
    const now = new Date();
    const nextHolidays = holidays.filter(h => h.date >= now);
    return nextHolidays;
  }
}
