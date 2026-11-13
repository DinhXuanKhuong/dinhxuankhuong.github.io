---
title: "Radiction — Vietnamese Review Rating Prediction"
date: 2026-11-13
description: "A web application that predicts 1–5-star ratings from Vietnamese product reviews using fine-tuned PhoBERT, with CSV batch processing and visual reports."
category: Vietnamese NLP & applied machine learning
order: 5
repository: https://github.com/DinhXuanKhuong/Radiction-The-best-service
draft: false
---
## Overview

Radiction turns Vietnamese product-review text into predicted star ratings. It brings a language-model inference pipeline into a web application where users can analyze individual comments or upload a CSV file of reviews.

The prediction service segments Vietnamese text with Underthesea, tokenizes it with a PhoBERT tokenizer, and runs a five-class sequence classifier using fine-tuned weights. It maps the predicted class to a rating from 1 to 5 and returns the model’s confidence score.

## Main features

- Single-review prediction and batch processing through CSV upload.
- Rating-distribution charts and word clouds for exploring review collections.
- Prediction history tied to user accounts.
- CSV export and PDF report generation.

## Built with

FastAPI serves the application and API, Jinja2 and Tailwind CSS provide the interface, and SQLite stores users and prediction history. The inference pipeline uses PyTorch, Hugging Face Transformers, and Underthesea; Chart.js supports the dashboard visualizations.

## Explore the implementation

- [Model loading, preprocessing, and inference](https://github.com/DinhXuanKhuong/Radiction-The-best-service/blob/main/app/services/ml_service.py)
- [Single and batch prediction endpoints](https://github.com/DinhXuanKhuong/Radiction-The-best-service/blob/main/app/routers/prediction.py)
