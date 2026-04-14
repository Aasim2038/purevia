import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import prisma from "@/lib/prisma";
import { getShortOrderId } from "@/lib/orderId";
import NotificationBell from "@/components/admin/NotificationBell";
import { DollarSign, Package, TriangleAlert, Truck, TrendingUp, Users } from "lucide-react";

type DashboardStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const statusClassMap: Record<DashboardStatus, string> = {
  PENDING: "bg-[#FFF4E5] text-[#D48806]",
  SHIPPED: "bg-[#E6F4FF] text-[#0958D9]",
  DELIVERED: "bg-[#E8F5E0] text-[var(--color-sage-dark)]",
  CANCELLED: "bg-[#FCF3F3] text-red-600",
};

const statusLabelMap: Record<DashboardStatus, string> = {
  PENDING: "Pending",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

function formatCurrency(amount: number) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function getDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function AdminDashboardPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [todayOrdersCount, activeUsers, pendingShipments, successfulOrdersToday, recentOrders, last14DaysOrders, lowStockProducts, latestOrder, topOrderItems] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      where: { status: { in: ["SHIPPED", "DELIVERED"] }, createdAt: { gte: todayStart } },
      select: { totalAmount: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: {
        status: { in: ["SHIPPED", "DELIVERED"] },
        createdAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 3 } },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, stock: true },
    }),
    prisma.order.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, customerName: true, createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, lineTotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const totalRevenue = successfulOrdersToday.reduce((sum, order) => sum + order.totalAmount, 0);
  const lowStockCount = lowStockProducts.length;
  const notifications = [
    ...(latestOrder
      ? [
          {
            id: `order-${latestOrder.id}`,
            text: `New Order ${getShortOrderId(latestOrder.id)} received`,
            createdAt: latestOrder.createdAt.toISOString(),
          },
        ]
      : []),
    ...lowStockProducts.slice(0, 3).map((product) => ({
      id: `stock-${product.id}`,
      text: `Low Stock alert: ${product.name} (${product.stock} left)`,
      createdAt: new Date().toISOString(),
    })),
  ];

  const topProductIds = topOrderItems.map((row) => row.productId);
  const topProductMap = new Map(
    (
      await prisma.product.findMany({
        where: { id: { in: topProductIds } },
        select: { id: true, name: true, category: true },
      })
    ).map((product) => [product.id, product])
  );

  const topProducts = topOrderItems.map((row) => ({
    id: row.productId,
    name: topProductMap.get(row.productId)?.name || "Product",
    category: topProductMap.get(row.productId)?.category || "Uncategorized",
    units: row._sum.quantity || 0,
    revenue: row._sum.lineTotal || 0,
  }));

  const today = new Date();
  const recentLabels: string[] = [];
  const dailyRevenueMap = new Map<string, number>();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = getDateKey(d);
    recentLabels.push(key);
    dailyRevenueMap.set(key, 0);
  }

  for (const order of last14DaysOrders) {
    const key = getDateKey(new Date(order.createdAt));
    if (dailyRevenueMap.has(key)) {
      dailyRevenueMap.set(key, (dailyRevenueMap.get(key) || 0) + order.totalAmount);
    }
  }

  const weeklySeries = recentLabels.map((key) => ({
    label: new Date(key).toLocaleDateString("en-IN", { weekday: "short" }),
    value: dailyRevenueMap.get(key) || 0,
  }));
  const maxWeeklyRevenue = Math.max(...weeklySeries.map((d) => d.value), 1);

  const currentWeekRevenue = weeklySeries.reduce((sum, point) => sum + point.value, 0);
  const previousWeekRevenue = last14DaysOrders
    .filter((order) => {
      const daysDiff = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / (24 * 60 * 60 * 1000));
      return daysDiff > 6 && daysDiff <= 13;
    })
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const growthPercent =
    previousWeekRevenue > 0 ? ((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex select-none">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-[#EAE6DF] h-[72px] flex items-center justify-between px-6 md:px-10 lg:px-12 sticky top-0 z-10">
          <h1 className="font-serif text-2xl font-light text-[var(--color-text)]">Overview</h1>
          <div className="flex items-center gap-3">
            <NotificationBell alerts={notifications} />
            <div className="w-9 h-9 rounded-full bg-[var(--color-warm)] border border-[rgba(196,168,130,0.3)] flex items-center justify-center text-[var(--color-sage-dark)] font-serif text-[1rem]">
              A
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 lg:p-12 w-full max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
                <div className="w-9 h-9 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                  <DollarSign size={16} />
                </div>
                <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Total Revenue</span>
              </div>
              <div className="font-serif text-[2rem] md:text-[2.2rem] font-medium text-[var(--color-text)]">{formatCurrency(totalRevenue)}</div>
              <div className="text-[0.75rem] text-[var(--color-sage-dark)] mt-2 font-medium">Today from completed shipments</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
                <div className="w-9 h-9 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                  <Package size={16} />
                </div>
                <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Total Orders</span>
              </div>
              <div className="font-serif text-[2rem] md:text-[2.2rem] font-medium text-[var(--color-text)]">{todayOrdersCount.toLocaleString("en-IN")}</div>
              <div className="text-[0.75rem] text-[var(--color-text-muted)] mt-2 font-medium">Orders placed today</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
                <div className="w-9 h-9 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                  <Users size={16} />
                </div>
                <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Active Users</span>
              </div>
              <div className="font-serif text-[2rem] md:text-[2.2rem] font-medium text-[var(--color-text)]">{activeUsers.toLocaleString("en-IN")}</div>
              <div className="text-[0.75rem] text-[var(--color-text-muted)] mt-2 font-medium">Registered customer base</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
                <div className="w-9 h-9 rounded-full bg-[#FFF4E5] flex items-center justify-center text-[#D48806]">
                  <Truck size={16} />
                </div>
                <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Pending Shipments</span>
              </div>
              <div className="font-serif text-[2rem] md:text-[2.2rem] font-medium text-[var(--color-text)]">{pendingShipments.toLocaleString("en-IN")}</div>
              <div className="text-[0.75rem] text-[var(--color-text-muted)] mt-2 font-medium">Orders awaiting dispatch</div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--color-text-muted)]">
                <div className="w-9 h-9 rounded-full bg-[#FCF3F3] flex items-center justify-center text-red-600">
                  <TriangleAlert size={16} />
                </div>
                <span className="text-[0.75rem] uppercase tracking-[0.1em] font-medium">Low Stock Alert</span>
              </div>
              <div className="font-serif text-[2rem] md:text-[2.2rem] font-medium text-[var(--color-text)]">{lowStockCount.toLocaleString("en-IN")}</div>
              <div className="text-[0.75rem] text-red-600/80 mt-2 font-medium">SKUs at 3 or below</div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-8 gap-6 mb-8">
            <div className="xl:col-span-5 bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#EAE6DF] bg-[#FCFAf8] flex items-center justify-between">
                <h2 className="font-serif text-[1.3rem] font-light text-[var(--color-text)]">Recent Orders</h2>
                <Link href="/admin/orders" className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-sage-dark)] hover:text-[var(--color-earth-dark)]">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)] border-b border-[#EAE6DF]">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[0.9rem] text-[var(--color-text)]">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[#F5F3ED] last:border-0 hover:bg-[#FAF9F7]">
                        <td className="px-6 py-4 font-serif font-medium">{getShortOrderId(order.id)}</td>
                        <td className="px-6 py-4">{order.customerName}</td>
                        <td className="px-6 py-4 font-serif">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[0.64rem] uppercase tracking-[0.08em] font-semibold ${statusClassMap[order.status as DashboardStatus]}`}>
                            {statusLabelMap[order.status as DashboardStatus]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="xl:col-span-3 bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-[1.3rem] font-light text-[var(--color-text)]">Top Products</h2>
                <Link href="/admin/products" className="text-[0.68rem] uppercase tracking-[0.1em] text-[var(--color-sage-dark)]">
                  Manage
                </Link>
              </div>
              {topProducts.length === 0 ? (
                <div className="text-[0.85rem] text-[var(--color-text-muted)]">No product sales yet.</div>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product, idx) => (
                    <div key={product.id} className="rounded-xl border border-[#EAE6DF] bg-[#FCFAF8] px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[0.64rem] uppercase tracking-[0.08em] text-[var(--color-sage-dark)]">#{idx + 1}</div>
                          <div className="text-[0.9rem] text-[var(--color-text)]">{product.name}</div>
                          <div className="text-[0.72rem] text-[var(--color-text-muted)]">{product.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[0.78rem] text-[var(--color-text-muted)]">{product.units} sold</div>
                          <div className="text-[0.86rem] font-medium text-[var(--color-text)]">{formatCurrency(product.revenue)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="xl:col-span-5 bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-[1.3rem] font-light text-[var(--color-text)]">Sales Overview</h2>
                <div className="flex items-center gap-1 text-[var(--color-sage-dark)]">
                  <TrendingUp size={15} />
                  <span className="text-[0.74rem] font-medium">{growthPercent >= 0 ? "+" : ""}{growthPercent.toFixed(1)}%</span>
                </div>
              </div>
              <div className="h-[200px] rounded-xl bg-[#FAF9F7] border border-[#EAE6DF] p-4 flex items-end gap-2">
                {weeklySeries.map((point) => (
                  <div key={point.label} className="flex-1 flex flex-col justify-end items-center gap-2">
                    <div
                      className="w-full max-w-[28px] rounded-md bg-[linear-gradient(180deg,#8A9E7E_0%,#6F8564_100%)]"
                      style={{ height: `${Math.max(10, (point.value / maxWeeklyRevenue) * 120)}px` }}
                      title={`${point.label}: ${formatCurrency(point.value)}`}
                    />
                    <span className="text-[0.62rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{point.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[0.74rem] text-[var(--color-text-muted)] mt-3">Weekly revenue trend (last 7 days)</p>
            </div>

            <div className="xl:col-span-3 bg-white rounded-2xl border border-[#EAE6DF] shadow-[0_4px_20px_rgba(138,158,126,0.02)] p-6">
              <h2 className="font-serif text-[1.3rem] font-light text-[var(--color-text)] mb-4">Notifications</h2>
              {notifications.length === 0 ? (
                <div className="text-[0.85rem] text-[var(--color-text-muted)]">No urgent alerts right now.</div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((note) => (
                    <div key={note.id} className="rounded-xl border border-[#EAE6DF] bg-[#FCFAf8] px-4 py-3">
                      <div className="text-[0.86rem] text-[var(--color-text)] mt-1">{note.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
