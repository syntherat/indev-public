const { isMailerConfigured, sendMail } = require("./mailer");

function formatCurrency(value) {
  const numeric = Number(value || 0);

  if (!Number.isFinite(numeric)) {
    return "INR 0";
  }

  return `INR ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric)}`;
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  }

  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function toLineItemsHtml(items) {
  return items
    .map((item) => {
      const quantity = Number(item?.quantity || 0);
      const lineTotal = Number(item?.lineTotal || 0);
      const productName = String(item?.name || "Product");
      const slug = String(item?.slug || "");

      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e9edf3;vertical-align:top;">
            <div style="font-weight:600;color:#101828;">${productName}</div>
            ${slug ? `<div style="font-size:12px;color:#667085;">${slug}</div>` : ""}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e9edf3;text-align:center;color:#344054;">${quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e9edf3;text-align:right;color:#101828;font-weight:600;">${formatCurrency(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");
}

function buildInvoiceEmail({
  customerName,
  orderNumber,
  paymentId,
  checkedOutAt,
  items,
  summary,
}) {
  const safeCustomerName = String(customerName || "Customer").trim() || "Customer";
  const safeOrderNumber = String(orderNumber || "-").trim() || "-";
  const safePaymentId = String(paymentId || "-").trim() || "-";
  const safeDate = formatDate(checkedOutAt);
  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = Number(summary?.subtotal || 0);
  const total = Number(summary?.total || subtotal);

  const subject = `Invoice • ${safeOrderNumber} • Thank you for your purchase`;

  const textLines = [
    `Hi ${safeCustomerName},`,
    "",
    "Thank you for your purchase with Indev Digital.",
    "",
    `Invoice Number: ${safeOrderNumber}`,
    `Payment ID: ${safePaymentId}`,
    `Purchase Date: ${safeDate}`,
    "",
    "Purchased Items:",
    ...safeItems.map((item) => {
      const quantity = Number(item?.quantity || 0);
      const lineTotal = Number(item?.lineTotal || 0);
      return `- ${String(item?.name || "Product")} x ${quantity}: ${formatCurrency(lineTotal)}`;
    }),
    "",
    `Subtotal: ${formatCurrency(subtotal)}`,
    `Total: ${formatCurrency(total)}`,
    "",
    "Thank you for choosing Indev Digital. If you need any help, just reply to this email.",
  ];

  const html = `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Segoe UI,Arial,sans-serif;color:#101828;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4e7ec;">
              <tr>
                <td style="padding:24px 28px;background:linear-gradient(135deg,#101828,#1d2939);color:#ffffff;">
                  <div style="font-size:12px;letter-spacing:0.12em;opacity:0.78;text-transform:uppercase;">Indev Digital</div>
                  <h1 style="margin:10px 0 4px;font-size:24px;line-height:1.2;">Payment Invoice</h1>
                  <p style="margin:0;font-size:14px;opacity:0.9;">Thank you for your purchase.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 28px 10px;">
                  <p style="margin:0 0 10px;font-size:15px;color:#344054;">Hi ${safeCustomerName},</p>
                  <p style="margin:0 0 14px;font-size:15px;color:#344054;line-height:1.6;">
                    Your payment was successful and your order is confirmed. Please find your invoice details below.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 6px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e7ec;border-radius:10px;overflow:hidden;">
                    <tr>
                      <td style="padding:10px 12px;background:#f8fafc;color:#475467;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Invoice Number</td>
                      <td style="padding:10px 12px;background:#f8fafc;color:#101828;font-weight:600;">${safeOrderNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 12px;border-top:1px solid #e9edf3;background:#fcfdff;color:#475467;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Payment ID</td>
                      <td style="padding:10px 12px;border-top:1px solid #e9edf3;background:#fcfdff;color:#101828;font-weight:600;">${safePaymentId}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 12px;border-top:1px solid #e9edf3;background:#f8fafc;color:#475467;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Purchase Date</td>
                      <td style="padding:10px 12px;border-top:1px solid #e9edf3;background:#f8fafc;color:#101828;font-weight:600;">${safeDate}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 28px 4px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e7ec;border-radius:10px;overflow:hidden;">
                    <thead>
                      <tr>
                        <th align="left" style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e9edf3;font-size:12px;color:#475467;text-transform:uppercase;letter-spacing:0.06em;">Item</th>
                        <th align="center" style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e9edf3;font-size:12px;color:#475467;text-transform:uppercase;letter-spacing:0.06em;">Qty</th>
                        <th align="right" style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e9edf3;font-size:12px;color:#475467;text-transform:uppercase;letter-spacing:0.06em;">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${toLineItemsHtml(safeItems)}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 28px 22px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:4px 0;color:#475467;font-size:14px;">Subtotal</td>
                      <td align="right" style="padding:4px 0;color:#344054;font-size:14px;">${formatCurrency(subtotal)}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0 0;color:#101828;font-size:16px;font-weight:700;">Total</td>
                      <td align="right" style="padding:8px 0 0;color:#101828;font-size:16px;font-weight:700;">${formatCurrency(total)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 28px;">
                  <p style="margin:0;font-size:14px;color:#475467;line-height:1.6;">
                    Thank you for choosing Indev Digital. We appreciate your trust and look forward to supporting your journey.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  return {
    subject,
    text: textLines.join("\n"),
    html,
  };
}

async function sendPurchaseInvoiceEmail({
  customerEmail,
  customerName,
  orderNumber,
  paymentId,
  checkedOutAt,
  items,
  summary,
}) {
  const recipient = String(customerEmail || "").trim().toLowerCase();

  if (!recipient) {
    return { skipped: true, reason: "missing-recipient" };
  }

  if (!isMailerConfigured()) {
    return { skipped: true, reason: "mailer-not-configured" };
  }

  const content = buildInvoiceEmail({
    customerName,
    orderNumber,
    paymentId,
    checkedOutAt,
    items,
    summary,
  });

  await sendMail({
    to: recipient,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  return { skipped: false };
}

module.exports = {
  sendPurchaseInvoiceEmail,
};
