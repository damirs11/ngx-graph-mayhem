const idCache: Record<string, boolean> = {};
/**
 * Generates a short id.
 *
 */
export function id(): string {
  let newId = ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);

  newId = `a${newId}`;

  // ensure not already used
  if (!idCache[newId]) {
    idCache[newId] = true;
    return newId;
  }

  return id();
}
