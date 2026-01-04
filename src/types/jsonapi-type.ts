import { Types } from "mongoose";

export interface JsonApiDocument {
  jsonapi?: { version: string };
  data?: ResourceObject | ResourceObject[] | null;
  included?: ResourceObject[];
  links?: Links;
  meta?: Meta;
  errors?: JsonApiError[];
}

export interface ResourceObject {
  type: string;
  id: string;
  attributes?: Record<string, any>;
  relationships?: Relationships;
  links?: Links;
  meta?: Meta;
}

export interface Relationships {
  [key: string]: Relationship;
}

export interface Relationship {
  data: ResourceIdentifier | ResourceIdentifier[] | null;
  links?: Links;
  meta?: Meta;
}

export interface ResourceIdentifier {
  type: string;
  id: string;
}

export interface Links {
  self?: string;
  related?: string;
  first?: string;
  last?: string;
  prev?: string;
  next?: string;
  [key: string]: string | LinkObject | undefined;
}

export interface LinkObject {
  href?: string;
  meta?: Meta;
}

export interface Meta {
  [key: string]: any;
}

export interface JsonApiError {
  id?: string;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: Meta;
}

export interface MongoosePopulateOptions {
  path: string;
  select?: string;
  match?: any;
  options?: any;
}

export interface QueryParams {
  fields?: Record<string, string[]>;
  include?: string[];
  sort?: string[];
  filter?: Record<string, any>;
  page?: {
    number?: number;
    size?: number;
    offset?: number;
    limit?: number;
  };
}

export interface QuizQueryParams extends QueryParams {
  filter?: {
    category?: string;
    difficulty?: string;
    isPublished?: boolean;
    isPublic?: boolean;
    author?: string;
    tags?: string[];
    search?: string;
  };
}