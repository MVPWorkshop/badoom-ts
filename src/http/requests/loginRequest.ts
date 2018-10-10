import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import HttpRequest from '../../core/http/httpRequest';

export default class LoginRequest extends HttpRequest {
  @IsNotEmpty()
  @IsString()
  public access_token: string;

  @IsNotEmpty()
  @IsNumber()
  public expires_at: number;

  @IsNotEmpty()
  @IsNumber()
  public expires_in: number;

  @IsNotEmpty()
  @IsNumber()
  public first_issued_at: number;

  @IsNotEmpty()
  @IsString()
  public id_token: string;

  @IsNotEmpty()
  @IsString()
  public idpId: string;

  @IsNotEmpty()
  @IsString()
  public login_hint: string;

  @IsNotEmpty()
  @IsString()
  public token_type: string;
}
