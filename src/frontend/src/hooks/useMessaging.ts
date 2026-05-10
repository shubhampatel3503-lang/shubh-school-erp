// ─── Messaging hooks — DirectMessage backend + WhatsApp via wacoder.in ────────
import { createActor } from "@/backend";
import type { DirectMessage } from "@/backend.d";
import type { backendInterface } from "@/backend.d";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useBackendActor() {
  return useActor<backendInterface>(createActor);
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DirectMessageFE {
  id: string;
  fromUsername: string;
  toStudentId: string | null;
  toClassLevel: string | null;
  toSection: string | null;
  channel: string;
  message: string;
  sentAt: string;
  deliveryStatus: string;
  templateKey: string | null;
  recipientLabel?: string;
}

export interface SendMessageParams {
  fromUsername: string;
  toStudentId: string | null;
  toClassLevel: string | null;
  toSection: string | null;
  channel: "WhatsApp" | "In-App" | "Both";
  message: string;
  templateKey: string | null;
  recipientPhone?: string;
  studentName?: string;
  whatsappApiKey?: string;
  whatsappApiUrl?: string;
}

function mapMsg(m: DirectMessage): DirectMessageFE {
  return {
    id: m.id,
    fromUsername: m.fromUsername,
    toStudentId: m.toStudentId ?? null,
    toClassLevel: m.toClassLevel ?? null,
    toSection: m.toSection ?? null,
    channel: m.channel,
    message: m.message,
    sentAt: m.sentAt,
    deliveryStatus: m.deliveryStatus,
    templateKey: m.templateKey ?? null,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useDirectMessages(limit = 100) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DirectMessageFE[]>({
    queryKey: ["directMessages", limit],
    queryFn: async (): Promise<DirectMessageFE[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getDirectMessages(BigInt(limit));
        return raw.map(mapMsg);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useDirectMessagesByStudent(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DirectMessageFE[]>({
    queryKey: ["directMessages", "student", studentId],
    queryFn: async (): Promise<DirectMessageFE[]> => {
      if (!actor || !studentId) return [];
      try {
        const raw = await actor.getDirectMessagesByRecipient(studentId);
        return raw.map(mapMsg);
      } catch {
        return [];
      }
    },
    enabled: !!studentId && !isFetching,
  });
}

export function useMessageTemplates() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Record<string, string>>({
    queryKey: ["messageTemplates"],
    queryFn: async (): Promise<Record<string, string>> => {
      if (!actor) return defaultTemplates;
      try {
        const raw = await actor.getMessageTemplates();
        if (!Array.isArray(raw) || raw.length === 0) return defaultTemplates;
        return Object.fromEntries(raw as [string, string][]);
      } catch {
        return defaultTemplates;
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60_000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useSendDirectMessage() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: SendMessageParams): Promise<DirectMessageFE> => {
      if (!actor) throw new Error("Backend not available. Please try again.");

      // Build DirectMessage object for backend
      const now = new Date().toISOString();
      const msgId = `msg-${Date.now()}`;
      const backendMsg: DirectMessage = {
        id: msgId,
        fromUsername: params.fromUsername,
        toStudentId: params.toStudentId ?? undefined,
        toClassLevel: params.toClassLevel ?? undefined,
        toSection: params.toSection ?? undefined,
        channel: params.channel,
        message: params.message,
        sentAt: now,
        deliveryStatus: "pending",
        templateKey: params.templateKey ?? undefined,
      };

      // 1. Save to backend
      const saved = await actor.sendDirectMessage(backendMsg);
      const fe = mapMsg(saved);

      // 2. WhatsApp via wacoder.in
      const shouldWA =
        params.channel === "WhatsApp" || params.channel === "Both";
      if (shouldWA && params.recipientPhone && params.whatsappApiKey) {
        const waUrl = (
          params.whatsappApiUrl ?? "https://wacoder.in/api"
        ).replace(/\/$/, "");
        try {
          await fetch(`${waUrl}/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apiKey: params.whatsappApiKey,
              phone: params.recipientPhone,
              message: params.message,
            }),
          });
          await actor.updateMessageDeliveryStatus(fe.id, "sent");
          fe.deliveryStatus = "sent";
        } catch {
          await actor.updateMessageDeliveryStatus(fe.id, "failed");
          fe.deliveryStatus = "failed";
        }
      }

      // 3. In-App notification
      const shouldInApp =
        params.channel === "In-App" || params.channel === "Both";
      if (shouldInApp) {
        try {
          await actor.createNotification(
            "New Message",
            params.message,
            null,
            params.toStudentId ?? null,
            (params.toClassLevel as import("@/types").ClassLevel) ?? null,
            params.fromUsername,
            "direct_message",
          );
        } catch {
          /* notification failure is non-blocking */
        }
      }

      return fe;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["directMessages"] });
    },
  });
}

export function useUpdateMessageStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!actor) throw new Error("Backend not available.");
      await actor.updateMessageDeliveryStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["directMessages"] }),
  });
}

export function useUpdateMessageTemplate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      key,
      template,
    }: { key: string; template: string }) => {
      if (!actor) throw new Error("Backend not available.");
      await actor.updateMessageTemplate(key, template);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messageTemplates"] }),
  });
}

// ─── Default templates ────────────────────────────────────────────────────────

export const defaultTemplates: Record<string, string> = {
  fees_reminder:
    "Dear {parent_name}, fees of ₹{amount} are pending for {student_name} (Adm. No. {adm_no}) for {months}. Please pay by {date}. — {school_name}",
  receipt:
    "Dear {parent_name}, payment of ₹{amount} received for {student_name} (Adm. No. {adm_no}) on {date}. Receipt No: {receipt_no}. Thank you! — {school_name}",
  admission:
    "Dear {parent_name}, {student_name} has been successfully admitted to {class} at {school_name}. Adm. No: {adm_no}. Welcome!",
  exam_schedule:
    "Dear {parent_name}, exam schedule for {student_name} ({class}): Exams start on {date}. Please ensure timely preparation. — {school_name}",
  holiday:
    "Dear Parents, the school will remain closed on {date} due to {reason}. Classes will resume on {resume_date}. — {school_name}",
  custom: "",
};

export const TEMPLATE_LABELS: Record<string, string> = {
  fees_reminder: "Fees Reminder",
  receipt: "Receipt",
  admission: "Admission Confirmation",
  exam_schedule: "Exam Schedule",
  holiday: "Holiday Announcement",
  custom: "Custom Message",
};

// ─── Class level options for UI ────────────────────────────────────────────────
export const CLASS_LEVELS = [
  { value: "PlayWay", label: "Play Way" },
  { value: "LKG", label: "LKG" },
  { value: "UKG", label: "UKG" },
  { value: "Class1", label: "Class 1" },
  { value: "Class2", label: "Class 2" },
  { value: "Class3", label: "Class 3" },
  { value: "Class4", label: "Class 4" },
  { value: "Class5", label: "Class 5" },
  { value: "Class6", label: "Class 6" },
  { value: "Class7", label: "Class 7" },
  { value: "Class8", label: "Class 8" },
  { value: "Class9", label: "Class 9" },
  { value: "Class10", label: "Class 10" },
  { value: "Class11", label: "Class 11" },
  { value: "Class12", label: "Class 12" },
];
