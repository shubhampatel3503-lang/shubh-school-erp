import type { ExamTimetable, Student } from "@/types";

interface AdmitCardTemplateProps {
  student: Student;
  timetable?: ExamTimetable | null;
  examName?: string;
  rollNo?: string;
  schoolName?: string;
  schoolAddress?: string;
  centerName?: string;
  variant?: "formal" | "compact";
  instructions?: string[];
}

const DEFAULT_INSTRUCTIONS = [
  "Candidates must carry this Admit Card to the examination hall.",
  "Mobile phones and electronic devices are strictly prohibited.",
  "Candidates must be present 30 minutes before the exam.",
  "No candidate will be allowed without a valid Admit Card.",
  "Borrowing of stationery is not permitted in the examination hall.",
];

export function AdmitCardTemplate({
  student,
  timetable,
  examName = "Annual Examination 2025-26",
  rollNo,
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolAddress = "123 Education Lane, Knowledge City, India - 110001",
  centerName = "School Campus",
  variant = "formal",
  instructions = DEFAULT_INSTRUCTIONS,
}: AdmitCardTemplateProps) {
  const className = student.classLevel.replace("Class", "Class ");
  const roll = rollNo ?? student.admNo;
  const entries = timetable?.entries ?? [];

  if (variant === "compact") {
    return (
      <div
        className="bg-white text-black"
        style={{
          width: 560,
          fontFamily: "Arial, sans-serif",
          border: "2px solid #1e3a5f",
          borderRadius: 8,
          overflow: "hidden",
        }}
        data-ocid="admit_card.compact.panel"
      >
        {/* Header */}
        <div
          style={{
            background: "#1e3a5f",
            color: "#fff",
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{schoolName}</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>{schoolAddress}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                background: "rgba(255,255,255,0.2)",
                padding: "4px 10px",
                borderRadius: 4,
              }}
            >
              ADMIT CARD
            </div>
            <div style={{ fontSize: 10, marginTop: 4, opacity: 0.85 }}>
              {examName}
            </div>
          </div>
        </div>

        {/* Student Info Row */}
        <div
          style={{
            padding: "10px 16px",
            background: "#f0f4f8",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 12,
          }}
        >
          <div
            style={{
              width: 48,
              height: 56,
              border: "2px solid #1e3a5f",
              borderRadius: 4,
              overflow: "hidden",
              flexShrink: 0,
              background: "#e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.fullName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: 20 }}>👤</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {student.fullName}
            </div>
            <div style={{ color: "#555", marginTop: 2 }}>
              <span style={{ marginRight: 16 }}>
                Class: <strong>{className}</strong>
              </span>
              <span style={{ marginRight: 16 }}>
                Roll No.: <strong>{roll}</strong>
              </span>
              <span>
                Session: <strong>{student.sessionId}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Timetable */}
        <div style={{ padding: "10px 16px 8px" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#1e3a5f",
              marginBottom: 6,
            }}
          >
            EXAM SCHEDULE
          </div>
          {entries.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
              }}
            >
              <thead>
                <tr style={{ background: "#1e3a5f", color: "#fff" }}>
                  <th style={{ padding: "5px 8px", textAlign: "left" }}>
                    Date
                  </th>
                  <th style={{ padding: "5px 8px", textAlign: "left" }}>
                    Subject
                  </th>
                  <th style={{ padding: "5px 8px", textAlign: "left" }}>
                    Time
                  </th>
                  <th style={{ padding: "5px 8px", textAlign: "left" }}>
                    Venue
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr
                    key={`${e.date}-${e.subjectId}`}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      background: i % 2 === 0 ? "#fff" : "#f8fafc",
                    }}
                  >
                    <td style={{ padding: "5px 8px" }}>{e.date}</td>
                    <td style={{ padding: "5px 8px", fontWeight: 600 }}>
                      {e.subjectName}
                    </td>
                    <td style={{ padding: "5px 8px" }}>
                      {e.startTime} – {e.endTime}
                    </td>
                    <td style={{ padding: "5px 8px" }}>
                      {e.venue || centerName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                padding: "12px 8px",
                color: "#888",
                fontSize: 12,
                fontStyle: "italic",
              }}
            >
              Exam schedule will be populated from saved timetable.
            </div>
          )}
        </div>

        {/* Signature line */}
        <div
          style={{
            padding: "8px 16px 12px",
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #ddd",
          }}
        >
          <div style={{ fontSize: 9, color: "#888" }}>
            Examination Centre: {centerName}
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: "1px solid #333",
                paddingTop: 4,
                width: 130,
                fontSize: 10,
              }}
            >
              Principal's Signature
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formal variant
  return (
    <div
      className="bg-white text-black"
      style={{
        width: 794,
        fontFamily: "Times New Roman, serif",
        border: "2px solid #1e3a5f",
      }}
      data-ocid="admit_card.formal.panel"
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "16px 40px 12px",
          borderBottom: "2px solid #1e3a5f",
          background: "#f0f4f8",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            color: "#1e3a5f",
          }}
        >
          {schoolName}
        </div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
          {schoolAddress}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            marginTop: 8,
            letterSpacing: 2,
            textDecoration: "underline",
            color: "#1e3a5f",
          }}
        >
          ADMIT CARD
        </div>
        <div style={{ fontSize: 13, color: "#444", marginTop: 4 }}>
          {examName}
        </div>
      </div>

      {/* Student Details */}
      <div
        style={{
          padding: "16px 40px",
          display: "flex",
          gap: 24,
          borderBottom: "1px solid #ddd",
        }}
      >
        <div
          style={{
            width: 80,
            height: 96,
            border: "2px solid #1e3a5f",
            borderRadius: 4,
            overflow: "hidden",
            flexShrink: 0,
            background: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student.fullName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ fontSize: 36, textAlign: "center" }}>👤</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <table style={{ width: "100%", fontSize: 13 }}>
            <tbody>
              <tr>
                <td style={{ width: 160, paddingBottom: 6, color: "#555" }}>
                  Student Name
                </td>
                <td style={{ fontWeight: 700, fontSize: 15, paddingBottom: 6 }}>
                  {student.fullName}
                </td>
                <td style={{ color: "#555" }}>Roll No.</td>
                <td style={{ fontWeight: 700 }}>{roll}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: 6, color: "#555" }}>
                  Father's Name
                </td>
                <td style={{ paddingBottom: 6 }}>{student.fatherName}</td>
                <td style={{ color: "#555" }}>Adm. No.</td>
                <td>{student.admNo}</td>
              </tr>
              <tr>
                <td style={{ paddingBottom: 6, color: "#555" }}>Class</td>
                <td style={{ paddingBottom: 6, fontWeight: 600 }}>
                  {className}
                </td>
                <td style={{ color: "#555" }}>Session</td>
                <td>{student.sessionId}</td>
              </tr>
              <tr>
                <td style={{ color: "#555" }}>Exam Centre</td>
                <td>{centerName}</td>
                <td style={{ color: "#555" }}>Invigilator Sign</td>
                <td style={{ borderBottom: "1px solid #333", width: 120 }} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Exam Schedule */}
      <div style={{ padding: "14px 40px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 8,
            color: "#1e3a5f",
            textDecoration: "underline",
          }}
        >
          EXAMINATION SCHEDULE
        </div>
        {entries.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
              border: "1px solid #999",
            }}
          >
            <thead>
              <tr style={{ background: "#1e3a5f", color: "#fff" }}>
                <th
                  style={{
                    border: "1px solid #999",
                    padding: "6px 10px",
                    textAlign: "center",
                  }}
                >
                  S.No.
                </th>
                <th
                  style={{
                    border: "1px solid #999",
                    padding: "6px 10px",
                    textAlign: "left",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    border: "1px solid #999",
                    padding: "6px 10px",
                    textAlign: "left",
                  }}
                >
                  Subject
                </th>
                <th
                  style={{
                    border: "1px solid #999",
                    padding: "6px 10px",
                    textAlign: "center",
                  }}
                >
                  Start Time
                </th>
                <th
                  style={{
                    border: "1px solid #999",
                    padding: "6px 10px",
                    textAlign: "center",
                  }}
                >
                  End Time
                </th>
                <th
                  style={{
                    border: "1px solid #999",
                    padding: "6px 10px",
                    textAlign: "left",
                  }}
                >
                  Venue
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={`${e.date}-${e.subjectId}`}
                  style={{ borderBottom: "1px solid #ddd" }}
                >
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "6px 10px",
                      textAlign: "center",
                    }}
                  >
                    {i + 1}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "6px 10px" }}>
                    {e.date}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "6px 10px",
                      fontWeight: 600,
                    }}
                  >
                    {e.subjectName}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "6px 10px",
                      textAlign: "center",
                    }}
                  >
                    {e.startTime}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "6px 10px",
                      textAlign: "center",
                    }}
                  >
                    {e.endTime}
                  </td>

                  <td style={{ border: "1px solid #ddd", padding: "6px 10px" }}>
                    {e.venue || centerName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              padding: "14px 0",
              color: "#888",
              fontSize: 13,
              fontStyle: "italic",
              textAlign: "center",
              border: "1px dashed #ccc",
              borderRadius: 4,
            }}
          >
            Exam schedule will be auto-populated from saved exam timetable for{" "}
            {className}.
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ padding: "0 40px 14px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#c00",
            marginBottom: 6,
          }}
        >
          IMPORTANT INSTRUCTIONS:
        </div>
        <ol
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 11,
            color: "#333",
            lineHeight: 1.8,
          }}
        >
          {instructions.map((ins) => (
            <li key={ins}>{ins}</li>
          ))}
        </ol>
      </div>

      {/* Signature Row */}
      <div
        style={{
          padding: "10px 40px 20px",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #ddd",
          fontSize: 12,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{ borderTop: "1px solid #333", paddingTop: 6, width: 160 }}
          >
            Student's Signature
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ borderTop: "1px solid #333", paddingTop: 6, width: 160 }}
          >
            Parent's Signature
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ borderTop: "1px solid #333", paddingTop: 6, width: 180 }}
          >
            <div style={{ fontWeight: 700 }}>Principal's Signature</div>
            <div style={{ fontSize: 10, color: "#555" }}>{schoolName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
