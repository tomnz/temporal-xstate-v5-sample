import { type SnapshotFrom, assign, setup } from "xstate";
import { defineQuery, defineSignal } from "@temporalio/workflow";

// XState Events
export type CloseEvent = { type: "close" };
export type EscalateEvent = { type: "escalate"; context?: string };
type CaseMachineEvent = CloseEvent | EscalateEvent;

// Other XState types
export type ClosedSource = "USER" | "STAFF" | "TIMEOUT";
export type CaseMachineContext = {
  closedBy?: ClosedSource;
};
export type CaseMachineState = SnapshotFrom<typeof caseMachine>;

// Temporal signals
type FromEvent<T extends { type: string }> = [Omit<T, "type">];
export const closeSignal = defineSignal<FromEvent<CloseEvent>>("close");
export const escalateSignal =
  defineSignal<FromEvent<EscalateEvent>>("escalate");

// Temporal Queries
export const stateQuery = defineQuery<CaseMachineState>("state");

export const caseMachine = setup({
  types: {
    events: {} as CaseMachineEvent,
    context: {} as CaseMachineContext,
  },
  actions: {
    inactiveClose: () => assign({ closedBy: "TIMEOUT" }),
  },
  delays: {
    // Time after which a case is automatically closed due to inactivity.
    inactiveClose: 1000 * 30, // 30 seconds - testing
  },
}).createMachine({
  initial: "open",
  states: {
    open: {
      on: {
        escalate: "staff",
      },
    },
    staff: {
      on: {
        close: "closed",
      },
    },
    closed: {
      type: "final",
    },
  },
  after: {
    inactiveClose: {
      actions: ["inactiveClose" as const],
      target: ".closed",
    },
  },
});
