import { storyState } from "./state.js";
import { storyYear2026 } from "../assets/storyYears/2026/annualEvents.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderParagraphs(value = "") {
  if (!value) {
    return "";
  }

  return String(value)
    .split("\n\n")
    .map(
      paragraph =>
        `<p>${escapeHtml(paragraph)}</p>`
    )
    .join("");
}

function ensureFinalOutputs() {
  if (!storyState.outputs) {
    storyState.outputs = {};
  }

  if (
    typeof storyState.outputs.yearStory !==
    "string"
  ) {
    storyState.outputs.yearStory = "";
  }

  if (
    !storyState.outputs.closingReflection
  ) {
    storyState.outputs.closingReflection = {
      clarified: "",
      intention: "",
      release: "",
      remember: "",
      dedication: ""
    };
  }

  return storyState.outputs;
}

function renderCompletedChapterReview() {
  const storyEntries =
    storyYear2026.events
      .map(event => {
        const story =
          storyState.outputs
            .annualEventStories?.[
              event.id
            ];

        if (!story) {
          return "";
        }

        const reflection =
          story.participantReflection || "";

        return `
          <details style="margin-bottom: 16px;">
            <summary>
              <strong>
                ${escapeHtml(story.title)}
              </strong>
            </summary>

            <div style="margin-top: 12px;">
              ${renderParagraphs(
                story.narrative
              )}

              ${
                reflection
                  ? `
                    <h4>In Your Own Words</h4>
                    <p>
                      ${escapeHtml(
                        reflection
                      )}
                    </p>
                  `
                  : ""
              }
            </div>
          </details>
        `;
      })
      .filter(Boolean)
      .join("");

  const characterSketch =
    storyState.outputs.characterSketch || "";

  const characterReflection =
    storyState.selections.reflection || "";

  return `
    <section style="margin: 30px 0;">
      <h3>Review What You’ve Written</h3>

      <p>
        Open any section you would like to revisit
        before writing your story of the year.
      </p>

      ${
        characterSketch
          ? `
            <details style="margin-bottom: 16px;">
              <summary>
                <strong>
                  Your Character Sketch
                </strong>
              </summary>

              <div style="margin-top: 12px;">
                ${renderParagraphs(
                  characterSketch
                )}

                ${
                  characterReflection
                    ? `
                      <h4>In Your Own Words</h4>
                      <p>
                        ${escapeHtml(
                          characterReflection
                        )}
                      </p>
                    `
                    : ""
                }
              </div>
            </details>
          `
          : ""
      }

      ${
        storyEntries ||
        `
          <p>
            Your completed chapters will appear
            here as you move through the full
            Storybook journey.
          </p>
        `
      }
    </section>
  `;
}

function renderYearStory({
  app,
  advanceStory,
  render
}) {
  const outputs = ensureFinalOutputs();

  app.innerHTML = `
    <h2>Write Your 2026 Story</h2>

    <p><strong>You did it.</strong></p>

    <p>
      You’ve worked through the major turning
      points of the year and explored how each
      one may affect you on a personal level.
      Now it’s time to step back and weave those
      insights into a single, coherent story.
    </p>

    <p>
      Review what you’ve written so far. Notice
      which themes, moments, or realizations feel
      most alive or relevant right now. Use those
      pieces as the foundation for your story of
      the year ahead.
    </p>

    ${renderCompletedChapterReview()}

    <h3>Spend some time journaling about:</h3>

    <ul>
      <li>
        What are the main focus areas of your
        life in the coming year?
      </li>
      <li>
        What are you feeling hopeful or excited
        about?
      </li>
      <li>
        What challenges might arise—and how do
        you expect to meet them?
      </li>
      <li>
        What feel like the essential lessons this
        year is asking you to learn?
      </li>
    </ul>

    <p>
      This isn’t about prediction or perfection.
      It’s about intention, awareness, and
      authorship.
    </p>

    <p>
      You’re naming the story you’re stepping
      into—and how you want to move through it.
    </p>

    <textarea
      id="yearStoryInput"
      rows="14"
      style="width: 100%;"
      placeholder="Write your 2026 story in your own words."
    >${escapeHtml(
      outputs.yearStory
    )}</textarea>

    <p
      id="yearStoryError"
      style="display: none;"
    >
      Please write something about the story
      you are stepping into before continuing.
    </p>

    <br>

    <button id="backToFinalAnnualStory">
      Back
    </button>

    <button id="continueToClosingReflection">
      Continue
    </button>
  `;

  function saveYearStory() {
    outputs.yearStory =
      document
        .getElementById(
          "yearStoryInput"
        )
        .value
        .trim();
  }

  document
    .getElementById(
      "backToFinalAnnualStory"
    )
    .addEventListener("click", () => {
      saveYearStory();

      storyState.currentAnchorId =
        "annualEventComplete";

      render();
    });

  document
    .getElementById(
      "continueToClosingReflection"
    )
    .addEventListener("click", () => {
      saveYearStory();

      if (!outputs.yearStory) {
        document.getElementById(
          "yearStoryError"
        ).style.display = "block";

        return;
      }

      advanceStory();
      render();
    });
}

