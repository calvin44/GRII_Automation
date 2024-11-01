import { months } from "@/constants/month"

function getNextMonthAndYear() {
  // Get the current date
  const currentDate = new Date()

  // Calculate the next month
  let nextMonth = currentDate.getMonth() + 1
  let nextYear = currentDate.getFullYear()

  // If the next month exceeds 12, adjust the month and year accordingly
  if (nextMonth > 11) {
    nextMonth = 0 // January (0-indexed)
    nextYear++
  }

  // Format the next month and year as a strings
  const nextMonthString = new Date(nextYear, nextMonth).toLocaleDateString(
    "en-US",
    { month: "long" }
  )
  const nextYearString = nextYear.toString()

  // Concatenate the month and year strings
  const nextMonthAndYear = nextMonthString + " " + nextYearString

  return nextMonthAndYear
}

function getNextMonthDatesForDay(dayName: string): string[] {
  // Get the current date
  const currentDate = new Date()

  // Get the next month
  const nextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  )

  // Initialize an array to store dates for the given day
  const dates: string[] = []

  // Loop through each day of the next month
  for (let day = 1; day <= 31; day++) {
    const currentDate = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      day
    )

    // Check if the day matches the given day name
    if (currentDate.toLocaleString("en-US", { weekday: "long" }) === dayName) {
      // Format the date as "9 May" and add it to the array
      const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString(
        "en-US",
        { month: "long" }
      )}`
      dates.push(formattedDate)
    }
  }

  return dates
}

function getCurrentMonthAndYear(monthOffset: number = 0): string {
  const currentDate: Date = new Date()
  const currentMonth: string = months[currentDate.getMonth() + monthOffset]
  const currentYear: number = currentDate.getFullYear()

  return `${currentMonth} ${currentYear}`
}

function closestSundayDate() {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const currentYear = today.getFullYear()

  // Calculate the difference in days to the next Sunday
  const daysUntilNextSunday = 7 - dayOfWeek

  // Adjust the date to the next Sunday
  const nextSunday = new Date(
    today.getTime() + daysUntilNextSunday * 24 * 60 * 60 * 1000
  )

  // Format the date as "D MMM"
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" }
  const formattedDate = nextSunday.toLocaleDateString("en-US", options)

  // Convert the formatted date to "D MMM" format
  const [month, day] = formattedDate.split(" ")
  return {
    month: month,
    monthDate: `${day} ${month}`,
    fullDate: `${day} ${month} ${currentYear}`,
  }
}

export {
  getNextMonthAndYear,
  getNextMonthDatesForDay,
  getCurrentMonthAndYear,
  closestSundayDate,
}
