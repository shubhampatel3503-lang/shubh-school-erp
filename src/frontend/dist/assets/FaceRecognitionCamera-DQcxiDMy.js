import { ae as createLucideIcon, r as reactExports, af as MotionConfigContext, j as jsxRuntimeExports, ag as isHTMLElement, ah as useConstant, ai as PresenceContext, aj as usePresence, ak as useIsomorphicLayoutEffect, al as LayoutGroupContext, am as useQuery, an as useMutation, ac as __vitePreload, ao as useQueryClient, a3 as useActor, ad as createActor, l as LoaderCircle, e as Button, U as Users, O as ScrollArea, a9 as motion, Z as getInitials, a7 as getClassLabel, ap as Bus } from "./index-pMBTUEbj.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-r-j30wiQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as TriangleAlert } from "./triangle-alert-Ai_hY88N.js";
import { R as RefreshCw } from "./refresh-cw-BgXF1ld8.js";
import { C as Camera } from "./camera-owTlFa42.js";
import { S as ScanFace } from "./scan-face-CGhu3Srl.js";
import { C as CircleCheckBig } from "./circle-check-big-DCQRnxmS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const MODEL_BASE = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model";
let modelLoadPromise = null;
let modelsLoaded = false;
async function ensureModelsLoaded() {
  if (modelsLoaded) return;
  if (modelLoadPromise) return modelLoadPromise;
  modelLoadPromise = (async () => {
    const faceapi = await __vitePreload(() => import("./face-api.esm-DrfIR0ne.js"), true ? [] : void 0);
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_BASE),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_BASE)
    ]);
    modelsLoaded = true;
  })();
  return modelLoadPromise;
}
async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}
async function computeDescriptor(photoUrl) {
  try {
    const faceapi = await __vitePreload(() => import("./face-api.esm-DrfIR0ne.js"), true ? [] : void 0);
    const img = await loadImage(photoUrl);
    const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    return (detection == null ? void 0 : detection.descriptor) ?? null;
  } catch {
    return null;
  }
}
function useFaceApiModels() {
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState(null);
  const load = reactExports.useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      await ensureModelsLoaded();
      setStatus("ready");
    } catch (e) {
      modelsLoaded = false;
      modelLoadPromise = null;
      const msg = e instanceof Error ? e.message : "Failed to load face recognition models";
      setError(msg);
      setStatus("error");
    }
  }, []);
  return { status, error, load };
}
function useBackendActor() {
  return useActor(createActor);
}
function useGetFaceEnrolledStudents() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["faceEnrolledStudents"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw = await actor.getFaceEnrolledStudents();
        return raw.filter((r) => r.faceEnrolled && r.descriptorJson).map((r) => ({
          studentId: r.studentId,
          admNo: r.admNo,
          photoUrl: r.photoUrl ?? "",
          descriptorJson: r.descriptorJson ?? "",
          enrolledBy: r.enrolledBy,
          faceEnrolled: r.faceEnrolled
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 1e3,
    // 1 min — refresh after enrollment
    refetchOnWindowFocus: true
  });
}
function useEnrollStudentFace() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      admNo,
      enrolledBy,
      photoUrl,
      descriptorJson
    }) => {
      if (!actor) throw new Error("Backend not available.");
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const result = await actor.enrollStudentFace(
        studentId,
        admNo,
        enrolledBy,
        photoUrl || null,
        descriptorJson,
        today
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faceEnrolledStudents"] })
  });
}
function useRevokeStudentFace() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (studentId) => {
      if (!actor) throw new Error("Backend not available.");
      const result = await actor.revokeStudentFaceEnrollment(studentId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faceEnrolledStudents"] })
  });
}
function useMarkFaceAttendance() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      studentId,
      studentName,
      classLevel,
      section,
      confidence
    }) => {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      if (!actor) {
        const key = `face_att_backend_${today}`;
        const existing = JSON.parse(
          localStorage.getItem(key) ?? "[]"
        );
        existing.push({ studentId, time });
        localStorage.setItem(key, JSON.stringify(existing));
        return;
      }
      try {
        const result = await actor.markFaceAttendance(
          studentId,
          studentName,
          classLevel,
          section,
          today,
          time,
          confidence
        );
        if (result.__kind__ === "err") throw new Error(result.err);
      } catch (e) {
        throw e instanceof Error ? e : new Error("Failed to mark attendance");
      }
    }
  });
}
function useDescriptorLoader(enrolledStudents, studentInfoMap) {
  const [descriptors, setDescriptors] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const load = reactExports.useCallback(async () => {
    if (!enrolledStudents.length) return;
    setLoading(true);
    setProgress(0);
    const results = [];
    for (let i = 0; i < enrolledStudents.length; i++) {
      const { studentId, photoUrl, descriptorJson } = enrolledStudents[i];
      let descriptor = null;
      if (descriptorJson) {
        try {
          const arr = JSON.parse(descriptorJson);
          if (Array.isArray(arr) && arr.length === 128) {
            descriptor = new Float32Array(arr);
          }
        } catch {
        }
      }
      if (!descriptor && photoUrl) {
        descriptor = await computeDescriptor(photoUrl);
      }
      if (descriptor) {
        const info = studentInfoMap.get(studentId);
        results.push({
          studentId,
          admNo: (info == null ? void 0 : info.admNo) ?? "",
          studentName: (info == null ? void 0 : info.name) ?? studentId,
          fatherName: (info == null ? void 0 : info.fatherName) ?? "",
          classLevel: (info == null ? void 0 : info.classLevel) ?? "",
          section: (info == null ? void 0 : info.section) ?? "",
          routeName: (info == null ? void 0 : info.routeName) ?? "",
          photoUrl: (info == null ? void 0 : info.photoUrl) ?? photoUrl,
          descriptor
        });
      }
      setProgress(Math.round((i + 1) / enrolledStudents.length * 100));
    }
    setDescriptors(results);
    setLoading(false);
  }, [enrolledStudents, studentInfoMap]);
  return { descriptors, loading, progress, load };
}
function useRecognitionLoop(videoRef, descriptors, markedIds, active, onMatch) {
  const intervalRef = reactExports.useRef(null);
  const processingRef = reactExports.useRef(false);
  const runOnce = reactExports.useCallback(async () => {
    if (processingRef.current) return;
    if (!videoRef.current || descriptors.length === 0) return;
    const video = videoRef.current;
    if (video.readyState < 2) return;
    processingRef.current = true;
    try {
      const faceapi = await __vitePreload(() => import("./face-api.esm-DrfIR0ne.js"), true ? [] : void 0);
      const detection = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 })
      ).withFaceLandmarks().withFaceDescriptor();
      if (!detection) return;
      const unmatched = descriptors.filter((d) => !markedIds.has(d.studentId));
      if (unmatched.length === 0) return;
      const matcher = new faceapi.FaceMatcher(
        unmatched.map(
          (d) => new faceapi.LabeledFaceDescriptors(d.studentId, [d.descriptor])
        ),
        0.55
        // max distance threshold
      );
      const best = matcher.findBestMatch(detection.descriptor);
      if (best.label !== "unknown") {
        const confidence = Math.max(0, 1 - best.distance);
        const enrolled = descriptors.find((d) => d.studentId === best.label);
        if (enrolled) {
          const now = /* @__PURE__ */ new Date();
          const timestamp = now.toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          });
          onMatch({
            studentId: enrolled.studentId,
            admNo: enrolled.admNo,
            studentName: enrolled.studentName,
            fatherName: enrolled.fatherName,
            classLevel: enrolled.classLevel,
            section: enrolled.section,
            routeName: enrolled.routeName,
            photoUrl: enrolled.photoUrl,
            confidence,
            timestamp
          });
        }
      }
    } catch {
    } finally {
      processingRef.current = false;
    }
  }, [videoRef, descriptors, markedIds, onMatch]);
  reactExports.useEffect(() => {
    if (!active || descriptors.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(runOnce, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, descriptors, runOnce]);
}
function AttendancePopup({
  match,
  onClose,
  deviceLabel = "Face"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 flex items-center justify-center p-4",
      style: { zIndex: 9999, background: "rgba(0,0,0,0.82)" },
      "data-ocid": "attendance.popup",
      onClick: onClose,
      onKeyUp: (e) => e.key === "Escape" && onClose(),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.75, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.85, opacity: 0 },
          transition: { type: "spring", stiffness: 380, damping: 28 },
          className: "bg-card rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden border-4 border-emerald-500",
          "data-ocid": "attendance.popup_card",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-500 px-5 py-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-white" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold text-base tracking-wide", children: "Attendance Marked ✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-emerald-100 text-xs font-medium", children: deviceLabel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-5 flex flex-col items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                match.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: match.photoUrl,
                    alt: match.studentName,
                    className: "w-[150px] h-[150px] rounded-2xl object-cover border-4 border-emerald-400 shadow-lg"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[150px] h-[150px] rounded-2xl bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl font-bold text-emerald-700", children: getInitials(match.studentName) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-white" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full text-center space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-2xl font-bold text-emerald-600 leading-tight",
                    "data-ocid": "attendance.popup_name",
                    children: match.studentName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-sm font-bold text-foreground tracking-wider",
                    "data-ocid": "attendance.popup_admno",
                    children: [
                      "ADM: ",
                      match.admNo
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-xl p-2.5 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5", children: "Father" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-xs truncate", children: match.fatherName || "—" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-xl p-2.5 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5", children: "Class" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-xs", children: [
                    getClassLabel(match.classLevel),
                    " —",
                    " ",
                    match.section
                  ] })
                ] }),
                match.routeName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 bg-sky-50 border border-sky-200 rounded-xl p-2.5 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { className: "w-4 h-4 text-sky-600 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-sky-700 uppercase tracking-wide", children: "Route" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sky-800 text-xs", children: match.routeName })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: match.timestamp }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "Tap anywhere to dismiss" })
            ] })
          ]
        }
      )
    }
  );
}
function FaceRecognitionCamera({
  students,
  descriptors,
  descriptorLoading,
  descriptorProgress,
  modelStatus,
  modelError,
  onRetryModels,
  onMarkPresent,
  markedEntries,
  enrolledCount = 0,
  enrolledLoading = false
}) {
  const videoRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const [camStatus, setCamStatus] = reactExports.useState("idle");
  const [pendingMatch, setPendingMatch] = reactExports.useState(
    null
  );
  const [recognitionActive, setRecognitionActive] = reactExports.useState(false);
  const [manualStudentId, setManualStudentId] = reactExports.useState("");
  const popupTimerRef = reactExports.useRef(null);
  const markedIds = reactExports.useMemo(
    () => new Set(markedEntries.map((e) => e.studentId)),
    [markedEntries]
  );
  const startCamera = reactExports.useCallback(async () => {
    if (streamRef.current) return;
    setCamStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamStatus("active");
    } catch (err) {
      const e = err;
      setCamStatus(
        e.name === "NotAllowedError" || e.name === "PermissionDeniedError" ? "denied" : "error"
      );
    }
  }, []);
  const stopCamera = reactExports.useCallback(() => {
    var _a;
    for (const t of ((_a = streamRef.current) == null ? void 0 : _a.getTracks()) ?? []) t.stop();
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamStatus("idle");
    setRecognitionActive(false);
  }, []);
  reactExports.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, [startCamera, stopCamera]);
  reactExports.useEffect(() => {
    setRecognitionActive(
      camStatus === "active" && modelStatus === "ready" && descriptors.length > 0 && !descriptorLoading
    );
  }, [camStatus, modelStatus, descriptors.length, descriptorLoading]);
  const handleRecognitionMatch = reactExports.useCallback(
    (match) => {
      if (markedIds.has(match.studentId)) return;
      if (pendingMatch) return;
      onMarkPresent(match);
      setPendingMatch(match);
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      popupTimerRef.current = setTimeout(() => setPendingMatch(null), 3e3);
    },
    [markedIds, pendingMatch, onMarkPresent]
  );
  useRecognitionLoop(
    videoRef,
    descriptors,
    markedIds,
    recognitionActive,
    handleRecognitionMatch
  );
  const handleManualMark = () => {
    if (!manualStudentId) return;
    const student = students.find((s) => s.id === manualStudentId);
    if (!student) return;
    const now = /* @__PURE__ */ new Date();
    const timestamp = now.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    const match = {
      studentId: student.id,
      admNo: student.admNo,
      studentName: student.fullName,
      fatherName: student.fatherName,
      classLevel: student.classLevel,
      section: student.sectionId,
      routeName: "",
      photoUrl: student.photoUrl,
      confidence: 1,
      timestamp
    };
    onMarkPresent(match);
    setPendingMatch(match);
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => setPendingMatch(null), 3e3);
    setManualStudentId("");
  };
  const unmarkedStudents = students.filter((s) => !markedIds.has(s.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    (modelStatus === "loading" || descriptorLoading) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
      modelStatus === "loading" ? "Loading face recognition models…" : `Computing face descriptors… ${descriptorProgress}%`
    ] }),
    modelStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs",
        "data-ocid": "face.model_error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5" }),
            modelError ?? "Failed to load face recognition models"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "h-6 px-2 text-xs border-red-300 text-red-700",
              onClick: onRetryModels,
              "data-ocid": "face.model_retry_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1" }),
                " Retry"
              ]
            }
          )
        ]
      }
    ),
    modelStatus === "ready" && descriptors.length === 0 && !descriptorLoading && !enrolledLoading && enrolledCount === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5" }),
      'No enrolled students found. Enroll students first using the "Enroll Students" tab.'
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden bg-black aspect-video w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              ref: videoRef,
              autoPlay: true,
              playsInline: true,
              muted: true,
              className: "w-full h-full object-cover",
              "data-ocid": "face.camera_feed"
            }
          ),
          camStatus === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 text-white animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm", children: "Starting camera…" })
          ] }),
          camStatus === "denied" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-10 h-10 text-red-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-sm text-center", children: [
              "Camera permission denied.",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "Allow access in browser settings and refresh."
            ] })
          ] }),
          camStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-10 h-10 text-red-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm text-center", children: "Camera not available." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "text-white border-white",
                onClick: startCamera,
                "data-ocid": "face.camera_retry_button",
                children: "Retry"
              }
            )
          ] }),
          camStatus === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-10 h-10 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "text-white border-white",
                onClick: startCamera,
                "data-ocid": "face.camera_start_button",
                children: "Start Camera"
              }
            )
          ] }),
          camStatus === "active" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-violet-400 rounded-tl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-violet-400 rounded-tr" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-violet-400 rounded-bl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-violet-400 rounded-br" }),
            recognitionActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 rounded-full px-3 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-medium", children: "Auto-scanning…" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `w-2 h-2 rounded-full ${camStatus === "active" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: camStatus === "active" ? "Camera active" : "Camera off" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "w-3.5 h-3.5 text-violet-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              descriptors.length,
              " faces enrolled"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "ml-auto h-7 px-2.5 text-xs gap-1",
              onClick: camStatus === "active" ? stopCamera : startCamera,
              "data-ocid": "face.camera_toggle_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3 h-3" }),
                camStatus === "active" ? "Stop" : "Start",
                " Camera"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3.5 h-3.5" }),
            "Manual Fallback"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pb-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: manualStudentId,
                onValueChange: setManualStudentId,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "flex-1 text-sm",
                      "data-ocid": "face.manual_student_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select student to mark manually…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: unmarkedStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
                    s.admNo,
                    " — ",
                    s.fullName
                  ] }, s.id)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: handleManualMark,
                disabled: !manualStudentId,
                className: "gap-1.5 shrink-0",
                "data-ocid": "face.manual_mark_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
                  "Mark"
                ]
              }
            )
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-emerald-600" }),
          "Today's Attendance",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full", children: markedEntries.length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 flex-1 min-h-0", children: markedEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-12 text-muted-foreground",
            "data-ocid": "face.attendance_list_empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "w-8 h-8 mb-2 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center px-4", children: [
                "No students marked yet.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "Camera will auto-detect enrolled faces."
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: markedEntries.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 10 },
            animate: { opacity: 1, x: 0 },
            className: "flex items-center gap-2.5 px-4 py-2.5",
            "data-ocid": `face.attendance_entry.${i + 1}`,
            children: [
              entry.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: entry.photoUrl,
                  alt: entry.studentName,
                  className: "w-9 h-9 rounded-full object-cover border-2 border-emerald-300 shrink-0"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0", children: getInitials(entry.studentName) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate", children: entry.studentName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  entry.admNo,
                  " •",
                  " ",
                  getClassLabel(entry.classLevel),
                  " •",
                  " ",
                  entry.time
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-emerald-600 shrink-0" })
            ]
          },
          entry.studentId
        )) }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: pendingMatch && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttendancePopup,
      {
        match: pendingMatch,
        onClose: () => setPendingMatch(null),
        deviceLabel: "Face Recognition"
      }
    ) })
  ] });
}
export {
  AnimatePresence as A,
  FaceRecognitionCamera as F,
  UserCheck as U,
  AttendancePopup as a,
  useGetFaceEnrolledStudents as b,
  useDescriptorLoader as c,
  useEnrollStudentFace as d,
  useRevokeStudentFace as e,
  useMarkFaceAttendance as f,
  useFaceApiModels as u
};
