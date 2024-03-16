import { CalendarificCountryDto } from "../../dtos/calendarific/CalendarificCountriesDto";

export class CalendarificCountry {
  public name: string;
  public id:   string;
  public flag: string;

  constructor(dto: CalendarificCountryDto) {
    this.name = dto.country_name;
    this.id   = dto["iso-3166"];
    this.flag = dto.flag_unicode;
  }
}
