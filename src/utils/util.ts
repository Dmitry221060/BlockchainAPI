export function formatTimestamp(date: Date = new Date()): string {
  const day = padToTwoNum(date.getDate()),
    month = padToTwoNum(date.getMonth() + 1),
    year = date.getFullYear(),
    hour = padToTwoNum(date.getHours()),
    minute = padToTwoNum(date.getMinutes()),
    second = padToTwoNum(date.getSeconds());

  return `[${day}.${month}.${year} ${hour}:${minute}:${second}]`;
}

export function padToTwoNum(str: number): string {
  const length = 2;
  return `0${str}`.slice(-length);
}
