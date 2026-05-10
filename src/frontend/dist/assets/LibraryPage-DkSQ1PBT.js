import { ae as createLucideIcon, cq as useBooks, cr as useIssuedBooks, a5 as useStudents, cs as useAddBook, ct as useUpdateBook, cu as useDeleteBook, cv as useIssueBook, cw as useReturnBook, r as reactExports, j as jsxRuntimeExports, B as BookOpen, t as Badge, a2 as TrendingUp, I as Input, e as Button, S as Skeleton, F as ue, a0 as formatDate, bk as formatCurrency, L as Label, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, k as DialogFooter } from "./index-pMBTUEbj.js";
import { D as DateInput } from "./DateInput-3uknL2jU.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription } from "./card-r-j30wiQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { R as RotateCcw } from "./rotate-ccw-BQz6udQk.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { S as SquarePen } from "./square-pen-rgW01YAz.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { T as TriangleAlert } from "./triangle-alert-Ai_hY88N.js";
import "./calendar-CAegGMND.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }]
];
const Scan = createLucideIcon("scan", __iconNode);
const CATEGORIES = [
  "All",
  "Textbook",
  "Reference",
  "Biography",
  "History",
  "Science",
  "Fiction",
  "General"
];
const emptyForm = {
  title: "",
  author: "",
  isbn: "",
  category: "Textbook",
  totalCopies: "1",
  publisher: "",
  publishYear: String((/* @__PURE__ */ new Date()).getFullYear()),
  shelfLocation: ""
};
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "library.confirm.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "destructive",
          className: "flex-1",
          onClick: onConfirm,
          "data-ocid": "library.confirm.confirm_button",
          children: confirmLabel ?? "Confirm"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onCancel,
          "data-ocid": "library.confirm.cancel_button",
          children: "Cancel"
        }
      )
    ] })
  ] }) });
}
function LibraryPage() {
  const { data: books = [], isLoading: booksLoading } = useBooks();
  const { data: issues = [], isLoading: issuesLoading } = useIssuedBooks();
  const { data: students = [] } = useStudents();
  const addBook = useAddBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const issueBook = useIssueBook();
  const returnBook = useReturnBook();
  const [search, setSearch] = reactExports.useState("");
  const [catFilter, setCatFilter] = reactExports.useState("All");
  const [bookDialog, setBookDialog] = reactExports.useState(false);
  const [editBook, setEditBook] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [deleteBookTarget, setDeleteBookTarget] = reactExports.useState(null);
  const [returnTarget, setReturnTarget] = reactExports.useState(null);
  const [studentSearch, setStudentSearch] = reactExports.useState("");
  const [barcodeInput, setBarcodeInput] = reactExports.useState("");
  const [selectedStudentId, setSelectedStudentId] = reactExports.useState(
    null
  );
  const [issuingBook, setIssuingBook] = reactExports.useState("");
  const [historyFrom, setHistoryFrom] = reactExports.useState("");
  const [historyTo, setHistoryTo] = reactExports.useState("");
  const filteredBooks = reactExports.useMemo(
    () => books.filter((b) => {
      const q = search.toLowerCase();
      return (!search || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q)) && (catFilter === "All" || b.category === catFilter);
    }),
    [books, search, catFilter]
  );
  const activeIssues = issues.filter((i) => !i.returnDate);
  const overdueIssues = activeIssues.filter((i) => i.isOverdue);
  const selectedStudentIssues = selectedStudentId ? activeIssues.filter((i) => i.studentId === selectedStudentId) : [];
  const visibleStudents = reactExports.useMemo(() => {
    const q = studentSearch.toLowerCase();
    return students.filter((s) => !q || s.fullName.toLowerCase().includes(q));
  }, [students, studentSearch]);
  function openAdd() {
    setEditBook(null);
    setForm(emptyForm);
    setBookDialog(true);
  }
  function openEdit(book) {
    setEditBook(book);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      totalCopies: String(book.totalCopies),
      publisher: book.publisher,
      publishYear: String(book.publishYear || (/* @__PURE__ */ new Date()).getFullYear()),
      shelfLocation: book.shelfLocation
    });
    setBookDialog(true);
  }
  async function handleSaveBook() {
    if (!form.title.trim() || !form.author.trim()) {
      ue.error("Title and author are required");
      return;
    }
    const totalCopies = Number.parseInt(form.totalCopies) || 1;
    try {
      if (editBook) {
        await updateBook.mutateAsync({
          ...editBook,
          ...form,
          totalCopies,
          publishYear: Number.parseInt(form.publishYear)
        });
        ue.success("Book updated");
      } else {
        await addBook.mutateAsync({
          title: form.title,
          author: form.author,
          isbn: form.isbn,
          category: form.category,
          totalCopies,
          publisher: form.publisher,
          publishYear: Number.parseInt(form.publishYear),
          shelfLocation: form.shelfLocation
        });
        ue.success("Book added to library");
      }
      setBookDialog(false);
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to save book");
    }
  }
  async function handleDeleteBook(id) {
    try {
      await deleteBook.mutateAsync(id);
      ue.success("Book deleted");
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to delete book");
    } finally {
      setDeleteBookTarget(null);
    }
  }
  async function handleIssueBook() {
    if (!selectedStudentId || !issuingBook) {
      ue.error("Select student and book");
      return;
    }
    const due = /* @__PURE__ */ new Date();
    due.setDate(due.getDate() + 14);
    const dueDate = due.toISOString().slice(0, 10);
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    try {
      await issueBook.mutateAsync({
        bookId: issuingBook,
        studentId: selectedStudentId,
        issueDate: today,
        dueDate
      });
      setIssuingBook("");
      ue.success(`Book issued — due ${formatDate(dueDate)}`);
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to issue book");
    }
  }
  async function handleReturnBook(issue) {
    try {
      await returnBook.mutateAsync({ issueId: issue.id, fine: issue.fine });
      ue.success(
        issue.fine > 0 ? `Book returned — fine: ${formatCurrency(issue.fine)}` : "Book returned successfully"
      );
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to return book");
    } finally {
      setReturnTarget(null);
    }
  }
  const isLoading = booksLoading || issuesLoading;
  function getStudentName(studentId) {
    var _a;
    return ((_a = students.find((s) => s.id === studentId)) == null ? void 0 : _a.fullName) ?? studentId;
  }
  function getBookTitle(bookId) {
    var _a;
    return ((_a = books.find((b) => b.id === bookId)) == null ? void 0 : _a.title) ?? bookId;
  }
  const filteredHistory = reactExports.useMemo(() => {
    return issues.filter((i) => {
      if (historyFrom && i.issueDate < historyFrom) return false;
      if (historyTo && i.issueDate > historyTo) return false;
      return true;
    });
  }, [issues, historyFrom, historyTo]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "library.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Library" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage books, track issues & returns, monitor overdue" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex gap-2", children: [
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
          books.reduce((s, b) => s + b.totalCopies, 0),
          " total books"
        ] }),
        overdueIssues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", children: [
          overdueIssues.length,
          " overdue"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "books", "data-ocid": "library.tab", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "books", "data-ocid": "library.books.tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 mr-2" }),
          "Books"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "issue", "data-ocid": "library.issue.tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4 mr-2" }),
          "Issue & Return"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "reports", "data-ocid": "library.reports.tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 mr-2" }),
          "Reports"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "books", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search by title, author, ISBN…",
                className: "pl-9",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                "data-ocid": "library.books.search_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: catFilter, onValueChange: setCatFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-36",
                "data-ocid": "library.category.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: openAdd,
              className: "ml-auto",
              "data-ocid": "library.add_book.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
                "Add Book"
              ]
            }
          )
        ] }),
        booksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "library.books.loading_state", children: [0, 1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "h-12 w-full rounded-lg"
          },
          `skel-book-${n}`
        )) }) : filteredBooks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-16 text-muted-foreground",
            "data-ocid": "library.books.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-12 w-12 mx-auto mb-3 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: books.length === 0 ? "No books in library yet" : "No books found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: books.length === 0 ? 'Click "Add Book" to add your first book' : "Try adjusting the search or filter" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
            "ISBN",
            "Title",
            "Author",
            "Category",
            "Total",
            "Available",
            "Shelf",
            "Actions"
          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: `px-4 py-3 font-medium text-muted-foreground ${h === "Total" || h === "Available" ? "text-right" : "text-left"}`,
              children: h
            },
            h
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredBooks.map((book, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-t border-border hover:bg-muted/20",
              "data-ocid": `library.book.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-mono text-xs", children: book.isbn }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground max-w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: book.title }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: book.author }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: book.category }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-medium", children: book.totalCopies }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `font-semibold ${book.availableCopies === 0 ? "text-destructive" : book.availableCopies < 3 ? "text-yellow-600" : "text-green-600"}`,
                    children: book.availableCopies
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs font-mono", children: book.shelfLocation }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-7 w-7 p-0",
                      onClick: () => openEdit(book),
                      "data-ocid": `library.edit_book.edit_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-7 w-7 p-0 text-destructive hover:text-destructive",
                      onClick: () => setDeleteBookTarget(book),
                      "data-ocid": `library.delete_book.delete_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] }) })
              ]
            },
            book.id
          )) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "issue", className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Find Student" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: "w-full",
                  type: "button",
                  "data-ocid": "library.scan_barcode.button",
                  onClick: () => ue.info("Camera barcode scanner — use text input below"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Scan, { className: "h-4 w-4 mr-2" }),
                    "Scan Barcode"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Enter barcode…",
                  value: barcodeInput,
                  onChange: (e) => setBarcodeInput(e.target.value),
                  "data-ocid": "library.barcode.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search student by name…",
                  value: studentSearch,
                  onChange: (e) => setStudentSearch(e.target.value),
                  "data-ocid": "library.student.search_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 max-h-48 overflow-y-auto", children: [
                visibleStudents.slice(0, 20).map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedStudentId(s.id);
                      setStudentSearch("");
                    },
                    className: `w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${selectedStudentId === s.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/40 text-foreground"}`,
                    "data-ocid": `library.student.item.${i + 1}`,
                    children: s.fullName
                  },
                  s.id
                )),
                visibleStudents.length === 0 && studentSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-2", children: "No students found" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "col-span-2", children: selectedStudentId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Issued Books" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
                selectedStudentIssues.length,
                " book(s) currently issued to",
                " ",
                getStudentName(selectedStudentId)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              selectedStudentIssues.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No books currently issued" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: selectedStudentIssues.map((issue, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-3 p-3 rounded-lg border ${issue.isOverdue ? "border-destructive/40 bg-destructive/5" : "border-border"}`,
                  "data-ocid": `library.issued.item.${i + 1}`,
                  children: [
                    issue.isOverdue && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground truncate", children: getBookTitle(issue.bookId) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        "Due: ",
                        formatDate(issue.dueDate)
                      ] }),
                      issue.isOverdue && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive font-medium", children: [
                        "Fine: ",
                        formatCurrency(issue.fine)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        type: "button",
                        onClick: () => setReturnTarget(issue),
                        "data-ocid": `library.return.button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5 mr-1" }),
                          "Return"
                        ]
                      }
                    )
                  ]
                },
                issue.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-border space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Issue New Book" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: issuingBook,
                      onValueChange: setIssuingBook,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "flex-1",
                            "data-ocid": "library.issue_book.select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select book to issue" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: books.filter((b) => b.availableCopies > 0).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: b.id, children: [
                          b.title,
                          " (",
                          b.availableCopies,
                          " avail)"
                        ] }, b.id)) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      onClick: handleIssueBook,
                      disabled: issueBook.isPending,
                      "data-ocid": "library.issue.button",
                      children: issueBook.isPending ? "Issuing..." : "Issue"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Default due date: 14 days from today" })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            CardContent,
            {
              className: "flex flex-col items-center justify-center py-16 text-muted-foreground",
              "data-ocid": "library.issue.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-12 w-12 mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Select a student" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Search or scan barcode to find a student" })
              ]
            }
          ) })
        ] }),
        overdueIssues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-destructive/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2 text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
            "Overdue Books (",
            overdueIssues.length,
            ")"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-destructive/20 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-destructive/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["Student", "Book", "Due Date", "Fine", "Action"].map(
              (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: `px-4 py-2 font-medium text-muted-foreground ${h === "Fine" || h === "Action" ? "text-right" : "text-left"}`,
                  children: h
                },
                h
              )
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: overdueIssues.map((issue, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-destructive/10",
                "data-ocid": `library.overdue.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-foreground", children: getStudentName(issue.studentId ?? "") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-foreground", children: getBookTitle(issue.bookId) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-destructive", children: formatDate(issue.dueDate) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right font-semibold text-destructive", children: formatCurrency(issue.fine) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      type: "button",
                      onClick: () => setReturnTarget(issue),
                      "data-ocid": `library.overdue_return.button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5 mr-1" }),
                        "Return"
                      ]
                    }
                  ) })
                ]
              },
              issue.id
            )) })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "reports", className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-primary" }),
            "Stock Report"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, `skel-issue-${n}`)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-3 mb-5", children: [
              {
                label: "Titles",
                value: books.length,
                color: "text-primary"
              },
              {
                label: "Total Copies",
                value: books.reduce((s, b) => s + b.totalCopies, 0),
                color: "text-green-600"
              },
              {
                label: "Available",
                value: books.reduce((s, b) => s + b.availableCopies, 0),
                color: "text-blue-600"
              },
              {
                label: "Issued",
                value: activeIssues.length,
                color: "text-orange-600"
              }
            ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-4 bg-muted/30 rounded-lg text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold ${color}`, children: value }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
                ]
              },
              label
            )) }),
            books.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-8 text-muted-foreground",
                "data-ocid": "library.stock.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-10 w-10 mx-auto mb-2 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No books to report" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
                "Title",
                "Category",
                "Total",
                "Issued",
                "Available"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: `px-4 py-2.5 font-medium text-muted-foreground ${["Total", "Issued", "Available"].includes(h) ? "text-right" : "text-left"}`,
                  children: h
                },
                h
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: books.map((book, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "border-t border-border hover:bg-muted/20",
                  "data-ocid": `library.stock.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground", children: book.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: book.category }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: book.totalCopies }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right text-orange-600", children: book.totalCopies - book.availableCopies }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `font-semibold ${book.availableCopies === 0 ? "text-destructive" : "text-green-600"}`,
                        children: book.availableCopies
                      }
                    ) })
                  ]
                },
                book.id
              )) })
            ] }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Issue History" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "From" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DateInput,
                  {
                    value: historyFrom,
                    onChange: setHistoryFrom,
                    className: "w-44",
                    "data-ocid": "library.history_from.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "To" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DateInput,
                  {
                    value: historyTo,
                    onChange: setHistoryTo,
                    className: "w-44",
                    "data-ocid": "library.history_to.input"
                  }
                )
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: issuesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, `skel-od-${n}`)) }) : filteredHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-8 text-muted-foreground",
              "data-ocid": "library.history.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-10 w-10 mx-auto mb-2 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: issues.length === 0 ? "No issue records yet" : "No records in selected date range" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
              "Book",
              "Student/Staff",
              "Issue Date",
              "Due Date",
              "Return Date",
              "Fine",
              "Status"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: `px-4 py-2.5 font-medium text-muted-foreground ${h === "Fine" ? "text-right" : "text-left"}`,
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredHistory.map((issue, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-border hover:bg-muted/20",
                "data-ocid": `library.history.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground", children: getBookTitle(issue.bookId) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: issue.studentId ? getStudentName(issue.studentId ?? "") : issue.staffId ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: formatDate(issue.issueDate) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: formatDate(issue.dueDate) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: issue.returnDate ? formatDate(issue.returnDate) : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: issue.fine > 0 ? formatCurrency(issue.fine) : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: issue.returnDate ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs text-green-600 border-green-200",
                      children: "Returned"
                    }
                  ) : issue.isOverdue ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "Overdue" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Active" }) })
                ]
              },
              issue.id
            )) })
          ] }) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: bookDialog, onOpenChange: setBookDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "library.book.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editBook ? "Edit Book" : "Add New Book" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.title,
              onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })),
              placeholder: "Book title",
              "data-ocid": "library.book_title.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Author *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.author,
              onChange: (e) => setForm((f) => ({ ...f, author: e.target.value })),
              placeholder: "Author name",
              "data-ocid": "library.book_author.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "ISBN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.isbn,
              onChange: (e) => setForm((f) => ({ ...f, isbn: e.target.value })),
              placeholder: "ISBN number",
              "data-ocid": "library.book_isbn.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.category,
              onValueChange: (v) => setForm((f) => ({ ...f, category: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "library.book_category.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.filter((c) => c !== "All").map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Total Copies" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.totalCopies,
              onChange: (e) => setForm((f) => ({ ...f, totalCopies: e.target.value })),
              inputMode: "numeric",
              "data-ocid": "library.book_copies.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Publisher" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.publisher,
              onChange: (e) => setForm((f) => ({ ...f, publisher: e.target.value })),
              "data-ocid": "library.book_publisher.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Publish Year" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.publishYear,
              onChange: (e) => setForm((f) => ({ ...f, publishYear: e.target.value })),
              inputMode: "numeric",
              "data-ocid": "library.book_year.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Shelf Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.shelfLocation,
              onChange: (e) => setForm((f) => ({ ...f, shelfLocation: e.target.value })),
              placeholder: "e.g. A-01",
              "data-ocid": "library.book_shelf.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            type: "button",
            onClick: () => setBookDialog(false),
            "data-ocid": "library.book.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: handleSaveBook,
            disabled: addBook.isPending || updateBook.isPending,
            "data-ocid": "library.book.save_button",
            children: addBook.isPending || updateBook.isPending ? "Saving..." : editBook ? "Save Changes" : "Add Book"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteBookTarget,
        title: "Delete Book?",
        message: `Are you sure you want to delete "${(deleteBookTarget == null ? void 0 : deleteBookTarget.title) ?? ""}"? This action cannot be undone.`,
        confirmLabel: "Delete",
        onConfirm: () => deleteBookTarget && handleDeleteBook(deleteBookTarget.id),
        onCancel: () => setDeleteBookTarget(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!returnTarget,
        title: "Return Book",
        message: `Confirm return of "${returnTarget ? getBookTitle(returnTarget.bookId) : ""}"${returnTarget && returnTarget.fine > 0 ? ` with fine ${formatCurrency(returnTarget.fine)}` : ""}?`,
        confirmLabel: "Confirm Return",
        onConfirm: () => returnTarget && handleReturnBook(returnTarget),
        onCancel: () => setReturnTarget(null)
      }
    )
  ] });
}
export {
  LibraryPage as default
};
