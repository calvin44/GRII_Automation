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
Liturgis: ${Liturgis}  
Song leader: ${songLeader1} ${songLeader2.length > 0 ? "," + songLeader2 : ""}
Pianist: ${Pemusik}
Usher: ${usher1} ${usher2.length > 0 ? "," + usher2 : ""}
Audio Visual: ${audioVisual}
Doa Persembahan: ${doaPersembahan}

Diingatkan kembali bagi semua penatalayan untuk berbusana yng sopan saat melayani!
Mohon mempersiapkan diri dgn baik untuk melayani dalam ibadah. God bless u all!!
`
}

