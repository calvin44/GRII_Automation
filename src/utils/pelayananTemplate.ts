interface GetTemplateInput extends PenatalayanInfo {
  date: string
}

type PenatalayanInfoWithoutDate = Omit<GetTemplateInput, 'date'>

export function getTemplate(penatalayan: GetTemplateInput) {
  const { date, ...penatalayanInfo } = penatalayan
  const trimmedObject = trimObjectValues<PenatalayanInfoWithoutDate>(penatalayanInfo)

  const {
    Liturgis,
    "Song leader": songLeader,
    "Pemusik": pemusik,
    "Usher": usher,
    "Audio Visual": audioVisual,
    "Doa Persembahan": doaPersembahan
  } = trimmedObject

  return `Selamat malam semua, bagi penatalayanan pada ${date}

KU  (pk 10.30)
Liturgis: ${Liturgis}  
Song leader: ${songLeader}
Pemusik: ${pemusik}
Usher: ${usher}
Audio Visual: ${audioVisual}
Doa Persembahan: ${doaPersembahan}

Diingatkan kembali bagi semua penatalayan untuk berbusana yang sopan saat melayani!
Mohon mempersiapkan diri dgn baik untuk melayani dalam ibadah. God bless u all!!

${generateMention(trimmedObject)}
`
}

function trimObjectValues<T extends Record<string, string>>(obj: T): T {
  const trimmedObj: Partial<T> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key].trim()
      if (value === "-") {
        value = ""
      }
      trimmedObj[key] = value as T[Extract<keyof T, string>]
    }
  }

  return trimmedObj as T
}

function generateMention(obj: PenatalayanInfoWithoutDate): string {
  return Object.values(obj)
    .flatMap(value => value.split(",").map(name => name.trim()))
    .filter(name => name.length > 0)
    .map(name => `@${name}`)
    .join("\n");
}
