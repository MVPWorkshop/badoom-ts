import { doc } from '../docs/doc';

export interface HttpResponseInterface {
  new(): HttpResponse;
}

export default abstract class HttpResponse {
  @doc()
  public code: number = 200;

  public toJSON(): object {
    const serialized = Object.assign({}, this);

    delete serialized['code'];

    return serialized;
  }
}
