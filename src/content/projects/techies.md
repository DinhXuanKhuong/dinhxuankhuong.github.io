---
title: "Techies — AI Dermatology Assistant"
date: 2026-01-10
description: "An experimental dermatology assistant that combines text-and-image chat, skin-lesion classification, and retrieval from a medical knowledge base."
category: Multimodal AI & agent workflows
order: 2
repository: https://github.com/DinhXuanKhuong/Techies
draft: false
---
## Overview

Techies is a full-stack AI dermatology assistant with a Next.js frontend and a FastAPI backend. Users can describe skin-related concerns, attach an image, and continue a conversation with context from earlier messages.

The implementation combines computer vision, Vietnamese text classification, document retrieval, and a language-model workflow. It explores how these components can work together in a conversational prototype.

## How it works

A LangGraph workflow coordinates input validation, topic classification, image analysis, symptom follow-up, knowledge retrieval, and response generation.

- An autoencoder-based image check screens for out-of-distribution inputs before the image-classification path.
- A PyTorch vision model returns probabilities across eight skin-lesion categories.
- A fine-tuned PhoBERT classifier routes Vietnamese text between medical and unrelated topics.
- A Chroma knowledge base retrieves documents using Vietnamese embeddings and cross-encoder reranking.
- The assistant can ask for more symptom details when image evidence is uncertain.

## Application features

Supabase supports authentication, uploaded images, chat sessions, and conversation history. The interface lets users revisit earlier conversations, while the backend passes stored messages into the assistant workflow. Docker Compose provides a combined frontend-and-backend setup.

## Explore the implementation

These links point to the repository’s current default branch, `an`, which contains the full-stack application.

- [Application overview and setup](https://github.com/DinhXuanKhuong/Techies/blob/an/README.md)
- [Assistant workflow](https://github.com/DinhXuanKhuong/Techies/blob/an/backend/derm_agent.py)
- [Knowledge retrieval and reranking](https://github.com/DinhXuanKhuong/Techies/blob/an/backend/rag.py)
- [Chat and session API](https://github.com/DinhXuanKhuong/Techies/blob/an/backend/main.py)
