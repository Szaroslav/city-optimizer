export interface NamedayDto {
  day:     number;
  month:   number;
  nameday: { [countryId: string]: string };
}
