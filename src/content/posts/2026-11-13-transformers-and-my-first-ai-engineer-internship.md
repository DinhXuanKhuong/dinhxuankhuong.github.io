---
title: "How Learning Transformers Helped Me Get My First AI Engineer Internship"
date: 2026-11-13
description: "A detailed, illustrated walkthrough from RNNs and LSTMs to Transformer blocks, RoPE, and KV caching—and the software lessons from my first AI Engineer internship."
category: Learning & career
language: en
draft: false
math: true
---
Learning Transformers helped me get my first AI Engineer internship at Kyanon Digital. After starting the internship, I also realized how much I still needed to learn about software engineering.

The model knowledge mattered. Being able to discuss LLMs, explain an attention module, talk about its weaknesses, and follow positional encoding through to RoPE helped me take that first step. But understanding a model is only part of building something useful with it. APIs, multi-agent workflows, deployment, and Docker brought a different set of questions.

This post connects those two parts of the journey: what I learned about Transformers, and what I would now recommend to someone preparing for an AI engineering role.

## Learning it well enough to explain it

My friend [Nguyễn Trần Thiên An](https://tawannt.github.io/) and I prepared a presentation about Transformers. Our slides move from RNNs and LSTMs to attention, positional encoding, residual connections, normalization, feed-forward networks, and decoding.

Preparing an explanation makes the gaps in your understanding visible. Knowing the name of a block is one thing; explaining what goes into it, what comes out, and why it is there is much more demanding.

The technical walkthrough below follows [our slides](/assets/slides/transformers-attention-is-all-you-need.pdf) and uses [Vaswani et al.’s *Attention Is All You Need*](https://arxiv.org/pdf/1706.03762) as the reference for the original architecture. RoPE comes later in the story; it is not part of the 2017 model.

<nav class="article-toc" aria-label="In this post">
  <p class="eyebrow">The technical walkthrough</p>
  <ol>
    <li><a href="#problem">Problem statement and motivation</a></li>
    <li><a href="#recurrence">What RNNs and LSTMs struggle with</a></li>
    <li><a href="#architecture">The complete architecture</a></li>
    <li><a href="#encoder">Inside the encoder</a></li>
    <li><a href="#decoder">Inside the decoder</a></li>
    <li><a href="#temperature">The output head and temperature</a></li>
    <li><a href="#kv-cache">KV caching and its memory trade-off</a></li>
    <li><a href="#position">Positional encoding and RoPE</a></li>
    <li><a href="#internship">What the internship taught me next</a></li>
  </ol>
</nav>

<h2 id="problem">1. The problem: learn relationships across a sequence</h2>

Consider translating a sentence. A model needs to recognize individual tokens, connect words that depend on each other, keep track of order, and generate an output whose length may differ from the input. A useful representation of “bank” should change depending on whether the surrounding sentence is about a river or money.

For an input sequence `x` and target sequence `y`, autoregressive generation models the target as a sequence of conditional predictions:

$$
P(y \mid x) = \prod_{t=1}^{T} P(y_t \mid y_1,\ldots,y_{t-1},x)
$$

For a decoder-only language model, the conditioning is the available token prefix instead of a separate encoded source. In either case, the next prediction needs information from context.

The engineering question is how to make that context available: **can positions exchange information effectively, without forcing every training example through a long chain of sequential steps?**

This is the motivation I find most useful for understanding Transformers. Attention creates direct interactions between positions, and matrix operations make many of those interactions parallelizable. The goal is a useful route for information and learning—not simply replacing one fashionable layer with another.

<h2 id="recurrence">2. Why RNNs and LSTMs are not the whole answer</h2>

### An RNN carries a state through time

An RNN updates a hidden state using the current input and the previous hidden state:

$$
h_t = \tanh(W_x x_t + W_h h_{t-1} + b)
$$

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/rnn.png"><img src="/assets/images/transformer-internship/rnn.png" alt="An unrolled recurrent network passes a hidden state along the sequence." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 4 from our presentation. An unrolled recurrent network passes a hidden state along the sequence. Open the image for a larger view.</figcaption>
</figure>

That recurrence gives the model a natural way to process ordered data. But computing $h_t$ requires $h_{t-1}$. We can parallelize work across examples and within matrix operations, while the chain of hidden states inside one example remains sequential.

There is also an information problem. Earlier evidence must survive many updates if it is to influence a much later prediction. A finite hidden state can represent useful history, but retaining the right details becomes a learning challenge as the sequence grows.

### Where vanishing and exploding gradients come from

During backpropagation through time, the effect of an early hidden state on a later one involves a product of Jacobians:

$$
\frac{\partial h_t}{\partial h_k} = \frac{\partial h_t}{\partial h_{t-1}} \cdots \frac{\partial h_{k+1}}{\partial h_k}
$$

As an intuition, imagine that each step multiplies a scalar gradient by `0.9`. After 100 steps, the factor is about `0.0000266`. With a factor of `1.1`, it is about `13,781`. Real networks use matrices and nonlinearities, but repeated multiplication explains why a training signal can shrink away or grow uncontrollably.

For `tanh`, saturation adds another difficulty: its derivative is small when the activation is near either extreme. The model may therefore struggle to assign credit to an event many steps earlier. Gradient clipping helps control exploding gradients; it does not recreate a signal that has already vanished.

### LSTMs improve the memory path

LSTMs introduce a cell state and learned gates. A simplified view of the cell update is:

$$
\begin{aligned} c_t &= f_t \odot c_{t-1} + i_t \odot g_t \\ h_t &= o_t \odot \tanh(c_t) \end{aligned}
$$

The forget gate $f_t$ controls retention, the input gate $i_t$ controls writing, and the output gate $o_t$ controls exposure of the cell state. The candidate $g_t$ proposes new content.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/lstm.png"><img src="/assets/images/transformer-internship/lstm.png" alt="The LSTM cell state and gates provide a more flexible route for memory." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 6 from our presentation. The LSTM cell state and gates provide a more flexible route for memory. Open the image for a larger view.</figcaption>
</figure>

Along the direct cell-state path, the derivative with respect to the previous cell state contains the forget gate. When that gate stays close to one, information and gradients have a more favorable route through time than in a plain recurrent update.

That is a major improvement, not a guarantee of perfect memory. For intuition, repeatedly retaining `0.99` of a signal for 1,000 steps leaves about `0.0000432`. An LSTM must learn what to retain, and the recurrence is still sequential. It is inaccurate to say that LSTMs *cannot* learn long-term dependencies; they were designed to help with them, but the problem is not universally solved.

A basic encoder–decoder RNN that compresses the whole source into one vector adds a bottleneck. Attention can let a decoder access multiple source states instead. Recurrent models can use attention too; the Transformer’s distinctive step is organizing its sequence processing around attention without recurrent state updates.

<h2 id="architecture">3. The architecture at a glance</h2>

The original [Transformer paper](https://arxiv.org/pdf/1706.03762) describes an **encoder–decoder** model. The encoder turns source tokens into contextual representations. The decoder uses those representations and a target prefix to predict the next target token.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/architecture.png"><img src="/assets/images/transformer-internship/architecture.png" alt="Our annotations of the original encoder–decoder diagram, Figure 1 of Vaswani et al." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 8 from our presentation. Our annotations of the original encoder–decoder diagram, Figure 1 of Vaswani et al. Open the image for a larger view.</figcaption>
</figure>

A compact view is:

```text
Source tokens → embeddings + positions → encoder stack → source representations
                                                             ↓
Target prefix → embeddings + positions → decoder stack → vocabulary logits
```

One encoder layer contains self-attention and a feed-forward network. One decoder layer contains causal self-attention, cross-attention, and a feed-forward network. Both use residual connections and normalization.

The diagram describes the original architecture. Encoder-only and decoder-only models keep different parts of this design. A GPT-style decoder-only model has causal self-attention without a separate source encoder or encoder–decoder cross-attention.

### Before the blocks: token embeddings

A tokenizer maps text into token IDs. Tokens can be words, word pieces, punctuation, or other units. The embedding table maps each ID to a learned vector; it does not assign a finished contextual meaning by itself.

I will use these dimensions below:

| Symbol | Meaning |
| --- | --- |
| `B` | Batch size |
| `S` | Source sequence length |
| `T` | Target or language-model sequence length |
| `D` | Model width |
| `H` | Number of query attention heads |
| $d_k$, $d_v$ | Per-head key/query and value dimensions |

A source batch starts as `B × S` IDs and becomes `B × S × D` vectors. Position information is incorporated so the model can distinguish sequence order; I return to the original encoding and RoPE after explaining the blocks.

<h2 id="encoder">4. Inside the encoder</h2>

### Self-attention: build a contextual representation

A source token can use information from other valid source positions. Self-attention calculates which information to mix into its representation.

For one head, let `X` be the current representations. The learned projections create queries, keys, and values:

$$
\begin{aligned} Q &= XW_Q \\ K &= XW_K \\ V &= XW_V \end{aligned}
$$

The query asks what information this position is looking for. The key describes how it can be matched to a query, and the value carries the information it can contribute.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/query-key-value.png"><img src="/assets/images/transformer-internship/query-key-value.png" alt="Queries, keys, and values are separate learned projections of representations." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 21 from our presentation. Queries, keys, and values are separate learned projections of representations. Open the image for a larger view.</figcaption>
</figure>

All three come from the same sequence in self-attention, but the projection matrices differ. These questions are intuition for the computation, not labels manually written into the vectors. The projections are learned through training.

#### Step 1: compare queries with keys

For positions `i` and `j`, the dot product $q_i\cdot k_j$ is a compatibility score. With token vectors represented as rows, all scores can be computed together as $QK^{\mathsf T}$.

If `Q` and `K` have shape `B × S × dₖ`, the score tensor has shape `B × S × S`. A row corresponds to a query; its columns correspond to candidate keys.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/attention-scores.png"><img src="/assets/images/transformer-internship/attention-scores.png" alt="Building the query–key score matrix. The article uses row-token notation and the per-head scale √dₖ." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 27 from our presentation. Building the query–key score matrix. The article uses row-token notation and the per-head scale √dₖ. Open the image for a larger view.</figcaption>
</figure>

**Notation note:** the slides use some column-vector conventions. Here I consistently use token rows and divide by $\sqrt{d_k}$, the query/key width within a head—not the full model width when those widths differ.

#### Step 2: scale and mask the scores

A dot product sums over $d_k$ coordinates. Under a rough independent, unit-variance assumption, its variance grows with $d_k$. Dividing by $\sqrt{d_k}$ keeps score magnitudes more controlled and helps avoid an excessively saturated softmax.

Masks decide which positions are available. A source-padding mask excludes padding tokens. The encoder’s ordinary bidirectional self-attention does not apply the decoder’s future-token restriction.

#### Step 3: normalize over the available keys

Softmax is applied across the key positions for each query:

$$
A = \operatorname{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{d_k}}+M\right)
$$

Allowed mask entries are zero; blocked entries are negative infinity before softmax. Each valid row becomes a distribution over its allowed keys. Implementations must also handle padding carefully so a query does not accidentally softmax a row with no valid keys.

#### Step 4: combine the values

$$
\operatorname{Attention}(Q,K,V) = AV
$$

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/context-vectors.png"><img src="/assets/images/transformer-internship/context-vectors.png" alt="Attention weights form a weighted sum of the value vectors." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 29 from our presentation. Attention weights form a weighted sum of the value vectors. Open the image for a larger view.</figcaption>
</figure>

If a query has weights `[0.7, 0.2, 0.1]`, its output is $0.7v_1+0.2v_2+0.1v_3$. For scalar values `[10, 0, -10]`, that mixture would be `6`. In a real head, the values are vectors, so the same weights combine every value coordinate.

The result is a new representation informed by context. The values need not be the original embeddings; in deeper layers, they are projections of already contextualized states.

### Multi-head attention: several learned views

One set of projections gives one way to compare and combine positions. Multi-head attention runs several learned projections in parallel, so the same sequence can be processed through different representation subspaces.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/multi-head-attention.png"><img src="/assets/images/transformer-internship/multi-head-attention.png" alt="Several projected heads process the same sequence in parallel." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 31 from our presentation. Several projected heads process the same sequence in parallel. Open the image for a larger view.</figcaption>
</figure>

For head `h`:

$$
\begin{aligned} \mathrm{head}_h &= \operatorname{Attention}(XW_{Qh},XW_{Kh},XW_{Vh}) \\ \operatorname{MultiHead}(X) &= \operatorname{Concat}(\mathrm{head}_1,\ldots,\mathrm{head}_H)W_O \end{aligned}
$$

A “multi-view” intuition is useful: one head might emphasize a nearby relationship while another responds to more distant context. However, the architecture does not guarantee a particular linguistic role for each head, or that all heads will learn distinct useful behaviors.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/head-projection.png"><img src="/assets/images/transformer-internship/head-projection.png" alt="Concatenation gathers the head outputs; a learned projection mixes them." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 33 from our presentation. Concatenation gathers the head outputs; a learned projection mixes them. Open the image for a larger view.</figcaption>
</figure>

The output projection $W_O$ mixes information across the concatenated heads and returns it to model width `D`. It is learned, so concatenation is not the last operation.

Implementations commonly project many heads in one matrix multiplication, then reshape and transpose tensors. With standard equal-width heads, $d_k=d_v=D/H$, giving:

```text
Input:           [B, S, D]
Queries/keys:    [B, H, S, dₖ]
Values:          [B, H, S, dᵥ]
Attention:       [B, H, S, S]
Head outputs:    [B, H, S, dᵥ]
Combined output: [B, S, D]
```

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/attention-tensors.png"><img src="/assets/images/transformer-internship/attention-tensors.png" alt="Batched tensor operations organize the attention computation for parallel hardware." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 34 from our presentation. Batched tensor operations organize the attention computation for parallel hardware. Open the image for a larger view.</figcaption>
</figure>

This is a useful place to check code: the softmax axis should select keys, and heads must be recombined in the intended order.

The direct connections also have a cost. Dense self-attention compares every query with every key: doubling sequence length roughly quadruples the number of score entries. Materializing the attention matrix uses $O(BHS^2)$ elements, and the pairwise computation is quadratic in sequence length. Memory-efficient implementations can avoid storing that whole matrix, but exact dense attention still performs quadratic pairwise work. Attention gives distant tokens a shorter communication path; it does not guarantee that the model will retrieve the right fact from a long context.

### Feed-forward network: transform each position’s features

Attention mixes information across positions. The feed-forward network applies a nonlinear transformation to each position separately, with shared parameters across positions within that layer.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/feed-forward.png"><img src="/assets/images/transformer-internship/feed-forward.png" alt="A position-wise network expands, transforms, and projects features back to the model width." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 46 from our presentation. A position-wise network expands, transforms, and projects features back to the model width. Open the image for a larger view.</figcaption>
</figure>

$$
\operatorname{FFN}(x) = \operatorname{ReLU}(xW_1+b_1)W_2+b_2
$$

The first projection expands the feature dimension; the second returns it to `D`. The nonlinearity matters: without it, two consecutive linear transformations would collapse into a single affine transformation.

The FFN can transform and recombine features discovered through attention. It does not itself create another token-to-token interaction. Later variants change the activations or introduce gating, so this equation should be read as the original block rather than a definition of every modern LLM.

### Residual connections: a more direct gradient path

Instead of replacing `x` with `F(x)`, a residual block computes:

$$
y = x + F(x)
$$

That lets a sublayer learn an update to an existing representation. With column-vector gradient notation and Jacobian $J_F$:

$$
\frac{\partial L}{\partial x} = \bigl(I+J_F(x)\bigr)^{\mathsf T}\frac{\partial L}{\partial y}
$$

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/residual-gradient.png"><img src="/assets/images/transformer-internship/residual-gradient.png" alt="The identity route in a residual addition contributes to gradient flow." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 40 from our presentation. The identity route in a residual addition contributes to gradient flow. Open the image for a larger view.</figcaption>
</figure>

The identity term gives gradients a direct route that does not depend only on repeatedly multiplying through the learned branch. If that branch’s derivative is small, there is still an identity contribution. This explains why skip connections can make deep networks easier to optimize; the [original residual-learning paper](https://arxiv.org/abs/1512.03385) is a useful reference.

The `+ I` term is not a promise that gradients can never vanish. Different paths can interact or cancel, and normalization adds its own Jacobian. The simple derivative above describes the residual addition before any subsequent normalization. This is why the placement of normalization matters.

### Layer normalization: normalize features within a token

For a representation tensor `X` with shape `[B, S, D]`, the usual Transformer LayerNorm computes a mean and variance over the `D` features of each token separately:

$$
\begin{aligned} \mu_{b,s} &= \frac{1}{D}\sum_{j=1}^{D} X_{b,s,j} \\ \sigma^2_{b,s} &= \frac{1}{D}\sum_{j=1}^{D}(X_{b,s,j}-\mu_{b,s})^2 \\ \operatorname{LN}(x) &= \gamma\odot\frac{x-\mu}{\sqrt{\sigma^2+\varepsilon}}+\beta \end{aligned}
$$

The learned scale $\gamma$ and shift $\beta$ allow the model to adjust the normalized representation; $\varepsilon$ supports numerical stability.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/layer-norm.png"><img src="/assets/images/transformer-internship/layer-norm.png" alt="Normalization followed by a learned scale and shift." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 43 from our presentation. Normalization followed by a learned scale and shift. Open the image for a larger view.</figcaption>
</figure>

#### How is that different from BatchNorm?

The distinction is the **axes used to calculate statistics**, not simply which one has “better normalization.”

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/batch-vs-layer-norm.png"><img src="/assets/images/transformer-internship/batch-vs-layer-norm.png" alt="A conceptual comparison of normalization axes; the article specifies the sequence layouts explicitly." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 42 from our presentation. A conceptual comparison of normalization axes; the article specifies the sequence layouts explicitly. Open the image for a larger view.</figcaption>
</figure>

| Question | Typical Transformer LayerNorm | BatchNorm1d on `[B, D, S]` |
| --- | --- | --- |
| What is normalized together? | Features of one token | Batch and sequence positions for each channel |
| Does one example affect another’s statistics? | No | Yes, during training |
| What statistics are used at inference? | Those of the current token | Running estimates by default |
| Are padding and variable sequence lengths a concern? | Feature normalization does not pool across tokens | Naively pooling across positions can include padding |

The slide is a conceptual comparison; the table specifies the sequence tensor layouts used here. The behavior is documented in [PyTorch’s LayerNorm](https://docs.pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html) and [BatchNorm1d](https://docs.pytorch.org/docs/stable/generated/torch.nn.BatchNorm1d.html) references.

#### Post-norm versus pre-norm

The original architecture applies normalization after a residual addition:

$$
\begin{aligned} \text{Post-norm:}\quad y &= \operatorname{LN}(x+F(x)) \\ \text{Pre-norm:}\quad y &= x+F(\operatorname{LN}(x)) \end{aligned}
$$

Pre-norm leaves the residual stream outside that sublayer’s normalization, changing the gradient route. It is a different arrangement, not merely moving the same operation without consequence. A complete model may also have a final normalization.

For the original encoder, the high-level flow is:

$$
\begin{aligned} u &= \operatorname{LN}\bigl(x+\operatorname{Dropout}(\operatorname{SelfAttention}(x))\bigr) \\ y &= \operatorname{LN}\bigl(u+\operatorname{Dropout}(\operatorname{FFN}(u))\bigr) \end{aligned}
$$

Dropout regularizes training by randomly zeroing selected activations; it is disabled for ordinary evaluation. It is not a substitute for a causal mask. Other dropout placements also appear in the complete model.

<h2 id="decoder">5. Inside the decoder: two different attention problems</h2>

### Masked self-attention prevents looking at future targets

During training, a decoder can process many target positions together. But a position must use only the target information that would be available when generating that prediction.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/causal-mask.png"><img src="/assets/images/transformer-internship/causal-mask.png" alt="Masked attention blocks access to later target positions." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 58 from our presentation. Masked attention blocks access to later target positions. Open the image for a larger view.</figcaption>
</figure>

For four positions, a causal attention mask allows the lower triangle, including the diagonal:

```text
              Key position
              1  2  3  4
Query 1       ✓  ✗  ✗  ✗
Query 2       ✓  ✓  ✗  ✗
Query 3       ✓  ✓  ✓  ✗
Query 4       ✓  ✓  ✓  ✓
```

A simple teacher-forcing example is:

```text
Decoder input:  <BOS>   I    love    AI
Training label:   I    love   AI    <EOS>
```

The representation at `love` helps predict `AI`; it must not attend to the later input `AI`, which would reveal its label. The attention mask enforces this while preserving parallel computation across training positions. Padding masks exclude padding for a separate reason.

During generation, the next token is appended to the prefix and used for the next prediction. The causal information boundary is therefore compatible with both parallel teacher-forced training and sequential inference.

### Cross-attention connects the target to the source

Self-attention takes queries, keys, and values from the same sequence. In the original decoder’s cross-attention, queries come from its current target-side states, while keys and values come from encoder outputs.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/cross-attention.png"><img src="/assets/images/transformer-internship/cross-attention.png" alt="Decoder queries interact with keys and values derived from the encoder output." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 52 from our presentation. Decoder queries interact with keys and values derived from the encoder output. Open the image for a larger view.</figcaption>
</figure>

$$
\begin{aligned} Q &= X_{\mathrm{decoder}}W_Q \\ K &= X_{\mathrm{encoder}}W_K \\ V &= X_{\mathrm{encoder}}W_V \end{aligned}
$$

For one head, the scores now have shape `[B, T, S]`, not necessarily a square matrix. Each target position chooses a mixture of source-side values. For translation, this creates a route from a partially generated target sentence to relevant source information.

Source padding is masked, but there is ordinarily no causal restriction across valid source positions: the source sentence is already available. Cross-attention is also not exclusive to translation; the same distinction applies whenever queries and the key/value memory come from different representation sets.

A high-level original decoder layer is:

$$
\begin{aligned} u &= \operatorname{LN}\bigl(x+\operatorname{Dropout}(\operatorname{CausalSelfAttention}(x))\bigr) \\ v &= \operatorname{LN}\bigl(u+\operatorname{Dropout}(\operatorname{CrossAttention}(u,X_{\mathrm{encoder}}))\bigr) \\ y &= \operatorname{LN}\bigl(v+\operatorname{Dropout}(\operatorname{FFN}(v))\bigr) \end{aligned}
$$

GPT-style decoder-only models omit the separate encoder–decoder cross-attention stage. The word “decoder” alone does not tell you whether a model has cross-attention; inspect the actual architecture.

<h2 id="temperature">6. The output head, softmax, and temperature</h2>

After the decoder stack, a linear projection maps each target representation to vocabulary-sized logits. Those scores are not probabilities yet.

For positive temperature $\tau$:

$$
p_i = \frac{\exp(z_i/\tau)}{\sum_j \exp(z_j/\tau)},\qquad \tau>0
$$

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/temperature-high.png"><img src="/assets/images/transformer-internship/temperature-high.png" alt="Changing temperature changes the shape of a softmax distribution." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 63 from our presentation. Changing temperature changes the shape of a softmax distribution. Open the image for a larger view.</figcaption>
</figure>

Here is a small worked example using logits `[2, 1, 0]`:

| Temperature | Approximate probabilities |
| --- | --- |
| `0.5` | `[0.867, 0.117, 0.016]` |
| `1.0` | `[0.665, 0.245, 0.090]` |
| `2.0` | `[0.506, 0.307, 0.186]` |

A lower positive temperature concentrates probability on high-scoring choices; a higher temperature spreads it out. Sampling from those distributions changes which continuations can be selected. It does not change which token has the largest logit, and making a distribution sharper does not make the answer more correct.

At zero temperature, practical interfaces usually choose a greedy-decoding convention rather than literally dividing by zero. During standard next-token training, cross-entropy is typically computed directly from logits using a numerically stable implementation.

**Attention softmax and output softmax have different jobs.** Attention normalizes over key positions to mix values. Output softmax normalizes over vocabulary items to support token prediction. The attention scale $1/\sqrt{d_k}$ is not the same setting as a user-controlled generation temperature.

<h2 id="kv-cache">7. KV caching: reuse computation, understand the memory bill</h2>

KV caching belongs here because it primarily accelerates **autoregressive inference**, rather than being an encoder block or a way to train longer sequences for free. Hugging Face’s [caching explanation](https://huggingface.co/docs/transformers/cache_explanation) describes the underlying reuse.

Without caching, a straightforward generation loop repeatedly runs the entire growing prefix. Yet in a causal model, adding a future token does not change an old position’s earlier representation. Its projected keys and values can therefore be reused.

There are two useful phases:

1. **Prefill:** process the prompt and populate each layer’s cache.
2. **Decode:** process the next input token, append its new keys and values, and use its query to attend to cached and current positions.

```text
Old cache:   K₁ … Kₜ₋₁     V₁ … Vₜ₋₁
New token:       Kₜ             Vₜ       plus query Qₜ
Append:      K₁ … Kₜ       V₁ … Vₜ
Attend:      Qₜ against all available keys → mix their values
```

Past queries are not needed to compute the current token’s attention output. Each layer has its own cache. In an encoder–decoder model, projected source keys and values for cross-attention can also be reused while the source stays fixed.

### Caching uses memory to avoid recomputation

The cache grows with context length. For a standard dense cache, an approximate storage calculation is:

$$
\text{KV bytes} \approx 2BLT H_{\mathrm{KV}}d_{\mathrm{head}} \cdot \text{bytes per element}
$$

`2` accounts for keys and values, `L` is the layer count, and $H_{\mathrm{KV}}$ is the number of key/value heads. It equals the query-head count for ordinary multi-head attention, but can differ for grouped-query arrangements.

As a worked example, take `B=1`, `L=32`, `T=4096`, `H_KV=32`, `d_head=128`, and 2-byte elements. That is **2 GiB of KV tensors alone**, excluding weights, temporary tensors, and allocator overhead. Keeping the other values fixed while using 8 KV heads would give 512 MiB; that requires a compatible architecture, not simply deleting heads at runtime.

A new query still attends over the available cached prefix. Caching does not make full-context decoding constant-cost or remove all long-sequence computation.

### What actually reduces cache memory?

[Cache strategies](https://huggingface.co/docs/transformers/kv_cache) offer trade-offs: quantization stores lower-precision KV data, while offloading moves storage between devices. Both can affect latency, and quantization can affect numerical behavior. Dynamic allocation grows with demand; static allocation reserves capacity and can support compilation, but may reserve unused space. Sliding-window caches bound memory only for layers designed to use a limited window, not arbitrary full-attention layers.

The practical question is whether you are constrained by model weights, KV storage, temporary attention tensors, or compute. Those are different bottlenecks.

<h2 id="position">8. Positional encoding: why position matters, and what RoPE changes</h2>

### Why attention needs position information

Imagine rearranging the tokens in “the dog chased the cat.” The same words in a different order can express a different relationship. A content-only self-attention operation has no built-in token index: permuting its input rows correspondingly permutes its outputs. That symmetry is insufficient when sequence order matters.

A causal mask provides a directional constraint, but it is not the same thing as an explicit, expressive position representation.

### Original sinusoidal encoding

The slides introduce position through patterns at multiple frequencies. Binary counting is a useful visual analogy: different coordinates change on different scales. Sinusoids provide a smooth version of that idea.

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/binary-position.png"><img src="/assets/images/transformer-internship/binary-position.png" alt="Binary patterns are an analogy for representing position at several scales." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 14 from our presentation. Binary patterns are an analogy for representing position at several scales. Open the image for a larger view.</figcaption>
</figure>

For position `p` and dimension pair indexed by `i`, the original construction is:

$$
\begin{aligned} \operatorname{PE}(p,2i) &= \sin\!\left(\frac{p}{10000^{2i/D}}\right) \\ \operatorname{PE}(p,2i+1) &= \cos\!\left(\frac{p}{10000^{2i/D}}\right) \end{aligned}
$$

<figure class="article-figure">
  <a href="/assets/images/transformer-internship/sinusoidal-position.png"><img src="/assets/images/transformer-internship/sinusoidal-position.png" alt="Sine and cosine signals give different coordinates different positional frequencies." loading="lazy" width="1500" height="844"></a>
  <figcaption>Slide 12 from our presentation. Sine and cosine signals give different coordinates different positional frequencies. Open the image for a larger view.</figcaption>
</figure>

The position vector is added to the token representation. Different frequencies let coordinates vary over different distance scales. This method is deterministic and can be evaluated at indices beyond those used during training.

### What is limited about adding an absolute position vector?

It is too strong to say that sinusoidal encoding is now simply “bad.” It remains a valid design, and the formula has no fixed learned-table boundary. But being able to calculate an encoding at position 50,000 does not establish that a model trained on much shorter sequences will use it well.

With additive absolute encodings, attention combines content with position through the learned projections. Relative displacement must be expressed through those interactions rather than built directly into the score’s geometry. A learned absolute-position table has a separate issue: indices beyond its configured range require an extension strategy.

Those are reasons to examine alternatives, not proof that one alternative wins on every task.

### RoPE places position inside query–key comparisons

[RoPE, introduced in RoFormer](https://arxiv.org/abs/2104.09864), rotates pairs of query and key coordinates by angles determined by their positions and frequencies. For a two-coordinate pair:

$$
R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
$$

Different coordinate pairs use different frequencies. In a common full-head construction, pair `i` uses $\omega_i=\mathrm{base}^{-2i/d_k}$, and position `p` gives rotation angle $p\omega_i$. The original construction uses base 10,000; implementations can choose other bases or scaling schemes. Applying these small rotations across the coordinate pairs forms the full rotation $R_p$.

Let the unrotated query be at position `m` and the key at `n`:

$$
\begin{aligned} \widetilde q_m &= R_m q_m, \qquad \widetilde k_n = R_n k_n \\ \widetilde q_m^{\mathsf T}\widetilde k_n &= q_m^{\mathsf T}R_m^{\mathsf T}R_n k_n \\ &= q_m^{\mathsf T}R_{n-m}k_n \end{aligned}
$$

The last equality exposes relative displacement in the score. Standard RoPE applies these rotations to queries and keys; values need not be rotated. It provides a relative-position structure without adding a separate bias for every token pair.

RoPE does **not** guarantee useful extrapolation to arbitrary lengths, eliminate dense attention’s quadratic pairwise work, or replace a causal mask. Position scaling and longer-context training still need evaluation. With a cache, keys normally keep their applied rotary positions, and new tokens must use continuing position indices rather than restart at zero.

### One pass through the complete model

To connect the pieces, the original encoder–decoder flow is: embed and position the source; contextualize it with encoder attention and FFNs; embed the shifted target; apply causal target attention; retrieve source information through cross-attention; transform the features; and project to vocabulary scores.

At inference, a decoding rule selects the next token and repeats that process, with caching where supported. No single block does all the work: attention exchanges information, FFNs transform features, residual paths and normalization support optimization, position schemes represent order, and the output head defines prediction scores.

That is the explanation I want to be able to give—not only the names of boxes, but the computation and constraints behind each one.

<h2 id="internship">9. What changed after I started the internship</h2>

After joining as an AI Engineer Intern, I realized that knowing ML, deep learning, and LLMs was not enough. I also needed a stronger understanding of the software around them.

The areas that stood out were **Multi-agent workflows, APIs, Deployment, ...**. They connect model behavior to an application that someone else can run, inspect, and maintain.

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

- [PyTorch RNN documentation](https://docs.pytorch.org/docs/stable/generated/torch.nn.RNN.html) and [LSTM documentation](https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html).
- [He et al., *Deep Residual Learning for Image Recognition*](https://arxiv.org/abs/1512.03385), 2015.
- [PyTorch LayerNorm](https://docs.pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html) and [BatchNorm1d](https://docs.pytorch.org/docs/stable/generated/torch.nn.BatchNorm1d.html) reference pages.
- [Hugging Face: how caching works](https://huggingface.co/docs/transformers/cache_explanation) and [cache strategies](https://huggingface.co/docs/transformers/kv_cache).
