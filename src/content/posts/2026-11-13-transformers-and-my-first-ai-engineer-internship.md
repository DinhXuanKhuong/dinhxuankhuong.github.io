---
title: "How Learning Transformers Helped Me Get My First AI Engineer Internship"
date: 2026-11-13
description: "From attention and positional encoding to my first AI Engineer internship—and why I now think software engineering belongs in every AI learning path."
category: Learning & career
language: en
draft: false
---
Learning Transformers helped me get my first AI Engineer internship at Kyanon Digital. After starting the internship, I also realized how much I still needed to learn about software engineering.

The model knowledge mattered. Being able to discuss LLMs, explain an attention module, talk about its weaknesses, and follow positional encoding through to RoPE helped me take that first step. But understanding a model is only part of building something useful with it. APIs, multi-agent workflows, deployment, and Docker brought a different set of questions.

This post connects those two parts of the journey: what I learned about Transformers, and what I would now recommend to someone preparing for an AI engineering role.

## Learning it well enough to explain it

My friend [Nguyễn Trần Thiên An](https://tawannt.github.io/) and I prepared a presentation about Transformers. Our slides move from RNNs and LSTMs to attention, positional encoding, residual connections, normalization, feed-forward networks, and decoding.

Preparing an explanation makes the gaps in your understanding visible. Knowing the name of a block is one thing; explaining what goes into it, what comes out, and why it is there is much more demanding.

The technical walkthrough below follows [our slides](/assets/slides/transformers-attention-is-all-you-need.pdf) and uses [Vaswani et al.’s *Attention Is All You Need*](https://arxiv.org/pdf/1706.03762) as the reference for the original architecture. RoPE comes later in the story; it is not part of the 2017 model.

## The architecture: a path from tokens to predictions

The original Transformer is an **encoder–decoder** architecture. For a translation task, the encoder builds contextual representations of the source sentence. The decoder uses those representations and the target tokens available so far to predict the next target token.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/architecture.png"><img src="/assets/images/transformer-internship/architecture.png" alt="Annotated encoder–decoder Transformer: embeddings and positional encodings feed stacked attention and feed-forward blocks, followed by an output projection and softmax." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 8 from our presentation, annotating Figure 1 of Vaswani et al. Open the image to inspect the full diagram.</figcaption>
</figure>

Each encoder layer contains self-attention and a position-wise feed-forward network. A decoder layer adds two attention stages: masked self-attention over the target sequence, then cross-attention to the encoder output. Residual connections and normalization surround these sublayers.

During training, the decoder receives the target sequence shifted right. A causal mask prevents a position from using future target tokens, so many positions can be trained in parallel without leaking the answer. During autoregressive generation, predictions are produced one token at a time. Parallel training does not mean that the whole response is generated at once.

GPT-style language models use a **decoder-only** arrangement. They keep causal self-attention but do not require a separate encoder and encoder–decoder cross-attention. Understanding the original diagram helped me see what later architectures keep, remove, or change.

## What each component contributes

### Token embeddings: give token IDs a representation

A tokenizer turns text into token IDs. A token may be a word, part of a word, or another unit; there is no guarantee that one word equals one token.

An embedding layer maps each ID to a learned vector. For a sequence of `T` tokens and model width `D`, the representation has shape `T × D`, before adding a batch dimension. Later layers refine these vectors using context.

### Position information: tell the model about order

Content-only self-attention does not inherently encode sequence order. We therefore need a way to distinguish the same content appearing at different positions.

Our slides explain sinusoidal positional encoding: sine and cosine signals at different frequencies create a vector for each position. In the original Transformer, this vector is added to the token embedding. The model receives information about both token identity and location.

A formula being defined for a longer position does not, by itself, guarantee that a model will work well on much longer sequences. That distinction becomes important when discussing context length.

### Attention: let a token gather relevant context

Attention produces a weighted mixture of information from other positions. It is a learned computation, not a literal act of reading or human understanding.

For self-attention, the current token representations `X` are projected into three sets of vectors:

```text
Q = XW_Q    queries
K = XW_K    keys
V = XW_V    values
```

A useful intuition is:

- A **query** describes what information a position is looking for.
- A **key** helps determine how relevant another position is to that query.
- A **value** contains information that can be passed into the resulting representation.

These roles arise through learned projections and the training objective. The vectors are not manually assigned meanings such as “subject” or “verb.”

Scaled dot-product attention is:

<div class="math-block" role="math" aria-label="Attention of Q, K, V equals softmax of Q K transpose divided by the square root of d k, plus the mask, multiplied by V.">Attention(Q, K, V) = softmax(QKᵀ / √dₖ + M)V</div>

Here, `dₖ` is the dimension of each query/key vector **within a head**. `M` is an optional mask: allowed positions receive zero and blocked positions receive negative infinity before softmax.

The computation has four steps. Dot products produce query–key compatibility scores. Scaling controls their magnitude. Softmax turns each query’s scores into weights over allowed keys. Multiplying by `V` forms a weighted sum of the value vectors.

For one head, if `Q` and `K` have shape `T × dₖ`, then `QKᵀ` has shape `T × T`. Each row corresponds to one query position; its columns correspond to key positions. Keeping track of these shapes makes the equation much easier to reason about.

### Multi-head attention: learn several contextual mixtures

Each attention head has its own projections. Heads can learn different ways of relating positions, and their outputs are concatenated and passed through an output projection.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/multi-head-attention.png"><img src="/assets/images/transformer-internship/multi-head-attention.png" alt="Slide showing parallel attention heads, scaled dot-product attention, concatenation, and an output projection." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 31 from our presentation. Each head operates in its projected space; the output projection combines their results.</figcaption>
</figure>

It is tempting to describe each head as a specialist with a fixed linguistic job. That can be a helpful illustration, but it is not a guarantee about what every trained head learns.

### Masked attention and cross-attention: control information access

In **causal self-attention**, position `t` can attend to positions up to and including `t`, but not later positions. This enforces the information boundary needed for next-token prediction. Padding masks serve a different purpose: excluding padding positions.

In **cross-attention**, queries come from the decoder, while keys and values come from encoder representations. The decoder can retrieve source-side information relevant to its current prediction. This is the bridge between the two halves of the original architecture.

### The feed-forward network: transform features at each position

Attention mixes information **across positions**. The feed-forward network then applies a nonlinear transformation **within each position’s representation**, using the same network at every position.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/feed-forward.png"><img src="/assets/images/transformer-internship/feed-forward.png" alt="Feed-forward network expanding a token representation, applying a nonlinearity, and projecting it back to the model width." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 46 from our presentation: expand, apply a nonlinearity, and project back.</figcaption>
</figure>

The original formulation uses two linear transformations with ReLU between them:

```text
FFN(x) = ReLU(xW₁ + b₁)W₂ + b₂
```

The temporary expansion provides room to transform features before returning to the model width. Calling the model a Transformer does not mean attention is doing all the work.

### Residual connections and normalization: support deeper computation

A residual connection adds a sublayer’s input back to its output: `x + F(x)`. This gives the network a direct path for information and gradients, so a sublayer can learn an update to an existing representation.

Layer normalization normalizes a token’s features and uses learned scale and shift parameters. It is different from normalizing a feature across examples in a batch.

Placement matters: the original architecture uses normalization after the residual addition, often called **post-norm**. Many later architectures use other arrangements. I try to identify the variant before treating a block diagram as a universal recipe.

### The prediction head and temperature: turn a representation into a token choice

The output projection maps a decoder representation to vocabulary-sized **logits**. Softmax converts logits to probabilities.

Temperature adjusts a sampling distribution by scaling logits before softmax. A lower positive temperature sharpens it; a higher temperature flattens it. Greedy decoding chooses the highest-scoring token directly. These are decoding choices, not replacements for learning useful representations.

## From positional encoding to RoPE

The next useful question was how position enters attention itself.

[Rotary Position Embedding, introduced in the RoFormer paper](https://arxiv.org/abs/2104.09864), applies position-dependent rotations to pairs of query and key coordinates. Rather than simply adding a position vector to the input embedding, it makes the attention score depend on relative displacement through those rotations.

In simplified notation:

```text
q̃ₘ = Rₘqₘ
k̃ₙ = Rₙkₙ

q̃ₘᵀk̃ₙ = qₘᵀRₘᵀRₙkₙ = qₘᵀRₙ₋ₘkₙ
```

`R` represents the rotary transformation. Its relative-position structure is the important idea here. RoPE is a way to represent position; it does not remove the pairwise cost of dense attention or guarantee unlimited useful context.

Being able to connect the original positional-encoding idea to RoPE helped me move beyond memorizing a single architecture diagram.

## Attention also has weaknesses

A good explanation needs to cover where the mechanism becomes expensive or insufficient.

**Long sequences are costly.** Dense self-attention compares pairs of positions. For sequence length `T`, that pairwise work grows quadratically with `T`; a straightforward implementation also materializes a `T × T` score matrix per head.

**Access to context is not reliable use of context.** A token being within the context window does not guarantee that a model will select the right evidence, reason correctly, or stay factually grounded.

**Autoregressive generation remains sequential.** Producing the next token depends on the tokens already generated. Serving latency is a separate concern from parallelizing training.

These distinctions gave me better questions to ask: what computation is happening, what information is available, and what does this design still fail to solve?

## What changed after I started the internship

After joining as an AI Engineer Intern, I realized that knowing ML, deep learning, and LLMs was not enough. I also needed a stronger understanding of the software around them.

The areas that stood out were **multi-agent workflows, APIs, deployment, and Docker**. They connect model behavior to an application that someone else can run, inspect, and maintain.

For me, software engineering means learning to make those connections explicit:

- **APIs:** define request and response formats, validate inputs, handle failures, and understand timeouts and authentication.
- **Code structure:** separate model inference, business logic, configuration, and user-facing interfaces.
- **Testing and debugging:** check ordinary cases, malformed inputs, dependency failures, and regressions after a change.
- **Deployment:** understand environments, dependencies, logs, resource limits, and how a service starts and stops.
- **Docker:** package the application and its dependencies, while remembering that a container alone does not provide monitoring, scaling, or a reliable release process.

Multi-agent systems made this especially clear. Several agents still need defined roles, shared or separate state, tool interfaces, handoffs, stopping conditions, and a way to evaluate the result. More agents can add coordination overhead, latency, and failure modes. I would start with a simple workflow and add agents when the separation serves a concrete purpose.

Those are software-design decisions as much as model decisions.

## A learning path I would recommend now

I would combine fundamentals with implementation and a small application. The resources below address different gaps; I would choose them around a project rather than treat the whole list as a prerequisite for applying to an internship.

| Focus | Resource | A practical goal |
| --- | --- | --- |
| ML foundations | [Machine Learning Specialization — DeepLearning.AI and Stanford Online](https://www.deeplearning.ai/specializations/machine-learning) | Understand supervised learning, evaluation, overfitting, and a meaningful baseline. |
| Neural networks | [Deep Learning Specialization — DeepLearning.AI](https://www.deeplearning.ai/specializations/deep-learning) | Connect optimization and neural-network building blocks to sequence models. |
| Hands-on implementation | [Learn PyTorch](https://www.learnpytorch.io/) | Write a training loop, inspect tensor shapes, save a model, and organize code into modules. |
| Working with language models | [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/en/chapter1/1) | Work with tokenizers, datasets, pretrained models, and fine-tuning workflows. |
| Everyday engineering tools | [The Missing Semester of Your CS Education](https://missing.csail.mit.edu/) | Become comfortable with the shell, Git, debugging, and packaging code. |
| Application development | [Full Stack Open — University of Helsinki](https://fullstackopen.com/en/) | Build a frontend and an API-backed application, and practice testing the boundaries between them. |
| Shipping ML systems | [Full Stack Deep Learning — 2022 course](https://fullstackdeeplearning.com/course/2022/) | Study testing, deployment, data management, and monitoring alongside model development. |
| Agent applications | [LangChain Academy](https://academy.langchain.com/collections) | Explore agent workflows, then test and observe their behavior in an application. |

The Machine Learning and Deep Learning specializations provide conceptual structure. Learn PyTorch gives that structure something concrete to run. For the software-engineering gap I noticed, I would particularly add **Missing Semester** and a small end-to-end application. Full Stack Open teaches JavaScript-based application development; its architecture and testing lessons are useful even when an AI backend is written in Python.

LangChain Academy is relevant to the agent side of the journey, but framework knowledge works best on top of an understanding of APIs, state, testing, and failure handling. Its catalog changes, so I would choose a current introductory course and check its prerequisites before committing to a longer path.

## The project I would build alongside the courses

I would turn one notebook experiment into a small, documented service:

1. Implement an attention block and check its shapes and causal mask on a tiny example.
2. Use a small model for a narrowly defined task and establish a baseline.
3. Move the inference code into a reusable module with a clear interface.
4. Expose it through an API and test valid inputs, invalid inputs, and failures.
5. Containerize it, document how to run it, and add useful logs.
6. Measure output quality, latency, and resource use before adding more orchestration.

My [GPT study notebooks](/projects/build-a-llm-from-scratch.html) are one part of that learning journey. The engineering work around a model is another part I want to keep developing.

Learning Transformers helped me reach my first internship. Starting that internship gave me a wider view of what I needed to learn next. My advice is to keep studying the models—and give yourself regular practice building the software that makes them usable.

## Slides and references

- [Our Transformer slides — PDF, approximately 15 MB](/assets/slides/transformers-attention-is-all-you-need.pdf), prepared by Nguyễn Trần Thiên An and Đinh Xuân Khương. The images above are selected slides from that deck; original figure credits remain with their respective authors.
- [Thiên An’s notes and website](https://tawannt.github.io/).
- [Vaswani et al., *Attention Is All You Need*](https://arxiv.org/pdf/1706.03762), 2017.
- [Su et al., *RoFormer: Enhanced Transformer with Rotary Position Embedding*](https://arxiv.org/abs/2104.09864), 2021.
