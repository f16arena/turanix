import { getCounterparties } from "../_components/get-counterparties";
import { InvoiceEditor } from "./_editor";

export default async function InvoicePage() {
  const counterparties = await getCounterparties();
  return <InvoiceEditor counterparties={counterparties} />;
}
