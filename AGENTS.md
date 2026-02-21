# NurseSync — Agent Guidelines (AGENTS.md)

> **Read this file FIRST before touching any code.**  
> All agents (CLIs) working on NurseSync **MUST** follow these rules without exception.

---

## 1. Golden Rules

1. **One owner per file.** Never modify a file that is not assigned to you (see Agent Assignment below). If you need a change in another agent's file, document it in `PROGRESS.md` as a `REQUEST`.
2. **Pull before push.** Always `git pull --rebase` before committing. If `PROGRESS.md` has changed, read it first.
3. **Update PROGRESS.md** after every meaningful unit of work. Commit the progress update with your code change.
4. **Never break the build.** Run `./gradlew composeApp:compileKotlinMetadata` before committing. If it fails, fix it before pushing.
5. **Clean commits.** One logical change per commit. Use the format: `[AgentName] feat/fix/refactor: short description`
6. **No wildcard imports.** Always use explicit imports.
7. **No hardcoded strings in UI.** All user-facing text goes in `composeResources/values/strings.xml`.

---

## 2. Project Structure

```
composeApp/src/commonMain/kotlin/exceptionallybad/nursesync/
├── app/          # App entry, theme, navigation
├── core/         # DI, network, database, platform abstractions, utils
├── domain/       # Models, repository interfaces, use cases (PURE KOTLIN)
├── data/         # Repository implementations, data sources, mappers
└── feature/      # UI screens + ViewModels, grouped by feature
```

### Dependency Rules

```
feature → domain, data
data → domain, core
domain → (nothing, pure Kotlin only)
core → (platform libs only)
```

> ⚠️ **`domain/` must have ZERO Android/iOS imports.** It is pure Kotlin.

---

## 3. Agent Assignment

| Agent | System Prompt | Owned Packages | Responsibilities |
|---|---|---|---|
| **Aarav** | `Aarav.md` | `app/`, `core/`, `domain/`, `data/`, `feature/auth/`, `feature/dashboard/` | Project scaffolding, core infra, DI, theme, navigation, auth flow, dashboard |
| **ArnavSharma** | `ArnavSharma.md` | `feature/voicelog/`, `feature/logentry/`, platform audio & STT impls | Voice recording, STT integration, log CRUD, transcript editing |
| **Ishaan** | `Ishaan.md` | `feature/handoff/`, `feature/tasks/`, `feature/discharge/` | Handoff summary, task priority system, discharge summaries |
| **Anshuman** | `Anshuman.md` | `feature/prescription/`, `feature/chat/`, `feature/settings/` | Prescription upload/matching, AI chat, settings & preferences |

### Shared File Protocol

Some files are **shared** and require coordination:

| File | Owner | Others May |
|---|---|---|
| `domain/model/*.kt` | Aarav (initial) | Request additions via PROGRESS.md |
| `domain/repository/*.kt` | Aarav (initial) | Request new methods via PROGRESS.md |
| `core/di/AppModule.kt` | Aarav | Request new module includes via PROGRESS.md |
| `app/navigation/NavGraph.kt` | Aarav | Request new routes via PROGRESS.md |
| `app/navigation/Screen.kt` | Aarav | Request new screens via PROGRESS.md |
| `libs.versions.toml` | Aarav | Request new deps via PROGRESS.md |
| `build.gradle.kts` (composeApp) | Aarav | Request new deps via PROGRESS.md |

---

## 4. PROGRESS.md Protocol

### Format

```markdown
## [TIMESTAMP] [AGENT_NAME] — [STATUS]

**Status:** STARTED | IN_PROGRESS | COMPLETED | BLOCKED | REQUEST
**Files touched:** list of files
**Description:** what was done
**Blockers:** any blocking issues
**Requests:** changes needed from other agents
```

### Workflow

1. **Before starting work**: `git pull --rebase`, read latest `PROGRESS.md`
2. **After completing a unit**: Update `PROGRESS.md` with your entry
3. **Commit**: `git add . && git commit -m "[AgentName] description" && git push`
4. **If you see a REQUEST for you**: Address it, then mark it COMPLETED

---

## 5. Code Style

- Follow `SKILLS.md` for all Kotlin patterns
- Use `@Composable` naming: PascalCase for composables, camelCase for everything else
- Max line length: 120 characters
- Use trailing commas in multi-line parameter lists
- Prefer `data class` for state objects
- Prefer `sealed class/interface` for type hierarchies
- All ViewModels extend `ViewModel()` from `androidx.lifecycle`
- All repository methods return `Result<T>` or `Flow<T>`

---

## 6. Git Branch Strategy

All agents work on `main` directly (for simplicity with many concurrent agents). The PROGRESS.md coordination prevents conflicts since each agent owns distinct files.

If conflicts arise:
1. `git pull --rebase`
2. Resolve conflicts in YOUR files only
3. For conflicts in shared files, coordinate via PROGRESS.md

---

## 7. Commit Message Format

```
[AgentName] type: short description

type = feat | fix | refactor | docs | test | chore
```

**Examples:**
```
[Aarav] feat: add Koin DI modules for core layer
[ArnavSharma] feat: implement VoiceLogScreen with recording controls
[Ishaan] fix: correct task priority sorting order
[Anshuman] refactor: extract chat message parsing to util
```

---

## 8. Testing Requirements

- Unit tests for all use cases
- Unit tests for all mappers
- ViewModel tests using Turbine for Flow assertions
- Place tests in `commonTest/kotlin/exceptionallybad/nursesync/`
- Mirror the source structure in tests

---

## 9. Definition of Done

A feature is "done" when:
- [ ] Code compiles without errors
- [ ] All screens render correctly in Preview
- [ ] Unit tests pass
- [ ] No hardcoded strings
- [ ] PROGRESS.md updated
- [ ] Code committed and pushed
- [ ] No unresolved REQUESTs from other agents
