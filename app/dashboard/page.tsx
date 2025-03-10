import { FaChartLine, FaShoppingCart, FaUsers } from "react-icons/fa";
import LayoutWrapper from "../components/LayoutWrapper";
const Dashboard = () => {
  const stats = [
    { title: "Revenue", value: "$12,000", color: "bg-blue-500", icon: <FaChartLine /> },
    { title: "Sales", value: "1,200", color: "bg-green-500", icon: <FaShoppingCart /> },
    { title: "Customers", value: "300", color: "bg-red-500", icon: <FaUsers /> },
  ];

  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 2000 },
  ];

  return (
    <LayoutWrapper>
    <div className="flex flex-grow p-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-black">Dashboard Overview</h1>

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} p-6 rounded-xl shadow-lg flex items-center space-x-4 transition hover:scale-105`}
            >
              <div className="text-white text-4xl">{stat.icon}</div>
              <div>
                <p className="text-white text-lg">{stat.title}</p>
                <h3 className="text-white text-3xl font-semibold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Table */}
        <div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-md w-full">
          <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-3">Month</th>
                <th className="border-b border-gray-700 p-3">Revenue ($)</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-700 transition">
                  <td className="p-3">{item.month}</td>
                  <td className="p-3">{item.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </LayoutWrapper>
  );
};

export default Dashboard;