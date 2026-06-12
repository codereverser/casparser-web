export interface FileUploader {
    hasFiles: boolean;
    files: FileList;
  }
  
  interface StatementPeriod {
    from: string;
    to: string;
  }
  
  interface InvestorInfo {
    name: string;
    email: string;
    address: string;
    mobile: string;
  }
  
  interface Transaction {
    date: string | Date;
    description: string;
    amount: number;
    units: number | null;
    nav: number | null;
    balance: number;
    type: string;
    dividend_rate: number | null;
  }
  
  interface SchemeValuation {
    date: string | Date;
    nav: number;
    value: number;
  }
  
  export interface Scheme {
    scheme: string;
    advisor: string;
    rta_code: string;
    rta: string;
    isin: string | null;
    amfi: string | null;
    open: number;
    close: number;
    close_calculated: number;
    valuation: SchemeValuation;
    transactions: Transaction[];
  }
  
  export interface Folio {
    folio: string;
    amc: string;
    PAN: string;
    KYC: string;
    PANKYC: string;
    schemes: Scheme[];
  }
  
  type CASParserData = {
    statement_period: StatementPeriod;
    folios: Folio[];
    investor_info: InvestorInfo;
    cas_type: string;
    file_type: string;
    parse_warnings: string[];
  }
  export type { CASParserData };

  export interface DematOwner {
    name: string;
    PAN: string;
  }

  export interface Equity {
    name: string | null;
    isin: string;
    num_shares: number | string;
    price: number | string;
    value: number | string;
    symbol: string | null;
    exchange: string | null;
  }

  export interface Bond {
    name: string | null;
    isin: string;
    num_bonds: number | string;
    value: number | string;
    face_value: number | string | null;
    coupon_rate: number | string | null;
    coupon_frequency: string | null;
    maturity_date: string | null;
    market_price: number | string | null;
  }

  export interface DematMutualFund {
    name: string | null;
    isin: string;
    amfi: string | null;
    type: string | null;
    balance: number | string;
    nav: number | string;
    value: number | string;
    avg_cost: number | string | null;
    total_cost: number | string | null;
    ucc: string | null;
    folio: string | null;
    pnl: number | string | null;
    return: number | string | null;
  }

  export interface DematAccount {
    name: string;
    type: string;
    dp_id: string | null;
    client_id: string | null;
    folios: number;
    balance: number | string;
    owners: DematOwner[];
    equities: Equity[];
    mutual_funds: DematMutualFund[];
    bonds: Bond[];
  }

  type NSDLCASData = {
    accounts: DematAccount[];
    statement_period: StatementPeriod;
    investor_info: InvestorInfo;
    file_type: string;
  }
  export type { NSDLCASData };
  
  export interface GainEntry {
    fy: string;
    fund: string;
    isin: string;
    type: string;
    buy_date: string;
    buy_price: number;
    stamp_duty: number;
    sell_date: string;
    sell_price: number;
    coa: number;
    stt: number;
    units: number;
    ltcg: number;
    stcg: number;
    tax_ltcg: number;
  }
  
  export interface Fund {
    name: string;
    isin: string;
    type: string;
  }

  export interface GainFund {
    scheme: string
    isin: string
    type: string
    folio: string
  }
  
  export interface TotalGains {
    ltcg: number;
    stcg: number;
    tax_ltcg: number;
    tax_stcg: number;
  }
  
  export interface FundGains {
    fy: str;
    fund: GainFund;
    total: TotalGains;
    txns: GainEntry[];
  }
  
  export interface FYSummary {
    funds: FundGains[];
    total: TotalGains;
  }
  
  export interface GainsData {
    [fy: string]: FYSummary;
  }
  
  export interface StatsData {
    invested: number;
    current: number;
  }
  
export interface InputFileEvent extends Event {
    target: HTMLInputElement;
}