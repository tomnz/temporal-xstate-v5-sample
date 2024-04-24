import { Worker } from "@temporalio/worker";

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows"),
    taskQueue: "task-queue-1",
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
