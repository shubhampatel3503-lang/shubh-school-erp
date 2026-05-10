import { formatDate } from "@/lib/utils";
import type { Student } from "@/types";

interface BonafideTemplateProps {
  student: Student;
  purpose?: string;
  schoolName?: string;
  schoolAddress?: string;
  principalName?: string;
  variant?: "formal" | "modern";
  issueDate?: string;
}

export function BonafideTemplate({
  student,
  purpose = "general purposes",
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolAddress = "123 Education Lane, Knowledge City, India - 110001",
  principalName = "Dr. Rajesh Kumar",
  variant = "formal",
  issueDate = new Date().toLocaleDateString("en-IN"),
}: BonafideTemplateProps) {
  const className = student.classLevel.replace("Class", "Class ");

  if (variant === "modern") {
    return (
      <div
        className="bg-white text-black"
        style={{
          width: 794,
          minHeight: 1123,
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
        data-ocid="bonafide.modern.panel"
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: "linear-gradient(180deg, #1e3a5f 0%, #2563eb 100%)",
          }}
        />

        <div style={{ marginLeft: 8, padding: "40px 48px 40px 40px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 32,
              paddingBottom: 20,
              borderBottom: "2px solid #1e3a5f",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#1e3a5f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>
                SS
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#1e3a5f",
                  letterSpacing: 1,
                }}
              >
                {schoolName}
              </div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                {schoolAddress}
              </div>
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                display: "inline-block",
                background: "#1e3a5f",
                color: "#fff",
                padding: "8px 40px",
                borderRadius: 4,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              BONAFIDE CERTIFICATE
            </div>
          </div>

          {/* Certificate No & Date */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              marginBottom: 28,
              color: "#666",
            }}
          >
            <span>
              Certificate No.: BC-{student.admNo}-{new Date().getFullYear()}
            </span>
            <span>Date: {issueDate}</span>
          </div>

          {/* Body */}
          <div style={{ fontSize: 15, lineHeight: 2.2, color: "#222" }}>
            <p>
              This is to certify that{" "}
              <strong style={{ fontSize: 16 }}>{student.fullName}</strong>,
              Son/Daughter of <strong>{student.fatherName}</strong> and{" "}
              <strong>{student.motherName}</strong>, bearing Admission No.{" "}
              <strong>{student.admNo}</strong>, is a bonafide student of this
              institution.
            </p>
            <p>
              He/She is currently studying in <strong>{className}</strong>
              {student.sectionId ? `, Section ${student.sectionId}` : ""} for
              the academic session <strong>{student.sessionId}</strong>.
            </p>
            <p>
              Date of Birth as per school records:{" "}
              <strong>{formatDate(student.dateOfBirth)}</strong>.
            </p>
            <p>
              This certificate is issued at the request of the student/guardian
              for <strong>{purpose}</strong>.
            </p>
          </div>

          {/* Signature */}
          <div
            style={{
              marginTop: 80,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#666" }}>
                <div>Admission No.: {student.admNo}</div>
                <div>Class: {className}</div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  border: "1px solid #999",
                  borderRadius: 4,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#aaa",
                }}
              >
                SEAL
              </div>
              <div
                style={{
                  borderTop: "1px solid #333",
                  paddingTop: 6,
                  width: 200,
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 600 }}>{principalName}</div>
                <div style={{ color: "#555", fontSize: 12 }}>Principal</div>
                <div style={{ color: "#555", fontSize: 12 }}>{schoolName}</div>
              </div>
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
        minHeight: 1123,
        fontFamily: "Times New Roman, serif",
        border: "3px double #1e3a5f",
        margin: 0,
        padding: 0,
      }}
      data-ocid="bonafide.formal.panel"
    >
      {/* Inner border */}
      <div
        style={{
          border: "1px solid #1e3a5f",
          margin: 12,
          minHeight: "calc(100% - 24px)",
          padding: "32px 48px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#1e3a5f",
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>
              SS
            </span>
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#1e3a5f",
              letterSpacing: 2,
            }}
          >
            {schoolName}
          </div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>
            {schoolAddress}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
              textDecoration: "underline",
              color: "#1e3a5f",
            }}
          >
            BONAFIDE CERTIFICATE
          </div>
        </div>

        {/* Ref & Date */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            marginBottom: 32,
            color: "#555",
          }}
        >
          <span>
            Ref. No.: BC/{new Date().getFullYear()}/{student.admNo}
          </span>
          <span>Date: {issueDate}</span>
        </div>

        {/* Body */}
        <div
          style={{
            fontSize: 15,
            lineHeight: 2.4,
            textAlign: "justify",
            color: "#111",
          }}
        >
          <p style={{ textIndent: 40 }}>
            This is to certify that{" "}
            <strong style={{ textDecoration: "underline", fontSize: 16 }}>
              {student.fullName}
            </strong>
            , Son/Daughter of <strong>{student.fatherName}</strong>, residing at{" "}
            <strong>
              {student.currentAddress || student.permanentAddress}
            </strong>
            , is a <em>Bonafide Student</em> of <strong>{schoolName}</strong>.
          </p>
          <p style={{ textIndent: 40 }}>
            He/She is currently enrolled in <strong>{className}</strong>
            {student.sectionId ? `, Section – ${student.sectionId}` : ""},{" "}
            bearing Admission No. <strong>{student.admNo}</strong>, for the
            Academic Session <strong>{student.sessionId}</strong>. His/Her Date
            of Birth as per school records is{" "}
            <strong>{formatDate(student.dateOfBirth)}</strong>.
          </p>
          <p style={{ textIndent: 40 }}>
            This certificate is issued on the request of the
            student/parent/guardian for <strong>{purpose}</strong> and to
            whomsoever it may concern.
          </p>
        </div>

        {/* Conduct */}
        <div style={{ marginTop: 20, fontSize: 14 }}>
          <span>Conduct and Character: </span>
          <span
            style={{
              borderBottom: "1px dotted #333",
              display: "inline-block",
              width: 200,
              marginLeft: 8,
            }}
          >
            Good
          </span>
        </div>

        {/* Signatures */}
        <div
          style={{
            marginTop: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: "1px solid #333",
                paddingTop: 6,
                width: 160,
                fontSize: 13,
              }}
            >
              <div>Class Teacher</div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                border: "2px solid #1e3a5f",
                borderRadius: 4,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#aaa",
                margin: "0 auto 8px",
              }}
            >
              SCHOOL
              <br />
              SEAL
            </div>
            <div
              style={{
                borderTop: "1px solid #333",
                paddingTop: 6,
                width: 200,
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 700 }}>{principalName}</div>
              <div>Principal</div>
              <div style={{ fontSize: 12, color: "#555" }}>{schoolName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
