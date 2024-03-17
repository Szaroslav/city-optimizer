import { ServerError } from "../ServerError";

export class FetchService {
  protected async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ServerError(
        response.status, "Fetch error: " + response.statusText);
    }
    return response.json();
  }
}
