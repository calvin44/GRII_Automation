interface GetTemplateInput extends PentalayanInfo {
  date: string
}

export function getTemplate(
  {
    date,
    Liturgis,
    "Song leader 1": songLeader1,
    "Song leader 2": songLeader2,
    Pemusik,
    "Usher 1": usher1,
    "Usher 2": usher2,
    "Audio Visual": audioVisual,
    "Doa Persembahan": doaPersembahan
  }: GetTemplateInput) {
  if (!date.length) { date = "21 April 2024" }
  return `Selamat malam semua, bagi penatalayanan pada ${date}

KU  (pk 10.30)
Liturgis: ${Liturgis.trim()}  
Song leader: ${songLeader1.trim()}${songLeader2.length > 0 ? ", " + songLeader2.trim() : ""}
Pianist: ${Pemusik.trim()}
Usher: ${usher1.trim()}${usher2.length > 0 ? ", " + usher2.trim() : ""}
Audio Visual: ${audioVisual.trim()}
Doa Persembahan: ${doaPersembahan.trim()}

Diingatkan kembali bagi semua penatalayan untuk berbusana yng sopan saat melayani!
Mohon mempersiapkan diri dgn baik untuk melayani dalam ibadah. God bless u all!!
`
}

