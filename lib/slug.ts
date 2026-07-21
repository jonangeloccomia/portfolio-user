const MAX_ATTEMPTS = 5;

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "user";
}

type DuplicateKeyError = Error & { code?: number; keyPattern?: Record<string, unknown> };

function isDuplicateSlugError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const mongoError = error as DuplicateKeyError;
  return mongoError.code === 11000 && !!mongoError.keyPattern?.slug;
}

export async function withUniqueSlug<T>(
  base: string,
  attempt: (candidate: string) => Promise<T>
): Promise<T> {
  const root = slugify(base);
  let candidate = root;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      return await attempt(candidate);
    } catch (error) {
      if (!isDuplicateSlugError(error) || i === MAX_ATTEMPTS - 1) {
        throw error;
      }
      candidate = `${root}-${i + 2}`;
    }
  }

  throw new Error("Could not generate a unique slug");
}
