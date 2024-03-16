import { NamedayDto } from "../../dtos/nameday/NamedayDto";

export class NamedayModel {
  public countryId: string;
  public day:       number;
  public month:     number;
  public whom:      string;

  constructor(dto: NamedayDto) {
    const countryId = Object.keys(dto.nameday)[0];
    this.countryId  = countryId;
    this.day        = dto.day;
    this.month      = dto.month;
    this.whom       = dto.nameday[countryId];
  }
}
