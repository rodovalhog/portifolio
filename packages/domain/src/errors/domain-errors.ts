export abstract class DomainError extends Error {
  public abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProfileNotFoundError extends DomainError {
  public readonly code = "PROFILE_NOT_FOUND";
  constructor(identifier = "default") {
    super(`Professional profile '${identifier}' was not found.`);
  }
}

export class ProjectNotFoundError extends DomainError {
  public readonly code = "PROJECT_NOT_FOUND";
  constructor(slug: string) {
    super(`Project with slug '${slug}' was not found.`);
  }
}

export class ExperienceNotFoundError extends DomainError {
  public readonly code = "EXPERIENCE_NOT_FOUND";
  constructor(id: string) {
    super(`Experience with id '${id}' was not found.`);
  }
}

export class UnauthorizedError extends DomainError {
  public readonly code = "UNAUTHORIZED";
  constructor(message = "Unauthorized access.") {
    super(message);
  }
}

export class ForbiddenError extends DomainError {
  public readonly code = "FORBIDDEN";
  constructor(message = "Access forbidden to requested resource.") {
    super(message);
  }
}

export class InvalidLocaleError extends DomainError {
  public readonly code = "INVALID_LOCALE";
  constructor(locale: string) {
    super(`Locale '${locale}' is not supported. Supported locales: 'pt-BR', 'en-US'.`);
  }
}
