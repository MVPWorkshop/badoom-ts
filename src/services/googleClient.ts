import { GOOGLE_CLIENT_ID, VALID_LOGIN_DOMAINS } from '../config/secrets';
import Axios, { AxiosResponse } from 'axios';
import logger from '../util/logger';

export interface GoogleJWT {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  hd: string;
  email: string;
  email_verified: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
}

export default class GoogleClient {
  public static async validateJWT(jwt: string): Promise<GoogleJWT | undefined> {
    let response: AxiosResponse;
    try {
      response = await Axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
        params: {
          id_token: jwt,
        }
      });
    } catch (e) {
      logger.warn(`Google login error: ${e}`);

      return undefined;
    }

    const googleJwt: GoogleJWT = response.data;

    if (
      googleJwt.email_verified !== 'true' ||
      VALID_LOGIN_DOMAINS.indexOf(googleJwt.hd) === -1 ||
      googleJwt.aud !== GOOGLE_CLIENT_ID
    ) {
      return undefined;
    }

    return googleJwt;
  }
}
