---
title: "Build a LLM From Scratch"
date: 2026-01-10
description: "A notebook-based study implementation of a GPT-style language model in PyTorch, covering tokenization, causal attention, training, and text generation."
category: Language models & deep learning
order: 1
repository: https://github.com/DinhXuanKhuong/Build-a-LLM-From-Scratch
draft: false
---
## Overview

This repository collects personal study implementations based on the book *Build a Large Language Model (From Scratch)*. The notebooks build up the components of a GPT-style model and connect them to a working training and generation pipeline in PyTorch.

## From text to a transformer

The progressive `all_in_one.ipynb` notebook begins with simple text tokenizers, introduces GPT-2 byte-pair encoding with `tiktoken`, and constructs sliding-window input–target datasets. It then develops self-attention, causal masking, and multi-head attention step by step.

The focused `gpt.ipynb` notebook implements token and positional embeddings, layer normalization, GELU feed-forward layers, residual connections, transformer blocks, and the output head.

## Training and generation

- Split a text corpus into training and validation data and prepare PyTorch data loaders.
- Train the model with AdamW, track losses, and generate sample text during training.
- Generate continuations with configurable temperature, top-k sampling, and an optional end-of-sequence token.
- Save and reload model weights and optimizer checkpoints.

The notebooks use small text corpora for learning and experimentation. The emphasis is on understanding the model’s building blocks and training process.

## Explore the notebooks

- [Progressive tokenization and attention walkthrough](https://github.com/DinhXuanKhuong/Build-a-LLM-From-Scratch/blob/main/all_in_one.ipynb)
- [GPT implementation, training, and generation](https://github.com/DinhXuanKhuong/Build-a-LLM-From-Scratch/blob/main/gpt.ipynb)
- [Kaggle notebook](https://www.kaggle.com/code/khngxuninh/build-a-llm-from-scratch)
