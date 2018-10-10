import { doc } from '../../core/docs/doc';
import HttpResponse from '../../core/http/httpResponse';

export default class LoginResponse extends HttpResponse {
  @doc({required: true})
  public token: string;

  constructor(token: string) {
    super();
    this.token = token;
  }
}
