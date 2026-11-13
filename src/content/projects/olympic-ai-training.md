---
title: "Olympic AI Training"
date: 2026-11-13
description: "An AI exam-practice platform with category-based flashcards, configurable 60- and 180-minute mock exams, and answer review."
category: AI education & full-stack development
order: 6
repository: https://github.com/DinhXuanKhuong/Olympic-AI-Training
draft: false
---
## Overview

Olympic AI Training is an exam-practice platform for reviewing AI topics through flashcards and timed mock exams. A React and TypeScript frontend connects to a FastAPI backend, with questions stored in SQLite and maintained as editable JSON files.

## Practice modes

- **Flashcards:** choose categories, answer questions one at a time, and receive immediate feedback. The practice session tracks seen questions to avoid repeats until the available set is exhausted.
- **60-minute mock exam:** a timed session with 40 questions.
- **180-minute mock exam:** a timed session with 100 questions.
- **Answer review:** see the score, percentage, unanswered questions, and selected versus correct answers after submission.

Exam setup supports a configurable distribution across categories. The backend checks that enough questions are available, samples them, and shuffles the resulting exam.

## Maintaining the question bank

An importer validates JSON questions and synchronizes additions, changes, and deletions with SQLite. This lets the question bank grow without editing the frontend.

The app uses in-memory exam sessions and does not require an account or retain a permanent exam history.

## Explore the implementation

- [Setup and question-bank format](https://github.com/DinhXuanKhuong/Olympic-AI-Training/blob/main/README.md)
- [Exam generation and scoring](https://github.com/DinhXuanKhuong/Olympic-AI-Training/blob/main/backend/app/services/exams.py)
- [Flashcard practice interface](https://github.com/DinhXuanKhuong/Olympic-AI-Training/blob/main/frontend/src/pages/FlashcardPractice.tsx)
