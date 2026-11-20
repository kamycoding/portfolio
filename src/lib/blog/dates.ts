const berlin = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Berlin', timeZoneName: 'longOffset' })

/*
 * Posts carry calendar days, structured data wants a full ISO 8601 date and time: midnight in Germany stands for
 * the day. German clocks change at 01:00 UTC, so the offset at 00:00 UTC is still the one of local midnight.
 */
export const berlinMidnight = (day: string) => {
  const zone = berlin.formatToParts(new Date(`${day}T00:00:00Z`)).find(part => part.type === 'timeZoneName')
  const offset = /[+-]\d{2}:\d{2}$/.exec(zone?.value ?? '')?.[0]

  if (!offset) throw new Error(`No Europe/Berlin offset for ${day}.`)

  return `${day}T00:00:00${offset}`
}
