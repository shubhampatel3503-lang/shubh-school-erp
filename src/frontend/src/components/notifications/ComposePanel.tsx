import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/hooks/useBackend";
import { useStudents } from "@/hooks/useBackend";
import {
  CLASS_LEVELS,
  TEMPLATE_LABELS,
  defaultTemplates,
  useSendDirectMessage,
} from "@/hooks/useMessaging";
import type { Student } from "@/types";
import { MessageCircle, Phone, School, Send, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  currentUser: string;
  onSent?: () => void;
}

type RecipientType = "individual" | "class" | "section";
type Channel = "WhatsApp" | "In-App" | "Both";

const CHANNEL_OPTS: { value: Channel; label: string; icon: string }[] = [
  { value: "WhatsApp", label: "WhatsApp", icon: "📱" },
  { value: "In-App", label: "In-App Notification", icon: "🔔" },
  { value: "Both", label: "Both", icon: "📡" },
];

// Highlight template placeholders
function highlightPlaceholders(text: string) {
  const parts = text.split(/({[^}]+})/g);
  return parts.map((p) =>
    p.startsWith("{") && p.endsWith("}") ? (
      <span
        key={`ph-${p}`}
        className="bg-primary/15 text-primary px-0.5 rounded font-mono text-xs"
      >
        {p}
      </span>
    ) : (
      <span key={`tx-${p}`}>{p}</span>
    ),
  );
}

