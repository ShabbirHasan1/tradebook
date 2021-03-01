export const formatPeriod = (period: number) => {
  const year = Math.floor(period / 100);
  const month = period - year * 100;
  let monthString = ``;
  switch (month) {
    case 1:
      monthString = `Jan`;
      break;
    case 2:
      monthString = `Feb`;
      break;
    case 3:
      monthString = `Mar`;
      break;
    case 4:
      monthString = `Apr`;
      break;
    case 5:
      monthString = `May`;
      break;
    case 6:
      monthString = `Jun`;
      break;
    case 7:
      monthString = `Jul`;
      break;
    case 8:
      monthString = `Aug`;
      break;
    case 9:
      monthString = `Sep`;
      break;
    case 10:
      monthString = `Oct`;
      break;
    case 11:
      monthString = `Nov`;
      break;
    case 12:
      monthString = `Dec`;
      break;
    default:
      monthString = ``;
      break;
  }
  return monthString.concat(` `, year.toString());
};

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((response) => response.json());
