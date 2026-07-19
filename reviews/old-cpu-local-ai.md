---
title: "Local AI on a 2009 Xeon (No GPU, No AVX)"
category: "Hardware / Local AI"
author: "Chris Lloyd"
date: 2026-07-19
rating: 4.4
affiliate_url: ""
tags: ["local-llm", "ollama", "quantization", "old-hardware", "no-avx", "sustainable", "cpu-inference", "benchmarks"]
summary: "Real benchmark numbers from running a 45-model local LLM fleet on a 17-year-old Xeon X3430 — including a Q8 vs Q4 quantization shootout that upends the usual advice."
pros:
  - "A 2009 quad-core runs a 45-model ollama fleet today — zero cloud, zero subscription"
  - "Quantized 1-3B models answer in 12-25s warm; a 7B senior produces shippable code in minutes"
  - "Sustainable: hardware everyone else scrapped, kept genuinely useful"
cons:
  - "Not a fun realtime chat — this is a workhorse, not a companion"
  - "Q4 quantization is NOT faster here (no AVX = no fast K-quant path); it only saves RAM"
  - "Cold model loads off spinning disks take minutes — design for async, not interactive"
verdict: "Wouldn't be a fun chat, but it works for us — measured, sustainable, and completely sovereign."
---

## Quick Take

Everyone says you need a GPU, or at least a modern CPU with AVX-512, to run local AI. Our build server is a 2009 Xeon X3430 — four cores, 16GB ECC, spinning RAID, and NO AVX at all. It runs a 45-model ollama fleet around the clock and ships real, tested code. Here are the actual numbers, because almost nobody publishes benchmarks for hardware this old.

## In Depth

### What it does
CPU-only LLM inference (ollama / GGUF) on a machine old enough to have voted twice. 1-3B models handle routine decisions and drafts; a quantized 7B "senior" handles the hard asks asynchronously; deterministic code generators do the heavy lifting so the models only spend tokens where judgement is needed.

### The quantization shootout (the interesting numbers)
We ran llama3.2:1b in Q8_0 against its Q4_K_M sibling — 28 head-to-head rounds across 14 scored arenas (code, math, comparison, decisions, docs):
- Accuracy: statistically identical — matched pass-for-pass on 13 of 14 arenas, a single flip on the 14th.
- Speed: Q4_K_M was about 15% SLOWER warm (e.g. 14.8s vs 12.3s on short tasks). The internet's "Q4 is faster" advice assumes AVX2/AVX-512 SIMD kernels for K-quant dequantization. Without AVX, Q8_0's trivial dequant wins the compute race.
- RAM: Q4 wins the only prize that matters on 16GB — 807MB vs 1.3GB resident, a 38% headroom gain.
Ruling: on old CPUs, quantization is a RAM lever, not a speed lever. Measure your own box; don't import assumptions from GPU-land.

### More measured surprises
- Doubling inference threads from 2 to 4 physical cores gained only ~6% tokens/sec — the box is memory-bandwidth-bound, not compute-bound.
- A 7B coder model at ~5 tok/s is useless for chat but excellent as an async "slow court": give it minutes instead of seconds and it produces working, reviewable code that the small models can't.

### Where it falls short
Interactive conversation. Warm answers land in 12-25 seconds, cold loads in minutes. You would not want this as your chat companion — it's a factory floor, not a front desk.

### Pricing / Value
Hardware most people would recycle for free. Weights are free. The cost is electricity and patience — and the patience is the system's, not yours, if you design async.

### Who should use it
Homelabbers, sovereignty-minded builders, anyone with a retired server and a stubborn streak. Sustainability angle is real: this is e-waste doing production work.

## Rating Breakdown

- Usability: 3/5 (async only — chat is not the use case)
- Value: 5/5 (rescued hardware, zero recurring cost)
- Power: 4/5 (surprising ceiling with the right architecture)
- Sovereignty / Privacy: 5/5 (nothing ever leaves the box)
- Overall: 4.4/5
