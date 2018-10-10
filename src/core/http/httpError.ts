import HttpResponse from './httpResponse';

export default abstract class HttpError extends HttpResponse {
  public code: number = 400;
  public message?: string;
}
