import type { Staff } from "@/types";

interface StaffIDCardTemplateProps {
  staff: Staff;
  schoolName?: string;
  schoolPhone?: string;
  schoolAddress?: string;
  academicYear?: string;
  variant?: "vertical" | "horizontal" | "themed";
}

export function StaffIDCardTemplate({
  staff,
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolPhone = "+91 98765 43210",
  schoolAddress = "Knowledge City, India",
  academicYear = `${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(2)}`,
  variant = "horizontal",
}: StaffIDCardTemplateProps) {
  const CARD_W = 342;
  const CARD_H = 216;

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
            "linear-gradient(135deg, #7c3aed 0%, #2563eb 60%, #1e3a5f 100%)",
        }}
        data-ocid="staff_id_card.themed.panel"
      >
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
            STAFF ID
          </div>
        </div>
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
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt={staff.fullName}
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
              {staff.fullName}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.8)",
                marginTop: 2,
              }}
            >
              {staff.designation}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.7)",
                marginTop: 4,
              }}
            >
              ID: <strong>{staff.staffCode}</strong>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>
              Dept: {staff.department}
            </div>
            <div style={{ fontSize: 9, color: "#f59e0b", fontWeight: 600 }}>
              {staff.mobile}
            </div>
          </div>
        </div>
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
            {schoolPhone}
          </div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>
            {academicYear}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "vertical") {
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
        data-ocid="staff_id_card.vertical.panel"
      >
        <div
          style={{
            background: "#7c3aed",
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
            style={{
              fontSize: 7,
              color: "rgba(255,255,255,0.7)",
              marginTop: 1,
            }}
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
            STAFF IDENTITY CARD
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "8px 0 4px",
            background: "#f5f3ff",
          }}
        >
          <div
            style={{
              width: 60,
              height: 70,
              borderRadius: 6,
              border: "2px solid #7c3aed",
              overflow: "hidden",
              background: "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt={staff.fullName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: 24, color: "#aaa" }}>👤</span>
            )}
          </div>
        </div>
        <div style={{ flex: 1, padding: "4px 8px", textAlign: "center" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#111",
              lineHeight: 1.2,
            }}
          >
            {staff.fullName}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "#7c3aed",
              fontWeight: 600,
              marginTop: 1,
            }}
          >
            {staff.designation}
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
              ID: <strong>{staff.staffCode}</strong>
            </div>
            <div>Dept: {staff.department}</div>
            <div>Mobile: {staff.mobile}</div>
            <div>Session: {academicYear}</div>
          </div>
        </div>
        <div
          style={{
            background: "#7c3aed",
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

  // Horizontal (default)
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
      data-ocid="staff_id_card.horizontal.panel"
    >
      {/* Left purple strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 90,
          background: "#7c3aed",
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
            background: "rgba(255,255,255,0.1)",
            border: "2px solid rgba(255,255,255,0.6)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {staff.photoUrl ? (
            <img
              src={staff.photoUrl}
              alt={staff.fullName}
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
          {staff.staffCode}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 8,
            color: "#f59e0b",
            fontWeight: 700,
          }}
        >
          STAFF
        </div>
      </div>

      {/* Right info */}
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
              color: "#7c3aed",
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
            {staff.fullName}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#7c3aed",
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            {staff.designation}
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
            <span style={{ color: "#888" }}>Dept:</span>
            <span>{staff.department}</span>
            <span style={{ color: "#888" }}>Mobile:</span>
            <span>{staff.mobile}</span>
            <span style={{ color: "#888" }}>Joined:</span>
            <span>{staff.dateOfJoining}</span>
            <span style={{ color: "#888" }}>Session:</span>
            <span>{academicYear}</span>
          </div>
        </div>
        <div style={{ fontSize: 7, color: "#aaa" }}>Ph: {schoolPhone}</div>
      </div>
    </div>
  );
}
