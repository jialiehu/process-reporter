# process-reporter

Reports information about your node process to statsd. Use it like this:

```javascript
var ProcessReporter = require('process-reporter');

var processReporter = ProcessReporter({
    statsd: statsdClient
});

processReporter.bootstrap();
```

It currently reports these stats:

* **yourapp.process-reporter.handles** number of libuv handles
* **yourapp.process-reporter.requests** number of libuv requests
* **yourapp.process-reporter.memory-usage.rss** resident set size of procss
* **yourapp.process-reporter.memory-usage.heap-total** total size of v8 heap
* **yourapp.process-reporter.memory-usage.heap-used** amt of v8 heap used
* **yourapp.process-reporter.lag-sampler** event loop lag
* **yourapp.process-reporter.gc.{gc-type}.pause-ms** length of GC pauses
* **yourapp.process-reporter.gc.{gc-type}.heap-used** +/- amount of bytes GCd
* **yourapp.process-reporter.gc.{gc-type}.heap-total** +/- changes in heap total

To destroy the reporter just call `processReporter.destroy();`

## Docs

The ProcessReporter constructor takes an options dictionary:

 - `options.statsd`, a per-worker statsd to write per-worker stats to
 - `options.globalStatsd`, a cluster-wide statsd to write cluster-wide stats to

You can pass in an optional `globalStatsd` that will be used to emit
**lag-sampler** and **gc.{gc-type}.pause-ms** stats that are cluster wide
so that your statsd aggregation can calculate more accurate P99s

