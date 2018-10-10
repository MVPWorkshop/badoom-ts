declare module 'bitgo' {
  export interface BitGoClientOptions {
    env?: string;
    accessToken: string;
  }

  export class BitGo {
    constructor(options: BitGoClientOptions);

    coin(coin: string): Coin;
  }

  export class Coin {
    wallets(): Wallets;
  }

  export class Wallets {
    list(options?: ListOptions): Promise<WalletListResponse>;
  }

  export class WalletListResponse {
    coin: string;
    nextBatchPrevId?: string;
    wallets: Wallet[];
  }

  export class Wallet {
    _wallet: WalletData;

    id(): string;

    approvalsRequired(): number;

    balance(): number | undefined;

    confirmedBalance(): number | undefined;

    spendableBalance(): number | undefined;

    balanceString(): string;

    confirmedBalanceString(): string;

    spendableBalanceString(): string;

    coin(): Currency;
  }

  export class WalletData {
    id: string;
    label: string;
    coin: Currency;
    keys: string[];
    users: User[];
    approvalsRequired: number;
    balance?: number;
    spendableBalance?: number;
    confirmedBalance?: number;
    balanceString: string;
    spendableBalanceString: string;
    confirmedBalanceString: string;
    admin: { [policyName: string]: Policy };
  }

  export interface ListOptions {
    limit?: number;
    prevId?: string;
    allTokens?: boolean;
  }

  export interface User {
    user: string;
    permissions: string[];
  }

  export interface Policy {
    id: string;
    label: string;
    version: number;
    date: string;
    rules: Rule[];
  }

  type ActionType = 'deny' | 'getapproval';

  export interface Rule {
    id: string;
    coin: string;
    type: string;
    action: Action;
    condition: Condition;
  }

  export interface Action {
    type: ActionType;
  }

  export interface Condition {
    amountString?: string;
    timeWindow: number;
    groupTags: string[];
    excludeTags: string[];
  }

  type Currency =
    'btc'
    | 'bch'
    | 'btg'
    | 'dash'
    | 'eth'
    | 'ltc'
    | 'rmg'
    | 'xrp'
    | 'zec'
    | 'aion'
    | 'ana'
    | 'ant'
    | 'appc'
    | 'ast'
    | 'bat'
    | 'bbx'
    | 'bcap'
    | 'bid'
    | 'bnt'
    | 'bnty'
    | 'btt'
    | 'brd'
    | 'cag'
    | 'cbc'
    | 'cdt'
    | 'cel'
    | 'chsb'
    | 'cln'
    | 'cpay'
    | 'cvc'
    | 'dai'
    | 'dent'
    | 'echt'
    | 'egl'
    | 'elf'
    | 'fun'
    | 'gen'
    | 'gnt'
    | 'hold'
    | 'hst'
    | 'ind'
    | 'kin'
    | 'knc'
    | 'lion'
    | 'lnc'
    | 'mdx'
    | 'mfg'
    | 'mkr'
    | 'mtl'
    | 'nas'
    | 'nexo'
    | 'neu'
    | 'nmr'
    | 'omg'
    | 'opt'
    | 'pay'
    | 'plc'
    | 'poly'
    | 'powr'
    | 'ppt'
    | 'pro'
    | 'qash'
    | 'qrl'
    | 'qvt'
    | 'rdn'
    | 'reb'
    | 'rebl'
    | 'rep'
    | 'salt'
    | 'shk'
    | 'snov'
    | 'snt'
    | 'srnt'
    | 'storj'
    | 'storm'
    | 'ten'
    | 'tkx'
    | 'tnt'
    | 'trst'
    | 'tusd'
    | 'upp'
    | 'ukg'
    | 'wax'
    | 'wtc'
    | 'xrl'
    | 'zil'
    | 'zrx'
    | 'tbtc'
    | 'tbch'
    | 'tdash'
    | 'teth'
    | 'terc'
    | 'tltc'
    | 'trmg'
    | 'txrp'
    | 'tzec';
}
