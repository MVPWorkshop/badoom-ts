import HttpResponse from '../../core/http/httpResponse';
import EchoRequest from '../requests/echoRequest';
import { doc } from '../../core/docs/doc';

export default class EchoResponse extends HttpResponse {
  @doc({required: true})
  public originalMessage: string;

  @doc()
  public request?: EchoRequest;

  @doc()
  public anotherOne?: Date;

  @doc({type: Date})
  public arrayOne: Date[];

  constructor(originalMessage: string, request?: EchoRequest, anotherOne?: Date, arrayOne?: Date[]) {
    super();
    this.originalMessage = originalMessage;
    this.request = request;
    this.anotherOne = anotherOne;
    this.arrayOne = arrayOne;
  }
}
