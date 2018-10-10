import { Request, Response } from 'express';
import LoginResponse from '../responses/loginResponse';
import { route } from '../../core/http/route';
import { HttpMethod } from '../../core/http/httpMethod';
import requestType from '../../core/http/requestType';
import LoginRequest from '../requests/loginRequest';
import GoogleClient from '../../services/googleClient';
import UserService from '../../services/userService';
import UnauthorizedError from '../errors/unauthorizedError';
import jwtService from 'jsonwebtoken';
import { SECRET } from '../../config/secrets';
import JwtToken from '../../auth/jwtToken';

export class Auth {
  @route(HttpMethod.POST, '/auth/login')
  @requestType(LoginRequest)
  async login(request: Request, response: Response, input: LoginRequest): Promise<LoginResponse | UnauthorizedError> {
    const googleJWT = await GoogleClient.validateJWT(input.id_token);

    if (!googleJWT) {
      return new UnauthorizedError();
    }

    const user = await UserService.getOrCreateUserFromJWT(googleJWT);

    const jwt = new JwtToken(user);

    const token: string = await jwtService.sign(JSON.stringify(jwt), SECRET);

    return new LoginResponse(token);
  }
}
