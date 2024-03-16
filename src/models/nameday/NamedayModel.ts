import { NamedayDto } from "../../dtos/nameday/NamedayDto";

export class NamedayModel {
  public countryId: string;
  public day:       number;
  public month:     number;
  public nameday:   { [countryName: string]: string };

  constructor(dto: NamedayDto) {
    this.countryId = Object.keys(dto.nameday)[0];
    this.day       = dto.day;
    this.month     = dto.month;
    this.nameday   = dto.nameday;
  }
}
