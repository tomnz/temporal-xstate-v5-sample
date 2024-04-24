import { log, setHandler } from "@temporalio/workflow";
import { createActor, getInitialSnapshot } from "xstate";

import {
  type CaseMachineState,
  caseMachine,
  stateQuery,
  closeSignal,
  escalateSignal,
} from "./machines";

export async function caseEngine() {
  const actor = createActor(caseMachine);

  let state: CaseMachineState = getInitialSnapshot(caseMachine);
  actor.subscribe((nextState) => {
    state = nextState;
    log.info(`Machine state: ${JSON.stringify(nextState, null, 2)}`);
  });
  setHandler(stateQuery, () => state);

  actor.start();

  log.info("Machine started");

  const send = actor.send.bind(actor);

  setHandler(closeSignal, () => send({ type: "close" }));
  setHandler(escalateSignal, (props) => send({ type: "escalate", ...props }));

  await new Promise<void>((resolve) => {
    actor.subscribe({
      complete() {
        log.info("Machine completed");
        resolve();
      },
    });
  });
}
