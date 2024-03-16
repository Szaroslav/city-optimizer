import {
  CalendarificHolidaysDto,
  HolidayType
} from "../../dtos/calendarific/CalendarificHolidaysDto";

export class CalendarificHolidays {
  public countryId: string;
  public holidays:  CalendarificHoliday[];

  constructor(countryId: string, dto: CalendarificHolidaysDto) {
    this.countryId = countryId;
    this.holidays  = this.getHolidaysFromDto(dto);
  }

  private getHolidaysFromDto(dto: CalendarificHolidaysDto): CalendarificHoliday[] {
    return dto.response.holidays.map((holiday => ({
      name: holiday.name,
      description: holiday.description,
      date: new Date(holiday.date.iso),
      type: holiday.primary_type,
    })));
  }
}

export interface CalendarificHoliday {
  name:        string;
  description: string;
  date:        Date;
  type:        HolidayType;
}
