import { ae as createLucideIcon, ax as useGetChatRooms, r as reactExports, j as jsxRuntimeExports, I as Input, O as ScrollArea, S as Skeleton, e as Button, P as MessageSquare, u as useGetSections, a6 as useRoutes, ay as useCreateChatRoom, ao as useQueryClient, U as Users, $ as Phone, az as useGetChatMessages, aA as useSendChatMessage, X, Z as getInitials, t as Badge } from "./index-pMBTUEbj.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import { C as CircleAlert } from "./circle-alert-5rCM7BJk.js";
import { R as RefreshCw } from "./refresh-cw-BgXF1ld8.js";
import { I as Info } from "./info-CUpF_eRC.js";
import { S as Send } from "./send-ByllD6tM.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
];
const Hash = createLucideIcon("hash", __iconNode);
function formatTime(ns) {
  const ms = typeof ns === "bigint" ? Number(ns) / 1e6 : Number(ns) / 1e6;
  const d = new Date(ms);
  const today = /* @__PURE__ */ new Date();
  if (d.toDateString() === today.toDateString()) {
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
const ROOM_TYPE_ICON = {
  Direct: Phone,
  General: Users,
  ClassGroup: Hash,
  RouteGroup: MessageSquare
};
const ROOM_TYPE_COLOR = {
  Direct: "bg-primary/10 text-primary",
  General: "bg-accent/20 text-accent-foreground",
  ClassGroup: "bg-emerald-100 text-emerald-700",
  RouteGroup: "bg-orange-100 text-orange-700"
};
const ROOM_TYPE_LABEL = {
  ClassGroup: "Class Groups",
  RouteGroup: "Route Groups",
  Direct: "Direct Messages",
  General: "General"
};
const SECTION_ORDER = [
  "PlayWay",
  "LKG",
  "UKG",
  ...Array.from({ length: 12 }, (_, i) => `Class${i + 1}`)
];
function GroupInfoPanel({
  room,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-72 border-l border-border bg-card flex flex-col",
      "data-ocid": "chat.group_info.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Group Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              type: "button",
              onClick: onClose,
              "data-ocid": "chat.group_info.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollArea, { className: "flex-1 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-primary", children: getInitials(room.name) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-foreground", children: room.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: room.roomType })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase mb-2", children: [
              room.members.length,
              " Members"
            ] }),
            room.members.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 py-2 border-b border-border/50",
                "data-ocid": `chat.member.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: m.slice(0, 2).toUpperCase() }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground capitalize", children: m })
                ]
              },
              m
            ))
          ] })
        ] })
      ]
    }
  );
}
function RoomSection({
  label,
  rooms,
  activeRoomId,
  onSelect
}) {
  if (rooms.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30", children: label }),
    rooms.map((room, idx) => {
      const Icon = ROOM_TYPE_ICON[room.roomType];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelect(room.id),
          className: `w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border/30 ${activeRoomId === room.id ? "bg-primary/8 border-l-2 border-l-primary" : ""}`,
          "data-ocid": `chat.room.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `size-10 rounded-full flex items-center justify-center flex-shrink-0 ${ROOM_TYPE_COLOR[room.roomType]}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate block", children: room.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                room.members.length,
                " members"
              ] })
            ] })
          ]
        },
        room.id
      );
    })
  ] });
}
function MessageBubble({
  msg,
  currentUser
}) {
  const isMine = msg.senderId === currentUser || msg.senderId === "admin";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${isMine ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[72%] ${isMine ? "" : "flex gap-2"}`, children: [
    !isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary", children: getInitials(msg.senderId) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      !isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary mb-1", children: msg.senderId }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `px-3 py-2 rounded-2xl text-sm ${isMine ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card text-foreground border border-border rounded-tl-sm"}`,
          children: msg.content
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `text-xs text-muted-foreground mt-1 ${isMine ? "text-right" : ""}`,
          children: formatTime(msg.sentAt)
        }
      )
    ] })
  ] }) });
}
function useEnsureSchoolGroups(rooms, roomsLoaded) {
  const { data: sections = [] } = useGetSections();
  const { data: routes = [] } = useRoutes();
  const createRoom = useCreateChatRoom();
  const qc = useQueryClient();
  const ensuredRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!roomsLoaded || ensuredRef.current) return;
    if (sections.length === 0 && routes.length === 0) return;
    ensuredRef.current = true;
    async function ensureGroups() {
      const roomNames = new Set(rooms.map((r) => r.name.toLowerCase()));
      for (const section of sections) {
        const label = `Class ${section.classLevel.replace("Class", "")} ${section.name}`;
        const normName = label.toLowerCase();
        if (!roomNames.has(normName)) {
          try {
            await createRoom.mutateAsync({
              name: label,
              roomType: "ClassGroup",
              members: [],
              createdBy: "system"
            });
          } catch {
          }
        }
      }
      for (const route of routes) {
        const normName = route.name.toLowerCase();
        if (!roomNames.has(normName)) {
          try {
            await createRoom.mutateAsync({
              name: route.name,
              roomType: "RouteGroup",
              members: [],
              createdBy: "system"
            });
          } catch {
          }
        }
      }
      qc.invalidateQueries({ queryKey: ["chatRooms"] });
    }
    ensureGroups();
  }, [roomsLoaded, sections, routes, rooms, createRoom, qc]);
}
function MessagesPanel({
  room,
  currentUser,
  onBack,
  onToggleInfo
}) {
  const {
    data: messages = [],
    isLoading,
    isError,
    refetch
  } = useGetChatMessages(room.id);
  const sendMsg = useSendChatMessage();
  const [inputText, setInputText] = reactExports.useState("");
  const bottomRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const id = setInterval(() => refetch(), 1e4);
    return () => clearInterval(id);
  }, [refetch]);
  reactExports.useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  function handleSend() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    sendMsg.mutate({
      roomId: room.id,
      senderId: currentUser,
      content: trimmed
    });
    setInputText("");
  }
  const Icon = ROOM_TYPE_ICON[room.roomType];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          type: "button",
          className: "md:hidden",
          onClick: onBack,
          "data-ocid": "chat.back_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `size-9 rounded-full flex items-center justify-center ${ROOM_TYPE_COLOR[room.roomType]}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: room.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          room.members.length,
          " members"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          type: "button",
          onClick: onToggleInfo,
          "data-ocid": "chat.group_info.open_modal_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 bg-muted/20 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 max-w-3xl mx-auto", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "chat.messages.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex ${i % 2 === 0 ? "justify-end" : ""}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-48 rounded-2xl" })
        },
        i
      )) }),
      isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-2 py-8 text-center",
          "data-ocid": "chat.messages.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-8 text-destructive/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Could not load messages." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                type: "button",
                onClick: () => refetch(),
                "data-ocid": "chat.messages.retry_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3 mr-1" }),
                  " Retry"
                ]
              }
            )
          ]
        }
      ),
      !isLoading && !isError && messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-2 py-12 text-center",
          "data-ocid": "chat.messages.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-10 text-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No messages yet. Start the conversation!" })
          ]
        }
      ),
      !isLoading && messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(MessageBubble, { msg, currentUser }, msg.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: inputText,
          onChange: (e) => setInputText(e.target.value),
          placeholder: "Type a message...",
          className: "flex-1 bg-muted/30",
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          },
          "data-ocid": "chat.message_input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          type: "button",
          onClick: handleSend,
          disabled: !inputText.trim() || sendMsg.isPending,
          "data-ocid": "chat.send_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" })
        }
      )
    ] }) })
  ] });
}
function ChatPage() {
  const {
    data: rooms = [],
    isLoading: roomsLoading,
    isError: roomsError,
    refetch: refetchRooms
  } = useGetChatRooms();
  const [activeRoomId, setActiveRoomId] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [showInfo, setShowInfo] = reactExports.useState(false);
  const [mobileView, setMobileView] = reactExports.useState("list");
  useEnsureSchoolGroups(rooms, !roomsLoading);
  reactExports.useEffect(() => {
    if (!activeRoomId && rooms.length > 0) {
      setActiveRoomId(rooms[0].id);
    }
  }, [rooms, activeRoomId]);
  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? null;
  const grouped = {
    ClassGroup: [],
    RouteGroup: [],
    Direct: [],
    General: []
  };
  for (const r of rooms) {
    const q = search.trim().toLowerCase();
    if (!q || r.name.toLowerCase().includes(q)) {
      grouped[r.roomType].push(r);
    }
  }
  grouped.ClassGroup.sort((a, b) => {
    const ai = SECTION_ORDER.findIndex(
      (cl) => a.name.toLowerCase().includes(cl.toLowerCase())
    );
    const bi = SECTION_ORDER.findIndex(
      (cl) => b.name.toLowerCase().includes(cl.toLowerCase())
    );
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  const currentUser = "admin";
  function selectRoom(id) {
    setActiveRoomId(id);
    setShowInfo(false);
    setMobileView("chat");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-[calc(100vh-4rem)] overflow-hidden",
      "data-ocid": "chat.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `w-full md:w-80 flex-shrink-0 border-r border-border bg-card flex flex-col ${mobileView === "chat" ? "hidden md:flex" : "flex"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground", children: "Messages" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      placeholder: "Search chats...",
                      className: "pl-8 h-9 bg-muted/30",
                      "data-ocid": "chat.search_input"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollArea, { className: "flex-1", children: [
                roomsLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", "data-ocid": "chat.rooms.loading_state", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground font-medium", children: "Setting up your school groups..." }),
                  [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "size-10 rounded-full" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
                    ] })
                  ] }, i))
                ] }),
                roomsError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "p-4 flex flex-col items-center gap-2 text-center",
                    "data-ocid": "chat.rooms.error_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-6 text-destructive/60" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Could not load chats." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          type: "button",
                          onClick: () => refetchRooms(),
                          "data-ocid": "chat.rooms.retry_button",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3 mr-1" }),
                            " Retry"
                          ]
                        }
                      )
                    ]
                  }
                ),
                !roomsLoading && !roomsError && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  [
                    "ClassGroup",
                    "RouteGroup",
                    "Direct",
                    "General"
                  ].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RoomSection,
                    {
                      label: ROOM_TYPE_LABEL[type],
                      rooms: grouped[type],
                      activeRoomId,
                      onSelect: selectRoom
                    },
                    type
                  )),
                  rooms.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex flex-col items-center gap-2 p-8 text-center",
                      "data-ocid": "chat.rooms.empty_state",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-10 text-muted-foreground/30" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No chat rooms yet. Add classes or routes to create groups." })
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex-1 flex min-w-0 ${mobileView === "list" ? "hidden md:flex" : "flex"}`,
            children: [
              activeRoom ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                MessagesPanel,
                {
                  room: activeRoom,
                  currentUser,
                  onBack: () => setMobileView("list"),
                  onToggleInfo: () => setShowInfo((v) => !v)
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 flex items-center justify-center bg-muted/20",
                  "data-ocid": "chat.no_selection.empty_state",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-16 mx-auto text-muted-foreground/30 mb-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "Select a conversation to start chatting" })
                  ] })
                }
              ),
              showInfo && activeRoom && /* @__PURE__ */ jsxRuntimeExports.jsx(
                GroupInfoPanel,
                {
                  room: activeRoom,
                  onClose: () => setShowInfo(false)
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  ChatPage as default
};
