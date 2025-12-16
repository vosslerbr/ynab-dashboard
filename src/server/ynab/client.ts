import * as ynab from "ynab";

export function getYnabClient(accessToken: string) {
  return new ynab.API(accessToken);
}
