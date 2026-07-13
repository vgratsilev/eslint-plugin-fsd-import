# Promotion Roadmap

The technical foundation of `eslint-plugin-fsd-import` is in place: the plugin covers the main FSD boundaries, supports both legacy and flat config, includes rule documentation, and verifies the published package surface.

The next goal is to improve discoverability and bring in developers who already use Feature-Sliced Design, ESLint, or need a way to enforce module boundaries. The focus is on clear educational materials, relevant communities, and useful integrations rather than artificial engagement.

## Stage 1. Create a short demo GIF or video

### What we are doing

Show the plugin in action on a small but realistic FSD project: an invalid import violates a slice boundary, ESLint catches the problem, and the developer changes the import to use a public API.

### How we are doing it

1. Prepare a minimal demo project or fixture with a clear `src/<layer>/<slice>` structure.
2. Choose one main scenario for the recording:
   - importing an internal module from another slice;
   - showing the ESLint diagnostic and rule name;
   - changing the import to use a public API.
3. Record a 30–60-second GIF or short video with readable code and terminal output.
4. Add a link or embed near the quick start section in the README.
5. Reuse the same material in the GitHub description, release notes, and community posts.

### How we verify it

1. The scenario can be reproduced from a clean checkout without any hidden manual steps.
2. The command and configuration shown in the demo match the current plugin API.
3. The code and diagnostics remain readable on a laptop screen.
4. The README link or asset works after publication.

## Stage 2. Publish a detailed practical article

### What we are doing

Write an article for Dev.to or Hashnode about enforcing boundaries in Feature-Sliced Design, using `eslint-plugin-fsd-import` as the practical solution.

### How we are doing it

1. Frame the title around a problem developers actively search for, for example: “How to Prevent Feature-Sliced Design Boundary Violations with ESLint”.
2. Build the article around a working example:
   - why FSD boundaries are easy to violate unnoticed;
   - an example of an invalid import;
   - installation and basic configuration;
   - which rules to enable and when to keep a rule opt-in;
   - migrating an existing project;
   - limitations and cases where the plugin should not make project-specific decisions.
3. Link to the demo, README, npm package, and individual rule docs.
4. Verify every code example with the existing tests or a minimal fixture.
5. If the article is published on multiple platforms, choose a canonical version and link back to it.

### How we verify it

1. A new user can follow the quick start without reading the source code.
2. All examples match the current rule names and configuration API.
3. The article answers practical questions: what the plugin catches, what it does not catch, and how to adopt it incrementally.
4. After publication, measure repository and npm traffic rather than article views alone.

## Stage 3. Share the project in relevant communities

### What we are doing

Share the plugin in communities where Feature-Sliced Design, frontend architecture, ESLint, and TypeScript are already being discussed.

### How we are doing it

1. Build a short list of active, relevant channels: FSD communities, frontend architecture groups, ESLint/JavaScript/TypeScript communities, and channels run by educators.
2. Check each community's posting rules and adapt the message to its context.
3. Use a concise format:
   - the problem and who encounters it;
   - one before-and-after example;
   - the demo;
   - a link to the README or article;
   - a request for meaningful feedback.
4. Answer questions and collect real use cases instead of posting the same promotional text everywhere.
5. Record where each relevant user or issue came from.

### How we verify it

1. Every post has a clear audience and a reason the plugin may be useful to them.
2. Posts follow the community rules and do not look like mass spam.
3. Feedback produces questions, issues, pull requests, or visits from FSD/ESLint developers.
4. After several weeks, compare channels by quality of outcome: adoption, issues, stars, forks, and contributions.

## Stage 4. Offer integrations to starter template and educational repository maintainers

### What we are doing

Find projects where `eslint-plugin-fsd-import` could be useful by default: FSD starter templates, boilerplates, courses, and educational repositories.

### How we are doing it

1. Build a list of 5–10 active repositories with maintainers and clear FSD usage.
2. Check each repository's structure, ESLint setup, and actual compatibility with the plugin's rules.
3. Prepare a short, personalized proposal with a concrete benefit for the project:
   - add the plugin to the starter;
   - enable safe recommended rules;
   - add a configuration example;
   - strengthen the existing documentation about architectural boundaries.
4. Offer a small, ready-to-review PR or a focused issue instead of a generic promotional message.
5. Respect contribution guidelines and avoid sending mass, identical outreach messages.

### How we verify it

1. Each proposed integration is tested against the target repository's configuration and structure.
2. The proposal explains a concrete project problem and does not promise capabilities the plugin does not have.
3. Record every outreach attempt and result: link, date, status, maintainer response, and next step.
4. Successful integrations receive a link from the plugin's README, showcase, or release notes.

## Stage 5. Measure results and repeat the effective channels

### What we are doing

Determine which materials and channels bring real users, then direct future effort toward them.

### How we are doing it

1. Record baseline values before publishing: npm downloads, repository visits, issues, stars, forks, and contributions.
2. Use separate links or tracking labels for the demo, article, communities, and integration outreach where the platform supports them.
3. Every 2–4 weeks, review not only reach but also the user journey: visit → installation → issue/feedback → continued use.
4. Update the README, demo, and article based on recurring user questions.
5. Repeat formats that lead to relevant visits and adoption; do not spend time on channels that produce only artificial activity.

### How we verify it

1. For every channel, we can estimate how many relevant visits, installations, or feedback items it generated.
2. Add only evidence-based improvements to the roadmap.
3. Turn new user requests into issues or separate technical tasks when they require changes to the plugin.

## General principles

- Demonstrate the plugin's real value with working examples.
- Keep all materials synchronized with the current API, README, and rule docs.
- Choose a relevant audience over the broadest possible audience.
- Make outreach personal and useful instead of mass promotion.
- Do not use bots, engagement manipulation, or artificial activity.
- Measure adoption, feedback, and community contributions—not only views.

## Order of execution

1. Prepare the demo GIF or video.
2. Publish the practical walkthrough article.
3. Share the demo and article in relevant communities.
4. Propose targeted integrations to starter templates and educational repositories.
5. Measure the results and repeat the most effective actions.
