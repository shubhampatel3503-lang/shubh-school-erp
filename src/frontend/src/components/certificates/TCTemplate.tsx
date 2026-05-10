import { formatDate } from "@/lib/utils";
import type { Student } from "@/types";

interface TCTemplateProps {
  student: Student;
  tcNumber?: string;
  reasonForLeaving?: string;
  lastClassAttended?: string;
  dateOfLeaving?: string;
  conduct?: string;
  schoolName?: string;
  schoolAddress?: string;
  principalName?: string;
  variant?: "formal" | "simplified";
}

export function TCTemplate({
  student,
  tcNumber,
  reasonForLeaving = "Parents' request",
  lastClassAttended,
  dateOfLeaving = new Date().toLocaleDateString("en-IN"),
  conduct = "Good",
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolAddress = "123 Education Lane, Knowledge City, India - 110001",
  principalName = "Dr. Rajesh Kumar",
  variant = "formal",
}: TCTemplateProps) {
  const tcNo = tcNumber ?? `TC-${new Date().getFullYear()}-${student.admNo}`;
  const className =
    lastClassAttended ?? student.classLevel.replace("Class", "Class ");
  const dobFormatted = formatDate(student.dateOfBirth);
  const admDateFormatted = formatDate(student.admissionDate);

  if (variant === "simplified") {
    return (
      <div
        className="bg-white text-black"
        style={{
          width: 794,
          minHeight: 900,
          fontFamily: "Arial, sans-serif",
          padding: "40px 48px",
        }}
        data-ocid="tc.simplified.panel"
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: "2px solid #1e3a5f",
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f" }}>
              {schoolName}
            </div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
              {schoolAddress}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f" }}>
              TRANSFER CERTIFICATE
            </div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
              T.C. No.: <strong>{tcNo}</strong>
            </div>
          </div>
        </div>

        {/* Two-column details */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 32px",
            fontSize: 13,
          }}
        >
          {(
            [
              ["Admission Number", student.admNo],
              ["Student Full Name", student.fullName],
              ["Father's Name", student.fatherName],
              ["Mother's Name", student.motherName],
              ["Date of Birth", dobFormatted],
              ["Gender", student.gender],
              ["Category", student.category || "General"],
              ["Address", student.currentAddress || student.permanentAddress],
              ["Last Class Attended", className],
              ["Aadhaar No.", student.aadhaarNo || "—"],
              ["Date of Admission", admDateFormatted],
              ["Date of Leaving", dateOfLeaving],
              ["Reason for Leaving", reasonForLeaving],
              ["Conduct & Character", conduct],
            ] as [string, string][]
          ).map(([label, value]) => (
            <div
              key={label}
              style={{
                borderBottom: "1px dotted #ccc",
                paddingBottom: 8,
                paddingTop: 4,
              }}
            >
              <div style={{ color: "#666", fontSize: 11 }}>{label}</div>
              <div style={{ fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Remarks */}
        <div style={{ marginTop: 24, fontSize: 13, lineHeight: 1.8 }}>
          <strong>Remarks:</strong> The above-mentioned student has been a
          student of this school. He/She is hereby granted this Transfer
          Certificate.
        </div>

        {/* Signatures */}
        <div
          style={{
            marginTop: 60,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: "1px solid #333",
                paddingTop: 6,
                width: 160,
                fontSize: 12,
              }}
            >
              Class Teacher
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: "1px solid #333",
                paddingTop: 6,
                width: 160,
                fontSize: 12,
              }}
            >
              Accounts Section
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: "1px solid #333",
                paddingTop: 6,
                width: 180,
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 700 }}>{principalName}</div>
              <div>Principal</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formal government-style TC
  const rows: [string, string, string][] = [
    ["1.", "Name of the School", schoolName],
    ["2.", "School Code / Affiliation No.", "SCH-2001-CBSE"],
    ["3.", "Name of Pupil", student.fullName],
    ["4.", "Mother's Name", student.motherName],
    ["5.", "Father's / Guardian's Name", student.fatherName],
    ["6.", "Nationality", "Indian"],
    ["7.", "Category (Gen/OBC/SC/ST)", student.category || "General"],
    ["8.", "Date of Birth (as per school record)", dobFormatted],
    ["9.", "Date of Birth in Words", `${dobFormatted} (as per records)`],
    ["10.", "Admission No.", student.admNo],
    ["11.", "Date of First Admission in the School", admDateFormatted],
    ["12.", "Class in which first Admitted", "—"],
    ["13.", "Class in which studying at the time of leaving", className],
    ["14.", "Whether Failed (if yes, mention class)", "No"],
    ["15.", "Subject Offered", "As per curriculum"],
    ["16.", "Whether NCC Cadet / Boy Scout / Girl Guide", "No"],
    ["17.", "Month up to which School fee paid", dateOfLeaving],
    ["18.", "Any fee concession availed, Nature & Extent", "Nil"],
    ["19.", "Total No. of Working Days in the Academic Year", "220"],
    ["20.", "Total No. of Days Present", "—"],
    ["21.", "Whether qualified for promotion", "Yes"],
    ["22.", "Conduct and Character", conduct],
    [
      "23.",
      "Date of Application for T.C.",
      new Date().toLocaleDateString("en-IN"),
    ],
    ["24.", "Date of Issue of T.C.", dateOfLeaving],
    ["25.", "Reason for Leaving", reasonForLeaving],
    ["26.", "Remarks", "—"],
  ];

  return (
    <div
      className="bg-white text-black"
      style={{
        width: 794,
        fontFamily: "Times New Roman, serif",
        border: "2px solid #000",
        padding: 0,
      }}
      data-ocid="tc.formal.panel"
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "20px 40px 14px",
          borderBottom: "2px solid #000",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
          {schoolName}
        </div>
        <div style={{ fontSize: 12, color: "#444", marginTop: 2 }}>
          {schoolAddress}
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            marginTop: 10,
            letterSpacing: 2,
            textDecoration: "underline",
          }}
        >
          TRANSFER CERTIFICATE
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontSize: 12,
          }}
        >
          <span>
            T.C. No.: <strong>{tcNo}</strong>
          </span>
          <span>
            Date: <strong>{dateOfLeaving}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
      >
        <tbody>
          {rows.map(([sno, label, value]) => (
            <tr key={sno} style={{ borderBottom: "1px solid #ccc" }}>
              <td
                style={{
                  padding: "5px 12px",
                  width: 36,
                  borderRight: "1px solid #ccc",
                  verticalAlign: "top",
                }}
              >
                {sno}
              </td>
              <td
                style={{
                  padding: "5px 12px",
                  width: 280,
                  borderRight: "1px solid #ccc",
                  verticalAlign: "top",
                }}
              >
                {label}
              </td>
              <td style={{ padding: "5px 12px", fontWeight: 500 }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Signatures */}
      <div
        style={{
          padding: "20px 40px 28px",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #000",
          marginTop: 4,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              borderTop: "1px solid #000",
              paddingTop: 6,
              width: 150,
              fontSize: 12,
            }}
          >
            Class Teacher
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              borderTop: "1px solid #000",
              paddingTop: 6,
              width: 150,
              fontSize: 12,
            }}
          >
            Checked By
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              border: "1px solid #333",
              borderRadius: 4,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              color: "#aaa",
              margin: "0 auto 8px",
            }}
          >
            SEAL
          </div>
          <div
            style={{
              borderTop: "1px solid #000",
              paddingTop: 6,
              width: 180,
              fontSize: 12,
            }}
          >
            <div style={{ fontWeight: 700 }}>{principalName}</div>
            <div>Principal</div>
          </div>
        </div>
      </div>
    </div>
  );
}