export function ComposePanel({ currentUser, onSent }: Props) {
  const [recipientType, setRecipientType] =
    useState<RecipientType>("individual");
  const [channel, setChannel] = useState<Channel>("WhatsApp");
  const [templateKey, setTemplateKey] = useState<string>("custom");
  const [message, setMessage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: settings } = useSettings();
  const { data: allStudents = [] } = useStudents();
  const sendMsg = useSendDirectMessage();

  // Debounced student search
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const matchingStudents = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return allStudents
      .filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.admNo.toLowerCase().includes(q) ||
          s.fatherName.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [allStudents, debouncedQuery]);

  // Extract unique sections from class
  const availableSections = useMemo(() => {
    if (!selectedClass) return [];
    const sects = new Set<string>();
    for (const st of allStudents.filter(
      (st) => st.classLevel === selectedClass,
    )) {
      sects.add(st.sectionId);
    }
    return Array.from(sects);
  }, [allStudents, selectedClass]);

  // Fill message from template
  const onTemplateChange = useCallback((key: string) => {
    setTemplateKey(key);
    if (key !== "custom" && defaultTemplates[key]) {
      setMessage(defaultTemplates[key]);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const recipientPhone = useMemo(() => {
    if (selectedStudent) {
      return (
        selectedStudent.fatherMobile ||
        selectedStudent.motherMobile ||
        selectedStudent.mobile ||
        ""
      );
    }
    return "";
  }, [selectedStudent]);

  function buildRecipientLabel() {
    if (recipientType === "individual" && selectedStudent)
      return `${selectedStudent.fullName} (${selectedStudent.admNo})`;
    if (recipientType === "class" && selectedClass)
      return `${CLASS_LEVELS.find((c) => c.value === selectedClass)?.label ?? selectedClass} — All Students`;
    if (recipientType === "section" && selectedClass && selectedSection)
      return `${CLASS_LEVELS.find((c) => c.value === selectedClass)?.label ?? selectedClass} — ${selectedSection}`;
    return "";
  }

  const isReady = useMemo(() => {
    if (!message.trim()) return false;
    if (recipientType === "individual" && !selectedStudent) return false;
    if (recipientType === "class" && !selectedClass) return false;
    if (recipientType === "section" && (!selectedClass || !selectedSection))
      return false;
    return true;
  }, [message, recipientType, selectedStudent, selectedClass, selectedSection]);

  async function handleSend() {
    if (!isReady) return;
    const label = buildRecipientLabel();
    try {
      await sendMsg.mutateAsync({
        fromUsername: currentUser,
        toStudentId:
          recipientType === "individual" ? (selectedStudent?.id ?? null) : null,
        toClassLevel:
          recipientType !== "individual" ? selectedClass || null : null,
        toSection: recipientType === "section" ? selectedSection || null : null,
        channel,
        message,
        templateKey: templateKey !== "custom" ? templateKey : null,
        recipientPhone:
          recipientType === "individual" ? recipientPhone : undefined,
        whatsappApiKey: settings?.whatsappApiKey || "",
        whatsappApiUrl: settings?.whatsappApiUrl ?? "",
      });
      toast.success(`Message sent to ${label}`);
      setMessage("");
      setTemplateKey("custom");
      setSelectedStudent(null);
      setSearchQuery("");
      onSent?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send message",
      );
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <Send className="h-4 w-4 text-primary" />
          Compose Message
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
        {/* Recipient Type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
            Send To
          </Label>
          <div
            className="grid grid-cols-3 gap-1.5"
            data-ocid="compose.recipient_type"
          >
            {(["individual", "class", "section"] as RecipientType[]).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setRecipientType(t)}
                  data-ocid={`compose.recipient_type.${t}`}
                  className={`px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-colors border ${
                    recipientType === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {t === "individual" ? (
                    <span className="flex items-center justify-center gap-1">
                      <User className="h-3 w-3" />
                      Individual
                    </span>
                  ) : t === "class" ? (
                    <span className="flex items-center justify-center gap-1">
                      <School className="h-3 w-3" />
                      Class
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      Section
                    </span>
                  )}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Individual student search */}
        {recipientType === "individual" && (
          <div className="space-y-1.5 relative">
            <Label
              htmlFor="student-search"
              className="text-xs font-semibold uppercase text-muted-foreground tracking-wide"
            >
              Student
            </Label>
            {selectedStudent ? (
              <div className="flex items-center justify-between p-2 bg-primary/5 border border-primary/20 rounded-md">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedStudent.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedStudent.admNo} ·
                    {CLASS_LEVELS.find(
                      (c) => c.value === selectedStudent.classLevel,
                    )?.label ?? selectedStudent.classLevel}
                  </p>
                  {recipientPhone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-2.5 w-2.5" />
                      {recipientPhone}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedStudent(null);
                    setSearchQuery("");
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  id="student-search"
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search by name or Adm. No."
                  data-ocid="compose.student_search"
                  className="h-8 text-sm"
                />
                {showDropdown && matchingStudents.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-[9999] w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
                  >
                    {matchingStudents.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-muted flex items-center justify-between text-sm"
                        onMouseDown={() => {
                          setSelectedStudent(s);
                          setSearchQuery("");
                          setShowDropdown(false);
                        }}
                      >
                        <span className="font-medium">{s.fullName}</span>
                        <span className="text-xs text-muted-foreground">
                          {s.admNo}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Class selector */}
        {(recipientType === "class" || recipientType === "section") && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
              Class
            </Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger
                className="h-8 text-sm"
                data-ocid="compose.class_select"
              >
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent className="z-[9999] max-h-64 overflow-y-auto">
                {CLASS_LEVELS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Section selector */}
        {recipientType === "section" && selectedClass && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
              Section
            </Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger
                className="h-8 text-sm"
                data-ocid="compose.section_select"
              >
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {availableSections.length > 0 ? (
                  availableSections.map((sec) => (
                    <SelectItem key={sec} value={sec}>
                      {sec}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="A">A</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Channel */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
            Channel
          </Label>
          <div className="flex gap-1.5">
            {CHANNEL_OPTS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setChannel(opt.value)}
                data-ocid={`compose.channel.${opt.value.toLowerCase().replace(/[^a-z]/g, "_")}`}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                  channel === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:bg-muted"
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
            Template
          </Label>
          <Select value={templateKey} onValueChange={onTemplateChange}>
            <SelectTrigger
              className="h-8 text-sm"
              data-ocid="compose.template_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {Object.entries(TEMPLATE_LABELS).map(([k, label]) => (
                <SelectItem key={k} value={k}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
              Message
            </Label>
            <span
              className={`text-xs ${message.length > 1000 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {message.length}/1000
            </span>
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message... Use {student_name}, {class}, {amount}, {date} as placeholders"
            rows={5}
            maxLength={1000}
            data-ocid="compose.message_textarea"
            className="text-sm resize-none"
          />
          {/* Preview with highlighted placeholders */}
          {message && (
            <div className="text-xs p-2 bg-muted/40 rounded border border-border leading-relaxed">
              {highlightPlaceholders(message)}
            </div>
          )}
        </div>

        {/* Recipient preview */}
        {buildRecipientLabel() && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs">To:</span>
            <Badge variant="secondary" className="text-xs">
              {buildRecipientLabel()}
            </Badge>
          </div>
        )}

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!isReady || sendMsg.isPending}
          className="w-full"
          data-ocid="compose.send_button"
        >
          <Send className="h-4 w-4 mr-2" />
          {sendMsg.isPending ? "Sending…" : "Send Message"}
        </Button>
      </CardContent>
    </Card>
  );
}
