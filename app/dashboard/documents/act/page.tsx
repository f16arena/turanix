import { getCounterparties } from "../_components/get-counterparties";
import { ActEditor } from "./_editor";

export default async function ActPage() {
  const counterparties = await getCounterparties();
  return <ActEditor counterparties={counterparties} />;
}