function renderClosingReflection({
  app,
  advanceStory,
  render
}) {
  const outputs = ensureFinalOutputs();
  const closing =
    outputs.closingReflection;

  const questions = [
    {
      id: "clarifiedReflection",
      key: "clarified",
      label:
        "What feels newly clarified about who you are right now?"
    },
    {
      id: "intentionReflection",
      key: "intention",
      label:
        "What intention feels most important to carry into the year ahead?"
    },
    {
      id: "releaseReflection",
      key: "release",
      label:
        "What are you ready to release?"
    },
    {
      id: "rememberReflection",
      key: "remember",
      label:
        "What do you want to remember when things feel uncertain or intense?"
    }
  ];

  const questionFields =
    questions
      .map(
        question => `
          <label for="${question.id}">
            <strong>
              ${escapeHtml(
                question.label
              )}
            </strong>
          </label>

          <textarea
            id="${question.id}"
            rows="4"
            style="width: 100%;"
            placeholder="Write in your own words."
          >${escapeHtml(
            closing[question.key]
          )}</textarea>

          <br><br>
        `
      )
      .join("");

  app.innerHTML = `
    <h2>Closing Reflection</h2>

    <p><strong>Take a moment to pause.</strong></p>

    <p>
      You’ve explored the character you’re
      becoming, the setting you’re moving through,
      and the forces shaping the year ahead.
      You don’t need to hold all of it at once.
      What matters most is what stayed with you.
    </p>

    <p>
      Before you close this Storybook, reflect
      on the questions below.
    </p>

    ${questionFields}

    <h3>
      A dedication, a promise, or a guiding
      principle
    </h3>

    <p>
      This doesn’t need to be grand. Simple and
      honest is enough.
    </p>

    <textarea
      id="dedicationReflection"
      rows="6"
      style="width: 100%;"
      placeholder="Write a few final sentences, if you would like."
    >${escapeHtml(
      closing.dedication
    )}</textarea>

    <p
      id="closingReflectionError"
      style="display: none;"
    >
      Please respond to the four reflection
      questions before continuing.
    </p>

    <br>

    <button id="backToYearStory">
      Back
    </button>

    <button id="completeStorybook">
      Complete My Storybook
    </button>
  `;

  function saveClosingReflection() {
    questions.forEach(question => {
      closing[question.key] =
        document
          .getElementById(
            question.id
          )
          .value
          .trim();
    });

    closing.dedication =
      document
        .getElementById(
          "dedicationReflection"
        )
        .value
        .trim();
  }

  document
    .getElementById(
      "backToYearStory"
    )
    .addEventListener("click", () => {
      saveClosingReflection();

      storyState.currentAnchorId =
        "yearStory";

      render();
    });

  document
    .getElementById(
      "completeStorybook"
    )
    .addEventListener("click", () => {
      saveClosingReflection();

      const allComplete =
        questions.every(
          question =>
            closing[question.key]
        );

      if (!allComplete) {
        document.getElementById(
          "closingReflectionError"
        ).style.display = "block";

        return;
      }

      advanceStory();
      render();
    });
}

function renderStorybookComplete({
  app,
  render
}) {
  const outputs = ensureFinalOutputs();
  const closing =
    outputs.closingReflection;

  app.innerHTML = `
    <h2>Your 2026 Storybook Is Complete</h2>

    <p>
      Keep this Storybook somewhere accessible.
      Return to it when you need perspective,
      reassurance, or a reminder of what you set
      in motion.
    </p>

    ${
      outputs.yearStory
        ? `
          <section style="margin: 30px 0;">
            <h3>Your 2026 Story</h3>
            ${renderParagraphs(
              outputs.yearStory
            )}
          </section>
        `
        : ""
    }

    ${
      closing.dedication
        ? `
          <section style="margin: 30px 0;">
            <h3>
              Your Dedication or Guiding Principle
            </h3>

            ${renderParagraphs(
              closing.dedication
            )}
          </section>
        `
        : ""
    }

    <section style="margin-top: 38px;">
      <p><strong>
        The story is already unfolding.
      </strong></p>

      <p><strong>
        You are not behind.
      </strong></p>

      <p><strong>
        You are participating.
      </strong></p>
    </section>

    <button id="backToClosingReflection">
      Back
    </button>
  `;

  document
    .getElementById(
      "backToClosingReflection"
    )
    .addEventListener("click", () => {
      storyState.currentAnchorId =
        "closingReflection";

      render();
    });
}

export function renderFinalSectionsAnchor({
  anchorId,
  app,
  advanceStory,
  render
}) {
  if (anchorId === "yearStory") {
    renderYearStory({
      app,
      advanceStory,
      render
    });

    return true;
  }

  if (anchorId === "closingReflection") {
    renderClosingReflection({
      app,
      advanceStory,
      render
    });

    return true;
  }

  if (anchorId === "storybookComplete") {
    renderStorybookComplete({
      app,
      render
    });

    return true;
  }

  return false;
}
