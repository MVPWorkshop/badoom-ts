import HttpError from '../../core/http/httpError';
import { doc } from '../../core/docs/doc';

export default class UnauthorizedError extends HttpError {
  @doc()
  public code: number = 401;

  @doc()
  public message: string = 'Unauthorized';
}
