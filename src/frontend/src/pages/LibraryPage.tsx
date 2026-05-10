import DateInput from "@/components/shared/DateInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddBook,
  useBooks,
  useDeleteBook,
  useIssueBook,
  useIssuedBooks,
  useReturnBook,
  useUpdateBook,
} from "@/hooks/useBackend";
import { useStudents } from "@/hooks/useBackend";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Book, BookIssue } from "@/types";
import {
  AlertTriangle,
  BookOpen,
  Edit,
  Plus,
  RotateCcw,
  Scan,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "All",
  "Textbook",
  "Reference",
  "Biography",
  "History",
  "Science",
  "Fiction",
  "General",
];

interface BookForm {
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: string;
  publisher: string;
  publishYear: string;
  shelfLocation: string;
}
const emptyForm: BookForm = {
  title: "",
  author: "",
  isbn: "",
  category: "Textbook",
  totalCopies: "1",
  publisher: "",
  publishYear: String(new Date().getFullYear()),
  shelfLocation: "",
};

// ─── Confirm Delete Dialog ────────────────────────────────────────────────
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm" data-ocid="library.confirm.dialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="flex gap-2 pt-2">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            data-ocid="library.confirm.confirm_button"
          >
            {confirmLabel ?? "Confirm"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            data-ocid="library.confirm.cancel_button"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function LibraryPage() {
  const { data: books = [], isLoading: booksLoading } = useBooks();
  const { data: issues = [], isLoading: issuesLoading } = useIssuedBooks();
  const { data: students = [] } = useStudents();
  const addBook = useAddBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const issueBook = useIssueBook();
  const returnBook = useReturnBook();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [bookDialog, setBookDialog] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [deleteBookTarget, setDeleteBookTarget] = useState<Book | null>(null);
  const [returnTarget, setReturnTarget] = useState<BookIssue | null>(null);

  const [studentSearch, setStudentSearch] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [issuingBook, setIssuingBook] = useState("");

  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");

  const filteredBooks = useMemo(
    () =>
      books.filter((b) => {
        const q = search.toLowerCase();
        return (
          (!search ||
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.isbn.includes(q)) &&
          (catFilter === "All" || b.category === catFilter)
        );
      }),
    [books, search, catFilter],
  );

  const activeIssues = issues.filter((i) => !i.returnDate);
  const overdueIssues = activeIssues.filter((i) => i.isOverdue);
  const selectedStudentIssues = selectedStudentId
    ? activeIssues.filter((i) => i.studentId === selectedStudentId)
    : [];

  const visibleStudents = useMemo(() => {
    const q = studentSearch.toLowerCase();
    return students.filter((s) => !q || s.fullName.toLowerCase().includes(q));
  }, [students, studentSearch]);

  function openAdd() {
    setEditBook(null);
    setForm(emptyForm);
    setBookDialog(true);
  }
  function openEdit(book: Book) {
    setEditBook(book);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      totalCopies: String(book.totalCopies),
      publisher: book.publisher,
      publishYear: String(book.publishYear || new Date().getFullYear()),
      shelfLocation: book.shelfLocation,
    });
    setBookDialog(true);
  }

  async function handleSaveBook() {
    if (!form.title.trim() || !form.author.trim()) {
      toast.error("Title and author are required");
      return;
    }
    const totalCopies = Number.parseInt(form.totalCopies) || 1;
    try {
      if (editBook) {
        await updateBook.mutateAsync({
          ...editBook,
          ...form,
          totalCopies,
          publishYear: Number.parseInt(form.publishYear),
        });
        toast.success("Book updated");
      } else {
        await addBook.mutateAsync({
          title: form.title,
          author: form.author,
          isbn: form.isbn,
          category: form.category,
          totalCopies,
          publisher: form.publisher,
          publishYear: Number.parseInt(form.publishYear),
          shelfLocation: form.shelfLocation,
        });
        toast.success("Book added to library");
      }
      setBookDialog(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save book");
    }
  }

  async function handleDeleteBook(id: string) {
    try {
      await deleteBook.mutateAsync(id);
      toast.success("Book deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete book");
    } finally {
      setDeleteBookTarget(null);
    }
  }

  async function handleIssueBook() {
    if (!selectedStudentId || !issuingBook) {
      toast.error("Select student and book");
      return;
    }
    const due = new Date();
    due.setDate(due.getDate() + 14);
    const dueDate = due.toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    try {
      await issueBook.mutateAsync({
        bookId: issuingBook,
        studentId: selectedStudentId,
        issueDate: today,
        dueDate,
      });
      setIssuingBook("");
      toast.success(`Book issued — due ${formatDate(dueDate)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to issue book");
    }
  }

  async function handleReturnBook(issue: BookIssue) {
    try {
      await returnBook.mutateAsync({ issueId: issue.id, fine: issue.fine });
      toast.success(
        issue.fine > 0
          ? `Book returned — fine: ${formatCurrency(issue.fine)}`
          : "Book returned successfully",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to return book");
    } finally {
      setReturnTarget(null);
    }
  }

  const isLoading = booksLoading || issuesLoading;

  function getStudentName(studentId: string) {
    return students.find((s) => s.id === studentId)?.fullName ?? studentId;
  }

  function getBookTitle(bookId: string) {
    return books.find((b) => b.id === bookId)?.title ?? bookId;
  }

  const filteredHistory = useMemo(() => {
    return issues.filter((i) => {
      if (historyFrom && i.issueDate < historyFrom) return false;
      if (historyTo && i.issueDate > historyTo) return false;
      return true;
    });
  }, [issues, historyFrom, historyTo]);

  return (
    <div className="p-6 space-y-6" data-ocid="library.page">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Library
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage books, track issues &amp; returns, monitor overdue
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          {!isLoading && (
            <Badge variant="secondary">
              {books.reduce((s, b) => s + b.totalCopies, 0)} total books
            </Badge>
          )}
          {overdueIssues.length > 0 && (
            <Badge variant="destructive">{overdueIssues.length} overdue</Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="books" data-ocid="library.tab">
        <TabsList>
          <TabsTrigger value="books" data-ocid="library.books.tab">
            <BookOpen className="h-4 w-4 mr-2" />
            Books
          </TabsTrigger>
          <TabsTrigger value="issue" data-ocid="library.issue.tab">
            <RotateCcw className="h-4 w-4 mr-2" />
            Issue &amp; Return
          </TabsTrigger>
          <TabsTrigger value="reports" data-ocid="library.reports.tab">
            <TrendingUp className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* ── Books ── */}
        <TabsContent value="books" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, ISBN…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="library.books.search_input"
              />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger
                className="w-36"
                data-ocid="library.category.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={openAdd}
              className="ml-auto"
              data-ocid="library.add_book.button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </div>

          {booksLoading ? (
            <div className="space-y-2" data-ocid="library.books.loading_state">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <Skeleton
                  key={`skel-book-${n}`}
                  className="h-12 w-full rounded-lg"
                />
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="library.books.empty_state"
            >
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">
                {books.length === 0
                  ? "No books in library yet"
                  : "No books found"}
              </p>
              <p className="text-sm mt-1">
                {books.length === 0
                  ? 'Click "Add Book" to add your first book'
                  : "Try adjusting the search or filter"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 sticky top-0">
                  <tr>
                    {[
                      "ISBN",
                      "Title",
                      "Author",
                      "Category",
                      "Total",
                      "Available",
                      "Shelf",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 font-medium text-muted-foreground ${
                          h === "Total" || h === "Available"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book, i) => (
                    <tr
                      key={book.id}
                      className="border-t border-border hover:bg-muted/20"
                      data-ocid={`library.book.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                        {book.isbn}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground max-w-[180px]">
                        <span className="truncate block">{book.title}</span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {book.author}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {book.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {book.totalCopies}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-semibold ${
                            book.availableCopies === 0
                              ? "text-destructive"
                              : book.availableCopies < 3
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {book.availableCopies}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs font-mono">
                        {book.shelfLocation}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => openEdit(book)}
                            data-ocid={`library.edit_book.edit_button.${i + 1}`}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteBookTarget(book)}
                            data-ocid={`library.delete_book.delete_button.${i + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* ── Issue & Return ── */}
        <TabsContent value="issue" className="space-y-5">
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Find Student</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  data-ocid="library.scan_barcode.button"
                  onClick={() =>
                    toast.info("Camera barcode scanner — use text input below")
                  }
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Scan Barcode
                </Button>
                <Input
                  placeholder="Enter barcode…"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  data-ocid="library.barcode.input"
                />
                <Input
                  placeholder="Search student by name…"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  data-ocid="library.student.search_input"
                />
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {visibleStudents.slice(0, 20).map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        setStudentSearch("");
                      }}
                      className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${
                        selectedStudentId === s.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/40 text-foreground"
                      }`}
                      data-ocid={`library.student.item.${i + 1}`}
                    >
                      {s.fullName}
                    </button>
                  ))}
                  {visibleStudents.length === 0 && studentSearch && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No students found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              {selectedStudentId ? (
                <>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Issued Books</CardTitle>
                    <CardDescription>
                      {selectedStudentIssues.length} book(s) currently issued to{" "}
                      {getStudentName(selectedStudentId)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedStudentIssues.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No books currently issued
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedStudentIssues.map((issue, i) => (
                          <div
                            key={issue.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              issue.isOverdue
                                ? "border-destructive/40 bg-destructive/5"
                                : "border-border"
                            }`}
                            data-ocid={`library.issued.item.${i + 1}`}
                          >
                            {issue.isOverdue && (
                              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {getBookTitle(issue.bookId)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Due: {formatDate(issue.dueDate)}
                              </p>
                              {issue.isOverdue && (
                                <p className="text-xs text-destructive font-medium">
                                  Fine: {formatCurrency(issue.fine)}
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              type="button"
                              onClick={() => setReturnTarget(issue)}
                              data-ocid={`library.return.button.${i + 1}`}
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />
                              Return
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="pt-2 border-t border-border space-y-2">
                      <Label className="text-sm font-medium">
                        Issue New Book
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          value={issuingBook}
                          onValueChange={setIssuingBook}
                        >
                          <SelectTrigger
                            className="flex-1"
                            data-ocid="library.issue_book.select"
                          >
                            <SelectValue placeholder="Select book to issue" />
                          </SelectTrigger>
                          <SelectContent>
                            {books
                              .filter((b) => b.availableCopies > 0)
                              .map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                  {b.title} ({b.availableCopies} avail)
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          onClick={handleIssueBook}
                          disabled={issueBook.isPending}
                          data-ocid="library.issue.button"
                        >
                          {issueBook.isPending ? "Issuing..." : "Issue"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Default due date: 14 days from today
                      </p>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent
                  className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                  data-ocid="library.issue.empty_state"
                >
                  <BookOpen className="h-12 w-12 mb-3 opacity-30" />
                  <p className="font-medium">Select a student</p>
                  <p className="text-sm">
                    Search or scan barcode to find a student
                  </p>
                </CardContent>
              )}
            </Card>
          </div>

          {overdueIssues.length > 0 && (
            <Card className="border-destructive/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Overdue Books ({overdueIssues.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-destructive/20 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-destructive/5">
                      <tr>
                        {["Student", "Book", "Due Date", "Fine", "Action"].map(
                          (h) => (
                            <th
                              key={h}
                              className={`px-4 py-2 font-medium text-muted-foreground ${
                                h === "Fine" || h === "Action"
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {overdueIssues.map((issue, i) => (
                        <tr
                          key={issue.id}
                          className="border-t border-destructive/10"
                          data-ocid={`library.overdue.item.${i + 1}`}
                        >
                          <td className="px-4 py-2 text-foreground">
                            {getStudentName(issue.studentId ?? "")}
                          </td>
                          <td className="px-4 py-2 text-foreground">
                            {getBookTitle(issue.bookId)}
                          </td>
                          <td className="px-4 py-2 text-destructive">
                            {formatDate(issue.dueDate)}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold text-destructive">
                            {formatCurrency(issue.fine)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              onClick={() => setReturnTarget(issue)}
                              data-ocid={`library.overdue_return.button.${i + 1}`}
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />
                              Return
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Reports ── */}
        <TabsContent value="reports" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Stock Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((n) => (
                    <Skeleton key={`skel-issue-${n}`} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                      {
                        label: "Titles",
                        value: books.length,
                        color: "text-primary",
                      },
                      {
                        label: "Total Copies",
                        value: books.reduce((s, b) => s + b.totalCopies, 0),
                        color: "text-green-600",
                      },
                      {
                        label: "Available",
                        value: books.reduce((s, b) => s + b.availableCopies, 0),
                        color: "text-blue-600",
                      },
                      {
                        label: "Issued",
                        value: activeIssues.length,
                        color: "text-orange-600",
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="p-4 bg-muted/30 rounded-lg text-center"
                      >
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                  {books.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground"
                      data-ocid="library.stock.empty_state"
                    >
                      <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No books to report</p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/40">
                          <tr>
                            {[
                              "Title",
                              "Category",
                              "Total",
                              "Issued",
                              "Available",
                            ].map((h) => (
                              <th
                                key={h}
                                className={`px-4 py-2.5 font-medium text-muted-foreground ${
                                  ["Total", "Issued", "Available"].includes(h)
                                    ? "text-right"
                                    : "text-left"
                                }`}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {books.map((book, i) => (
                            <tr
                              key={book.id}
                              className="border-t border-border hover:bg-muted/20"
                              data-ocid={`library.stock.item.${i + 1}`}
                            >
                              <td className="px-4 py-2.5 font-medium text-foreground">
                                {book.title}
                              </td>
                              <td className="px-4 py-2.5">
                                <Badge variant="outline" className="text-xs">
                                  {book.category}
                                </Badge>
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                {book.totalCopies}
                              </td>
                              <td className="px-4 py-2.5 text-right text-orange-600">
                                {book.totalCopies - book.availableCopies}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <span
                                  className={`font-semibold ${
                                    book.availableCopies === 0
                                      ? "text-destructive"
                                      : "text-green-600"
                                  }`}
                                >
                                  {book.availableCopies}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issue History</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">From</Label>
                    <DateInput
                      value={historyFrom}
                      onChange={setHistoryFrom}
                      className="w-44"
                      data-ocid="library.history_from.input"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">To</Label>
                    <DateInput
                      value={historyTo}
                      onChange={setHistoryTo}
                      className="w-44"
                      data-ocid="library.history_to.input"
                    />
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {issuesLoading ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((n) => (
                    <Skeleton key={`skel-od-${n}`} className="h-10 w-full" />
                  ))}
                </div>
              ) : filteredHistory.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="library.history.empty_state"
                >
                  <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">
                    {issues.length === 0
                      ? "No issue records yet"
                      : "No records in selected date range"}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                      <tr>
                        {[
                          "Book",
                          "Student/Staff",
                          "Issue Date",
                          "Due Date",
                          "Return Date",
                          "Fine",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className={`px-4 py-2.5 font-medium text-muted-foreground ${
                              h === "Fine" ? "text-right" : "text-left"
                            }`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((issue, i) => (
                        <tr
                          key={issue.id}
                          className="border-t border-border hover:bg-muted/20"
                          data-ocid={`library.history.item.${i + 1}`}
                        >
                          <td className="px-4 py-2.5 font-medium text-foreground">
                            {getBookTitle(issue.bookId)}
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {issue.studentId
                              ? getStudentName(issue.studentId ?? "")
                              : (issue.staffId ?? "—")}
                          </td>
                          <td className="px-4 py-2.5">
                            {formatDate(issue.issueDate)}
                          </td>
                          <td className="px-4 py-2.5">
                            {formatDate(issue.dueDate)}
                          </td>
                          <td className="px-4 py-2.5">
                            {issue.returnDate
                              ? formatDate(issue.returnDate)
                              : "—"}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            {issue.fine > 0 ? formatCurrency(issue.fine) : "—"}
                          </td>
                          <td className="px-4 py-2.5">
                            {issue.returnDate ? (
                              <Badge
                                variant="outline"
                                className="text-xs text-green-600 border-green-200"
                              >
                                Returned
                              </Badge>
                            ) : issue.isOverdue ? (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Active
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Book Dialog ── */}
      <Dialog open={bookDialog} onOpenChange={setBookDialog}>
        <DialogContent data-ocid="library.book.dialog">
          <DialogHeader>
            <DialogTitle>{editBook ? "Edit Book" : "Add New Book"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Book title"
                data-ocid="library.book_title.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Author *</Label>
              <Input
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
                placeholder="Author name"
                data-ocid="library.book_author.input"
              />
            </div>
            <div className="space-y-1">
              <Label>ISBN</Label>
              <Input
                value={form.isbn}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isbn: e.target.value }))
                }
                placeholder="ISBN number"
                data-ocid="library.book_isbn.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger data-ocid="library.book_category.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Total Copies</Label>
              <Input
                value={form.totalCopies}
                onChange={(e) =>
                  setForm((f) => ({ ...f, totalCopies: e.target.value }))
                }
                inputMode="numeric"
                data-ocid="library.book_copies.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Publisher</Label>
              <Input
                value={form.publisher}
                onChange={(e) =>
                  setForm((f) => ({ ...f, publisher: e.target.value }))
                }
                data-ocid="library.book_publisher.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Publish Year</Label>
              <Input
                value={form.publishYear}
                onChange={(e) =>
                  setForm((f) => ({ ...f, publishYear: e.target.value }))
                }
                inputMode="numeric"
                data-ocid="library.book_year.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Shelf Location</Label>
              <Input
                value={form.shelfLocation}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shelfLocation: e.target.value }))
                }
                placeholder="e.g. A-01"
                data-ocid="library.book_shelf.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setBookDialog(false)}
              data-ocid="library.book.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveBook}
              disabled={addBook.isPending || updateBook.isPending}
              data-ocid="library.book.save_button"
            >
              {addBook.isPending || updateBook.isPending
                ? "Saving..."
                : editBook
                  ? "Save Changes"
                  : "Add Book"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Confirm */}
      <ConfirmDialog
        open={!!deleteBookTarget}
        title="Delete Book?"
        message={`Are you sure you want to delete "${deleteBookTarget?.title ?? ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() =>
          deleteBookTarget && handleDeleteBook(deleteBookTarget.id)
        }
        onCancel={() => setDeleteBookTarget(null)}
      />

      {/* Return Book Confirm */}
      <ConfirmDialog
        open={!!returnTarget}
        title="Return Book"
        message={`Confirm return of "${returnTarget ? getBookTitle(returnTarget.bookId) : ""}"${
          returnTarget && returnTarget.fine > 0
            ? ` with fine ${formatCurrency(returnTarget.fine)}`
            : ""
        }?`}
        confirmLabel="Confirm Return"
        onConfirm={() => returnTarget && handleReturnBook(returnTarget)}
        onCancel={() => setReturnTarget(null)}
      />
    </div>
  );
}
