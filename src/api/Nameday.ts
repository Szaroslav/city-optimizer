import { FetchService } from "./FetchService";
import { NamedayDto } from "../dtos/nameday/NamedayDto";

export class Nameday extends FetchService {
  private readonly TODAY_NAMEDAY_URL: string;

  constructor(todayNamedayUrl: string) {
    super();
    this.TODAY_NAMEDAY_URL = todayNamedayUrl;
  }

  async isCountryIdSupported(countryId: string): Promise<boolean> {
    try {
      const url = this.TODAY_NAMEDAY_URL
        + "?country=" + countryId.toLowerCase();
      await this.fetchJson<NamedayDto>(url);
      return true;
    }
    catch {
      return false;
    }
  }

  async fetchTodayNameday(countryId: string): Promise<NamedayDto> {
    const url = this.TODAY_NAMEDAY_URL
      + "?country=" + countryId.toLowerCase();

    const response = await this.fetchJson<NamedayDto>(url);

    return response;
  }
}
