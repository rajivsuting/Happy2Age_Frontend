import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import axiosInstance from "../../utils/axios";
import { FiPlus, FiX, FiCalendar, FiEdit2 } from "react-icons/fi";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduledActivities, setScheduledActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editFormData, setEditFormData] = useState({
    activityIds: [],
    cohortId: "",
    notes: "",
    activityFacilitator: "",
    status: "scheduled",
    date: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    activityIds: [],
    cohortId: "",
    notes: "",
    activityFacilitator: "",
  });

  useEffect(() => {
    fetchActivities();
    fetchCohorts();
    fetchScheduledActivities();
  }, [currentDate]);

  const fetchActivities = async () => {
    try {
      const response = await axiosInstance.get("/activity/export");
      console.log(response.data.data);
      if (response.data.success) {
        setActivities(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to fetch activities");
    }
  };

  const fetchCohorts = async () => {
    try {
      const response = await axiosInstance.get("/cohort/all", {
        params: {
          page: 1,
          limit: 100,
        },
      });
      if (response.data.success) {
        setCohorts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      setError("Failed to fetch cohorts");
    }
  };

  const fetchScheduledActivities = async () => {
    try {
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      const response = await axiosInstance.get("/scheduled-activity", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      if (response.data.success) {
        setScheduledActivities(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching scheduled activities:", error);
      setError("Failed to fetch scheduled activities");
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsAddingActivity(false);
  };

  const handleAddActivity = (date) => {
    setSelectedDate(date);
    setIsAddingActivity(true);
    setFormData({
      activityIds: [],
      cohortId: "",
      notes: "",
      activityFacilitator: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/scheduled-activity", {
        ...formData,
        date: selectedDate.toISOString(),
      });
      if (response.data.success) {
        setIsAddingActivity(false);
        setFormData({ activityIds: [], cohortId: "", notes: "" });
        fetchScheduledActivities();
      }
    } catch (error) {
      console.error("Error scheduling activity:", error);
      setError("Failed to schedule activity");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (activity) => {
    setEditingActivity(activity);
    setEditFormData({
      activityIds: activity.activities
        ? activity.activities.map((a) => a._id)
        : [],
      cohortId: activity.cohort._id,
      notes: activity.notes || "",
      activityFacilitator: activity.activityFacilitator || "",
      status: activity.status || "scheduled",
      date: activity.date
        ? new Date(activity.date).toISOString().slice(0, 10)
        : "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/scheduled-activity/${editingActivity._id}`,
        {
          activityIds: editFormData.activityIds,
          cohortId: editFormData.cohortId,
          notes: editFormData.notes,
          status: editFormData.status,
          date: editFormData.date,
        }
      );
      if (response.data.success) {
        setEditingActivity(null);
        setEditFormData({
          activityId: "",
          cohortId: "",
          notes: "",
          activityFacilitator: "",
          status: "scheduled",
          date: "",
        });
        fetchScheduledActivities();
      }
    } catch (error) {
      setError("Failed to update activity");
    } finally {
      setLoading(false);
    }
  };

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const getActivitiesForDate = (date) => {
    return scheduledActivities.filter(
      (activity) =>
        format(new Date(activity.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="min-h-full p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Calendar Section */}
          <div className="w-[400px] bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FiCalendar className="text-[#239d62]" />
                {format(currentDate, "MMMM yyyy")}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentDate(
                      new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                    )
                  }
                  className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 text-sm border border-gray-200"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentDate(
                      new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                    )
                  }
                  className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 text-sm border border-gray-200"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center py-1 text-xs font-semibold text-gray-600"
                >
                  {day}
                </div>
              ))}
              {days.map((day) => (
                <div
                  key={day.toString()}
                  className={`relative min-h-[60px] p-1 border border-gray-200 rounded-lg hover:bg-gray-50 group ${
                    !isSameMonth(day, currentDate) ? "bg-gray-50" : ""
                  } ${isToday(day) ? "bg-blue-50" : ""} ${
                    selectedDate &&
                    format(selectedDate, "yyyy-MM-dd") ===
                      format(day, "yyyy-MM-dd")
                      ? "ring-2 ring-[#239d62]"
                      : ""
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  <span className="text-sm text-gray-600">
                    {format(day, "d")}
                  </span>
                  <button
                    className="absolute top-1 right-1 p-1 rounded-full bg-[#239d62] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddActivity(day);
                    }}
                  >
                    <FiPlus size={14} />
                  </button>
                  {getActivitiesForDate(day).length > 0 && (
                    <div className="mt-1">
                      <div className="w-1 h-1 bg-[#239d62] rounded-full mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {selectedDate ? (
              isAddingActivity ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Schedule Activity for{" "}
                      {format(selectedDate, "MMMM d, yyyy")}
                    </h2>
                    <button
                      onClick={() => setIsAddingActivity(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Activities
                      </label>
                      {/* Show selected activities as tags/chips */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.activityIds.map((activityId, idx) => {
                          const activity = activities.find(
                            (a) => a._id === activityId
                          );
                          return activity ? (
                            <span
                              key={activityId}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#239d62]/10 text-[#239d62]"
                            >
                              {activity.name}
                              <button
                                type="button"
                                className="ml-2 text-[#239d62] hover:text-[#239d62]/80 focus:outline-none"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    activityIds: prev.activityIds.filter(
                                      (id) => id !== activityId
                                    ),
                                  }));
                                }}
                              >
                                <svg
                                  className="h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                      <select
                        value=""
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value && !formData.activityIds.includes(value)) {
                            setFormData((prev) => ({
                              ...prev,
                              activityIds: [...prev.activityIds, value],
                            }));
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62]"
                      >
                        <option value="">Select an activity</option>
                        {activities
                          .filter(
                            (activity) =>
                              !formData.activityIds.includes(activity._id)
                          )
                          .map((activity) => (
                            <option key={activity._id} value={activity._id}>
                              {activity.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cohort
                      </label>
                      <select
                        value={formData.cohortId}
                        onChange={(e) =>
                          setFormData({ ...formData, cohortId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62]"
                        required
                      >
                        <option value="">Select a cohort</option>
                        {cohorts.map((cohort) => (
                          <option key={cohort._id} value={cohort._id}>
                            {cohort.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Activity Facilitator
                      </label>
                      <input
                        type="text"
                        value={formData.activityFacilitator}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            activityFacilitator: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62]"
                        placeholder="Enter facilitator name..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#239d62]"
                        rows={3}
                        placeholder="Add any additional notes about this activity..."
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingActivity(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-[#239d62] text-white rounded-md hover:bg-[#239d62]/90 disabled:opacity-50"
                      >
                        {loading ? "Scheduling..." : "Schedule Activity"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Activities for {format(selectedDate, "MMMM d, yyyy")}
                    </h2>
                    <button
                      onClick={() => setIsAddingActivity(true)}
                      className="px-4 py-2 bg-[#239d62] text-white rounded-md hover:bg-[#239d62]/90 flex items-center gap-2"
                    >
                      <FiPlus size={16} />
                      Schedule Activity
                    </button>
                  </div>

                  <div className="space-y-4">
                    {getActivitiesForDate(selectedDate).length > 0 ? (
                      getActivitiesForDate(selectedDate).map((activity) => (
                        <div
                          key={activity._id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                        >
                          {editingActivity &&
                          editingActivity._id === activity._id ? (
                            <form
                              onSubmit={handleEditSubmit}
                              className="space-y-2"
                            >
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Activities
                                </label>
                                {/* Show selected activities as tags/chips */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {editFormData.activityIds.map(
                                    (activityId, idx) => {
                                      const activity = activities.find(
                                        (a) => a._id === activityId
                                      );
                                      return activity ? (
                                        <span
                                          key={activityId}
                                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#239d62]/10 text-[#239d62]"
                                        >
                                          {activity.name}
                                          <button
                                            type="button"
                                            className="ml-1 text-[#239d62] hover:text-[#239d62]/80 focus:outline-none"
                                            onClick={() => {
                                              setEditFormData((prev) => ({
                                                ...prev,
                                                activityIds:
                                                  prev.activityIds.filter(
                                                    (id) => id !== activityId
                                                  ),
                                              }));
                                            }}
                                          >
                                            <svg
                                              className="h-3 w-3"
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </button>
                                        </span>
                                      ) : null;
                                    }
                                  )}
                                </div>
                                <select
                                  value=""
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (
                                      value &&
                                      !editFormData.activityIds.includes(value)
                                    ) {
                                      setEditFormData((prev) => ({
                                        ...prev,
                                        activityIds: [
                                          ...prev.activityIds,
                                          value,
                                        ],
                                      }));
                                    }
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                >
                                  <option value="">Select an activity</option>
                                  {activities
                                    .filter(
                                      (activity) =>
                                        !editFormData.activityIds.includes(
                                          activity._id
                                        )
                                    )
                                    .map((activity) => (
                                      <option
                                        key={activity._id}
                                        value={activity._id}
                                      >
                                        {activity.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Cohort
                                </label>
                                <select
                                  value={editFormData.cohortId}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      cohortId: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                  required
                                >
                                  <option value="">Select a cohort</option>
                                  {cohorts.map((c) => (
                                    <option key={c._id} value={c._id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  value={editFormData.date}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      date: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Activity Facilitator
                                </label>
                                <input
                                  type="text"
                                  value={editFormData.activityFacilitator}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      activityFacilitator: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                  placeholder="Enter facilitator name..."
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Notes
                                </label>
                                <textarea
                                  value={editFormData.notes}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      notes: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Status
                                </label>
                                <select
                                  value={editFormData.status}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      status: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                  required
                                >
                                  <option value="scheduled">Scheduled</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setEditingActivity(null)}
                                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={loading}
                                  className="px-3 py-1 bg-[#239d62] text-white rounded hover:bg-[#239d62]/90 disabled:opacity-50"
                                >
                                  {loading ? "Saving..." : "Save"}
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {activity.activities &&
                                  activity.activities.length > 0
                                    ? activity.activities
                                        .map((a) => a.name)
                                        .join(", ")
                                    : "No activities"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Cohort: {activity.cohort.name}
                                </p>
                                {activity.activityFacilitator && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Facilitator: {activity.activityFacilitator}
                                  </p>
                                )}
                                {activity.notes && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {activity.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    activity.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : activity.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {activity.status}
                                </span>
                                <button
                                  onClick={() => handleEditClick(activity)}
                                  className="text-[#239d62] hover:text-[#176b47] p-1 rounded-full"
                                  title="Edit Activity"
                                >
                                  <FiEdit2 size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">
                          No activities scheduled for this date
                        </p>
                        <button
                          onClick={() => setIsAddingActivity(true)}
                          className="text-[#239d62] hover:text-[#239d62]/80 font-medium"
                        >
                          Schedule an activity
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No date selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a date to view or schedule activities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
