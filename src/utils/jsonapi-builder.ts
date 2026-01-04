import type { JsonApiDocument, ResourceObject, Links, LinkObject, Meta } from '../types/jsonapi-type.js';

export class JsonApiBuilder {
  private data: ResourceObject | ResourceObject[] | null = null;
  private included: ResourceObject[] = [];
  private links: Links = {};
  private meta: Meta = {};
  private errors: any[] = [];
  private jsonapi = { version: '1.1' };

  // Data methods
  setData(data: ResourceObject | ResourceObject[] | null): this {
    this.data = data;
    return this;
  }

  addResource(resource: ResourceObject): this {
    if (!this.data) {
      this.data = resource;
    } else if (Array.isArray(this.data)) {
      this.data.push(resource);
    } else {
      this.data = [this.data, resource];
    }
    return this;
  }

  addIncluded(resource: ResourceObject): this {
    // Prevent duplicates
    if (!this.included.some(r => r.type === resource.type && r.id === resource.id)) {
      this.included.push(resource);
    }
    return this;
  }

  // Links methods
  addLink(key: string, link: string | LinkObject): this {
    this.links[key] = link;
    return this;
  }

  addPaginationLinks(
    baseUrl: string,
    currentPage: number,
    totalPages: number,
    pageSize: number,
    totalItems: number
  ): this {
    this.links = {
      self: `${baseUrl}?page[number]=${currentPage}&page[size]=${pageSize}`,
      first: `${baseUrl}?page[number]=1&page[size]=${pageSize}`,
      last: `${baseUrl}?page[number]=${totalPages}&page[size]=${pageSize}`,
      ...(currentPage > 1 && {
        prev: `${baseUrl}?page[number]=${currentPage - 1}&page[size]=${pageSize}`
      }),
      ...(currentPage < totalPages && {
        next: `${baseUrl}?page[number]=${currentPage + 1}&page[size]=${pageSize}`
      })
    };

    this.meta = {
      ...this.meta,
      totalPages,
      totalItems,
      currentPage,
      pageSize
    };

    return this;
  }

  // Meta methods
  addMeta(key: string, value: any): this {
    this.meta[key] = value;
    return this;
  }

  // Error handling
  addError(error: any): this {
    this.errors.push({
      status: error.status || '500',
      title: error.title || 'Internal Server Error',
      detail: error.detail || error.message,
      ...(error.source && { source: error.source }),
      ...(error.code && { code: error.code })
    });
    return this;
  }

  // Build response
  build(): JsonApiDocument {
    const response: JsonApiDocument = {
      jsonapi: this.jsonapi
    };

    if (this.errors.length > 0) {
      response.errors = this.errors;
    } else {
      if (this.data !== undefined) response.data = this.data;
      if (this.included.length > 0) response.included = this.included;
      if (Object.keys(this.links).length > 0) response.links = this.links;
      if (Object.keys(this.meta).length > 0) response.meta = this.meta;
    }

    return response;
  }

  // MongoDB document to JSON:API resource
  static documentToResource(
    doc: any,
    type: string,
    attributesMap: Record<string, string> = {},
    relationshipsMap: Record<string, string> = {}
  ): ResourceObject {
    const resource: ResourceObject = {
      type,
      id: doc._id.toString(),
      attributes: {}
    };

    // Map attributes
    Object.entries(attributesMap).forEach(([jsonApiKey, mongoKey]) => {
      if (doc[mongoKey] !== undefined) {
        (resource.attributes as any)[jsonApiKey] = doc[mongoKey];
      }
    });

    // Handle virtuals
    if (doc.questionCount !== undefined) {
      (resource.attributes as any)['question-count'] = doc.questionCount;
    }

    // Add timestamps if they exist
    if (doc.createdAt) {
      (resource.attributes as any)['created-at'] = doc.createdAt.toISOString();
    }
    if (doc.updatedAt) {
      (resource.attributes as any)['updated-at'] = doc.updatedAt.toISOString();
    }

    // Add relationships if provided
    if (Object.keys(relationshipsMap).length > 0) {
      resource.relationships = {};
      Object.entries(relationshipsMap).forEach(([relName, field]) => {
        if (doc[field]) {
          if (Array.isArray(doc[field])) {
            resource.relationships![relName] = {
              data: doc[field].map((id: any) => ({
                type: field,
                id: id.toString()
              }))
            };
          } else {
            resource.relationships![relName] = {
              data: {
                type: field,
                id: doc[field].toString()
              }
            };
          }
        }
      });
    }

    return resource;
  }
}