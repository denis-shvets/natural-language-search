export type ISOTimestamp = 'ISO-8601 UTC timestamp';

export type Domain = {
  name: string;
  parameters: Record<string, string[] | ISOTimestamp>;
};

export type Domains = [Domain, ...Domain[]];

export type Config = {
  apiKey: string;
  model: string;
  domains: Domains;
};

type Role = 'system' | 'user';

export type Message = {
  role: Role;
  content: string;
};
