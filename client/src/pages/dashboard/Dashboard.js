import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_TOOL_HISTORY, GET_TOOL_USAGE_ANALYTICS, GET_DASHBOARD_STATS } from "../../graphql/queries";
import DashboardLayout from "../../DashboardLayout";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const formatToolName = (name) => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp));
  return date.toLocaleString();
};

const Dashboard = () => {
  const [bookmarkedTools, setBookmarkedTools] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [analytics, setAnalytics] = useState([]);
const [stats, setStats] = useState(null);

  const { data: historyData, loading: historyLoading } = useQuery(GET_USER_TOOL_HISTORY);
  const { refetch: refetchAnalytics} = useQuery(GET_TOOL_USAGE_ANALYTICS, { skip: true });
  const { refetch: refetchStats} = useQuery(GET_DASHBOARD_STATS, { skip: true });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  
    if (role === "admin") {
      refetchAnalytics()
        .then((res) => {
          setAnalytics(res.data.getToolUsageAnalytics || []);
        })
        .catch(() => toast.error("Failed to fetch analytics"));
  
      refetchStats()
        .then((res) => {
          setStats(res.data.getDashboardStats || null);
        })
        .catch(() => toast.error("Failed to fetch dashboard stats"));
    }
  }, [refetchAnalytics, refetchStats]);
  

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedTools") || "[]");
    setBookmarkedTools(bookmarks);
  }, []);

  return (
    <DashboardLayout>
      <h2 className="mb-4">Dashboard</h2>

      {/* Bookmarked Tools */}
      <section className="mb-5">
        <h4>Bookmarked Tools</h4>
        {bookmarkedTools.length > 0 ? (
          <ul className="list-group">
            {bookmarkedTools.map((toolId) => (
              <li key={toolId} className="list-group-item">
                <Link to={`/${toolId}`}>{formatToolName(toolId)}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookmarks yet.</p>
        )}
      </section>

      {/* Recent Used Tools */}
      <section className="mb-5">
        <h4>Recent Used Tools</h4>
        {historyLoading ? (
          <p>Loading recent tools...</p>
        ) : historyData?.getUserToolHistory?.length > 0 ? (
          <ul className="list-group">
            {historyData.getUserToolHistory.map((tool) => (
              <li key={tool.id} className="list-group-item">
                {formatToolName(tool.toolName)} — {formatDate(tool.usedAt)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent tools used yet.</p>
        )}
      </section>

      {/* Admin Analytics */}
      {userRole === "admin" && (
        <>
          <section className="mb-5">
            <h4>Top Used Tools</h4>
            {analytics.length > 0 ? (
  <ul className="list-group">
    {analytics.map((tool, idx) => (
      <li key={idx} className="list-group-item">
        {formatToolName(tool.toolName)} — {tool.count} times
      </li>
    ))}
  </ul>
) : (
  <p>No usage analytics available.</p>
)}
          </section>

          <section className="mb-5">
            <h4>Platform Statistics</h4>
            {stats ? (
  <ul className="list-group">
    <li className="list-group-item">Total Users: {stats.totalUsers}</li>
    <li className="list-group-item">Total Bookmarks: {stats.totalBookmarks}</li>
    <li className="list-group-item">Total Tools Used: {stats.totalToolsUsed}</li>
    <li className="list-group-item">Most Active User: {stats.mostActiveUser}</li>
  </ul>
) : (
  <p>No platform stats available.</p>
)}

          </section>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
