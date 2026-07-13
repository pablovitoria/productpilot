# ProductPilot

ProductPilot is an AI-assisted product discovery workspace designed to help Product Managers turn unstructured customer feedback into evidence-backed product decisions.

Rather than asking AI to make product decisions, ProductPilot uses a human-in-the-loop workflow: AI synthesizes feedback and identifies potential opportunities, while the Product Manager validates evidence, adds product and business context, challenges assumptions, and owns the final decision.

> 🚧 ProductPilot is currently an active MVP under development.

## The Problem

Product Managers receive customer feedback from interviews, reviews, surveys, support tickets, sales conversations, and internal teams.

The difficult part is not collecting feedback. It is turning qualitative signals into structured product opportunities, connecting those opportunities to relevant data, and clearly documenting the reasoning behind a product decision.

## Product Workflow

Customer Feedback  
→ AI Analysis  
→ Opportunity Selection  
→ PM Decision Workspace  
→ AI Challenge  
→ Product Artifact

The workflow is intentionally guided rather than chatbot-based.

## MVP

The MVP focuses on one end-to-end product discovery workflow.

A Product Manager can:

- Paste unstructured customer feedback.
- Review and edit AI-generated synthesis.
- Explore potential product opportunities.
- Validate customer evidence and add product metrics.
- Add business context and assess the opportunity.
- Challenge assumptions before making a decision.
- Generate a Product Decision Canvas, Epic Draft, or PRD Draft.

## Product Principle

**AI proposes. Product Managers decide.**

ProductPilot is designed to accelerate product thinking without removing the human judgment required for strong product decisions.

## Success

The primary MVP objective is to reduce the average time required to move from unstructured customer feedback to a structured product decision by at least 50%.

## Current Status

The product workflow and MVP have been defined and documented.

Implementation is currently in progress using Next.js, React, TypeScript, and Tailwind CSS.

The current prototype includes:

- Customer feedback input
- AI analysis workflow
- Editable AI synthesis
- AI transparency interactions

Additional workflow screens are actively being implemented.

## Product Documentation

Detailed product documentation is available in the [`product`](./product) directory, including:

- Product Brief
- MVP Definition
- User Flow
- Screen Specifications
- Success Metrics
- Technical Architecture

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Cursor-assisted development

## About This Project

I built ProductPilot to explore a question I have repeatedly encountered in product work:

**How can AI make product discovery faster and more evidence-based without replacing Product Manager judgment?**

This repository documents the product from initial definition and workflow design through implementation.
