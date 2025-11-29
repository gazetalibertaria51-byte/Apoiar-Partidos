
export interface StateSupport {
  code: string;
  name: string;
  count: number;
}

export interface PartyDetails {
  id: string; // Unique identifier for navigation
  name: string;
  fullName?: string; // For the full name in the list/card
  cnpj: string;
  status: string;
  president: string;
  totalSupport: number;
  // Additional fields for the list view
  registrationDate?: string;
  contact?: string;
}

export interface SearchResult {
  text: string;
  sources: { uri: string; title: string }[];
}

export enum LoginStep {
  CPF = 'CPF',
  PASSWORD = 'PASSWORD',
  FACIAL_INSTRUCTIONS = 'FACIAL_INSTRUCTIONS',
  FACIAL_SCAN = 'FACIAL_SCAN',
  SUCCESS = 'SUCCESS'
}
