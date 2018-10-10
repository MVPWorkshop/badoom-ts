import BitGoJS from 'bitgo';

import { BITGO_ACCESS_KEY, BITGO_ENVIRONMENT } from '../config/secrets';

const BitGo = new BitGoJS.BitGo({
  accessToken: BITGO_ACCESS_KEY,
  env: BITGO_ENVIRONMENT,
});

export default BitGo;
