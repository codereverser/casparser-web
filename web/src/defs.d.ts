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

interface Scheme {
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

interface Folio {
  folio: string;
  amc: string;
  PAN: string;
  KYC: string;
  PANKYC: string;
  schemes: Scheme[];
}

export interface CASParserData {
  statement_period: StatementPeriod;
  folios: Folio[];
  investor_info: InvestorInfo;
  cas_type: string;
  file_type: string;
}
