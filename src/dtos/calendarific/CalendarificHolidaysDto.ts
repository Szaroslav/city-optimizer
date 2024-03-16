import { CalendarificMetadata } from "./CalendarificMetadata";

export interface CalendarificHolidaysDto {
  meta:     CalendarificMetadata;
  response: Response;
}

interface Response {
  holidays: Holiday[];
}

interface Holiday {
  name:          string;
  description:   string;
  country:       Country;
  date:          DateClass;
  primary_type:  HolidayType;
  type:          HolidayType[];
  canonical_url: string;
  urlid:         string;
  locations:     string;
  states:        State[] | "All";
}

export interface Country {
  id:   string;
  name: string;
}

interface DateClass {
  iso:       string;
  datetime:  DateTime;
  timezone?: Timezone;
}

interface DateTime {
  year:    number;
  month:   number;
  day:     number;
  hour?:   number;
  minute?: number;
  second?: number;
}

interface Timezone {
  offset:          string;
  zoneabb:         string;
  zoneoffset:      number;
  zonedst:         number;
  zonetotaloffset: number;
}

export interface State {
  id:        number;
  abbrev:    string | null;
  name:      string;
  exception: string | null;
  iso:       string;
}

export enum HolidayType {
  Christian                     = "Christian",
  ClockChangeDaylightSavingTime = "Clock change/Daylight Saving Time",
  CommonLocalHoliday            = "Common local holiday",
  DeFactoHoliday                = "De facto holiday",
  FlagDay                       = "Flag day",
  HalfDayHoliday                = "Half-day holiday",
  Hebrew                        = "Hebrew",
  Hinduism                      = "Hinduism",
  LocalHoliday                  = "Local holiday",
  LocalObservance               = "Local observance",
  Muslim                        = "Muslim",
  NationalHoliday               = "National holiday",
  Observance                    = "Observance",
  OptionalHoliday               = "Optional holiday",
  Orthodox                      = "Orthodox",
  Season                        = "Season",
  SportingEvent                 = "Sporting event",
  UnitedNationsObservance       = "United Nations observance",
  Weekend                       = "Weekend",
  WorldwideObservance           = "Worldwide observance",
}
