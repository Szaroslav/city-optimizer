export enum HttpStatusCode {
  Success              = 200,
  BadRequest           = 400,
  Unauthorized         = 401,
  UnprocessableContent = 422,
  InternalError        = 500,
  TooManyRequests      = 429,
  Unavailable          = 503,
}
