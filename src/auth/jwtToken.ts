import User from '../database/models/user.model';
import moment from 'moment';

export default class JwtToken {
  public user: User;
  public sub: number;
  public iat: number;
  public exp: number;
  public alg: string = 'HS256';

  constructor(user: User) {
    const now = moment();
    this.user = user;
    this.sub = user.id;
    this.iat = now.unix();
    this.exp = moment(now).add(4, 'hours').unix();
  }
}
