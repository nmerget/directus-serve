export interface DirectusFile {
  id: string;
  location?: string;
  tags?: string[];
}

export interface ServeConfig {
  latest?: string;
  versionQueryParam?: string;
  contentNotFound?: string;
}
