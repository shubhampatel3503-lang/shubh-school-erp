import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { FrontendChatMessage, FrontendChatRoom } from "@/hooks/useBackend";
import {
  useCreateChatRoom,
  useGetChatMessages,
  useGetChatRooms,
  useGetSections,
  useRoutes,
  useSendChatMessage,
} from "@/hooks/useBackend";
import { getInitials } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Hash,
  Info,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ns: bigint | string | number): string {
  const ms =
    typeof ns === "bigint" ? Number(ns) / 1_000_000 : Number(ns) / 1_000_000;
  const d = new Date(ms);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

const ROOM_TYPE_ICON: Record<FrontendChatRoom["roomType"], typeof Hash> = {
  Direct: Phone,
  General: Users,
  ClassGroup: Hash,
  RouteGroup: MessageSquare,
};

const ROOM_TYPE_COLOR: Record<FrontendChatRoom["roomType"], string> = {
  Direct: "bg-primary/10 text-primary",
  General: "bg-accent/20 text-accent-foreground",
  ClassGroup: "bg-emerald-100 text-emerald-700",
  RouteGroup: "bg-orange-100 text-orange-700",
};

const ROOM_TYPE_LABEL: Record<FrontendChatRoom["roomType"], string> = {
  ClassGroup: "Class Groups",
  RouteGroup: "Route Groups",
  Direct: "Direct Messages",
  General: "General",
};

const SECTION_ORDER = [
  "PlayWay",
  "LKG",
  "UKG",
  ...Array.from({ length: 12 }, (_, i) => `Class${i + 1}`),
];

// ─── Group Info Panel ─────────────────────────────────────────────────────────
function GroupInfoPanel({
  room,
  onClose,
}: { room: FrontendChatRoom; onClose: () => void }) {
  return (
    <div
      className="w-72 border-l border-border bg-card flex flex-col"
      data-ocid="chat.group_info.panel"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Group Info</h3>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={onClose}
          data-ocid="chat.group_info.close_button"
        >
          <X className="size-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">
              {getInitials(room.name)}
            </span>
          </div>
          <h4 className="font-semibold text-foreground">{room.name}</h4>
          <Badge variant="secondary">{room.roomType}</Badge>
        </div>
        <div className="mt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            {room.members.length} Members
          </p>
          {room.members.map((m, i) => (
            <div
              key={m}
              className="flex items-center gap-2 py-2 border-b border-border/50"
              data-ocid={`chat.member.item.${i + 1}`}
            >
              <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground">
                  {m.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-foreground capitalize">{m}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Room List Section ────────────────────────────────────────────────────────
function RoomSection({
  label,
  rooms,
  activeRoomId,
  onSelect,
}: {
  label: string;
  rooms: FrontendChatRoom[];
  activeRoomId: string | null;
  onSelect: (id: string) => void;
}) {
  if (rooms.length === 0) return null;
  return (
    <div>
      <p className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30">
        {label}
      </p>
      {rooms.map((room, idx) => {
        const Icon = ROOM_TYPE_ICON[room.roomType];
        return (
          <button
            type="button"
            key={room.id}
            onClick={() => onSelect(room.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border/30 ${
              activeRoomId === room.id
                ? "bg-primary/8 border-l-2 border-l-primary"
                : ""
            }`}
            data-ocid={`chat.room.item.${idx + 1}`}
          >
            <div
              className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${ROOM_TYPE_COLOR[room.roomType]}`}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground truncate block">
                {room.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {room.members.length} members
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({
  msg,
  currentUser,
}: { msg: FrontendChatMessage; currentUser: string }) {
  const isMine = msg.senderId === currentUser || msg.senderId === "admin";
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[72%] ${isMine ? "" : "flex gap-2"}`}>
        {!isMine && (
          <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-primary">
              {getInitials(msg.senderId)}
            </span>
          </div>
        )}
        <div>
          {!isMine && (
            <p className="text-xs font-semibold text-primary mb-1">
              {msg.senderId}
            </p>
          )}
          <div
            className={`px-3 py-2 rounded-2xl text-sm ${
              isMine
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-card text-foreground border border-border rounded-tl-sm"
            }`}
          >
            {msg.content}
          </div>
          <p
            className={`text-xs text-muted-foreground mt-1 ${
              isMine ? "text-right" : ""
            }`}
          >
            {formatTime(msg.sentAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Auto-Group Initialization ─────────────────────────────────────────────────
function useEnsureSchoolGroups(
  rooms: FrontendChatRoom[],
  roomsLoaded: boolean,
) {
  const { data: sections = [] } = useGetSections();
  const { data: routes = [] } = useRoutes();
  const createRoom = useCreateChatRoom();
  const qc = useQueryClient();
  const ensuredRef = useRef(false);

  useEffect(() => {
    if (!roomsLoaded || ensuredRef.current) return;
    if (sections.length === 0 && routes.length === 0) return;

    ensuredRef.current = true;

    async function ensureGroups() {
      const roomNames = new Set(rooms.map((r) => r.name.toLowerCase()));

      // Create ClassGroup rooms for each section that doesn't exist
      for (const section of sections) {
        const label = `Class ${section.classLevel.replace("Class", "")} ${section.name}`;
        const normName = label.toLowerCase();
        if (!roomNames.has(normName)) {
          try {
            await createRoom.mutateAsync({
              name: label,
              roomType: "ClassGroup",
              members: [],
              createdBy: "system",
            });
          } catch {
            // Room may already exist — ignore
          }
        }
      }

      // Create RouteGroup rooms for each route that doesn't exist
      for (const route of routes) {
        const normName = route.name.toLowerCase();
        if (!roomNames.has(normName)) {
          try {
            await createRoom.mutateAsync({
              name: route.name,
              roomType: "RouteGroup",
              members: [],
              createdBy: "system",
            });
          } catch {
            // Room may already exist — ignore
          }
        }
      }

      qc.invalidateQueries({ queryKey: ["chatRooms"] });
    }

    ensureGroups();
  }, [roomsLoaded, sections, routes, rooms, createRoom, qc]);
}

// ─── Messages Panel ────────────────────────────────────────────────────────────
function MessagesPanel({
  room,
  currentUser,
  onBack,
  onToggleInfo,
}: {
  room: FrontendChatRoom;
  currentUser: string;
  onBack: () => void;
  onToggleInfo: () => void;
}) {
  const {
    data: messages = [],
    isLoading,
    isError,
    refetch,
  } = useGetChatMessages(room.id);
  const sendMsg = useSendChatMessage();
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const id = setInterval(() => refetch(), 10_000);
    return () => clearInterval(id);
  }, [refetch]);

  // Scroll to bottom when messages change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll-to-bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    sendMsg.mutate({
      roomId: room.id,
      senderId: currentUser,
      content: trimmed,
    });
    setInputText("");
  }

  const Icon = ROOM_TYPE_ICON[room.roomType];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="md:hidden"
          onClick={onBack}
          data-ocid="chat.back_button"
        >
          <X className="size-4" />
        </Button>
        <div
          className={`size-9 rounded-full flex items-center justify-center ${ROOM_TYPE_COLOR[room.roomType]}`}
        >
          <Icon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{room.name}</p>
          <p className="text-xs text-muted-foreground">
            {room.members.length} members
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={onToggleInfo}
          data-ocid="chat.group_info.open_modal_button"
        >
          <Info className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 bg-muted/20 p-4">
        <div className="space-y-3 max-w-3xl mx-auto">
          {isLoading && (
            <div className="space-y-3" data-ocid="chat.messages.loading_state">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-end" : ""}`}
                >
                  <Skeleton className="h-10 w-48 rounded-2xl" />
                </div>
              ))}
            </div>
          )}
          {isError && (
            <div
              className="flex flex-col items-center gap-2 py-8 text-center"
              data-ocid="chat.messages.error_state"
            >
              <AlertCircle className="size-8 text-destructive/60" />
              <p className="text-sm text-muted-foreground">
                Could not load messages.
              </p>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => refetch()}
                data-ocid="chat.messages.retry_button"
              >
                <RefreshCw className="size-3 mr-1" /> Retry
              </Button>
            </div>
          )}
          {!isLoading && !isError && messages.length === 0 && (
            <div
              className="flex flex-col items-center gap-2 py-12 text-center"
              data-ocid="chat.messages.empty_state"
            >
              <MessageSquare className="size-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
          {!isLoading &&
            messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} currentUser={currentUser} />
            ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-muted/30"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            data-ocid="chat.message_input"
          />
          <Button
            size="icon"
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() || sendMsg.isPending}
            data-ocid="chat.send_button"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const {
    data: rooms = [],
    isLoading: roomsLoading,
    isError: roomsError,
    refetch: refetchRooms,
  } = useGetChatRooms();

  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  // Ensure school-based groups are created on load
  useEnsureSchoolGroups(rooms, !roomsLoading);

  // Auto-select first room when rooms load
  useEffect(() => {
    if (!activeRoomId && rooms.length > 0) {
      setActiveRoomId(rooms[0].id);
    }
  }, [rooms, activeRoomId]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? null;

  // Group rooms by type in display order
  const grouped: Record<FrontendChatRoom["roomType"], FrontendChatRoom[]> = {
    ClassGroup: [],
    RouteGroup: [],
    Direct: [],
    General: [],
  };
  for (const r of rooms) {
    const q = search.trim().toLowerCase();
    if (!q || r.name.toLowerCase().includes(q)) {
      grouped[r.roomType].push(r);
    }
  }

  // Sort ClassGroups by school class order
  grouped.ClassGroup.sort((a, b) => {
    const ai = SECTION_ORDER.findIndex((cl) =>
      a.name.toLowerCase().includes(cl.toLowerCase()),
    );
    const bi = SECTION_ORDER.findIndex((cl) =>
      b.name.toLowerCase().includes(cl.toLowerCase()),
    );
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const currentUser = "admin";

  function selectRoom(id: string) {
    setActiveRoomId(id);
    setShowInfo(false);
    setMobileView("chat");
  }

  return (
    <div
      className="flex h-[calc(100vh-4rem)] overflow-hidden"
      data-ocid="chat.page"
    >
      {/* Room List Sidebar */}
      <div
        className={`w-full md:w-80 flex-shrink-0 border-r border-border bg-card flex flex-col ${
          mobileView === "chat" ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-border space-y-3">
          <h2 className="font-display font-bold text-foreground">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="pl-8 h-9 bg-muted/30"
              data-ocid="chat.search_input"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {roomsLoading && (
            <div className="p-4 space-y-3" data-ocid="chat.rooms.loading_state">
              <p className="text-xs text-center text-muted-foreground font-medium">
                Setting up your school groups...
              </p>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {roomsError && (
            <div
              className="p-4 flex flex-col items-center gap-2 text-center"
              data-ocid="chat.rooms.error_state"
            >
              <AlertCircle className="size-6 text-destructive/60" />
              <p className="text-xs text-muted-foreground">
                Could not load chats.
              </p>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => refetchRooms()}
                data-ocid="chat.rooms.retry_button"
              >
                <RefreshCw className="size-3 mr-1" /> Retry
              </Button>
            </div>
          )}
          {!roomsLoading && !roomsError && (
            <>
              {(
                [
                  "ClassGroup",
                  "RouteGroup",
                  "Direct",
                  "General",
                ] as FrontendChatRoom["roomType"][]
              ).map((type) => (
                <RoomSection
                  key={type}
                  label={ROOM_TYPE_LABEL[type]}
                  rooms={grouped[type]}
                  activeRoomId={activeRoomId}
                  onSelect={selectRoom}
                />
              ))}
              {rooms.length === 0 && (
                <div
                  className="flex flex-col items-center gap-2 p-8 text-center"
                  data-ocid="chat.rooms.empty_state"
                >
                  <MessageSquare className="size-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    No chat rooms yet. Add classes or routes to create groups.
                  </p>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex min-w-0 ${
          mobileView === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {activeRoom ? (
          <MessagesPanel
            room={activeRoom}
            currentUser={currentUser}
            onBack={() => setMobileView("list")}
            onToggleInfo={() => setShowInfo((v) => !v)}
          />
        ) : (
          <div
            className="flex-1 flex items-center justify-center bg-muted/20"
            data-ocid="chat.no_selection.empty_state"
          >
            <div className="text-center">
              <MessageSquare className="size-16 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}

        {/* Group Info Panel */}
        {showInfo && activeRoom && (
          <GroupInfoPanel
            room={activeRoom}
            onClose={() => setShowInfo(false)}
          />
        )}
      </div>
    </div>
  );
}
