/** Thrown only for programmer errors (e.g. non-string input). Invalid *values* are reported via `parse*().valid`, never thrown. */
export class IdentifierError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IdentifierError';
    Object.setPrototypeOf(this, IdentifierError.prototype);
  }
}

export function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new IdentifierError(`${label} must be a string`);
  }
  return value;
}
