---
title: "InTelFace — Privacy-Preserving Face Recognition"
date: 2026-11-13
description: "A CPU-based face-recognition demonstrator that uses homomorphic encryption to compare face embeddings without revealing them to the matching server."
category: Computer vision & privacy
order: 4
repository: https://github.com/DinhXuanKhuong/Privacy-Preserving-Face-Recognition-System-Using-Homomorphic-Encryption
draft: false
---
## Overview

InTelFace explores face recognition with a clear privacy boundary between a trusted desktop application and a separate matching service. The desktop captures a face, produces a 512-dimensional Facenet512 embedding, and encrypts it using TenSEAL’s CKKS homomorphic encryption scheme.

The server calculates squared distances between encrypted embeddings. It returns encrypted results to the desktop, which holds the private key, decrypts the distances, and makes the final matching decision. Raw camera frames and plaintext embeddings stay on the trusted client.

## Main features

- Face detection and alignment with InsightFace, followed by CPU-based Facenet512 embedding.
- A PySide6 desktop interface for enrollment, sign-in, duplicate detection, and threshold calibration.
- A FastAPI matcher with local SQLite storage and PostgreSQL/Supabase support.
- Workflows for local operation and deploying the matcher to Google Cloud Run.

## Project scope

This is a research demonstrator. The Intel UP 4000 software profile is implemented, with physical hardware acceptance still pending in the repository’s status report. The desktop interface is hosted in Qt WebEngine; a standalone public browser client is future work.

## Explore the implementation

- [Project overview and setup](https://github.com/DinhXuanKhuong/Privacy-Preserving-Face-Recognition-System-Using-Homomorphic-Encryption/blob/main/README.md)
- [Encrypted matching implementation](https://github.com/DinhXuanKhuong/Privacy-Preserving-Face-Recognition-System-Using-Homomorphic-Encryption/blob/main/src/secureface/he/matcher.py)
- [Project status](https://github.com/DinhXuanKhuong/Privacy-Preserving-Face-Recognition-System-Using-Homomorphic-Encryption/blob/main/docs/project-status.md)
