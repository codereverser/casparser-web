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
}
export type { CASParserData };

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
  name: str;
  isin: str;
  type: str;
}

export interface TotalGains {
  ltcg: number;
  stcg: number;
  tax_ltcg: number;
  tax_stcg: number;
}

export interface FundGains {
  fy: str;
  fund: Fund;
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
