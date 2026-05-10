import { j as jsxRuntimeExports, a0 as formatDate, a5 as useStudents, bA as useStaff, r as reactExports, d6 as usePaymentsByStudent, dn as useExamTimetables, a7 as getClassLabel, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, e as Button, X, L as Label, I as Input } from "./index-pMBTUEbj.js";
import { F as FeeReceiptTemplate } from "./FeeReceiptTemplate-BjT7XvY6.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
const DEFAULT_INSTRUCTIONS = [
  "Candidates must carry this Admit Card to the examination hall.",
  "Mobile phones and electronic devices are strictly prohibited.",
  "Candidates must be present 30 minutes before the exam.",
  "No candidate will be allowed without a valid Admit Card.",
  "Borrowing of stationery is not permitted in the examination hall."
];
function AdmitCardTemplate({
  student,
  timetable,
  examName = "Annual Examination 2025-26",
  rollNo,
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolAddress = "123 Education Lane, Knowledge City, India - 110001",
  centerName = "School Campus",
  variant = "formal",
  instructions = DEFAULT_INSTRUCTIONS
}) {
  const className = student.classLevel.replace("Class", "Class ");
  const roll = rollNo ?? student.admNo;
  const entries = (timetable == null ? void 0 : timetable.entries) ?? [];
  if (variant === "compact") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-white text-black",
        style: {
          width: 560,
          fontFamily: "Arial, sans-serif",
          border: "2px solid #1e3a5f",
          borderRadius: 8,
          overflow: "hidden"
        },
        "data-ocid": "admit_card.compact.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: "#1e3a5f",
                color: "#fff",
                padding: "10px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 700 }, children: schoolName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, opacity: 0.8 }, children: schoolAddress })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: 11,
                        fontWeight: 600,
                        background: "rgba(255,255,255,0.2)",
                        padding: "4px 10px",
                        borderRadius: 4
                      },
                      children: "ADMIT CARD"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, marginTop: 4, opacity: 0.85 }, children: examName })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "10px 16px",
                background: "#f0f4f8",
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 12
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 48,
                      height: 56,
                      border: "2px solid #1e3a5f",
                      borderRadius: 4,
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: student.photoUrl,
                        alt: student.fullName,
                        style: { width: "100%", height: "100%", objectFit: "cover" }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20 }, children: "👤" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 14 }, children: student.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#555", marginTop: 2 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginRight: 16 }, children: [
                      "Class: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: className })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginRight: 16 }, children: [
                      "Roll No.: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: roll })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Session: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.sessionId })
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 16px 8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#1e3a5f",
                  marginBottom: 6
                },
                children: "EXAM SCHEDULE"
              }
            ),
            entries.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "table",
              {
                style: {
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 11
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: "#1e3a5f", color: "#fff" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "5px 8px", textAlign: "left" }, children: "Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "5px 8px", textAlign: "left" }, children: "Subject" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "5px 8px", textAlign: "left" }, children: "Time" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { padding: "5px 8px", textAlign: "left" }, children: "Venue" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      style: {
                        borderBottom: "1px solid #e2e8f0",
                        background: i % 2 === 0 ? "#fff" : "#f8fafc"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 8px" }, children: e.date }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 8px", fontWeight: 600 }, children: e.subjectName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { padding: "5px 8px" }, children: [
                          e.startTime,
                          " – ",
                          e.endTime
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 8px" }, children: e.venue || centerName })
                      ]
                    },
                    `${e.date}-${e.subjectId}`
                  )) })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  padding: "12px 8px",
                  color: "#888",
                  fontSize: 12,
                  fontStyle: "italic"
                },
                children: "Exam schedule will be populated from saved timetable."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "8px 16px 12px",
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #ddd"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, color: "#888" }, children: [
                  "Examination Centre: ",
                  centerName
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      borderTop: "1px solid #333",
                      paddingTop: 4,
                      width: 130,
                      fontSize: 10
                    },
                    children: "Principal's Signature"
                  }
                ) })
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-white text-black",
      style: {
        width: 794,
        fontFamily: "Times New Roman, serif",
        border: "2px solid #1e3a5f"
      },
      "data-ocid": "admit_card.formal.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              textAlign: "center",
              padding: "16px 40px 12px",
              borderBottom: "2px solid #1e3a5f",
              background: "#f0f4f8"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: "#1e3a5f"
                  },
                  children: schoolName
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "#555", marginTop: 2 }, children: schoolAddress }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 16,
                    fontWeight: 700,
                    marginTop: 8,
                    letterSpacing: 2,
                    textDecoration: "underline",
                    color: "#1e3a5f"
                  },
                  children: "ADMIT CARD"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "#444", marginTop: 4 }, children: examName })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "16px 40px",
              display: "flex",
              gap: 24,
              borderBottom: "1px solid #ddd"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 80,
                    height: 96,
                    border: "2px solid #1e3a5f",
                    borderRadius: 4,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: student.photoUrl,
                      alt: student.fullName,
                      style: { width: "100%", height: "100%", objectFit: "cover" }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, textAlign: "center" }, children: "👤" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { style: { width: "100%", fontSize: 13 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { width: 160, paddingBottom: 6, color: "#555" }, children: "Student Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 700, fontSize: 15, paddingBottom: 6 }, children: student.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "#555" }, children: "Roll No." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 700 }, children: roll })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { paddingBottom: 6, color: "#555" }, children: "Father's Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { paddingBottom: 6 }, children: student.fatherName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "#555" }, children: "Adm. No." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: student.admNo })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { paddingBottom: 6, color: "#555" }, children: "Class" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { paddingBottom: 6, fontWeight: 600 }, children: className }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "#555" }, children: "Session" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: student.sessionId })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "#555" }, children: "Exam Centre" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: centerName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { color: "#555" }, children: "Invigilator Sign" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { borderBottom: "1px solid #333", width: 120 } })
                ] })
              ] }) }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 40px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 8,
                color: "#1e3a5f",
                textDecoration: "underline"
              },
              children: "EXAMINATION SCHEDULE"
            }
          ),
          entries.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "table",
            {
              style: {
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                border: "1px solid #999"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: "#1e3a5f", color: "#fff" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      style: {
                        border: "1px solid #999",
                        padding: "6px 10px",
                        textAlign: "center"
                      },
                      children: "S.No."
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      style: {
                        border: "1px solid #999",
                        padding: "6px 10px",
                        textAlign: "left"
                      },
                      children: "Date"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      style: {
                        border: "1px solid #999",
                        padding: "6px 10px",
                        textAlign: "left"
                      },
                      children: "Subject"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      style: {
                        border: "1px solid #999",
                        padding: "6px 10px",
                        textAlign: "center"
                      },
                      children: "Start Time"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      style: {
                        border: "1px solid #999",
                        padding: "6px 10px",
                        textAlign: "center"
                      },
                      children: "End Time"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      style: {
                        border: "1px solid #999",
                        padding: "6px 10px",
                        textAlign: "left"
                      },
                      children: "Venue"
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    style: { borderBottom: "1px solid #ddd" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          style: {
                            border: "1px solid #ddd",
                            padding: "6px 10px",
                            textAlign: "center"
                          },
                          children: i + 1
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { border: "1px solid #ddd", padding: "6px 10px" }, children: e.date }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          style: {
                            border: "1px solid #ddd",
                            padding: "6px 10px",
                            fontWeight: 600
                          },
                          children: e.subjectName
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          style: {
                            border: "1px solid #ddd",
                            padding: "6px 10px",
                            textAlign: "center"
                          },
                          children: e.startTime
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          style: {
                            border: "1px solid #ddd",
                            padding: "6px 10px",
                            textAlign: "center"
                          },
                          children: e.endTime
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { border: "1px solid #ddd", padding: "6px 10px" }, children: e.venue || centerName })
                    ]
                  },
                  `${e.date}-${e.subjectId}`
                )) })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "14px 0",
                color: "#888",
                fontSize: 13,
                fontStyle: "italic",
                textAlign: "center",
                border: "1px dashed #ccc",
                borderRadius: 4
              },
              children: [
                "Exam schedule will be auto-populated from saved exam timetable for",
                " ",
                className,
                "."
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 40px 14px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 12,
                fontWeight: 700,
                color: "#c00",
                marginBottom: 6
              },
              children: "IMPORTANT INSTRUCTIONS:"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ol",
            {
              style: {
                margin: 0,
                paddingLeft: 18,
                fontSize: 11,
                color: "#333",
                lineHeight: 1.8
              },
              children: instructions.map((ins) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: ins }, ins))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "10px 40px 20px",
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #ddd",
              fontSize: 12
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { borderTop: "1px solid #333", paddingTop: 6, width: 160 },
                  children: "Student's Signature"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { borderTop: "1px solid #333", paddingTop: 6, width: 160 },
                  children: "Parent's Signature"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: { borderTop: "1px solid #333", paddingTop: 6, width: 180 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700 }, children: "Principal's Signature" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#555" }, children: schoolName })
                  ]
                }
              ) })
            ]
          }
        )
      ]
    }
  );
}
function BonafideTemplate({
  student,
  purpose = "general purposes",
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolAddress = "123 Education Lane, Knowledge City, India - 110001",
  principalName = "Dr. Rajesh Kumar",
  variant = "formal",
  issueDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")
}) {
  const className = student.classLevel.replace("Class", "Class ");
  if (variant === "modern") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-white text-black",
        style: {
          width: 794,
          minHeight: 1123,
          fontFamily: "Arial, sans-serif",
          position: "relative"
        },
        "data-ocid": "bonafide.modern.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 8,
                background: "linear-gradient(180deg, #1e3a5f 0%, #2563eb 100%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: 8, padding: "40px 48px 40px 40px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 32,
                  paddingBottom: 20,
                  borderBottom: "2px solid #1e3a5f"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "#1e3a5f",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontSize: 26, fontWeight: 700 }, children: "SS" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: 26,
                          fontWeight: 700,
                          color: "#1e3a5f",
                          letterSpacing: 1
                        },
                        children: schoolName
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "#555", marginTop: 2 }, children: schoolAddress })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", marginBottom: 36 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  display: "inline-block",
                  background: "#1e3a5f",
                  color: "#fff",
                  padding: "8px 40px",
                  borderRadius: 4,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: 2
                },
                children: "BONAFIDE CERTIFICATE"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 28,
                  color: "#666"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Certificate No.: BC-",
                    student.admNo,
                    "-",
                    (/* @__PURE__ */ new Date()).getFullYear()
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Date: ",
                    issueDate
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 15, lineHeight: 2.2, color: "#222" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "This is to certify that",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: 16 }, children: student.fullName }),
                ", Son/Daughter of ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.fatherName }),
                " and",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.motherName }),
                ", bearing Admission No.",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.admNo }),
                ", is a bonafide student of this institution."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "He/She is currently studying in ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: className }),
                student.sectionId ? `, Section ${student.sectionId}` : "",
                " for the academic session ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.sessionId }),
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Date of Birth as per school records:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatDate(student.dateOfBirth) }),
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "This certificate is issued at the request of the student/guardian for ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: purpose }),
                "."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  marginTop: 80,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "#666" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      "Admission No.: ",
                      student.admNo
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      "Class: ",
                      className
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: 56,
                          height: 56,
                          border: "1px solid #999",
                          borderRadius: 4,
                          marginBottom: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "#aaa"
                        },
                        children: "SEAL"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          borderTop: "1px solid #333",
                          paddingTop: 6,
                          width: 200,
                          fontSize: 13
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600 }, children: principalName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 12 }, children: "Principal" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#555", fontSize: 12 }, children: schoolName })
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "bg-white text-black",
      style: {
        width: 794,
        minHeight: 1123,
        fontFamily: "Times New Roman, serif",
        border: "3px double #1e3a5f",
        margin: 0,
        padding: 0
      },
      "data-ocid": "bonafide.formal.panel",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            border: "1px solid #1e3a5f",
            margin: 12,
            minHeight: "calc(100% - 24px)",
            padding: "32px 48px"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: 24 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#1e3a5f",
                    margin: "0 auto 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontSize: 28, fontWeight: 700 }, children: "SS" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#1e3a5f",
                    letterSpacing: 2
                  },
                  children: schoolName
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "#555", marginTop: 3 }, children: schoolAddress }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    marginTop: 16,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: 3,
                    textDecoration: "underline",
                    color: "#1e3a5f"
                  },
                  children: "BONAFIDE CERTIFICATE"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 32,
                  color: "#555"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Ref. No.: BC/",
                    (/* @__PURE__ */ new Date()).getFullYear(),
                    "/",
                    student.admNo
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Date: ",
                    issueDate
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  fontSize: 15,
                  lineHeight: 2.4,
                  textAlign: "justify",
                  color: "#111"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { textIndent: 40 }, children: [
                    "This is to certify that",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { textDecoration: "underline", fontSize: 16 }, children: student.fullName }),
                    ", Son/Daughter of ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.fatherName }),
                    ", residing at",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.currentAddress || student.permanentAddress }),
                    ", is a ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Bonafide Student" }),
                    " of ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: schoolName }),
                    "."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { textIndent: 40 }, children: [
                    "He/She is currently enrolled in ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: className }),
                    student.sectionId ? `, Section – ${student.sectionId}` : "",
                    ",",
                    " ",
                    "bearing Admission No. ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.admNo }),
                    ", for the Academic Session ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.sessionId }),
                    ". His/Her Date of Birth as per school records is",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatDate(student.dateOfBirth) }),
                    "."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { textIndent: 40 }, children: [
                    "This certificate is issued on the request of the student/parent/guardian for ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: purpose }),
                    " and to whomsoever it may concern."
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 20, fontSize: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Conduct and Character: " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    borderBottom: "1px dotted #333",
                    display: "inline-block",
                    width: 200,
                    marginLeft: 8
                  },
                  children: "Good"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  marginTop: 80,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        borderTop: "1px solid #333",
                        paddingTop: 6,
                        width: 160,
                        fontSize: 13
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Class Teacher" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
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
                          margin: "0 auto 8px"
                        },
                        children: [
                          "SCHOOL",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                          "SEAL"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          borderTop: "1px solid #333",
                          paddingTop: 6,
                          width: 200,
                          fontSize: 13
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700 }, children: principalName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Principal" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "#555" }, children: schoolName })
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function IDCardTemplate({
  student,
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolPhone = "+91 98765 43210",
  schoolAddress = "Knowledge City, India",
  academicYear = "2025-26",
  bloodGroup = "B+",
  variant = "vertical"
}) {
  const className = student.classLevel.replace("Class", "Class ");
  const dob = formatDate(student.dateOfBirth);
  const CARD_W = 342;
  const CARD_H = 216;
  if (variant === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          width: CARD_W,
          height: CARD_H,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          background: "#fff",
          border: "1px solid #ddd"
        },
        "data-ocid": "id_card.horizontal.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 90,
                background: "#1e3a5f",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 12
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "#fff3",
                      border: "2px solid rgba(255,255,255,0.6)",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: student.photoUrl,
                        alt: student.fullName,
                        style: { width: "100%", height: "100%", objectFit: "cover" }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 28, color: "rgba(255,255,255,0.7)" }, children: "👤" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      marginTop: 8,
                      fontSize: 9,
                      color: "rgba(255,255,255,0.8)",
                      textAlign: "center",
                      padding: "0 4px"
                    },
                    children: student.admNo
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      marginTop: 4,
                      fontSize: 8,
                      color: "#f59e0b",
                      fontWeight: 700
                    },
                    children: "ID CARD"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                marginLeft: 94,
                padding: "10px 12px 10px 8px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#1e3a5f",
                        letterSpacing: 1,
                        textTransform: "uppercase"
                      },
                      children: schoolName
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 7, color: "#777", marginBottom: 8 }, children: schoolAddress }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#111",
                        lineHeight: 1.2
                      },
                      children: student.fullName
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: 10,
                        color: "#1e3a5f",
                        fontWeight: 600,
                        marginTop: 2
                      },
                      children: className
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      fontSize: 9,
                      color: "#555",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "3px 6px"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: "DOB:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: dob }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: "Father:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: student.fatherName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: "Mobile:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: student.fatherMobile }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: "Blood:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#c00", fontWeight: 700 }, children: bloodGroup }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: "Session:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: academicYear })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 7, color: "#aaa" }, children: [
                  "Ph: ",
                  schoolPhone
                ] })
              ]
            }
          )
        ]
      }
    );
  }
  if (variant === "themed") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          width: CARD_W,
          height: CARD_H,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #7c3aed 100%)"
        },
        "data-ocid": "id_card.themed.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "10px 14px 8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#fff",
                        letterSpacing: 1
                      },
                      children: schoolName
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 7, color: "rgba(255,255,255,0.7)" }, children: schoolAddress })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#f59e0b",
                      background: "rgba(255,255,255,0.15)",
                      padding: "3px 8px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.3)"
                    },
                    children: "STUDENT ID"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, padding: "0 14px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  width: 60,
                  height: 70,
                  borderRadius: 8,
                  border: "2px solid rgba(255,255,255,0.5)",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: student.photoUrl,
                    alt: student.fullName,
                    style: { width: "100%", height: "100%", objectFit: "cover" }
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 28, color: "rgba(255,255,255,0.5)" }, children: "👤" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, color: "#fff" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, lineHeight: 1.2 }, children: student.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 10,
                    color: "rgba(255,255,255,0.8)",
                    marginTop: 2
                  },
                  children: className
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    fontSize: 9,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 4
                  },
                  children: [
                    "Adm. No.: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.admNo })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.7)" }, children: [
                "DOB: ",
                dob
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, color: "#f59e0b", fontWeight: 600 }, children: [
                "Blood: ",
                bloodGroup
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.3)",
                padding: "6px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 8, color: "rgba(255,255,255,0.8)" }, children: [
                  student.fatherName,
                  " · ",
                  student.fatherMobile
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 8, color: "rgba(255,255,255,0.7)" }, children: academicYear })
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        width: 162,
        height: 256,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        border: "1px solid #ddd"
      },
      "data-ocid": "id_card.vertical.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: "#1e3a5f",
              padding: "8px 10px 6px",
              textAlign: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 8,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: 1
                  },
                  children: schoolName
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { fontSize: 6, color: "rgba(255,255,255,0.7)", marginTop: 1 },
                  children: schoolAddress
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 7,
                    color: "#f59e0b",
                    fontWeight: 700,
                    marginTop: 2
                  },
                  children: "STUDENT IDENTITY CARD"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "center",
              padding: "8px 0 4px",
              background: "#f0f4f8"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  width: 60,
                  height: 70,
                  borderRadius: 6,
                  border: "2px solid #1e3a5f",
                  overflow: "hidden",
                  background: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: student.photoUrl,
                    alt: student.fullName,
                    style: { width: "100%", height: "100%", objectFit: "cover" }
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 24, color: "#aaa" }, children: "👤" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "4px 8px", textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 11,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.2
              },
              children: student.fullName
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 9,
                color: "#1e3a5f",
                fontWeight: 600,
                marginTop: 1
              },
              children: className
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                borderTop: "1px dashed #ddd",
                marginTop: 5,
                paddingTop: 4,
                fontSize: 8,
                color: "#555",
                textAlign: "left",
                lineHeight: 1.8
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "Adm. No.: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: student.admNo })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "DOB: ",
                  dob
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "Father: ",
                  student.fatherName
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#c00", fontWeight: 700 }, children: [
                  "Blood: ",
                  bloodGroup
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  "Session: ",
                  academicYear
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              background: "#1e3a5f",
              padding: "4px 8px",
              textAlign: "center"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 7, color: "rgba(255,255,255,0.8)" }, children: schoolPhone })
          }
        )
      ]
    }
  );
}
function StaffIDCardTemplate({
  staff,
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolPhone = "+91 98765 43210",
  schoolAddress = "Knowledge City, India",
  academicYear = `${(/* @__PURE__ */ new Date()).getFullYear()}-${String((/* @__PURE__ */ new Date()).getFullYear() + 1).slice(2)}`,
  variant = "horizontal"
}) {
  const CARD_W = 342;
  const CARD_H = 216;
  if (variant === "themed") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          width: CARD_W,
          height: CARD_H,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 60%, #1e3a5f 100%)"
        },
        "data-ocid": "staff_id_card.themed.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "10px 14px 8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#fff",
                        letterSpacing: 1
                      },
                      children: schoolName
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 7, color: "rgba(255,255,255,0.7)" }, children: schoolAddress })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#f59e0b",
                      background: "rgba(255,255,255,0.15)",
                      padding: "3px 8px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.3)"
                    },
                    children: "STAFF ID"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, padding: "0 14px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  width: 60,
                  height: 70,
                  borderRadius: 8,
                  border: "2px solid rgba(255,255,255,0.5)",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: staff.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: staff.photoUrl,
                    alt: staff.fullName,
                    style: { width: "100%", height: "100%", objectFit: "cover" }
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 28, color: "rgba(255,255,255,0.5)" }, children: "👤" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, color: "#fff" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, lineHeight: 1.2 }, children: staff.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 10,
                    color: "rgba(255,255,255,0.8)",
                    marginTop: 2
                  },
                  children: staff.designation
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    fontSize: 9,
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 4
                  },
                  children: [
                    "ID: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: staff.staffCode })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.7)" }, children: [
                "Dept: ",
                staff.department
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#f59e0b", fontWeight: 600 }, children: staff.mobile })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.3)",
                padding: "6px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 8, color: "rgba(255,255,255,0.8)" }, children: schoolPhone }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 8, color: "rgba(255,255,255,0.7)" }, children: academicYear })
              ]
            }
          )
        ]
      }
    );
  }
  if (variant === "vertical") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          width: 162,
          height: 256,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          fontFamily: "Arial, sans-serif",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          border: "1px solid #ddd"
        },
        "data-ocid": "staff_id_card.vertical.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: "#7c3aed",
                padding: "8px 10px 6px",
                textAlign: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: 1
                    },
                    children: schoolName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 7,
                      color: "rgba(255,255,255,0.7)",
                      marginTop: 1
                    },
                    children: schoolAddress
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 7,
                      color: "#f59e0b",
                      fontWeight: 700,
                      marginTop: 2
                    },
                    children: "STAFF IDENTITY CARD"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "center",
                padding: "8px 0 4px",
                background: "#f5f3ff"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 60,
                    height: 70,
                    borderRadius: 6,
                    border: "2px solid #7c3aed",
                    overflow: "hidden",
                    background: "#ede9fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: staff.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: staff.photoUrl,
                      alt: staff.fullName,
                      style: { width: "100%", height: "100%", objectFit: "cover" }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 24, color: "#aaa" }, children: "👤" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "4px 8px", textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#111",
                  lineHeight: 1.2
                },
                children: staff.fullName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  fontSize: 9,
                  color: "#7c3aed",
                  fontWeight: 600,
                  marginTop: 1
                },
                children: staff.designation
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  borderTop: "1px dashed #ddd",
                  marginTop: 5,
                  paddingTop: 4,
                  fontSize: 8,
                  color: "#555",
                  textAlign: "left",
                  lineHeight: 1.8
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    "ID: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: staff.staffCode })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    "Dept: ",
                    staff.department
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    "Mobile: ",
                    staff.mobile
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    "Session: ",
                    academicYear
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                background: "#7c3aed",
                padding: "4px 8px",
                textAlign: "center"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 7, color: "rgba(255,255,255,0.8)" }, children: schoolPhone })
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        width: CARD_W,
        height: CARD_H,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        background: "#fff",
        border: "1px solid #ddd"
      },
      "data-ocid": "staff_id_card.horizontal.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 90,
              background: "#7c3aed",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 12
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "2px solid rgba(255,255,255,0.6)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: staff.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: staff.photoUrl,
                      alt: staff.fullName,
                      style: { width: "100%", height: "100%", objectFit: "cover" }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 28, color: "rgba(255,255,255,0.7)" }, children: "👤" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    marginTop: 8,
                    fontSize: 9,
                    color: "rgba(255,255,255,0.8)",
                    textAlign: "center",
                    padding: "0 4px"
                  },
                  children: staff.staffCode
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    marginTop: 4,
                    fontSize: 8,
                    color: "#f59e0b",
                    fontWeight: 700
                  },
                  children: "STAFF"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              marginLeft: 94,
              padding: "10px 12px 10px 8px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#7c3aed",
                      letterSpacing: 1,
                      textTransform: "uppercase"
                    },
                    children: schoolName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 7, color: "#777", marginBottom: 8 }, children: schoolAddress }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#111",
                      lineHeight: 1.2
                    },
                    children: staff.fullName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 10,
                      color: "#7c3aed",
                      fontWeight: 600,
                      marginTop: 2
                    },
                    children: staff.designation
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    fontSize: 9,
                    color: "#555",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "3px 6px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: "Dept:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: staff.department }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: "Mobile:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: staff.mobile }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: "Joined:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: staff.dateOfJoining }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#888" }, children: "Session:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: academicYear })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 7, color: "#aaa" }, children: [
                "Ph: ",
                schoolPhone
              ] })
            ]
          }
        )
      ]
    }
  );
}
function TCTemplate({
  student,
  tcNumber,
  reasonForLeaving = "Parents' request",
  lastClassAttended,
  dateOfLeaving = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN"),
  conduct = "Good",
  schoolName = "SHUBH PUBLIC SCHOOL",
  schoolAddress = "123 Education Lane, Knowledge City, India - 110001",
  principalName = "Dr. Rajesh Kumar",
  variant = "formal"
}) {
  const tcNo = tcNumber ?? `TC-${(/* @__PURE__ */ new Date()).getFullYear()}-${student.admNo}`;
  const className = lastClassAttended ?? student.classLevel.replace("Class", "Class ");
  const dobFormatted = formatDate(student.dateOfBirth);
  const admDateFormatted = formatDate(student.admissionDate);
  if (variant === "simplified") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-white text-black",
        style: {
          width: 794,
          minHeight: 900,
          fontFamily: "Arial, sans-serif",
          padding: "40px 48px"
        },
        "data-ocid": "tc.simplified.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: "2px solid #1e3a5f"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 700, color: "#1e3a5f" }, children: schoolName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#555", marginTop: 2 }, children: schoolAddress })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: "#1e3a5f" }, children: "TRANSFER CERTIFICATE" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, color: "#555", marginTop: 4 }, children: [
                    "T.C. No.: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: tcNo })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 32px",
                fontSize: 13
              },
              children: [
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
                ["Conduct & Character", conduct]
              ].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    borderBottom: "1px dotted #ccc",
                    paddingBottom: 8,
                    paddingTop: 4
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#666", fontSize: 11 }, children: label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600 }, children: value })
                  ]
                },
                label
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 24, fontSize: 13, lineHeight: 1.8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Remarks:" }),
            " The above-mentioned student has been a student of this school. He/She is hereby granted this Transfer Certificate."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                marginTop: 60,
                display: "flex",
                justifyContent: "space-between"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      borderTop: "1px solid #333",
                      paddingTop: 6,
                      width: 160,
                      fontSize: 12
                    },
                    children: "Class Teacher"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      borderTop: "1px solid #333",
                      paddingTop: 6,
                      width: 160,
                      fontSize: 12
                    },
                    children: "Accounts Section"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      borderTop: "1px solid #333",
                      paddingTop: 6,
                      width: 180,
                      fontSize: 12
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700 }, children: principalName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Principal" })
                    ]
                  }
                ) })
              ]
            }
          )
        ]
      }
    );
  }
  const rows = [
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
      (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")
    ],
    ["24.", "Date of Issue of T.C.", dateOfLeaving],
    ["25.", "Reason for Leaving", reasonForLeaving],
    ["26.", "Remarks", "—"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-white text-black",
      style: {
        width: 794,
        fontFamily: "Times New Roman, serif",
        border: "2px solid #000",
        padding: 0
      },
      "data-ocid": "tc.formal.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              textAlign: "center",
              padding: "20px 40px 14px",
              borderBottom: "2px solid #000"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 700, letterSpacing: 2 }, children: schoolName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "#444", marginTop: 2 }, children: schoolAddress }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 17,
                    fontWeight: 700,
                    marginTop: 10,
                    letterSpacing: 2,
                    textDecoration: "underline"
                  },
                  children: "TRANSFER CERTIFICATE"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                    fontSize: 12
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "T.C. No.: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: tcNo })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Date: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: dateOfLeaving })
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "table",
          {
            style: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map(([sno, label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid #ccc" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  style: {
                    padding: "5px 12px",
                    width: 36,
                    borderRight: "1px solid #ccc",
                    verticalAlign: "top"
                  },
                  children: sno
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  style: {
                    padding: "5px 12px",
                    width: 280,
                    borderRight: "1px solid #ccc",
                    verticalAlign: "top"
                  },
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "5px 12px", fontWeight: 500 }, children: value })
            ] }, sno)) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "20px 40px 28px",
              display: "flex",
              justifyContent: "space-between",
              borderTop: "2px solid #000",
              marginTop: 4
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    borderTop: "1px solid #000",
                    paddingTop: 6,
                    width: 150,
                    fontSize: 12
                  },
                  children: "Class Teacher"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    borderTop: "1px solid #000",
                    paddingTop: 6,
                    width: 150,
                    fontSize: 12
                  },
                  children: "Checked By"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
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
                      margin: "0 auto 8px"
                    },
                    children: "SEAL"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      borderTop: "1px solid #000",
                      paddingTop: 6,
                      width: 180,
                      fontSize: 12
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700 }, children: principalName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Principal" })
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function toFrontendStudent(s) {
  const str = (v) => typeof v === "string" ? v : "";
  const strOrNull = (v) => typeof v === "string" ? v : null;
  return {
    id: str(s.id),
    admNo: str(s.admNo),
    fullName: str(s.fullName),
    fatherName: str(s.fatherName),
    motherName: str(s.motherName),
    fatherMobile: str(s.fatherMobile),
    motherMobile: str(s.motherMobile),
    mobile: str(s.mobile),
    currentAddress: str(s.currentAddress),
    permanentAddress: str(s.permanentAddress),
    category: str(s.category) || "General",
    aadhaarNo: str(s.aadhaarNo),
    srNo: str(s.srNo),
    penNo: str(s.penNo),
    apaarNo: str(s.apaarNo),
    prevSchool: str(s.prevSchool),
    admissionDate: str(s.admissionDate) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    busNo: str(s.busNo),
    classLevel: str(s.classLevel) || "Class1",
    sectionId: str(s.sectionId),
    sessionId: str(s.session) || str(s.sessionId),
    dateOfBirth: str(s.dateOfBirth),
    gender: str(s.gender) || "Male",
    photoUrl: str(s.photoUrl),
    isDiscontinued: s.isDiscontinued === true,
    discontinuedAt: strOrNull(s.discontinuedAt),
    transportRouteId: strOrNull(s.transportRouteId),
    pickupPointId: strOrNull(s.transportPickupPointId) ?? strOrNull(s.pickupPointId),
    createdAt: typeof s.createdAt === "bigint" ? new Date(Number(s.createdAt)).toISOString() : str(s.createdAt)
  };
}
function useReactToPrint(contentRef) {
  return reactExports.useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Print</title>
      <style>
        body { margin: 0; display: flex; justify-content: center; padding: 20px; background: #f5f5f5; }
        @media print { body { padding: 0; background: white; } }
      </style></head>
      <body>${el.innerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
    }, 400);
  }, [contentRef]);
}
function GeneratePrintModal({
  template,
  onClose,
  preStudent = null,
  preStaff = null,
  forcedType
}) {
  const { data: rawStudents = [] } = useStudents();
  const { data: backendStaff = [] } = useStaff();
  const [selectedStudentId, setSelectedStudentId] = reactExports.useState(
    (preStudent == null ? void 0 : preStudent.id) ?? ""
  );
  const [selectedStaffId, setSelectedStaffId] = reactExports.useState(
    (preStaff == null ? void 0 : preStaff.id) ?? ""
  );
  const [purpose, setPurpose] = reactExports.useState("general purposes");
  const [reasonForLeaving, setReasonForLeaving] = reactExports.useState("Parents' request");
  const [examName, setExamName] = reactExports.useState("Annual Examination 2025-26");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const printRef = reactExports.useRef(null);
  const handlePrint = useReactToPrint(printRef);
  const isStaffType = ((template == null ? void 0 : template.templateType) ?? forcedType) === "StaffIDCard";
  const students = rawStudents.map(toFrontendStudent);
  const staffList = backendStaff;
  const selectedStudent = preStudent ?? students.find((s) => s.id === selectedStudentId) ?? null;
  const selectedStaff = preStaff ?? staffList.find((s) => s.id === selectedStaffId) ?? null;
  const { data: rawPayments = [] } = usePaymentsByStudent(
    isStaffType ? "" : selectedStudentId
  );
  const { data: timetables = [] } = useExamTimetables();
  const latestPayment = rawPayments.length > 0 ? rawPayments[rawPayments.length - 1] : null;
  const rawStudentTimetable = timetables.find((t) => t.classLevel === (selectedStudent == null ? void 0 : selectedStudent.classLevel)) ?? null;
  const studentTimetable = rawStudentTimetable ? {
    id: rawStudentTimetable.id,
    name: rawStudentTimetable.examName,
    sessionId: rawStudentTimetable.sessionId,
    classLevel: rawStudentTimetable.classLevel,
    entries: rawStudentTimetable.entries,
    isPublished: true
  } : null;
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return !q || s.fullName.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q) || getClassLabel(s.classLevel).toLowerCase().includes(q);
  });
  const filteredStaff = staffList.filter((s) => {
    const q = searchQuery.toLowerCase();
    return !q || s.fullName.toLowerCase().includes(q) || s.staffCode.toLowerCase().includes(q) || s.designation.toLowerCase().includes(q);
  });
  function renderDocumentPreview() {
    const type = (template == null ? void 0 : template.templateType) ?? forcedType;
    const nameLower = ((template == null ? void 0 : template.name) ?? "").toLowerCase();
    const isV2 = nameLower.includes("modern") || nameLower.includes("simplified") || nameLower.includes("horizontal") || nameLower.includes("themed") || nameLower.includes("compact");
    if (type === "StaffIDCard" && selectedStaff) {
      const variant = nameLower.includes("vertical") ? "vertical" : nameLower.includes("themed") ? "themed" : "horizontal";
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StaffIDCardTemplate, { staff: selectedStaff, variant });
    }
    if (!selectedStudent) return null;
    if (type === "FeeReceipt" && latestPayment) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        FeeReceiptTemplate,
        {
          student: selectedStudent,
          payment: latestPayment,
          schoolInfo: {
            name: "SHUBH PUBLIC SCHOOL",
            tagline: "",
            about: "",
            photoUrl: "",
            address: "",
            phone: "",
            email: ""
          }
        }
      );
    }
    if (type === "Bonafide") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        BonafideTemplate,
        {
          student: selectedStudent,
          purpose,
          variant: isV2 ? "modern" : "formal"
        }
      );
    }
    if (type === "Transfer") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        TCTemplate,
        {
          student: selectedStudent,
          reasonForLeaving,
          variant: isV2 ? "simplified" : "formal"
        }
      );
    }
    if (type === "IDCard") {
      const variant = nameLower.includes("horizontal") ? "horizontal" : nameLower.includes("themed") ? "themed" : "vertical";
      return /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardTemplate, { student: selectedStudent, variant });
    }
    if (type === "AdmitCard") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdmitCardTemplate,
        {
          student: selectedStudent,
          timetable: studentTimetable,
          examName,
          variant: isV2 ? "compact" : "formal"
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 bg-white border border-border rounded-lg text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Preview for ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: template == null ? void 0 : template.templateType }),
      " will appear here."
    ] }) });
  }
  const canPrint = isStaffType ? !!selectedStaff : !!selectedStudent && !((template == null ? void 0 : template.templateType) === "FeeReceipt" && !latestPayment);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!(template ?? forcedType), onOpenChange: () => onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col p-0",
      "data-ocid": "generate_print.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "px-6 pt-5 pb-3 border-b border-border flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-lg font-display", children: [
            "Generate & Print — ",
            (template == null ? void 0 : template.name) ?? forcedType
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              onClick: onClose,
              "data-ocid": "generate_print.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-72 flex-shrink-0 border-r border-border overflow-y-auto p-4 space-y-4 bg-muted/20", children: [
            isStaffType && !preStaff && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase mb-2 block", children: "Select Staff Member" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search staff…",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "h-8 text-sm mb-2",
                  "data-ocid": "generate_print.search_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: selectedStaffId,
                  onValueChange: setSelectedStaffId,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-8 text-sm",
                        "data-ocid": "generate_print.staff.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose staff…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: filteredStaff.slice(0, 50).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, className: "text-sm", children: [
                      s.fullName,
                      " (",
                      s.staffCode,
                      ") — ",
                      s.designation
                    ] }, s.id)) })
                  ]
                }
              )
            ] }),
            !isStaffType && !preStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase mb-2 block", children: "Select Student" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search student…",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "h-8 text-sm mb-2",
                  "data-ocid": "generate_print.search_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: selectedStudentId,
                  onValueChange: setSelectedStudentId,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-8 text-sm",
                        "data-ocid": "generate_print.student.select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose student…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: filteredStudents.slice(0, 50).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, className: "text-sm", children: [
                      s.fullName,
                      " (",
                      s.admNo,
                      ") — ",
                      getClassLabel(s.classLevel)
                    ] }, s.id)) })
                  ]
                }
              )
            ] }),
            !isStaffType && preStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-primary", children: "Student" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: preStudent.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                preStudent.admNo,
                " · ",
                getClassLabel(preStudent.classLevel)
              ] })
            ] }),
            isStaffType && preStaff && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-primary", children: "Staff" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: preStaff.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                preStaff.staffCode,
                " · ",
                preStaff.designation
              ] })
            ] }),
            (template == null ? void 0 : template.templateType) === "Bonafide" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Purpose" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: purpose,
                  onChange: (e) => setPurpose(e.target.value),
                  className: "h-8 text-sm",
                  placeholder: "Purpose of certificate",
                  "data-ocid": "generate_print.purpose.input"
                }
              )
            ] }),
            (template == null ? void 0 : template.templateType) === "Transfer" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Reason for Leaving" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: reasonForLeaving,
                  onChange: (e) => setReasonForLeaving(e.target.value),
                  className: "h-8 text-sm",
                  "data-ocid": "generate_print.reason.input"
                }
              )
            ] }),
            (template == null ? void 0 : template.templateType) === "AdmitCard" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase mb-1 block", children: "Exam Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: examName,
                  onChange: (e) => setExamName(e.target.value),
                  className: "h-8 text-sm",
                  "data-ocid": "generate_print.exam_name.input"
                }
              ),
              selectedStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                "Timetable:",
                " ",
                studentTimetable ? studentTimetable.name : "No timetable found for this class"
              ] })
            ] }),
            (template == null ? void 0 : template.templateType) === "FeeReceipt" && selectedStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-card border border-border p-3 space-y-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-muted-foreground", children: "Latest Payment" }),
              latestPayment ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "Receipt: ",
                  latestPayment.receiptNo
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "Date: ",
                  latestPayment.paymentDate
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "Amount: ₹",
                  latestPayment.totalAmount.toLocaleString("en-IN")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "Method: ",
                  latestPayment.paymentMethod
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic", children: "No payment record found" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "w-full",
                disabled: !canPrint,
                onClick: handlePrint,
                "data-ocid": "generate_print.print_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 mr-2" }),
                  "Print Document"
                ]
              }
            ),
            !canPrint && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-muted-foreground text-center",
                "data-ocid": "generate_print.no_student_state",
                children: isStaffType ? "Select a staff member to preview and print" : "Select a student to preview and print"
              }
            ),
            (template == null ? void 0 : template.templateType) === "FeeReceipt" && selectedStudent && !latestPayment && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive text-center", children: "No fee payment found for this student" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 overflow-auto p-6 bg-muted/10",
              "data-ocid": "generate_print.preview.panel",
              children: canPrint ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: printRef, children: renderDocumentPreview() }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center h-full text-center text-muted-foreground",
                  "data-ocid": "generate_print.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-14 mb-4 opacity-10" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isStaffType ? "Select a staff member to preview" : "Select a student to preview the document" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "The template will auto-fill with real data" })
                  ]
                }
              )
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  GeneratePrintModal as G
};
