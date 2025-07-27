import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import axiosInstance from "../utils/axios";

const AttendanceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ID from useParams:", id);
    if (!id) {
      setError("No participant ID provided");
      setLoading(false);
      return;
    }
    fetchAttendance();
  }, [id]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching attendance for ID:", id);
      const response = await axiosInstance.get(
        `/session/attendance/participant/${id}`
      );
      console.log("Response:", response.data);

      if (response.data.success) {
        setAttendance(response.data.data);
      } else {
        setError("Attendance data not found");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError(
        error.response?.data?.error || "Failed to fetch attendance data"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#239d62]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const presentCount = attendance?.sessions.filter(
    (session) => session.present
  ).length;
  const totalSessions = attendance?.sessions.length;
  const absentCount = totalSessions - presentCount;
  const attendancePercentage = Math.round((presentCount / totalSessions) * 100);

  return (
    <div className="min-h-full bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Attendance Details
              </h1>
              <p className="mt-2 text-base text-gray-500">
                View detailed attendance information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/attendance")}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#239d62] transition-colors duration-200"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Participant Name
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {attendance?.participantName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Present</p>
                  <p className="mt-1 text-sm font-semibold text-green-600">
                    {presentCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Absent</p>
                  <p className="mt-1 text-sm font-semibold text-red-600">
                    {absentCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Attendance
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {attendancePercentage}% ({presentCount}/{totalSessions})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Session History
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Session Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {attendance?.sessions.map((session, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {session.sessionName}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="text-sm text-gray-500">
                            {formatDate(session.date)}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div
                            className={`text-sm font-semibold ${
                              session.present
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {session.present ? "Present" : "Absent"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetails;
