import { doc } from '../docs';

export interface HttpResponseInterface {
  new(): HttpResponse;
}

export default abstract class HttpResponse {
  @doc()
  public code: number = 200;

  public toJson(): object {
    const serialized = Object.assign({}, this);

    delete serialized['code'];

    return serialized;
  }
}
