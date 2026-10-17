
export const parseNumber = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return NaN
  return Number(value)
}
