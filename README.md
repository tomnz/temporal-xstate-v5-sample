# temporal-xstate-v5-after

Minimal repro case for a delayed transition in XState, which fails when "waking up" the workflow, with a message: `Missing associated machine for Timer(0)`

This state machine is intended to form the foundation of a "case management" workflow. The intent is to provide sensible timeouts at each step in a case via `after` transitions.
