import { ae as createLucideIcon, r as reactExports, c9 as LayoutDashboard, G as GraduationCap, U as Users, aR as IndianRupee, aS as ClipboardCheck, b5 as Award, aQ as Briefcase, ap as Bus, ca as Library, cb as Package, aC as MessageCircle, cc as Video, P as MessageSquare, a4 as CreditCard, a_ as ClipboardList, av as GalleryVerticalEnd, a2 as TrendingUp, bz as ChartColumn, cd as CalendarClock, ce as UserCog, cf as Settings, Y as UsersRound, j as jsxRuntimeExports, I as Input, O as ScrollArea, aM as cn, t as Badge, aw as ChevronRight } from "./index-pMBTUEbj.js";
import { S as Search } from "./search-ByT9I9Ba.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode);
const MODULES = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    group: "Core",
    tagline: "Your school at a glance",
    what: "The Dashboard is your home screen after login. It shows live counts of students, staff, fees collected today, upcoming events, and recent notices. It also has a powerful search bar to quickly find any student.",
    steps: [
      {
        step: "Login with your username and password",
        detail: "Default admin credentials: admin / admin123"
      },
      {
        step: "View summary cards",
        detail: "See total students, fee collection today (₹), attendance %, and pending tasks"
      },
      {
        step: "Search for a student",
        detail: "Type a name, mobile number, village, or parent name in the search bar"
      },
      {
        step: "Click any metric card",
        detail: "Opens the related module for deeper detail"
      },
      {
        step: "Change session",
        detail: "Use the session selector (top bar) to switch between academic years like 2024–25 or 2025–26"
      }
    ],
    features: [
      "Live student, staff, and fee count from saved data",
      "Quick student search (name, mobile, village, father/mother name)",
      "Session-wise data — switch between 2019–20 to 2025–26+",
      "Notice board showing only real saved announcements",
      "Upcoming exam and event reminders"
    ],
    tips: [
      "Always select the correct academic session from the top bar before entering data",
      "The search bar searches across all sessions — useful for finding alumni",
      "Dashboard numbers update immediately when you add/edit students or collect fees"
    ]
  },
  {
    id: "academics",
    label: "Academics",
    icon: GraduationCap,
    group: "Core",
    tagline: "Classes, subjects, and syllabus management",
    what: "Academics module lets you define all classes (Play Way, LKG, UKG, Class 1–12), create sections (A, B, C), add subjects per class, assign teachers, and upload the syllabus for each subject.",
    steps: [
      {
        step: "Go to Academics from sidebar",
        detail: "Click 'Academics' under the Core group"
      },
      {
        step: "Add a class",
        detail: "Click 'Add Class', enter class name (e.g. Class 5), section, and capacity"
      },
      {
        step: "Add subjects",
        detail: "Select a class, then click 'Add Subject'. Enter subject name, code, and max marks"
      },
      {
        step: "Assign a teacher",
        detail: "Select subject → Assign Teacher → choose from HR staff list"
      },
      {
        step: "Upload syllabus",
        detail: "For each subject, click 'Syllabus' to upload a PDF or enter chapter-wise topics"
      }
    ],
    features: [
      "Indian class names: Play Way, LKG, UKG, Class 1–12",
      "Multiple sections per class (A, B, C, D)",
      "Subject-wise teacher assignment",
      "Syllabus tracking per subject",
      "Class-wise timetable view"
    ],
    tips: [
      "Create all classes and sections first before adding students",
      "Use standard subject codes (e.g. ENG01, MAT01) for easier reporting",
      "Syllabus progress can be tracked monthly using the syllabus completion tab"
    ]
  },
  {
    id: "students",
    label: "Students",
    icon: Users,
    group: "Core",
    tagline: "Complete student lifecycle management",
    what: "The Students module is the heart of the ERP. It stores full student profiles with 22+ data fields, handles admissions, photo uploads, bulk import/export, discount assignment, family grouping, and old balance carry-forward.",
    steps: [
      {
        step: "Go to Students from sidebar",
        detail: "Click 'Students' under the Core group"
      },
      {
        step: "Add a new student",
        detail: "Click 'Add Student', fill the form with name, father's name, class, section, mobile, DOB (dd/mm/yyyy), and address"
      },
      {
        step: "Upload student photo",
        detail: "Click the photo area → select a JPG/PNG file from your device (no URL needed)"
      },
      {
        step: "Assign discount",
        detail: "Open student profile → Fee tab → click 'Discount' to set monthly discounts per fee head"
      },
      {
        step: "Set old balance",
        detail: "In the Fee tab, enter previous session outstanding balance — it auto-adds to current dues"
      },
      {
        step: "Export student list",
        detail: "Click Export → check the columns you want to share → Download CSV"
      },
      {
        step: "Bulk import",
        detail: "Click Import → download the sample format → fill data → upload the file"
      }
    ],
    features: [
      "22-column student profile (name, DOB, class, section, mobile, address, etc.)",
      "File upload for student photo (not a URL)",
      "Family grouping by mobile number for easier fee collection",
      "Per-student discount per fee head (e.g. Tuition Fee − ₹500 discount)",
      "Old balance carry-forward from previous session",
      "Select columns on export to share only relevant data",
      "Bulk import with downloadable sample format"
    ],
    tips: [
      "Always enter the same mobile number for siblings — they will be auto-grouped as a family",
      "Use bulk import to add 50+ students at once. Download the sample file first",
      "Discounts are applied per fee head. 'Tuition Fee: ₹2,000 − Discount ₹500 = Net ₹1,500' is shown at fee collection"
    ]
  },
  {
    id: "fees",
    label: "Fees",
    icon: IndianRupee,
    group: "Core",
    tagline: "Fee headings, plans, collection, and registers",
    what: "The Fees module handles all money operations: define fee headings (Tuition Fee, Activity Fee, etc.), create class-wise fee plans, collect monthly fees, view the fee register, and track who collected which fees.",
    steps: [
      {
        step: "Create Fee Headings",
        detail: "Fees → Fee Headings → Add Heading (e.g. Tuition Fee, Transport, Meal)"
      },
      {
        step: "Create a Fee Plan",
        detail: "Fees → Fee Plans → Add Plan → select class → enter monthly amounts for each heading"
      },
      {
        step: "Collect Fees",
        detail: "Fees → Collect Fees → search student → review dues with discounts applied → collect amount → generate receipt"
      },
      {
        step: "View Fee Register",
        detail: "Fees → Fee Register → filter by date, class, or user to see all collections"
      },
      {
        step: "User-wise report",
        detail: "Admin can filter Fee Register by user to see which staff collected how much and for which students"
      }
    ],
    features: [
      "Unlimited fee headings per school",
      "Class-wise monthly fee plans",
      "Discount display: 'Tuition Fee: ₹2,000 − Discount ₹500 = Net ₹1,500'",
      "Old balance auto-added to current dues",
      "Fee receipt printable with school logo",
      "User-wise fee register — admin sees who collected which fees",
      "UPI QR code support for online payment"
    ],
    tips: [
      "Set up all fee headings before creating plans",
      "Fee plans are class-wise — one plan covers all students in that class",
      "The Fee Register is permanent and cannot be deleted — a full audit trail",
      "Use the 'Concession' option under student profile for partial waivers"
    ]
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: ClipboardCheck,
    group: "Core",
    tagline: "Daily attendance, device integration, and reports",
    what: "Mark and track daily attendance for students and staff. Supports manual entry, RFID, biometric (ESSL), and face recognition methods. Stores IN/OUT times, generates reports, and exports to Excel.",
    steps: [
      {
        step: "Go to Attendance from sidebar",
        detail: "Click 'Attendance' under Core group"
      },
      {
        step: "Select date and class",
        detail: "Choose today's date (auto-filled) and a class/section"
      },
      {
        step: "Mark attendance",
        detail: "Click P (Present), A (Absent), L (Late), or H (Half Day) for each student"
      },
      {
        step: "Save attendance",
        detail: "Click 'Save Attendance' — data is stored permanently"
      },
      {
        step: "View summary",
        detail: "Click 'Attendance Summary' to see monthly attendance % per student"
      },
      {
        step: "Export",
        detail: "Click Export → choose Excel to download the attendance sheet"
      }
    ],
    features: [
      "Manual, RFID, biometric (ESSL), and face recognition attendance",
      "IN/OUT time tracking per student",
      "Late arrival and half-day marking",
      "Monthly summary report per class",
      "Device-type logging (manual vs. RFID vs. biometric)",
      "Excel export for any date range"
    ],
    tips: [
      "Mark attendance every day before 10 AM for accuracy",
      "The summary view shows attendance percentage used for exam eligibility",
      "RFID/biometric data is auto-imported — check the 'Device Attendance' tab"
    ]
  },
  {
    id: "examinations",
    label: "Examinations",
    icon: Award,
    group: "Exams",
    tagline: "Timetables, results, and online MCQ exams",
    what: "Manage the full exam cycle: create exam timetables with AI suggestions, assign subjects per class, enter marks, generate result cards, and create online MCQ exams for students.",
    steps: [
      {
        step: "Create an Exam",
        detail: "Examinations → Add Exam → enter name (e.g. Half Yearly), start/end dates, exam type"
      },
      {
        step: "Generate Timetable",
        detail: "Click 'Generate Timetable' → AI suggests subject schedule → drag and drop to adjust → save"
      },
      {
        step: "Enter Marks",
        detail: "Select exam → select class → enter marks for each student per subject"
      },
      {
        step: "Generate Results",
        detail: "Click 'Generate Results' to calculate total, percentage, and rank"
      },
      {
        step: "Print Result Cards",
        detail: "Select template → print or download PDF result cards"
      },
      {
        step: "Create Online Exam",
        detail: "Online Exams tab → Add Questions → set duration → assign to class → students take it online"
      }
    ],
    features: [
      "AI-assisted exam timetable generation",
      "Drag-and-drop subject rearrangement (date rows are locked)",
      "Subject-wise marks entry with max marks",
      "Auto calculation: total, percentage, grade, rank",
      "Result card templates with school logo",
      "Online MCQ exams with timer",
      "Excel-style export of timetable and results"
    ],
    tips: [
      "Enter exam dates before generating timetable — the AI uses them to avoid conflicts",
      "Drag subjects left/right to swap them across dates, rows (dates) stay fixed",
      "Online exams can be assigned to specific classes and have optional time limits"
    ]
  },
  {
    id: "hr",
    label: "HR & Payroll",
    icon: Briefcase,
    group: "HR",
    tagline: "Staff records, salaries, and payroll",
    what: "Manage all staff — teachers, admin, drivers, etc. Store personal details, set salary structures, process monthly payroll, track leave, and generate salary slips.",
    steps: [
      {
        step: "Add Staff",
        detail: "HR → Staff → Add Staff → fill name, designation, department, joining date, mobile, salary"
      },
      {
        step: "Set Salary Structure",
        detail: "Click on a staff member → Salary tab → set basic pay + allowances + deductions"
      },
      {
        step: "Process Payroll",
        detail: "HR → Payroll → select month → click 'Process All' to calculate net pay for all staff"
      },
      {
        step: "Mark Leave",
        detail: "HR → Leave → select staff → mark dates as CL/EL/ML → save"
      },
      {
        step: "Generate Salary Slip",
        detail: "HR → Payroll → select staff → Print Salary Slip"
      }
    ],
    features: [
      "Staff profiles with photo upload",
      "Designation and department management",
      "Salary structure: basic + HRA + TA + deductions",
      "Monthly payroll processing",
      "Leave management (CL, EL, ML, LWP)",
      "Printable salary slips"
    ],
    tips: [
      "Set up salary structures for all staff before running payroll",
      "Leave without pay (LWP) is auto-deducted from the monthly salary",
      "Salary slips can be printed or emailed directly from the payroll screen"
    ]
  },
  {
    id: "transport",
    label: "Transport",
    icon: Bus,
    group: "Operations",
    tagline: "Routes, vehicles, and student transport assignment",
    what: "Manage school vehicles, define routes and stops, assign students to routes, and track transport fee collection. Supports GPS-based live tracking (requires hardware).",
    steps: [
      {
        step: "Add a Vehicle",
        detail: "Transport → Vehicles → Add Vehicle → enter bus number, capacity, driver name"
      },
      {
        step: "Create a Route",
        detail: "Transport → Routes → Add Route → enter route name and list of stops with distances"
      },
      {
        step: "Assign Students",
        detail: "Select a route → Assign Students → pick students from the list"
      },
      {
        step: "Set Transport Fee",
        detail: "Go to Fees → Fee Headings → add 'Transport Fee' → include in class fee plan"
      },
      {
        step: "View Route Report",
        detail: "Transport → Reports → see how many students per route, driver details, vehicle capacity"
      }
    ],
    features: [
      "Multi-vehicle management",
      "Route-wise stop mapping",
      "Student-to-route assignment",
      "Transport fee integrated with main fee module",
      "Driver and conductor records",
      "GPS live tracking (hardware required)"
    ],
    tips: [
      "Create all routes and stops before assigning students",
      "Transport fee is added as a separate fee heading in the Fees module",
      "Each student can be assigned to only one route at a time"
    ]
  },
  {
    id: "library",
    label: "Library",
    icon: Library,
    group: "Operations",
    tagline: "Books, members, and issue/return tracking",
    what: "Manage the school library — catalogue books, issue books to students and staff, track returns, and generate fine reports for overdue books.",
    steps: [
      {
        step: "Add Books",
        detail: "Library → Books → Add Book → enter title, author, publisher, ISBN, quantity, shelf number"
      },
      {
        step: "Issue a Book",
        detail: "Library → Issue → search student/staff → select book → set return date → Issue"
      },
      {
        step: "Return a Book",
        detail: "Library → Returns → search by student or book → click Return → fine auto-calculated if overdue"
      },
      {
        step: "View Report",
        detail: "Library → Reports → see issued books list, overdue list, most borrowed books"
      }
    ],
    features: [
      "Book catalogue with ISBN and shelf number",
      "Issue to students and staff",
      "Auto fine calculation for overdue returns",
      "Search books by title, author, or ISBN",
      "Member-wise issue history"
    ],
    tips: [
      "Enter ISBN for each book to avoid duplicates",
      "Set a default return duration (e.g. 14 days) in Library Settings",
      "Export overdue list to follow up with students"
    ]
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    group: "Operations",
    tagline: "School items, stock levels, and purchase tracking",
    what: "Track all school assets and consumables — furniture, stationery, lab equipment, sports goods. Record purchases, issue to departments, and view current stock levels.",
    steps: [
      {
        step: "Add Item Category",
        detail: "Inventory → Categories → Add (e.g. Furniture, Stationery, Lab Equipment)"
      },
      {
        step: "Add Item",
        detail: "Inventory → Items → Add Item → enter name, category, unit, current stock, minimum stock"
      },
      {
        step: "Record Purchase",
        detail: "Inventory → Purchase → Add Purchase → select item, quantity, price per unit, date, vendor"
      },
      {
        step: "Issue to Department",
        detail: "Inventory → Issue → select item and department → enter quantity → Issue"
      },
      {
        step: "Check Stock",
        detail: "Inventory → Stock Report → see current levels, items below minimum stock (highlighted in red)"
      }
    ],
    features: [
      "Multi-category item management",
      "Purchase recording with vendor details",
      "Department-wise issue tracking",
      "Low stock alerts",
      "Stock valuation report"
    ],
    tips: [
      "Set minimum stock levels to get alerts before items run out",
      "Use the Purchase tab to track vendor-wise spending over the year",
      "Annual stock audit report is available under Reports"
    ]
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageCircle,
    group: "Communication",
    tagline: "Notices, SMS, and parent notifications",
    what: "Send notices, circular letters, and SMS to parents, students, or staff. Schedule announcements, manage the notice board, and send WhatsApp messages (with API key).",
    steps: [
      {
        step: "Send a Notice",
        detail: "Communication → Notices → Add Notice → enter title, message, select recipients (All/Class/Group) → Send"
      },
      {
        step: "Send SMS",
        detail: "Communication → SMS → compose message → select recipients → Send (requires SMS gateway config)"
      },
      {
        step: "Schedule an Announcement",
        detail: "Set a future date while creating a notice — it will auto-publish on that date"
      },
      {
        step: "View Notice Board",
        detail: "Communication → Notice Board → shows all active notices sorted by date"
      }
    ],
    features: [
      "Notice board with real saved data only",
      "Class-wise or school-wide announcements",
      "SMS notifications via gateway",
      "WhatsApp integration (API key required)",
      "Scheduled announcements"
    ],
    tips: [
      "Always select the correct recipient group to avoid sending to wrong classes",
      "Configure SMS gateway in Settings → Integrations before using SMS",
      "Notice board shows only what you have saved — no demo or fake entries"
    ]
  },
  {
    id: "virtual-classes",
    label: "Virtual Classes",
    icon: Video,
    group: "Communication",
    tagline: "Online classes via Zoom or Google Meet",
    what: "Schedule and manage online/virtual classes for students. Generate meeting links (Zoom/Google Meet), notify students, and keep a record of virtual sessions conducted.",
    steps: [
      {
        step: "Schedule a Class",
        detail: "Virtual Classes → Add Class → enter subject, class, teacher, date, time, duration"
      },
      {
        step: "Add Meeting Link",
        detail: "Paste the Zoom or Google Meet link in the 'Meeting URL' field"
      },
      {
        step: "Notify Students",
        detail: "Click 'Notify' to send the link to all students in the selected class via notice board"
      },
      {
        step: "View History",
        detail: "Virtual Classes → History → see all past sessions with attendance records"
      }
    ],
    features: [
      "Zoom and Google Meet link support",
      "Class and subject-wise scheduling",
      "Automatic student notification",
      "Session history and attendance tracking"
    ],
    tips: [
      "Create the Zoom/Meet link first, then paste it here",
      "Students will see the link on their dashboard notice board",
      "Record the session link for students who missed the live class"
    ]
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    group: "Communication",
    tagline: "Internal messaging between staff and teachers",
    what: "Real-time internal chat for school staff. Send direct messages or group messages to departments, teachers, or admin.",
    steps: [
      {
        step: "Open Chat",
        detail: "Click 'Chat' in the sidebar under Communication group"
      },
      {
        step: "Start a conversation",
        detail: "Click 'New Chat' → search for a staff member or group → type and send"
      },
      {
        step: "Create a group",
        detail: "New Chat → Group → add members → give a group name → Create"
      }
    ],
    features: [
      "Direct messages between staff",
      "Group chats for departments",
      "Message history saved permanently",
      "Unread message count in sidebar badge"
    ],
    tips: [
      "Use department groups (e.g. 'Class Teachers') for announcements",
      "Chat is for internal staff only — parents use the notice board"
    ]
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: CreditCard,
    group: "Finance",
    tagline: "Track school expenditure and vouchers",
    what: "Record all school expenses — salaries, utilities, maintenance, purchases. Categorise expenses, attach vouchers, and generate monthly/yearly expense summaries.",
    steps: [
      {
        step: "Add Expense Category",
        detail: "Expenses → Categories → Add (e.g. Salary, Electricity, Maintenance, Purchase)"
      },
      {
        step: "Record Expense",
        detail: "Expenses → Add Expense → enter amount, date (dd/mm/yyyy), category, paid to, note"
      },
      {
        step: "Attach Voucher",
        detail: "While adding expense, upload a bill/receipt photo as proof"
      },
      {
        step: "View Summary",
        detail: "Expenses → Reports → filter by month or category to see total spending"
      }
    ],
    features: [
      "Category-wise expense tracking",
      "Voucher/receipt upload",
      "Monthly and yearly summary",
      "Expense vs. income comparison"
    ],
    tips: [
      "Use consistent category names to get clean reports",
      "Upload receipts as photo files to keep a digital audit trail",
      "Cross-check with Payroll to avoid double-counting salary expenses"
    ]
  },
  {
    id: "homework",
    label: "Homework",
    icon: ClipboardList,
    group: "Studio",
    tagline: "Assign and track homework for students",
    what: "Teachers can assign homework per subject and class with a due date. Students and parents see it on their dashboard. Track completion and add teacher remarks.",
    steps: [
      {
        step: "Assign Homework",
        detail: "Homework → Add Homework → select class, section, subject, date (dd/mm/yyyy), description"
      },
      {
        step: "Set Due Date",
        detail: "Enter the due date — students see this on their dashboard with a countdown"
      },
      {
        step: "Mark Completion",
        detail: "Homework → View → tick off students who submitted homework"
      },
      {
        step: "Add Remark",
        detail: "Click on a student's name → add a remark like 'Excellent work' or 'Incomplete'"
      }
    ],
    features: [
      "Class and subject-wise homework assignment",
      "Due date with visibility to parents",
      "Completion tracking per student",
      "Teacher remarks"
    ],
    tips: [
      "Assign homework early so parents have time to help",
      "Add clear descriptions — avoid vague instructions",
      "Use the 'Pending' filter to quickly find students who haven't submitted"
    ]
  },
  {
    id: "certificate-studio",
    label: "Certificate Studio",
    icon: GalleryVerticalEnd,
    group: "Studio",
    tagline: "Design and print all school certificates",
    what: "Design, customise, and print all school certificates and documents — Bonafide, Transfer Certificate (TC), ID Card, Admit Card, and Fee Receipt. Use drag-and-drop to position text and data fields. Save your template layout.",
    steps: [
      {
        step: "Select Document Type",
        detail: "Certificate Studio → choose from Bonafide, TC, ID Card, Admit Card, Fee Receipt"
      },
      {
        step: "Pick a Template",
        detail: "Each document has 2–3 pre-designed templates. Click a template to load it"
      },
      {
        step: "Drag Fields to Position",
        detail: "Drag text or data fields (student name, class, date, etc.) anywhere on the canvas"
      },
      {
        step: "Save Template",
        detail: "Click 'Save Template' — positions are stored permanently in the database"
      },
      {
        step: "Print Document",
        detail: "Select a student → click Print → the document fills with real student data → Print or Save PDF"
      }
    ],
    features: [
      "Templates: Bonafide, TC, ID Card, Admit Card, Fee Receipt",
      "2–3 pre-designed choices per document type",
      "Drag-and-drop field placement on canvas",
      "Template positions saved to database",
      "Filled with real student data at print time",
      "Print or export as PDF"
    ],
    tips: [
      "Save your template once — it applies to all students of that document type",
      "School logo and background upload available in template settings",
      "TC requires head-teacher signature field — add it as a text field",
      "Date fields auto-fill with today's date (dd/mm/yyyy format)"
    ]
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: TrendingUp,
    group: "Studio",
    tagline: "Visual charts and school performance insights",
    what: "View interactive charts and graphs for student strength, fee collection trends, attendance percentages, exam results, and expense tracking — all from real saved data.",
    steps: [
      {
        step: "Open Analytics",
        detail: "Click 'Analytics' in the sidebar under Studio group"
      },
      {
        step: "Select a chart type",
        detail: "Choose from: Students, Fees, Attendance, Exams, Expenses"
      },
      {
        step: "Filter by session/class",
        detail: "Use dropdowns to narrow the view to a specific class or session"
      },
      {
        step: "Export chart",
        detail: "Click the download icon on any chart to save it as PNG"
      }
    ],
    features: [
      "Student strength chart by class",
      "Monthly fee collection trend (₹)",
      "Attendance percentage by class",
      "Exam result comparison chart",
      "Expense category breakdown",
      "All charts sourced from live saved data"
    ],
    tips: [
      "Share analytics charts in PTA meetings for clear data presentation",
      "Attendance below 75% is flagged automatically — use this for eligibility checks"
    ]
  },
  {
    id: "reports",
    label: "Reports",
    icon: ChartColumn,
    group: "Finance",
    tagline: "Printable registers and data exports",
    what: "Generate and download all school registers and reports — student register, fee register, attendance register, result report, staff list, and more. All reports use real saved data.",
    steps: [
      {
        step: "Open Reports",
        detail: "Click 'Reports' in the sidebar under Finance group"
      },
      {
        step: "Select a report type",
        detail: "Choose from Student Register, Fee Ledger, Attendance Report, Result Report, etc."
      },
      {
        step: "Set filters",
        detail: "Choose session, class, date range as needed"
      },
      {
        step: "Generate and download",
        detail: "Click Generate → Preview → Print or Export as Excel/PDF"
      }
    ],
    features: [
      "Student register (class-wise)",
      "Fee ledger and collection summary",
      "Attendance register (monthly)",
      "Result report per exam",
      "Staff list and payroll summary",
      "Excel and PDF export"
    ],
    tips: [
      "Run the Fee Ledger report at month-end to reconcile collections",
      "Student register is required for government inspection — export before any major exam",
      "All reports use only saved data — no placeholder entries"
    ]
  },
  {
    id: "sessions",
    label: "Sessions",
    icon: CalendarClock,
    group: "Admin",
    tagline: "Academic year management and data isolation",
    what: "Create and manage academic sessions (e.g. 2024–25, 2025–26). Each session has its own student, fee, and attendance data. Switch between sessions using the top bar selector.",
    steps: [
      {
        step: "Open Sessions",
        detail: "Click 'Sessions' in the sidebar under Admin group"
      },
      {
        step: "Create a new session",
        detail: "Click 'Add Session' → enter year range (e.g. 2025–26) → Save"
      },
      {
        step: "Set as active",
        detail: "Click the 'Set Active' button next to the session you want to work in"
      },
      {
        step: "Switch session",
        detail: "Use the session selector on the Dashboard top bar to view historical data"
      }
    ],
    features: [
      "Sessions from 2019–20 to 2025–26 and beyond",
      "Session-wise student and fee data",
      "Historical data access without mixing current data",
      "Active session indicator on all screens"
    ],
    tips: [
      "Always create the new session in April before the academic year starts",
      "Old session data is safe and read-only once you move to a new session",
      "Student promotion (from one class to the next) is done at session change"
    ]
  },
  {
    id: "users",
    label: "User Management",
    icon: UserCog,
    group: "Admin",
    tagline: "User accounts, roles, and permissions",
    what: "Create login accounts for all staff roles — admin, teacher, accountant, librarian, etc. Assign roles with specific module access. Reset passwords and deactivate accounts.",
    steps: [
      {
        step: "Open Users",
        detail: "Click 'User Management' in the sidebar under Admin group"
      },
      {
        step: "Add a user",
        detail: "Click 'Add User' → enter full name, username, password, and role (Admin/Teacher/Accountant/Librarian)"
      },
      {
        step: "Set permissions",
        detail: "Choose which modules the user can access (view only or full access)"
      },
      {
        step: "Reset password",
        detail: "Click on a user → Reset Password → set a new temporary password"
      },
      {
        step: "Deactivate a user",
        detail: "Toggle the 'Active' switch to disable login without deleting the account"
      }
    ],
    features: [
      "Multiple roles: Admin, Teacher, Accountant, Librarian, Parent",
      "Module-level access control",
      "Password reset by admin",
      "Account activation/deactivation",
      "Audit log of user actions"
    ],
    tips: [
      "Default login: admin / admin123 — change this password immediately after first login",
      "Give accountants access to Fees and Reports only — not HR or Settings",
      "Deactivate (don't delete) accounts for staff who leave — records are preserved"
    ]
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    group: "Admin",
    tagline: "School profile, themes, and integrations",
    what: "Configure your school's name, logo, address, contact details, academic calendar, and theme. Manage integrations (SMS, WhatsApp, Payment Gateway) and customise the public landing page.",
    steps: [
      {
        step: "Set School Info",
        detail: "Settings → School Profile → enter school name, address, phone, affiliation number, logo upload"
      },
      {
        step: "Change Theme",
        detail: "Settings → Theme → select one of 10 colour themes → Apply (takes effect immediately)"
      },
      {
        step: "Edit Landing Page",
        detail: "Settings → Landing Page → customise hero text, images, section order, visibility of each section, and colours"
      },
      {
        step: "Configure SMS",
        detail: "Settings → Integrations → SMS → enter your gateway API key and sender ID"
      },
      {
        step: "Set up Payment Gateway",
        detail: "Settings → Integrations → Payments → add Razorpay/PayU key and secret"
      }
    ],
    features: [
      "School name, logo, and address",
      "10 colour themes (applied globally)",
      "Full landing page customisation: hero, images, sections, colours",
      "SMS gateway integration",
      "WhatsApp API integration",
      "Razorpay / PayU payment gateway",
      "Academic calendar settings"
    ],
    tips: [
      "Upload your school logo in PNG format with a transparent background for best results",
      "Theme changes apply instantly — no page reload needed",
      "The landing page editor lets you drag sections up/down to reorder them"
    ]
  },
  {
    id: "alumni",
    label: "Alumni",
    icon: UsersRound,
    group: "Admin",
    tagline: "Track and connect with school alumni",
    what: "Maintain a database of past students who have passed out of the school. Record their current occupation, contact details, and achievements. Send alumni newsletters.",
    steps: [
      {
        step: "Open Alumni",
        detail: "Click 'Alumni' in the sidebar under Admin group"
      },
      {
        step: "Add Alumni",
        detail: "Click 'Add Alumni' → enter name, passing year, class passed, current profession, mobile"
      },
      {
        step: "Import from Students",
        detail: "Click 'Import from Students' → select the passing-out batch → confirm"
      },
      {
        step: "Send Newsletter",
        detail: "Alumni → Communication → compose message → Send to All Alumni"
      }
    ],
    features: [
      "Alumni database with passing year and batch",
      "Import from student records at session end",
      "Profession and achievement tracking",
      "Alumni communication/newsletter"
    ],
    tips: [
      "At the end of every session, promote Class 12 students to Alumni",
      "Keep mobile numbers updated — useful for annual alumni events"
    ]
  }
];
function groupModules(modules) {
  return modules.reduce((acc, m) => {
    if (!acc[m.group]) acc[m.group] = [];
    acc[m.group].push(m);
    return acc;
  }, {});
}
const GROUP_ORDER = [
  "Core",
  "Exams",
  "HR",
  "Operations",
  "Communication",
  "Finance",
  "Studio",
  "Admin"
];
function StepCard({
  index,
  step,
  detail
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold mt-0.5", children: index }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: step }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: detail })
    ] })
  ] });
}
function ModuleDetail({ module: mod }) {
  const Icon = mod.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "help.detail_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 pb-5 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display text-foreground", children: mod.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: mod.tagline }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "mt-2 text-xs", children: mod.group })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-labelledby": `help-what-${mod.id}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          id: `help-what-${mod.id}`,
          className: "text-sm font-semibold text-foreground mb-2 uppercase tracking-wide",
          children: "📖 What It Does"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-lg p-3", children: mod.what })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-labelledby": `help-steps-${mod.id}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          id: `help-steps-${mod.id}`,
          className: "text-sm font-semibold text-foreground mb-3 uppercase tracking-wide",
          children: "🪜 How to Use — Step by Step"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: mod.steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        StepCard,
        {
          index: i + 1,
          step: s.step,
          detail: s.detail
        },
        s.step
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-labelledby": `help-features-${mod.id}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          id: `help-features-${mod.id}`,
          className: "text-sm font-semibold text-foreground mb-2 uppercase tracking-wide",
          children: "✅ Key Features"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: mod.features.map((f, fi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex items-start gap-2 text-sm text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5 shrink-0 text-primary mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
          ]
        },
        `${mod.id}-feat-${fi}`
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "aria-labelledby": `help-tips-${mod.id}`,
        className: "bg-accent/10 border border-accent/20 rounded-xl p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "h3",
            {
              id: `help-tips-${mod.id}`,
              className: "flex items-center gap-2 text-sm font-semibold text-foreground mb-2 uppercase tracking-wide",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "size-4 text-accent-foreground" }),
                " Tips & Best Practices"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: mod.tips.map((t, ti) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-start gap-2 text-sm text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-accent-foreground font-bold", children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t })
              ]
            },
            `${mod.id}-tip-${ti}`
          )) })
        ]
      }
    )
  ] });
}
function ModuleListItem({
  module: mod,
  selected,
  onClick,
  index
}) {
  const Icon = mod.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": `help.module.item.${index}`,
      className: cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150",
        selected ? "bg-primary text-primary-foreground" : "hover:bg-muted/60 text-foreground"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon,
          {
            className: cn(
              "size-4 shrink-0",
              selected ? "text-primary-foreground" : "text-muted-foreground"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: mod.label })
      ]
    }
  );
}
function HelpPage() {
  const [search, setSearch] = reactExports.useState("");
  const [selectedId, setSelectedId] = reactExports.useState("dashboard");
  const filtered = reactExports.useMemo(() => {
    if (!search.trim()) return MODULES;
    const q = search.toLowerCase();
    return MODULES.filter(
      (m) => m.label.toLowerCase().includes(q) || m.group.toLowerCase().includes(q) || m.what.toLowerCase().includes(q) || m.tagline.toLowerCase().includes(q)
    );
  }, [search]);
  const grouped = reactExports.useMemo(() => groupModules(filtered), [filtered]);
  const selectedModule = MODULES.find((m) => m.id === selectedId) ?? MODULES[0];
  const visibleIds = new Set(filtered.map((m) => m.id));
  const effectiveSelected = visibleIds.has(selectedId) ? selectedModule : filtered[0] ?? MODULES[0];
  let listIndex = 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full bg-background", "data-ocid": "help.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: "w-56 shrink-0 border-r border-border bg-card flex flex-col",
        "data-ocid": "help.module_list",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-b border-border shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search modules…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-8 h-8 text-xs",
                "data-ocid": "help.search_input"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 space-y-3", children: [
            filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs text-muted-foreground text-center py-8 px-3",
                "data-ocid": "help.empty_state",
                children: [
                  'No modules match "',
                  search,
                  '"'
                ]
              }
            ),
            GROUP_ORDER.filter((g) => {
              var _a;
              return ((_a = grouped[g]) == null ? void 0 : _a.length) > 0;
            }).map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60", children: group }),
              grouped[group].map((mod) => {
                const idx = ++listIndex;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ModuleListItem,
                  {
                    module: mod,
                    selected: effectiveSelected.id === mod.id,
                    onClick: () => setSelectedId(mod.id),
                    index: idx
                  },
                  mod.id
                );
              })
            ] }, group))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-border shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground text-center", children: [
            MODULES.length,
            " modules documented"
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 min-w-0 overflow-auto bg-background", children: effectiveSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleDetail, { module: effectiveSelected }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex h-full items-center justify-center text-muted-foreground text-sm",
        "data-ocid": "help.no_selection",
        children: "Select a module from the left to view its guide"
      }
    ) })
  ] });
}
export {
  HelpPage as default
};
