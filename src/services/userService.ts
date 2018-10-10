import User from '../database/models/user.model';
import { GoogleJWT } from './googleClient';
import { Role } from '../auth/role';

export default class UserService {
  public static async getOrCreateUserFromJWT(jwt: GoogleJWT): Promise<User> {
    const existingUser: User = await User.findOne({where: {email: jwt.email}});

    if (existingUser) {
      return existingUser;
    }

    return await new User({
      email: jwt.email,
      firstName: jwt.given_name,
      lastName: jwt.family_name,
      role: Role.USER,
    }).save();
  }
}
