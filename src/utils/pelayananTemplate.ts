interface GetTemplateInput extends PentalayanInfo {
  date: string
}

type PenatalayanInfoWithoutDate = Omit<GetTemplateInput, 'date'>

export function getTemplate(penatalayan: GetTemplateInput) {
  const { date, ...penatalayanInfo } = penatalayan
  const trimmedObject = trimObjectValues<PenatalayanInfoWithoutDate>(penatalayanInfo)

  const {
    Liturgis,
    "Song leader 1": songLeader1,
    "Song leader 2": songLeader2,
    "Pemusik 1": pemusik1,
    "Pemusik 2": pemusik2,
    "Usher 1": usher1,
    "Usher 2": usher2,
    "Audio Visual": audioVisual,
    "Doa Persembahan": doaPersembahan
  } = trimmedObject

  return `Selamat malam semua, bagi penatalayanan pada ${date}

KU  (pk 10.30)
Liturgis: ${Liturgis}  
Song leader: ${songLeader1}${songLeader2 ? ", " + songLeader2 : ""}
Pemusik: ${pemusik1}${pemusik2 ? ", " + pemusik2 : ""}
Usher: ${usher1}${usher2 ? ", " + usher2 : ""}
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
  let mention = ""

  const objEntries = Object.entries(obj)
  for (const [index, [_, value]] of objEntries.entries()) {
    if (value.length === 0) continue
    if (index === objEntries.length - 1) {
      mention += "@" + value
    } else {
      mention += "@" + value + "\n"
    }
  }

  return mention
}
