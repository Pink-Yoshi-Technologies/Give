# Contribution to Give
Welcome! We're excited you're interested in contributing to Give, a project developed by Pink Yoshi Technologies for the University of Auckland's SOFTENG 310 course. This document outlines the process for filing bug reports, suggesting features, submitting pull requests, and more.

> Note: Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.

## How to File a Bug Report
1. Go to the [Issues](./issues) tab.
2. Click **New Issue** and select **Bug Report**.
3. Fill in all required sections:
   * What happened?
   * Steps to reproduce
   * Expected behaviour
   * Environment (OS, browser, etc.)
4. Check for duplicates before submitting.
5. Tag your issue with the `bug` label.
6. A team member will review and approve the issue before anyone begins work.

## How to Suggest a New Feature
1. Go to the [Issues](./issues) tab.
2. Click **New Issue** and select **Feature Request**.
3. Clearly describe:
   * What you'd like to see
   * Why it's valuable
   * Any dependencies
4. Label your issue with `enhancement`.
5. The team will evaluate it during our weekly meeting and mark it as approved or accepted.

## How to Submit a Pull Request (PR)
> You **must** be assigned to an approved issue before starting a PR.
1. Fork the repository and clone it locally.
2. Create a **feature branch**:
   `git checkout -b feature/your-issue-title`
3. Make your changes and add tests.
4. Ensure the test suite passes:
   `npm test`
5. Create a pull request with:
   * A clear title (not just "Fix #12", but e.g., `Fix login timeout issue (#12)`)
   * A description of the changes
   * A link to the associated issue (`Closes #12`)
6. A peer will review the code:
   * They will run the code and tests
   * Request changes if necessary
   * Approve once it meets standards
7. Once approved, the PR will be **squashed and merged** by a designated team member.

**Note:** Do _not_ merge without approval. PRs merged without review will result in lost marks.

## Setting up Your Development Environment
1. Clone the repository:
   ```
   git clone https://github.com/Pink-Yoshi-Technologies/Give.git
   cd Give
   ```
2. Install dependencies:
   * JavaScript: `npm install`
3. Run the tests:
   `npm test`

## Types of Contributions We're Looking For
We welcome:
* Feature development
* Bug fixes
* Writing tests
* Improving documentation
* Code reviews
* Accessibility improvements

We do _not_ accept:
* Style-only changes (e.g. reformatting) unless part of another PR
* Unapproved features
* Code without associated issues

## Newcomer-Friendly Contributions
* Look for issues with the `good first issue` label
* These are great starting points with mentoring available
* Join our [weekly group meeting] (see [wiki](../../wiki)) or ask questions in issue comments

## Technical Contribution Requirements
* Each code contribution **must include relevant tests**
* Follow our style guide
* Use meaningful commit messages
* Document your code clearly (docstrings/comments)

## Roadmap and Vision
Our goal is to develop a robust and maintainable web app for Give in **A1**, enabling a new team to extend it in **A2**.

Key upcoming milestones:
* MVP complete by August 22.
* Wiki maintained with up-to-date architecture and contribution summaries.
See the [wiki](../../wiki) and issue board for a breakdown of features by phase.

## Architecture Overview
The system consists of the following high-level components:
```
Client (React/Javascript)
  ↓
Backend (Node)
  ↓
Data Layer (Firebase)
```
For more, visit the wiki.

## Ground Rules and Etiquette
* Be respectful and inclusive - see our [Code of Conduct](./CODE_OF_CONDUCT.md)
* Use issue comments and PR discussions to coordinate
* Only work on assigned and approved issues
* One open claimed issue per contributor at a time
* Document all discussion outcomes on relevant issues or PRs

## Getting in touch
* Use GitHub Issues and Pull Request comments for all communication
