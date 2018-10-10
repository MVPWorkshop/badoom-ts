import passport from 'passport';
import passportJWT from 'passport-jwt';
import { SECRET } from '../../config/secrets';
import JwtToken from '../../auth/jwtToken';
import User from '../../database/models/user.model';
import logger from '../../util/logger';

const jwtStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

passport.use(new jwtStrategy({
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
  },
  async (jwt: JwtToken, callback: any) => {
    if (!jwt.sub) {
      logger.warn('Sub field not present in JWT');

      return callback('Unauthorized');
    }

    const user = await User.find({where: {id: jwt.sub}});

    if (!user) {
      return callback('Unauthorized');
    }

    return callback(undefined, user);
  }
));
