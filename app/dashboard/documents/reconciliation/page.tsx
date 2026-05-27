import { getCounterparties } from "../_components/get-counterparties";
import { ReconciliationEditor } from "./_editor";

export default async function ReconciliationPage() {
  const counterparties = await getCounterparties();
  return <ReconciliationEditor counterparties={counterparties} />;
}
