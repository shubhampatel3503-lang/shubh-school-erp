import { formatDate } from "@/lib/utils";
import type { Student } from "@/types";

interface IDCardTemplateProps {
  student: Student;
  schoolName?: string;
  schoolPhone?: string;
  schoolAddress?: string;
  academicYear?: string;
  bloodGroup?: string;
  variant?: "vertical" | "horizontal" | "themed";
}

export function IDCardTemplate({
  student,
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolPhone = "+91 98765 43210",
  schoolAddress = "Knowledge City, India",
  academicYear = "2025-26",
  bloodGroup = "B+",
  variant = "vertical",
}: IDCardTemplateProps) {
  const className = student.classLevel.replace("Class", "Class ");
  const dob = formatDate(student.dateOfBirth);

  // Credit-card proportion: 85.6mm × 54mm → scale ×3 = 257px × 162px, ×4 = 342px × 216px
  const CARD_W = 342;
  const CARD_H = 216;

  if (variant === "horizontal") {
    return (
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          background: "#fff",
          border: "1px solid #ddd",
        }}
        data-ocid="id_card.horizontal.panel"
      >
        {/* Left Photo Strip */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 90,
            background: "#1e3a5f",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 12,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#fff3",
              border: "2px solid rgba(255,255,255,0.6)",
              overflow: "hidden",
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
              <span style={{ fontSize: 28, color: "rgba(255,255,255,0.7)" }}>
                👤
              </span>
            )}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 9,
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              padding: "0 4px",
            }}
          >
            {student.admNo}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 8,
              color: "#f59e0b",
              fontWeight: 700,
            }}
          >
            ID CARD
          </div>
        </div>

        {/* Right Info */}
        <div
          style={{
            marginLeft: 94,
            padding: "10px 12px 10px 8px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#1e3a5f",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {schoolName}
            </div>
            <div style={{ fontSize: 7, color: "#777", marginBottom: 8 }}>
              {schoolAddress}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.2,
              }}
            >
              {student.fullName}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#1e3a5f",
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              {className}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 9,
                color: "#555",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "3px 6px",
              }}
            >
              <span style={{ color: "#888" }}>DOB:</span>
              <span>{dob}</span>
              <span style={{ color: "#888" }}>Father:</span>
              <span>{student.fatherName}</span>
              <span style={{ color: "#888" }}>Mobile:</span>
              <span>{student.fatherMobile}</span>
              <span style={{ color: "#888" }}>Blood:</span>
              <span style={{ color: "#c00", fontWeight: 700 }}>
                {bloodGroup}
              </span>
              <span style={{ color: "#888" }}>Session:</span>
              <span>{academicYear}</span>
            </div>
          </div>
          <div style={{ fontSize: 7, color: "#aaa" }}>Ph: {schoolPhone}</div>
        </div>
      </div>
    );
  }

  if (variant === "themed") {
    return (
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          background:
            "linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #7c3aed 100%)",
        }}
        data-ocid="id_card.themed.panel"
      >
        {/* Top Bar */}
        <div
          style={{
            padding: "10px 14px 8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 1,
              }}
            >
              {schoolName}
            </div>
            <div style={{ fontSize: 7, color: "rgba(255,255,255,0.7)" }}>
              {schoolAddress}
            </div>
          </div>
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: "#f59e0b",
              background: "rgba(255,255,255,0.15)",
              padding: "3px 8px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            STUDENT ID
          </div>
        </div>

        {/* Main area */}
        <div style={{ display: "flex", gap: 10, padding: "0 14px" }}>
          <div
            style={{
              width: 60,
              height: 70,
              borderRadius: 8,
              border: "2px solid rgba(255,255,255,0.5)",
              overflow: "hidden",
              flexShrink: 0,
              background: "rgba(255,255,255,0.15)",
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
              <span style={{ fontSize: 28, color: "rgba(255,255,255,0.5)" }}>
                👤
              </span>
            )}
          </div>
          <div style={{ flex: 1, color: "#fff" }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
              {student.fullName}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.8)",
                marginTop: 2,
              }}
            >
              {className}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.7)",
                marginTop: 4,
              }}
            >
              Adm. No.: <strong>{student.admNo}</strong>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>
              DOB: {dob}
            </div>
            <div style={{ fontSize: 9, color: "#f59e0b", fontWeight: 600 }}>
              Blood: {bloodGroup}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.3)",
            padding: "6px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.8)" }}>
            {student.fatherName} · {student.fatherMobile}
          </div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>
            {academicYear}
          </div>
        </div>
      </div>
    );
  }

  // Vertical card
  return (
    <div
      style={{
        width: 162,
        height: 256,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        border: "1px solid #ddd",
      }}
      data-ocid="id_card.vertical.panel"
    >
      {/* Header */}
      <div
        style={{
          background: "#1e3a5f",
          padding: "8px 10px 6px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 1,
          }}
        >
          {schoolName}
        </div>
        <div
          style={{ fontSize: 6, color: "rgba(255,255,255,0.7)", marginTop: 1 }}
        >
          {schoolAddress}
        </div>
        <div
          style={{
            fontSize: 7,
            color: "#f59e0b",
            fontWeight: 700,
            marginTop: 2,
          }}
        >
          STUDENT IDENTITY CARD
        </div>
      </div>

      {/* Photo */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "8px 0 4px",
          background: "#f0f4f8",
        }}
      >
        <div
          style={{
            width: 60,
            height: 70,
            borderRadius: 6,
            border: "2px solid #1e3a5f",
            overflow: "hidden",
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
            <span style={{ fontSize: 24, color: "#aaa" }}>👤</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: "4px 8px", textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.2,
          }}
        >
          {student.fullName}
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#1e3a5f",
            fontWeight: 600,
            marginTop: 1,
          }}
        >
          {className}
        </div>
        <div
          style={{
            borderTop: "1px dashed #ddd",
            marginTop: 5,
            paddingTop: 4,
            fontSize: 8,
            color: "#555",
            textAlign: "left",
            lineHeight: 1.8,
          }}
        >
          <div>
            Adm. No.: <strong>{student.admNo}</strong>
          </div>
          <div>DOB: {dob}</div>
          <div>Father: {student.fatherName}</div>
          <div style={{ color: "#c00", fontWeight: 700 }}>
            Blood: {bloodGroup}
          </div>
          <div>Session: {academicYear}</div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#1e3a5f",
          padding: "4px 8px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 7, color: "rgba(255,255,255,0.8)" }}>
          {schoolPhone}
        </div>
      </div>
    </div>
  );
}
