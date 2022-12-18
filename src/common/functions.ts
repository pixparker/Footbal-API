/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const date = new Date();

export const today = {
  day: date.getDate(),
  month: date.getMonth() + 1,
  year: date.getFullYear(),
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms || 1000));
}
