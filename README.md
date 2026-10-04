# clock-skew-report

Measure clock offset, drift and sudden clock jumps for each source in a JSONL event stream by comparing source and receive timestamps.

```sh
npx --yes github:b69ca/clock-skew-report events.jsonl
npx --yes github:b69ca/clock-skew-report events.jsonl --source-time device.at --received-time ingest.at --entity device.id --fail-abs 5000
```

Numeric timestamps are milliseconds; strings use JavaScript date parsing. Each source receives min, median, p95, max, maximum absolute skew, first-to-last drift, future-timestamp count and jump details. `--jump-ms` sets the offset-change threshold. `--fail-abs` exits 1 when any source exceeds the allowed absolute skew.

This does not synchronize clocks or infer network latency. It turns already captured dual-timestamp events into a compact forensic report. Zero dependencies, Node.js 20+, MIT licensed.
