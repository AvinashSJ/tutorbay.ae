"use client";
import { useState, useEffect, useMemo } from "react";
import { getSupabase } from "@/libs/supabase";
import { useUser } from "@/hooks/useUser";
import moment from "moment";

const STATUS_BADGE = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-yellow-100 text-yellow-700",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DemosCalendar = () => {
  const { userId } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));
  const [selectedDate, setSelectedDate] = useState(moment().startOf("day"));

  useEffect(() => {
    if (!userId) return;
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const supabase = getSupabase();
        const { data, error: rpcError } = await supabase.rpc("get_tutor_sessions", {
          p_tutor_id: userId,
        });
        if (rpcError) throw rpcError;
        setSessions(data || []);
      } catch (err) {
        setError(err.message || "Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [userId]);

  // Build a map of { "YYYY-MM-DD": session[] } for quick lookup
  const sessionsByDate = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      if (!s.scheduledAt) return;
      const key = moment(s.scheduledAt).format("YYYY-MM-DD");
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [sessions]);

  // Set of dates that have demos
  const demoDateKeys = useMemo(() => new Set(Object.keys(sessionsByDate)), [sessionsByDate]);

  // Sessions for the selected date
  const selectedSessions = useMemo(() => {
    const key = selectedDate.format("YYYY-MM-DD");
    return sessionsByDate[key] || [];
  }, [selectedDate, sessionsByDate]);

  const startOfMonth = currentMonth.clone().startOf("month");
  const endOfMonth = currentMonth.clone().endOf("month");
  const startDay = startOfMonth.day();

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = currentMonth.daysInMonth();
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }
    return days;
  }, [currentMonth, startDay]);

  const goPrevMonth = () => setCurrentMonth((m) => m.clone().subtract(1, "month"));
  const goNextMonth = () => setCurrentMonth((m) => m.clone().add(1, "month"));
  const goToday = () => {
    setCurrentMonth(moment().startOf("month"));
    setSelectedDate(moment().startOf("day"));
  };

  const isToday = (d) => {
    const date = currentMonth.clone().date(d);
    return date.isSame(moment(), "day");
  };

  const isSelected = (d) => {
    const date = currentMonth.clone().date(d);
    return date.isSame(selectedDate, "day");
  };

  const hasDemo = (d) => {
    const key = currentMonth.clone().date(d).format("YYYY-MM-DD");
    return demoDateKeys.has(key);
  };

  const formatDateHeader = (date) => date.format("dddd, D MMMM YYYY");

  const formatSessionTime = (iso) => {
    if (!iso) return "—";
    return moment(iso).format("h:mm A");
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark flex items-center gap-2">
          <i className="icofont-calendar text-primaryColor" /> Demos Calendar
        </h2>
        <button
          onClick={goToday}
          className="text-xs text-primaryColor hover:underline border border-primaryColor px-3 py-1 rounded"
        >
          Today
        </button>
      </div>

      {/* Calendar + Demos side by side on large screens */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid */}
        <div className="lg:w-[380px] shrink-0 bg-darkdeep3 dark:bg-darkdeep3-dark rounded p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={goPrevMonth}
              className="p-1.5 hover:bg-whiteColor dark:hover:bg-whiteColor-dark rounded transition"
            >
              <i className="icofont-rounded-left text-base" />
            </button>
            <h4 className="text-sm font-semibold text-blackColor dark:text-blackColor-dark">
              {currentMonth.format("MMMM YYYY")}
            </h4>
            <button
              onClick={goNextMonth}
              className="p-1.5 hover:bg-whiteColor dark:hover:bg-whiteColor-dark rounded transition"
            >
              <i className="icofont-rounded-right text-base" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-contentColor dark:text-contentColor-dark py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((d, idx) => (
              <div key={idx} className="h-9 p-px">
                {d !== null ? (
                  <button
                    onClick={() => setSelectedDate(currentMonth.clone().date(d))}
                    className={`w-full h-full flex items-center justify-center rounded text-xs transition relative
                      ${isSelected(d)
                        ? "bg-primaryColor text-white font-semibold"
                        : isToday(d)
                          ? "bg-primaryColor/10 text-primaryColor font-semibold"
                          : "hover:bg-whiteColor dark:hover:bg-whiteColor-dark text-blackColor dark:text-blackColor-dark"
                      }`}
                  >
                    <span>{d}</span>
                    {hasDemo(d) && (
                      <span className={`absolute -bottom-0.5 w-1 h-1 rounded-full ${isSelected(d) ? "bg-white" : "bg-primaryColor"}`} />
                    )}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Demos */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-4 flex items-center gap-2">
            <i className="icofont-list text-primaryColor" />
            Demos on {formatDateHeader(selectedDate)}
            {selectedSessions.length > 0 && (
              <span className="text-sm font-normal text-contentColor">({selectedSessions.length})</span>
            )}
          </h4>

          {selectedSessions.length === 0 ? (
            <p className="text-sm text-contentColor dark:text-contentColor-dark bg-darkdeep3 dark:bg-darkdeep3-dark p-5 rounded">
              No demos scheduled for this day.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {selectedSessions.map((session) => (
                <div key={session.sessionId} className="bg-darkdeep3 dark:bg-darkdeep3-dark rounded p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1 mr-3">
                      <h4 className="font-semibold text-blackColor dark:text-blackColor-dark">
                        {session.requirementTitle || session.requirementSubject}
                      </h4>
                      <p className="text-xs text-contentColor dark:text-contentColor-dark mt-0.5">
                        {session.sessionType?.replace(/_/g, " ")}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_BADGE[session.status] || "bg-gray-100 text-gray-700"}`}>
                      {session.status}
                    </span>
                  </div>

                  <p className="text-xs text-contentColor dark:text-contentColor-dark flex items-center gap-1 mb-2">
                    <i className="icofont-clock-time" /> {formatSessionTime(session.scheduledAt)}
                    {session.scheduledAt && (
                      <span className="text-contentColor/60">
                        &mdash; {moment(session.scheduledAt).format("h:mm A")}
                      </span>
                    )}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {session.locationUrl && (
                      <a href={session.locationUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primaryColor hover:underline flex items-center gap-1">
                        <i className="icofont-location-pin" /> View Location
                      </a>
                    )}
                    {session.meetingLink && (
                      <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primaryColor hover:underline flex items-center gap-1">
                        <i className="icofont-video-alt" /> Join Meeting
                      </a>
                    )}
                  </div>

                  {session.feedback && (
                    <div className="mt-3 p-3 bg-whiteColor dark:bg-whiteColor-dark rounded text-xs text-contentColor dark:text-contentColor-dark space-y-1">
                      <p><span className="font-semibold">Feedback:</span> {session.feedback}</p>
                      {session.rating && <p><span className="font-semibold">Rating:</span> {session.rating}/5</p>}
                      {session.outcome && <p><span className="font-semibold">Outcome:</span> {session.outcome}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {sessions.length > 0 && (
        <div className="text-xs text-contentColor dark:text-contentColor-dark flex flex-wrap gap-4 pt-4 border-t border-borderColor dark:border-borderColor-dark">
          <span>Total: <strong>{sessions.length}</strong></span>
          <span>Upcoming: <strong className="text-blue-600">{sessions.filter((s) => s.status === "SCHEDULED").length}</strong></span>
          <span>Completed: <strong className="text-green-600">{sessions.filter((s) => s.status === "COMPLETED").length}</strong></span>
          <span>Days: <strong>{demoDateKeys.size}</strong></span>
        </div>
      )}
    </div>
  );
};

export default DemosCalendar;
