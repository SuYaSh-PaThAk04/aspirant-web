const BASE_LENGTH = 12;
const RANDOM_MIN = 10_000;
const RANDOM_MAX = 99_999;

export function normalizeUsername(value: string) {
  return value.replace(/^@+/, "").replace(/[^\w.-]/g, "").slice(0, 30);
}

export function suggestUsername(name = "") {
  const source = name.trim() || "aspirant";
  const base =
    source
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^0-9a-z]/g, "")
      .slice(0, BASE_LENGTH) || "aspirant";
  const randomNumber = Math.floor(RANDOM_MIN + Math.random() * (RANDOM_MAX - RANDOM_MIN));
  return `${base}-${randomNumber}`;
}
