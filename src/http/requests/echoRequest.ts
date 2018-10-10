import { IsNotEmpty, IsString } from 'class-validator';
import HttpRequest from '../../core/http/httpRequest';

export default class EchoRequest extends HttpRequest {
  @IsNotEmpty()
  @IsString()
  public message: string;
}
