import HttpError from '../../core/http/httpError';
import { doc } from '../../core/docs/doc';

export default class NotFoundError extends HttpError {
  @doc()
  public code: number = 404;

  @doc()
  public message: string = 'Not found';
}
