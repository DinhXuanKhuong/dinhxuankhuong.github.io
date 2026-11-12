import test from "node:test";
import assert from "node:assert/strict";
import { summarizeGoals } from "../src/_lib/goals.js";

test("goal totals include completed and fractional progress", () => {
  const summary = summarizeGoals([
    { title: "Finished", progress: 100, url: "/poems.html", note: "A milestone" },
    { title: "Halfway", progress: 50 },
    { title: "Someday" },
  ]);
  assert.equal(summary.earned, 1.5);
  assert.equal(summary.total, 3);
  assert.equal(summary.percent, 50);
  assert.equal(summary.complete, 1);
  assert.equal(summary.inProgress, 1);
  assert.deepEqual(summary.goals.map((goal) => goal.symbol), ["✓", "~", "✗"]);
  assert.equal(summary.goals[0].note, "A milestone");
  assert.equal(summary.goals[0].url, "/poems.html");
});

test("empty lists and zero progress produce valid totals", () => {
  assert.equal(summarizeGoals().total, 0);
  assert.equal(summarizeGoals([]).percent, 0);
  assert.equal(summarizeGoals([{ title: "A wish", progress: 0 }]).earned, 0);
});

test("invalid goal data stops the build with an actionable message", () => {
  for (const progress of [-1, 101, "50", NaN]) {
    assert.throws(() => summarizeGoals([{ title: "A wish", progress }]), /progress must be a number from 0 to 100/);
  }
  assert.throws(() => summarizeGoals([{ title: "" }]), /add a title/);
  assert.throws(() => summarizeGoals([{ title: "A wish", url: "javascript:alert(1)" }]), /use an https/);
  assert.throws(() => summarizeGoals([{ title: "A wish", url: "//example.com" }]), /use an https/);
});
