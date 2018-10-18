import { doc } from '../docs';

export interface HttpResponseInterface {
  new(): HttpResponse;
}

export type Headers = { [header: string]: any };

export default abstract class HttpResponse {
  @doc()
  public code: number = 200;

  public _headers: Headers = {};

  get headers(): Headers {
    return this._headers;
  }

  public toJSON(): object {
    const serialized = Object.assign({}, this);

    delete serialized['code'];
    delete serialized['_headers'];

    return serialized;
  }
}
