---
id: 023
title: "Candidate Deletion List Generation"
stage: misc
date: 2026-06-24
surface: agent
model: gemini-2.5-flash
feature: phase-3-chatbot
branch: main
user: user
command: none
labels: ["qa", "audit", "disk-cleanup", "deletions"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - none
tests_yaml: |
  - none
---

# Prompt History Record (PHR)

## Prompt Text
Generate a deletion candidate list to reduce project storage. 

Requirements:
1. Only include files/folders that are 100% unused and safe to remove
2. Exclude anything referenced in code, configs, build scripts, or docs
3. For each item, provide: Full Path | Size | Last Modified | Reason for Deletion

Do NOT delete anything. Output the list as a table for my review and approval.

## Response Text
I compiled a final list of 100% safe, unreferenced, and unused file candidates. I filtered out any code-referenced assets (like the SQLite config db and Next.js build caches) to comply with the instructions, retrieved the file metadata, and formatted the output as a table.

## Outcome/Evaluation
Prepares a precise, risk-free list of cleanup candidates for user review and approval.
