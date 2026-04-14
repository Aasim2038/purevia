import nodemailer from "nodemailer";
import { getShortOrderId } from "@/lib/orderId";

type EmailOrderItem = {
  productName: string;
  quantity: number;
  lineTotal: number;
};

type CustomerEmailPayload = {
  to: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  items: EmailOrderItem[];
};

type AdminEmailPayload = {
  orderId: string;
  customerName: string;
  customerEmail: string | null;
  totalAmount: number;
  items: EmailOrderItem[];
  lowStockWarnings: Array<{ name: string; stock: number }>;
};

function createTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  if (!emailUser || !emailPassword) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
}

function toRupee(amount: number) {
  return `Rs ${Math.round(amount)}`;
}

export async function sendCustomerOrderConfirmation(payload: CustomerEmailPayload) {
  const transporter = createTransporter();
  const emailUser = process.env.EMAIL_USER;
  if (!transporter || !emailUser) return;

  const shortId = getShortOrderId(payload.orderId);
  const itemsHtml = payload.items
    .map((item) => `<li>${item.productName} x ${item.quantity} - ${toRupee(item.lineTotal)}</li>`)
    .join("");

  await transporter.sendMail({
    from: emailUser,
    to: payload.to,
    subject: `Your Order Confirmation ${shortId}`,
    html: `
      <h2>Thanks for your order, ${payload.customerName || "Customer"}!</h2>
      <p>Your order <strong>${shortId}</strong> has been received.</p>
      <p><strong>Total:</strong> ${toRupee(payload.totalAmount)}</p>
      <p><strong>Items:</strong></p>
      <ul>${itemsHtml}</ul>
      <p>We will notify you once it ships.</p>
    `,
  });
}

export async function sendAdminNewOrderAlert(payload: AdminEmailPayload) {
  const transporter = createTransporter();
  const emailUser = process.env.EMAIL_USER;
  if (!transporter || !emailUser) return;

  const shortId = getShortOrderId(payload.orderId);
  const itemsHtml = payload.items
    .map((item) => `<li>${item.productName} x ${item.quantity} - ${toRupee(item.lineTotal)}</li>`)
    .join("");
  const lowStockHtml =
    payload.lowStockWarnings.length > 0
      ? `<p><strong>Low Stock Warnings:</strong></p><ul>${payload.lowStockWarnings
          .map((item) => `<li>${item.name}: ${item.stock} left</li>`)
          .join("")}</ul>`
      : "<p><strong>Low Stock Warnings:</strong> None</p>";

  await transporter.sendMail({
    from: emailUser,
    to: "atasssolutions@gmail.com",
    subject: `New Order Alert ${shortId}`,
    html: `
      <h2>New order received</h2>
      <p><strong>Order:</strong> ${shortId}</p>
      <p><strong>Customer:</strong> ${payload.customerName}</p>
      <p><strong>Email:</strong> ${payload.customerEmail || "N/A"}</p>
      <p><strong>Total:</strong> ${toRupee(payload.totalAmount)}</p>
      <p><strong>Items:</strong></p>
      <ul>${itemsHtml}</ul>
      ${lowStockHtml}
    `,
  });
}
