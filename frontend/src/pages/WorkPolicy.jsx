import React from "react";
import "../style/WorkPolicy.css";

export default function OfficeTiming() {
  return (
    <div className="office-container">
      <div className="office-card">
        <h2 className="office-title">Office Timing</h2>

        <div className="office-content">
          <p>
            Interns are expected to follow standard office hours:
          </p>

          <p className="highlight">
            <strong>
              Monday to Friday, 9:00 AM to 6:00 PM (Flexible time but 8 hours compulsory)
            </strong>
          </p>

          <ol>
            <li>
              The total <b>working hours per day</b> will be 8 hours, excluding breaks.
            </li>
            <li>
              Interns are entitled to a 1-hour lunch break and two short breaks (15 minutes each)
              – one in the morning and one in the afternoon.
            </li>
            <li>
              Interns must ensure that they adhere to the break schedule and complete their
              assigned tasks within the working hours.
            </li>
            <li>
              Punctuality and regular attendance are required. Any changes to the schedule must
              be approved by the supervisor in advance.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}