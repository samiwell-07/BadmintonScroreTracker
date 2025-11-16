import { SAVED_NAMES_LIMIT } from '../../types/match'

export const upsertSavedName = (names: string[], name: string) => {
  const lowered = name.toLowerCase()
  const filtered = names.filter((existing) => existing.toLowerCase() !== lowered)
  return [name, ...filtered].slice(0, SAVED_NAMES_LIMIT)
}
