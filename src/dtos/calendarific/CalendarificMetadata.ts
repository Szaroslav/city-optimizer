export interface CalendarificMetadata {
  code: HttpResponseCode;
}

export enum HttpResponseCode {
  Success              = 200,
  Unauthorized         = 401,
  UnprocessableContent = 422,
  InternalError        = 500,
  TooManyRequests      = 429,
  Unavailable          = 503,
}
