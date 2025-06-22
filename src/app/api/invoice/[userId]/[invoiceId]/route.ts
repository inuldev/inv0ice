import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/connectDB";
import { formatCurrency, TCurrencyKey } from "@/lib/utils";
import InvoiceModel, { IInvoice } from "@/models/invoice.model";
import SettingModel, { ISettings } from "@/models/setting.model";

// Helper function to filter out empty address lines
function getAddressLines(
  address1?: string,
  address2?: string | null,
  address3?: string | null
): string[] {
  const lines = [address1, address2, address3].filter(
    (line) => line && line.trim() !== ""
  );
  return lines as string[];
}

// Helper function to get image dimensions while maintaining aspect ratio
function getImageDimensions(
  maxWidth: number,
  maxHeight: number,
  aspectRatio: number
) {
  let width = maxWidth;
  let height = maxWidth / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }

  return { width, height };
}

// Professional PDF Invoice Generator
async function generateProfessionalInvoice(
  invoice: IInvoice,
  settings: ISettings
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Constants
  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  const MARGIN = 15;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const PRIMARY_COLOR = "#2563eb"; // Professional blue
  const SECONDARY_COLOR = "#64748b"; // Gray
  const TEXT_COLOR = "#1e293b"; // Dark gray
  const LIGHT_GRAY = "#f8fafc";

  let currentY = MARGIN;

  // === HEADER SECTION ===
  // Top accent line
  doc.setFillColor(PRIMARY_COLOR);
  doc.rect(0, 0, PAGE_WIDTH, 4, "F");
  currentY += 6;

  // Logo section (left side)
  if (settings.invoiceLogo) {
    try {
      // Smaller, more compact logo size
      const logoMaxWidth = 30;
      const logoMaxHeight = 10;
      doc.addImage(
        settings.invoiceLogo,
        MARGIN,
        currentY,
        logoMaxWidth,
        logoMaxHeight
      );
    } catch (error) {
      console.log("Error adding logo:", error);
    }
  }

  // Invoice title (right side) - smaller font size
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(PRIMARY_COLOR);
  doc.text("INVOICE", PAGE_WIDTH - MARGIN, currentY + 10, { align: "right" });

  currentY += 20;

  // === INVOICE INFO SECTION ===
  // Company info (left side)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(TEXT_COLOR);
  doc.text(invoice.from.name, MARGIN, currentY);

  currentY += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(SECONDARY_COLOR);
  doc.text(invoice.from.email, MARGIN, currentY);

  currentY += 3;
  const fromAddressLines = getAddressLines(
    invoice.from.address1,
    invoice.from.address2,
    invoice.from.address3
  );
  fromAddressLines.forEach((line) => {
    currentY += 3;
    doc.text(line, MARGIN, currentY);
  });

  // Invoice details (right side) - positioned at same level as company name
  const invoiceDetailsY = currentY - fromAddressLines.length * 3 - 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(SECONDARY_COLOR);

  const rightColumnX = PAGE_WIDTH - MARGIN - 60;
  doc.text("Invoice No:", rightColumnX, invoiceDetailsY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(TEXT_COLOR);
  doc.text(invoice.invoice_no, PAGE_WIDTH - MARGIN, invoiceDetailsY, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(SECONDARY_COLOR);
  doc.text("Invoice Date:", rightColumnX, invoiceDetailsY + 4);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(TEXT_COLOR);
  doc.text(
    format(invoice.invoice_date, "dd MMM yyyy"),
    PAGE_WIDTH - MARGIN,
    invoiceDetailsY + 4,
    { align: "right" }
  );

  doc.setFont("helvetica", "normal");
  doc.setTextColor(SECONDARY_COLOR);
  doc.text("Due Date:", rightColumnX, invoiceDetailsY + 8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(TEXT_COLOR);
  doc.text(
    format(invoice.due_date, "dd MMM yyyy"),
    PAGE_WIDTH - MARGIN,
    invoiceDetailsY + 8,
    { align: "right" }
  );

  currentY += 15;

  // === BILL TO SECTION ===
  doc.setFillColor(LIGHT_GRAY);
  doc.rect(MARGIN, currentY, CONTENT_WIDTH, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(PRIMARY_COLOR);
  doc.text("BILL TO", MARGIN + 3, currentY + 4);

  currentY += 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(TEXT_COLOR);
  doc.text(invoice.to.name, MARGIN, currentY);

  currentY += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(SECONDARY_COLOR);
  doc.text(invoice.to.email, MARGIN, currentY);

  currentY += 3;
  const toAddressLines = getAddressLines(
    invoice.to.address1,
    invoice.to.address2,
    invoice.to.address3
  );
  toAddressLines.forEach((line) => {
    currentY += 3;
    doc.text(line, MARGIN, currentY);
  });

  currentY += 10;

  // === ITEMS TABLE ===
  // Table header
  const tableStartY = currentY;
  const itemColWidth = 85;
  const qtyColWidth = 25;
  const priceColWidth = 35;
  const totalColWidth = 40;

  // Calculate positions to align with totals section
  const totalColumnRightEdge = PAGE_WIDTH - MARGIN; // Same as totals section

  doc.setFillColor(PRIMARY_COLOR);
  doc.rect(MARGIN, currentY, CONTENT_WIDTH, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor("#ffffff");

  doc.text("DESCRIPTION", MARGIN + 3, currentY + 5);
  doc.text("QTY", MARGIN + itemColWidth + 3, currentY + 5, {
    align: "center",
  });
  doc.text("PRICE", totalColumnRightEdge - totalColWidth - 5, currentY + 5, {
    align: "right",
  });
  doc.text("TOTAL", totalColumnRightEdge - 2, currentY + 5, {
    align: "right",
  });

  currentY += 8;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(TEXT_COLOR);

  invoice.items.forEach((item, index) => {
    // Calculate description lines for proper row height
    const descriptionWidth = itemColWidth - 6; // Available width for description
    const descriptionLines = doc.splitTextToSize(
      item.item_name,
      descriptionWidth
    );
    const lineCount = descriptionLines.length;
    const rowHeight = Math.max(6, lineCount * 3 + 2); // Minimum 6mm, or based on line count

    // Alternate row colors with dynamic height
    if (index % 2 === 0) {
      doc.setFillColor("#f9fafb");
      doc.rect(MARGIN, currentY, CONTENT_WIDTH, rowHeight, "F");
    }

    const rowStartY = currentY + 4;

    // Description with text wrapping
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(TEXT_COLOR);

    descriptionLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, MARGIN + 3, rowStartY + lineIndex * 3);
    });

    // Other columns positioned at the center of the row
    const centerY = rowStartY + ((lineCount - 1) * 3) / 2;

    doc.text(item.quantity.toString(), MARGIN + itemColWidth + 3, centerY, {
      align: "center",
    });
    const priceX = totalColumnRightEdge - totalColWidth - 5;
    const totalX = totalColumnRightEdge;
    doc.text(
      formatCurrency(item.price, invoice.currency as TCurrencyKey),
      priceX,
      centerY,
      { align: "right" }
    );
    doc.text(
      formatCurrency(item.total, invoice.currency as TCurrencyKey),
      totalX,
      centerY,
      { align: "right" }
    );

    currentY += rowHeight;
  });

  currentY += 8;

  // === TOTALS SECTION ===
  const totalsX = PAGE_WIDTH - MARGIN - 80;
  const totalsWidth = 80;

  // Subtotal
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(SECONDARY_COLOR);
  doc.text("Subtotal:", totalsX, currentY);
  doc.setTextColor(TEXT_COLOR);
  doc.text(
    formatCurrency(invoice.sub_total, invoice.currency as TCurrencyKey),
    PAGE_WIDTH - MARGIN,
    currentY,
    { align: "right" }
  );

  currentY += 5;

  // Discount (if any)
  if (invoice.discount && invoice.discount > 0) {
    doc.setTextColor(SECONDARY_COLOR);
    doc.text("Discount:", totalsX, currentY);
    doc.setTextColor("#dc2626"); // Red for discount
    doc.text(
      `-${formatCurrency(invoice.discount, invoice.currency as TCurrencyKey)}`,
      PAGE_WIDTH - MARGIN,
      currentY,
      { align: "right" }
    );
    currentY += 5;
  }

  // Tax (if any)
  if (invoice.tax_percentage && invoice.tax_percentage > 0) {
    const taxAmount =
      ((invoice.sub_total - (invoice.discount || 0)) * invoice.tax_percentage) /
      100;
    doc.setTextColor(SECONDARY_COLOR);
    doc.text(`Tax (${invoice.tax_percentage}%):`, totalsX, currentY);
    doc.setTextColor(TEXT_COLOR);
    doc.text(
      formatCurrency(taxAmount, invoice.currency as TCurrencyKey),
      PAGE_WIDTH - MARGIN,
      currentY,
      { align: "right" }
    );
    currentY += 5;
  }

  // Total line
  doc.setDrawColor(PRIMARY_COLOR);
  doc.setLineWidth(0.5);
  doc.line(totalsX, currentY, PAGE_WIDTH - MARGIN, currentY);
  currentY += 5;

  // Final total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(PRIMARY_COLOR);
  doc.text("TOTAL:", totalsX, currentY);
  doc.text(
    formatCurrency(invoice.total, invoice.currency as TCurrencyKey),
    PAGE_WIDTH - MARGIN,
    currentY,
    { align: "right" }
  );

  currentY += 15;

  // === NOTES SECTION ===
  if (invoice.notes && invoice.notes.trim() !== "") {
    doc.setFillColor(LIGHT_GRAY);
    doc.rect(MARGIN, currentY, CONTENT_WIDTH, 6, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(PRIMARY_COLOR);
    doc.text("NOTES", MARGIN + 3, currentY + 4);

    currentY += 9;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(TEXT_COLOR);

    // Split notes into lines if too long
    const noteLines = doc.splitTextToSize(invoice.notes, CONTENT_WIDTH - 6);
    noteLines.forEach((line: string) => {
      doc.text(line, MARGIN + 3, currentY);
      currentY += 3;
    });

    currentY += 8;
  }

  // === SIGNATURE SECTION ===
  if (settings.signature?.image || settings.signature?.name) {
    // Position signature closer to content, not forced to bottom
    const signatureY = currentY + 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(SECONDARY_COLOR);
    doc.text("Authorized Signature:", PAGE_WIDTH - MARGIN - 45, signatureY);

    if (settings.signature?.image) {
      try {
        // Add signature image - smaller size
        doc.addImage(
          settings.signature.image,
          PAGE_WIDTH - MARGIN - 50,
          signatureY + 3,
          40,
          12
        );
      } catch (error) {
        console.log("Error adding signature:", error);
      }
    }

    if (settings.signature?.name) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(TEXT_COLOR);
      doc.text(settings.signature.name, PAGE_WIDTH - MARGIN, signatureY + 18, {
        align: "right",
      });
    }
  }

  // === FOOTER ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(SECONDARY_COLOR);
  doc.text("Thank you for your business!", PAGE_WIDTH / 2, PAGE_HEIGHT - 15, {
    align: "center",
  });

  return doc;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string; userId: string }> }
) {
  try {
    const { userId, invoiceId } = await params;

    // console.log(invoiceId, userId);

    //connect db
    await connectDB();
    const settings: ISettings | null = await SettingModel.findOne({
      userId: userId,
    });
    const invoice: IInvoice | null = await InvoiceModel.findById(invoiceId);

    if (!invoice) {
      return NextResponse.json(
        {
          message: "No invoice found",
        },
        {
          status: 500,
        }
      );
    }

    if (!settings) {
      return NextResponse.json(
        {
          message: "Please add logo and signature in setting section",
        },
        {
          status: 500,
        }
      );
    }

    // Generate professional PDF invoice
    const doc = await generateProfessionalInvoice(invoice, settings);

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": "inline",
      },
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      message: error || error.message || "Something went wrong",
    });
  }
}
