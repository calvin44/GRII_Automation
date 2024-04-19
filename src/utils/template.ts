interface getTemplateInput {
  date: string
}

export function getTemplate({ date }: getTemplateInput) {
  if (!date.length) { date = "21 April 2024" }
  return `Selamat malam semua, bagi penatalayanan pada tgl 21 April 2024

KU  (pk 10.30)
Liturgis @Lukas Gandajaya 顏恩文  
Song leader @Frederik 郭薩爾 @Meitty Mulyadi 李沛芳
Pianist  @calvin
Penyambut & Kolektan  @rebecca h 丘一廷 @Erivita sakti 薩艾薇
Audio Visual @(台）楊學聰 John Yeo S.
Doa Persembahan @Felix Harsono 何宜晃

Diingatkan kembali bagi semua penatalayan untuk berbusana yng sopan saat melayani!
Mohon mempersiapkan diri dgn baik untuk melayani dalam ibadah. God bless u all!!
`
}

