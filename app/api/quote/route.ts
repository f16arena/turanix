import { NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  HeadingLevel,
  WidthType,
  BorderStyle,
  ShadingType,
} from "docx";
import { createClient } from "../../_lib/supabase/server";
import { getCurrentOrg } from "../../_lib/org";

export const runtime = "nodejs";

type Item = { name: string; unit: string; qty: number; price: number };

type Body = {
  number: string;
  date: string;
  intro: string;
  outro: string;
  sender: {
    name: string;
    bin: string;
    phone: string;
    email: string;
    address: string;
  };
  receiver: { company: string; person: string; bin?: string | null };
  counterparty_id?: string | null;
  counterparty_snapshot?: Record<string, unknown> | null;
  terms: {
    validity: string;
    delivery: string;
    payment: string;
    extra: string;
  };
  items: Item[];
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const org = await getCurrentOrg();
  if (!org) return new NextResponse("Unauthorized", { status: 401 });

  const body = (await req.json()) as Body;
  const total = body.items.reduce((s, i) => s + i.qty * i.price, 0);

  // Сохраняем в архив документов параллельно
  await supabase.from("documents").insert({
    organization_id: org.id,
    kind: "quote",
    number: body.number,
    date: body.date,
    counterparty_id: body.counterparty_id ?? null,
    counterparty_snapshot: body.counterparty_snapshot ?? {
      name: body.receiver.company,
      bin: body.receiver.bin ?? null,
    },
    payload: body as unknown as Record<string, unknown>,
    total,
    status: "issued",
  });

  const accent = "1A5BFF";
  const accentLight = "E6EEFF";

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      cell("№", { bold: true, color: "FFFFFF", fill: accent, align: AlignmentType.CENTER, width: 6 }),
      cell("Наименование", { bold: true, color: "FFFFFF", fill: accent, width: 44 }),
      cell("Ед.", { bold: true, color: "FFFFFF", fill: accent, align: AlignmentType.CENTER, width: 10 }),
      cell("Кол-во", { bold: true, color: "FFFFFF", fill: accent, align: AlignmentType.RIGHT, width: 12 }),
      cell("Цена", { bold: true, color: "FFFFFF", fill: accent, align: AlignmentType.RIGHT, width: 14 }),
      cell("Сумма", { bold: true, color: "FFFFFF", fill: accent, align: AlignmentType.RIGHT, width: 14 }),
    ],
  });

  const itemRows = body.items.map(
    (it, i) =>
      new TableRow({
        children: [
          cell(String(i + 1), { align: AlignmentType.CENTER, fill: i % 2 === 0 ? "FFFFFF" : "F4F6FB" }),
          cell(it.name, { fill: i % 2 === 0 ? "FFFFFF" : "F4F6FB" }),
          cell(it.unit, { align: AlignmentType.CENTER, fill: i % 2 === 0 ? "FFFFFF" : "F4F6FB" }),
          cell(numFmt(it.qty), { align: AlignmentType.RIGHT, fill: i % 2 === 0 ? "FFFFFF" : "F4F6FB" }),
          cell(numFmt(it.price) + " ₸", { align: AlignmentType.RIGHT, fill: i % 2 === 0 ? "FFFFFF" : "F4F6FB" }),
          cell(numFmt(it.qty * it.price) + " ₸", { align: AlignmentType.RIGHT, bold: true, fill: i % 2 === 0 ? "FFFFFF" : "F4F6FB" }),
        ],
      }),
  );

  const totalRow = new TableRow({
    children: [
      cell("Итого к оплате", { bold: true, colSpan: 5, align: AlignmentType.RIGHT, fill: accentLight }),
      cell(numFmt(total) + " ₸", { bold: true, align: AlignmentType.RIGHT, fill: accentLight }),
    ],
  });

  const itemsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: solidBorders(),
    rows: [headerRow, ...itemRows, totalRow],
  });

  const termsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: solidBorders(),
    rows: [
      termsRow("Срок действия", body.terms.validity, accentLight),
      termsRow("Срок поставки", body.terms.delivery, accentLight),
      termsRow("Условия оплаты", body.terms.payment, accentLight),
      termsRow("Дополнительно", body.terms.extra, accentLight),
    ],
  });

  const doc = new Document({
    creator: "Turanix",
    title: `КП ${body.number}`,
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Коммерческое предложение № ${body.number}`,
                bold: true,
                color: accent,
                size: 36,
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 280 },
            children: [
              new TextRun({
                text: `от ${formatDate(body.date)}`,
                italics: true,
                color: "555555",
              }),
            ],
          }),

          partyBlock("Отправитель", [
            body.sender.name,
            `БИН: ${body.sender.bin}`,
            `Тел: ${body.sender.phone}`,
            `Email: ${body.sender.email}`,
            body.sender.address,
          ]),

          partyBlock("Получатель", [
            body.receiver.company || "—",
            body.receiver.person ? `Контактное лицо: ${body.receiver.person}` : "",
          ].filter(Boolean)),

          paragraph(body.intro, { after: 280 }),

          sectionHeading("Состав предложения", accent),
          itemsTable,

          spacer(),

          sectionHeading("Условия", accent),
          termsTable,

          spacer(),

          paragraph(body.outro, { after: 0 }),

          new Paragraph({
            spacing: { before: 800 },
            children: [
              new TextRun({
                text: "Подпись руководителя ____________________",
                color: "333333",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(buffer as unknown as BlobPart, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="quote-${body.number}.docx"`,
    },
  });
}

function cell(
  text: string,
  opts: {
    bold?: boolean;
    color?: string;
    fill?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    width?: number;
    colSpan?: number;
  } = {},
) {
  return new TableCell({
    columnSpan: opts.colSpan,
    width: opts.width
      ? { size: opts.width, type: WidthType.PERCENTAGE }
      : undefined,
    shading: opts.fill
      ? { type: ShadingType.CLEAR, color: "auto", fill: opts.fill }
      : undefined,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: opts.align,
        children: [
          new TextRun({
            text,
            bold: opts.bold,
            color: opts.color,
            font: "Arial",
          }),
        ],
      }),
    ],
  });
}

function termsRow(label: string, value: string, fill: string) {
  return new TableRow({
    children: [
      cell(label, { bold: true, fill, width: 30 }),
      cell(value || "—", { width: 70 }),
    ],
  });
}

function partyBlock(title: string, lines: string[]) {
  return new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({ text: `${title}: `, bold: true, color: "1A5BFF" }),
      new TextRun({ text: lines.join("  ·  "), color: "333333" }),
    ],
  });
}

function paragraph(text: string, opts: { after?: number } = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 200 },
    children: [new TextRun({ text, color: "222222" })],
  });
}

function sectionHeading(text: string, color: string) {
  return new Paragraph({
    spacing: { before: 200, after: 140 },
    children: [
      new TextRun({ text, bold: true, color, size: 26, font: "Arial" }),
    ],
  });
}

function spacer() {
  return new Paragraph({ children: [new TextRun({ text: "" })] });
}

function solidBorders() {
  const c = { style: BorderStyle.SINGLE, size: 4, color: "D5DCE6" };
  return {
    top: c,
    bottom: c,
    left: c,
    right: c,
    insideHorizontal: c,
    insideVertical: c,
  };
}

function numFmt(n: number) {
  return new Intl.NumberFormat("ru-KZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ru-KZ", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
