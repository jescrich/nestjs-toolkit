export class Urn {
  static compose(params: { entity: string; id: string, system?: string }): string {
    const { entity, id, system } = params;
    const base = `urn:${entity}:${id}`;
    return system ? `urn:${base}:vendor:${system}` : base;
  }

  static entity(urn: string): string {
    return urn.split(':')[2];
  }

  static id(urn: string): string {
    return this.key(urn, this.entity(urn));
  }

  static system(urn: string): string {
    return urn.split(':')[1];
  }

  static key(urn: string, key: string): string {
    const urnRegex = /([^:]+):([^:]+)/g;

    const parts: { [key: string]: string } = {};

    let match;
    while ((match = urnRegex.exec(urn)) !== null) {
      parts[match[1]] = match[2];
    }

    delete parts['urn'];

    return parts[key];
  }

  static isValid(urn: string): boolean {
    const parts = urn.split(':');
    return parts.length >= 3 && parts[0] === 'urn' && parts[1] !== '' && parts[2] !== '';
  }

  static value(urn: string, key: string): string | null {
    const parts = urn.split(':');

    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i] === key) {
        return parts[i + 1];
      }
    }

    return null; // Return null if the key is not found
  }
}
