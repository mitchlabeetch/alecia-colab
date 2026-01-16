# Palette's Journal

This journal records critical UX and accessibility learnings from the `alecia-colab` project.

## Format
`## YYYY-MM-DD - [Title]`
**Learning:** [UX/a11y insight]
**Action:** [How to apply next time]

## 2026-01-16 - Accessibility in Sidebar and Collapsible Sections
**Learning:** Icon-only buttons in the sidebar and collapsible toggles were missing accessible names and state indicators, making navigation difficult for screen reader users.
**Action:** Always add `aria-label` to icon-only buttons and `aria-expanded`/`aria-controls` to toggle elements. Used `useId` for stable ID generation in collapsible sections.
