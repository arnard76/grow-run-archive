import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import Timezone from 'dayjs/plugin/timezone.js';
import DayJSUtc from 'dayjs/plugin/utc.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(Timezone);
dayjs.extend(DayJSUtc);

export default dayjs;
