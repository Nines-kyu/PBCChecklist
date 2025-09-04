import { useEffect, useState } from "react";
import { apiRequest } from "../../Services/API";

const Dashboard: React.FC = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtectedData = async () => {
      const response = await apiRequest("/protected", {
        method: "GET",
      });

      if (response.success) {
        setMessage(response.data.message);
      } else if (response.status === 401) {
        setMessage("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        setMessage(response.data.message || "Failed to fetch data.");
      }

      setLoading(false);
    };

    fetchProtectedData();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Dashboard;
