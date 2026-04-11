import { motion } from "framer-motion";
import { useGetAdminStats, useGetAllOrders } from "@workspace/api-client-react";
import { ShoppingBag, TrendingUp, Calendar, Users, Package, Clock } from "lucide-react";

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: ordersData } = useGetAllOrders();
  const recentOrders = ordersData?.orders?.slice(0, 10) ?? stats?.recentOrders ?? [];

  const statCards = [
    { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Revenue", value: `Rs ${Number(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Bookings", value: stats?.totalBookings ?? 0, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Newsletter Subscribers", value: stats?.totalSubscribers ?? 0, icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? 0, icon: Clock, color: "text-red-600", bg: "bg-red-50" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const paymentStatusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-4xl font-bold text-primary-foreground">Admin Dashboard</h1>
          <p className="text-primary-foreground/70 mt-2">Angaayam Foods Overview</p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-10">
        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                <div className="h-10 bg-muted rounded-xl mb-3" />
                <div className="h-6 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {statCards.map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <p className="font-bold text-2xl text-foreground">{card.value}</p>
                <p className="text-muted-foreground text-xs mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" /> Recent Orders
          </h2>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Order #</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Total</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Payment</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-primary font-bold">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-muted-foreground text-xs">{order.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold">Rs {Number(order.total).toFixed(0)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] ?? "bg-muted text-muted-foreground"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${paymentStatusColors[order.paymentStatus] ?? "bg-muted text-muted-foreground"}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
