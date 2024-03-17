import { CalendarificCountryDto } from "../../dtos/calendarific/CalendarificCountriesDto";

export class CalendarificCountry {
  public name: string;
  public code: string;
  public flag: string;

  constructor(dto: CalendarificCountryDto) {
    this.name = dto.country_name;
    this.code = dto["iso-3166"];
    this.flag = dto.flag_unicode;
  }
}
