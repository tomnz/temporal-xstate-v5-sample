import { Client } from "@temporalio/client";
import { caseEngine } from "./workflows";

async function run() {
  const client = new Client();

  await client.workflow.start(caseEngine, {
    taskQueue: "task-queue-1",
    workflowId: "case-engine-1",
  });
  // Workflow will run for 30 seconds, until an `after` transition is hit,
  // at which point it will error out, with message:
  //    Missing associated machine for Timer(0)
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
