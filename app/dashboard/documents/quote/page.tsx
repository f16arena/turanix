import { getCounterparties } from "../_components/get-counterparties";
import { QuoteEditor } from "./_editor";

export default async function QuotePage() {
  const counterparties = await getCounterparties();
  return <QuoteEditor counterparties={counterparties} />;
}
