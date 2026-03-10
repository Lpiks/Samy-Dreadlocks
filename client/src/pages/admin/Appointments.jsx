import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import "./Appointments.css";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [filterType, setFilterType] = useState('today'); // 'all', 'today', 'tomorrow', 'custom'
  const [filterMode, setFilterMode] = useState('scheduled'); // 'scheduled' or 'created'
  
  const getTodayString = () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
  };

  const [dateFilter, setDateFilter] = useState(getTodayString());
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
    
    // Auto-refresh interval has been completely removed to prevent
    // spamming the backend and triggering 429 Too Many Requests errors.
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/appointments");
      const sorted = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setAppointments(sorted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch appointments";
      setError(`Error: ${errorMessage}`);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#28a745";
      case "pending":
        return "#ffc107";
      case "cancelled":
        return "#dc3545";
      case "completed":
        return "#17a2b8";
      default:
        return "#fff";
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/appointments/${id}/status`, { status });
      fetchAppointments(); // Refresh list
      toast.success(`Appoinment status updated to ${status}`);
      // Dispatch event to update navbar badge immediately
      window.dispatchEvent(new Event("appointmentStatusChanged"));
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;

  const filteredAppointments = appointments.filter((apt) => {
    if (filterType === 'all') return true;

    // Use either the scheduled date (apt.date) or the creation date (apt.createdAt)
    const targetAptDate = filterMode === 'created' ? apt.createdAt : apt.date;
    const aptDate = new Date(targetAptDate);

    if (filterType === 'custom') {
      if (!dateFilter) return true;
      const [year, month, day] = dateFilter.split("-");
      return (
        aptDate.getFullYear() === parseInt(year) &&
        aptDate.getMonth() === parseInt(month) - 1 &&
        aptDate.getDate() === parseInt(day)
      );
    }
    
    const targetDate = new Date();
    if (filterType === 'tomorrow') {
        targetDate.setDate(targetDate.getDate() + 1);
    }

    return (
      aptDate.getFullYear() === targetDate.getFullYear() &&
      aptDate.getMonth() === targetDate.getMonth() &&
      aptDate.getDate() === targetDate.getDate()
    );
  });

  return (
    <div className="container admin-container">
      <h1 className="page-title">Manage Appointments</h1>

      <div className="filters-wrapper">
        <div className="filter-mode-toggle">
            <span className="filter-mode-label">Filter By:</span>
            <label className={`filter-mode-option ${filterMode === 'scheduled' ? 'active' : ''}`}>
                <input 
                    type="radio" 
                    name="filterMode" 
                    value="scheduled"
                    checked={filterMode === 'scheduled'}
                    onChange={() => setFilterMode('scheduled')}
                />
                Scheduled Date
            </label>
            <label className={`filter-mode-option ${filterMode === 'created' ? 'active' : ''}`}>
                <input 
                    type="radio" 
                    name="filterMode" 
                    value="created"
                    checked={filterMode === 'created'}
                    onChange={() => setFilterMode('created')}
                />
                Booking Date
            </label>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filterType === 'today' ? 'active' : ''}`}
            onClick={() => setFilterType('today')}
          >
            Today
          </button>
          <button 
            className={`filter-tab ${filterType === 'tomorrow' ? 'active' : ''}`}
            onClick={() => setFilterType('tomorrow')}
          >
            Tomorrow
          </button>
          <button 
            className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Appointments
          </button>
          <button 
            className={`filter-tab ${filterType === 'custom' ? 'active' : ''}`}
            onClick={() => setFilterType('custom')}
          >
            Custom Date
          </button>
        </div>

        {filterType === 'custom' && (
          <div className="custom-date-picker">
            <label htmlFor="date-filter">Select Date:</label>
            <input
              type="date"
              id="date-filter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        )}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="no-appointments-card">
          <p>
            {filterType === 'all' 
              ? "No appointments found overall." 
              : "No appointments found for the selected date."}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr 
                  key={apt._id} 
                  onClick={() => setSelectedAppointment(apt)}
                  className="appointment-table-row"
                  style={{ cursor: 'pointer' }}
                >
                  <td data-label="Client Name">
                    {/* Show name from the booking form (guest.name), fallback to username */}
                    {apt.guest?.name ||
                      (apt.user ? apt.user.username : "Unknown")}
                  </td>
                  <td data-label="Phone">{apt.guest?.phone || "N/A"}</td>
                  <td data-label="Service">
                    {apt.service
                      ? apt.service.name || "Unknown Service"
                      : "Service Deleted"}
                  </td>
                  <td data-label="Date & Time">{formatDate(apt.date)}</td>
                  <td data-label="Status">
                    <span
                      className="status-badge"
                      style={{
                        color: getStatusColor(apt.status),
                        borderColor: getStatusColor(apt.status),
                      }}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td data-label="Notes">{apt.notes || "-"}</td>
                  <td data-label="Actions">
                    {apt.status === "pending" && (
                      <div className="action-buttons">
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(apt._id, "confirmed"); }}
                          className="btn-icon btn-approve"
                          title="Approve"
                        >
                          ✓
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(apt._id, "cancelled"); }}
                          className="btn-icon btn-decline"
                          title="Decline"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAppointment(null)}>&times;</button>
            <h2 className="modal-title">Appointment Details</h2>
            
            <div className="modal-body">
              <div className="detail-group">
                <span className="detail-label">Client Name</span>
                <span className="detail-value">{selectedAppointment.guest?.name || (selectedAppointment.user ? selectedAppointment.user.username : 'Unknown')}</span>
              </div>
              
              <div className="detail-group">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{selectedAppointment.guest?.phone || 'N/A'}</span>
              </div>
              
              <div className="detail-group">
                <span className="detail-label">Service</span>
                <span className="detail-value">{selectedAppointment.service ? (selectedAppointment.service.name || 'Unknown Service') : 'Service Deleted'}</span>
              </div>
              
              <div className="detail-group">
                <span className="detail-label">Booking Date</span>
                <span className="detail-value">{formatDate(selectedAppointment.createdAt)}</span>
              </div>
              
              <div className="detail-group">
                <span className="detail-label">Scheduled Date</span>
                <span className="detail-value highlight-date">{formatDate(selectedAppointment.date)}</span>
              </div>
              
              <div className="detail-group">
                <span className="detail-label">Status</span>
                <span 
                  className="status-badge"
                  style={{
                    color: getStatusColor(selectedAppointment.status),
                    borderColor: getStatusColor(selectedAppointment.status),
                    margin: 0
                  }}
                >
                  {selectedAppointment.status}
                </span>
              </div>
              
              <div className="detail-group full-width">
                <span className="detail-label">Notes</span>
                <p className="detail-notes">{selectedAppointment.notes || 'No notes provided.'}</p>
              </div>
            </div>

            {selectedAppointment.status === 'pending' && (
              <div className="modal-actions">
                <button 
                  className="modal-btn approve-btn"
                  onClick={() => { updateStatus(selectedAppointment._id, 'confirmed'); setSelectedAppointment(null); }}
                >
                  Approve Appointment
                </button>
                <button 
                  className="modal-btn decline-btn"
                  onClick={() => { updateStatus(selectedAppointment._id, 'cancelled'); setSelectedAppointment(null); }}
                >
                  Decline Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAppointments;
