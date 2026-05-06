import Image from "next/image";

type State =
  | "ready"
  | "waiting"
  | "conflict"
  | "failure"
  | "open"
  | "closed"
  | "merged"
  | "draft";

export const ICONS: Record<State, string> = {
  ready: "status_ready.svg",
  waiting: "status_waiting.svg",
  conflict: "status_conflict.svg",
  failure: "status_failure.svg",
  open: "status_open.svg",
  closed: "status_closed.svg",
  merged: "status_merged.svg",
  draft: "status_draft.svg",
};

export default function StatusIcon({ state }: { state: State }) {
  return (
    <Image src={`/icons/dashboard/${ICONS[state]}`} alt={`${state} icon`} width={32} height={32} />
  );
}
