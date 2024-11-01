interface GetTemplateInput extends PenatalayanInfo {
  date: string
}

type PenatalayanInfoWithoutDate = Omit<GetTemplateInput, "date">

export function getTemplate(penatalayan: GetTemplateInput) {
  const { date, ...penatalayanInfo } = penatalayan

  const {
    Liturgis,
    "Song leader": songLeader,
    Pemusik: pemusik,
    Usher: usher,
    "Audio Visual": audioVisual,
    "Doa Persembahan": doaPersembahan,
  } = penatalayanInfo

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

${generateMention(penatalayanInfo)}
`
}

function generateMention(obj: PenatalayanInfoWithoutDate): string {
  return Object.values(obj)
    .flatMap((value) => value.split(",").map((name) => name.trim()))
    .filter((name) => name.length > 0)
    .map((name) => `@${name}`)
    .join("\n")
}
