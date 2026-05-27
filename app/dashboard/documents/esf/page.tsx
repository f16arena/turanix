import { getCounterparties } from "../_components/get-counterparties";
import { InvoiceEditor } from "../invoice/_editor";

export default async function EsfPage() {
  const counterparties = await getCounterparties();
  return <InvoiceEditor counterparties={counterparties} kind="esf" />;
}
