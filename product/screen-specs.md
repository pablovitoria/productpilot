# Screen Specifications

## Design Principles

- The experience should feel guided, not conversational.
- AI proposes; Product Managers decide.
- Every screen should help the user make one clear decision.
- Minimize unnecessary writing by prefilling AI drafts whenever possible.
- The interface should feel clean, structured, and opinionated, inspired by Linear and Vercel.

---

# Screen 1 — Home

### Goal

Start a new product discovery workflow.

### User sees

- ProductPilot logo
- Short product description
- Large text area to paste customer feedback
- Example placeholder text
- "Analyze Feedback" button

### User actions

- Paste customer feedback
- Start analysis

### AI responsibilities

None.

### System behavior

- Validate that customer feedback has been entered.
- Display an error if the text box is empty.
- Allow large amounts of pasted text.

### Navigation

Analyze Feedback → AI Analysis

### Success criteria

The user understands what ProductPilot does and starts a workflow in under one minute.

---

# Screen 2 — AI Analysis

### Goal

Help the Product Manager quickly understand the customer feedback before evaluating opportunities.

### User sees

Five analysis cards:

- Themes
- Pain Points
- Customer Quotes
- Sentiment Overview
- Emerging Patterns

Below the analysis:

- Loading summary
- "Continue" button

### User actions

- Review the analysis
- Continue

### AI responsibilities

Generate a first-pass synthesis of the customer feedback.

### System behavior

- Organize the analysis into clear sections.
- Every generated section should remain editable later in the workflow.

### Navigation

Continue → Opportunity Selection

### Success criteria

The Product Manager understands the main customer problems without reading every individual comment.

---

# Screen 3 — Opportunity Selection

### Goal

Help the Product Manager choose which opportunity should be evaluated further.

### User sees

Three to five opportunity cards.

Each card includes:

- Opportunity title
- Short description
- Supporting evidence
- Estimated confidence

### User actions

- Compare opportunities
- Select one opportunity

### AI responsibilities

Generate multiple potential opportunities rather than recommending a single solution.

### System behavior

- Only one opportunity can be selected.
- The selected opportunity becomes the basis for the remainder of the workflow.

### Navigation

Select Opportunity → Decision Workspace

### Success criteria

The Product Manager selects one opportunity for further evaluation.

---

# Screen 4 — Decision Workspace

### Goal

Guide the Product Manager through a structured decision-making process that combines AI-generated insights with business context, supporting evidence, and human judgment before generating any output.

### User sees

A sticky summary card at the top showing:

- Selected Opportunity
- Evidence Strength
- Business Objective
- Decision Confidence
- Decision Readiness

Below, the workspace is divided into five decision blocks.

---

## Decision Block 1 — Problem Validation

### Purpose

Confirm that the selected opportunity represents a real customer problem worth solving.

### AI pre-fills

- Problem Statement
- Opportunity Description
- Initial Rationale

### PM actions

- Edit the problem statement
- Validate or reject the opportunity
- Add additional context if needed

---

## Decision Block 2 — Supporting Evidence

### Purpose

Combine qualitative customer insights with quantitative business evidence.

### Customer Evidence (AI-generated)

AI prepares a first draft including:

- Themes
- Pain points
- Representative customer quotes
- Frequency of mentions

The Product Manager can:

- Edit
- Remove
- Add additional evidence

### Business Evidence (PM-driven)

The Product Manager strengthens the opportunity with supporting business information.

Examples include:

- Product metrics
- Conversion
- Retention
- Feature adoption
- Revenue impact
- Customer segments
- Support volume
- Operational KPIs
- Any custom metric

AI suggests the most relevant metrics based on the selected opportunity, but the Product Manager decides which evidence to include.

---

## Decision Block 3 — Business Context

### Purpose

Capture the strategic reasoning behind the opportunity.

Questions include:

- Which business objective does this support?
- Why is this important now?
- Which users are affected?
- What happens if this problem is not solved?

Whenever possible, use structured inputs (dropdowns, chips, selectors) instead of large text boxes.

---

## Decision Block 4 — Opportunity Assessment

### Purpose

Evaluate the opportunity using structured ratings rather than long-form writing.

Assess:

- Customer Impact
- Business Impact
- Strategic Alignment
- Confidence
- Estimated Effort (optional)

This section supports structured thinking rather than automated prioritization.

---

## Decision Block 5 — Recommendation

### Purpose

Determine the recommended next step.

Options include:

- Build MVP
- Create Prototype
- Run Experiment
- Gather More Research
- Park for Later

AI may suggest a recommendation, but the Product Manager always makes the final decision.

---

## Decision Readiness

Throughout the workflow, ProductPilot tracks progress with a checklist.

Example:

- ✅ Problem validated
- ✅ Customer evidence reviewed
- ✅ Business evidence added
- ✅ Business context completed
- ✅ Opportunity assessed
- ⏳ AI Challenge pending

This helps the Product Manager understand whether the opportunity has been fully evaluated before generating an output.

### User actions

- Edit AI-generated content
- Add supporting business evidence
- Complete the structured evaluation
- Make the final recommendation

### AI responsibilities

- Generate first drafts
- Organize customer evidence
- Suggest relevant business metrics
- Keep the workspace structured
- Never make the final decision

### System behavior

- Every AI-generated section remains editable.
- Every recommendation is traceable back to supporting evidence.

### Navigation

Continue → AI Challenge

### Success criteria

The Product Manager has evaluated the opportunity using customer evidence, business evidence, business context, and structured judgment.

---

# Screen 5 — AI Challenge

### Goal

Challenge assumptions before generating the final output.

### User sees

A list of observations, questions, or potential blind spots.

Examples:

- Missing supporting evidence
- Contradictory product metrics
- Alternative interpretations
- Additional research suggestions

### User actions

- Accept feedback
- Ignore feedback
- Return to the previous screen to make changes

### AI responsibilities

Act as a thinking partner rather than validating every decision.

### System behavior

The Product Manager can revisit the Decision Workspace before continuing.

### Navigation

Back → Decision Workspace

Continue → Output Selection

### Success criteria

The Product Manager has considered the AI's challenges before generating the final artifact.

---

# Screen 6 — Output Selection

### Goal

Generate the artifact that best supports the next stage of the product lifecycle.

### User sees

Three output options:

- Product Decision Canvas
- Epic Draft
- PRD Draft

A preview of the generated output.

Export options.

### User actions

- Select output type
- Generate
- Copy
- Export

### AI responsibilities

Generate the selected artifact using the validated information collected throughout the workflow.

### System behavior

Only validated information should be included in the generated artifact.

### Navigation

Finish

or

Start New Workflow

### Success criteria

The Product Manager leaves with a high-quality artifact ready to share with product, engineering, or business stakeholders.
