import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
export default defineNuxtPlugin(() => {
  Intl.DateTimeFormat().resolvedOptions().timeZone = 'Asia/Tehran'
  process.env.TZ = 'Asia/Tehran'
  // eslint-disable-next-line import/no-named-as-default-member
  dayjs.extend(utc)
  // eslint-disable-next-line import/no-named-as-default-member
  dayjs.extend(timezone)
  // eslint-disable-next-line import/no-named-as-default-member
  dayjs.extend(jalaliday)
  dayjs.tz.setDefault('Asia/Tehran')
  // @ts-ignore
  dayjs.calendar('jalali')
})
