---
id: 018
title: "Project Execution Guide Request"
stage: misc
date: 2026-06-22
surface: agent
model: gemini-2.5-flash
feature: phase-3-chatbot
branch: main
user: user
command: none
labels: ["documentation", "running-project", "guide"]
links:
  spec: "specs/002-phase-3-chatbot/spec.md"
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
How to run this project in step by step way?

## Response Text
I provided a detailed, step-by-step guide explaining how to configure the environment, run the PostgreSQL database (Neon), boot the FastAPI backend, launch the Next.js frontend, and run the automated chat integration tests.

## Outcome/Evaluation
Ensures the user can reliably run the entire application end-to-end locally and verify its core features.
