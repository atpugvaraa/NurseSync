# NurseSync — Kotlin & KMP Best Practices (SKILLS.md)

> **Every agent MUST follow these practices. No exceptions.**

---

## 1. Kotlin Idioms

### 1.1 Immutability First
```kotlin
// ✅ DO: Use val, immutable collections, data classes
val patients: List<Patient> = emptyList()
data class Patient(val id: String, val name: String)

// ❌ DON'T: Use var unless absolutely necessary
var patients: MutableList<Patient> = mutableListOf()
```

### 1.2 Null Safety
```kotlin
// ✅ DO: Use safe calls, elvis operator, smart casts
val name = patient?.name ?: "Unknown"
val length = (input as? String)?.length ?: 0

// ❌ DON'T: Use !! except in tests
val name = patient!!.name  // NEVER in production code
```

### 1.3 Scope Functions
```kotlin
// ✅ Use let for null checks + transformation
patient?.let { saveToDatabase(it) }

// ✅ Use apply for object configuration
val client = HttpClient().apply {
    install(ContentNegotiation) { json() }
    install(Logging) { level = LogLevel.BODY }
}

// ✅ Use also for side effects
val result = repository.save(entry).also { logger.d { "Saved: $it" } }

// ✅ Use run for scoped computations
val result = patient.run {
    "$name (Bed: $bed, Ward: $ward)"
}

// ❌ DON'T nest scope functions (max 1 level deep)
patient?.let { p ->
    p.prescriptions.let { rx ->       // ❌ Nested — hard to read
        rx.firstOrNull()?.let { /* */ }
    }
}
```

### 1.4 Extension Functions
```kotlin
// ✅ Use for domain-specific operations
fun Instant.toDisplayString(): String =
    this.toLocalDateTime(TimeZone.currentSystemDefault())
        .let { "${it.hour}:${it.minute.toString().padStart(2, '0')}" }

fun Float.toConfidenceLabel(): String = when {
    this >= 0.85f -> "High"
    this >= 0.70f -> "Medium"
    else -> "Low"
}
```

### 1.5 Sealed Hierarchies
```kotlin
// ✅ Use sealed interface for lightweight type unions
sealed interface UiEvent {
    data class Click(val id: String) : UiEvent
    data object Refresh : UiEvent
    data class TextChanged(val text: String) : UiEvent
}

// ✅ Exhaustive when expressions
fun handle(event: UiEvent) = when (event) {
    is UiEvent.Click -> { /* ... */ }
    UiEvent.Refresh -> { /* ... */ }
    is UiEvent.TextChanged -> { /* ... */ }
}
```

---

## 2. Coroutines & Flow

### 2.1 Structured Concurrency
```kotlin
// ✅ Always launch coroutines from a CoroutineScope (viewModelScope)
class MyViewModel : ViewModel() {
    fun loadData() {
        viewModelScope.launch {
            val result = repository.fetchData()
            _uiState.update { it.copy(data = result) }
        }
    }
}

// ❌ NEVER use GlobalScope
GlobalScope.launch { /* ... */ }  // FORBIDDEN
```

### 2.2 Flow Best Practices
```kotlin
// ✅ Use StateFlow for UI state
private val _uiState = MutableStateFlow(MyUiState())
val uiState: StateFlow<MyUiState> = _uiState.asStateFlow()

// ✅ Collect in composables with lifecycle awareness
@Composable
fun MyScreen(viewModel: MyViewModel = koinViewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
}

// ✅ Use Flow operators for transformations
fun getActivePatients(): Flow<List<Patient>> =
    patientDao.getAllPatients()
        .map { entities -> entities.map { it.toDomain() } }
        .distinctUntilChanged()

// ❌ DON'T collect flows in init blocks without cancellation
init {
    someFlow.collect { /* ... */ }  // BLOCKS FOREVER — use launchIn
}
```

### 2.3 Error Handling in Coroutines
```kotlin
// ✅ Use Result<T> at repository boundaries
suspend fun saveLog(entry: LogEntry): Result<LogEntry> = runCatching {
    val entity = entry.toEntity()
    dao.insert(entity)
    entry
}

// ✅ Use catch operator for Flow errors
fun observeLogs(): Flow<List<LogEntry>> =
    dao.getAll()
        .map { it.map { entity -> entity.toDomain() } }
        .catch { emit(emptyList()) }
```

---

## 3. Compose Multiplatform

### 3.1 State Management
```kotlin
// ✅ Hoist state to ViewModel, pass down as parameters
@Composable
fun PatientCard(
    patient: Patient,
    onTap: () -> Unit,
    modifier: Modifier = Modifier,    // Always accept modifier
) {
    Card(modifier = modifier.clickable(onClick = onTap)) {
        Text(patient.name)
    }
}

// ❌ DON'T put business logic in composables
@Composable
fun PatientCard(viewModel: SomeViewModel) {
    // WRONG — composable should not know about ViewModel
}
```

### 3.2 Composable Naming & Structure
```kotlin
// ✅ Screen-level composable: receives ViewModel, passes state down
@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel = koinViewModel(),
    onNavigateToVoiceLog: () -> Unit,
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    DashboardContent(state = state, onNavigateToVoiceLog = onNavigateToVoiceLog)
}

// ✅ Content composable: stateless, receives data + lambdas
@Composable
private fun DashboardContent(
    state: DashboardUiState,
    onNavigateToVoiceLog: () -> Unit,
) { /* ... */ }

// ✅ Preview composable: uses hardcoded data
@Preview
@Composable
private fun DashboardContentPreview() {
    MaterialTheme {
        DashboardContent(
            state = DashboardUiState(/* sample data */),
            onNavigateToVoiceLog = {},
        )
    }
}
```

### 3.3 Modifier Best Practices
```kotlin
// ✅ Always accept Modifier as parameter with default
@Composable
fun ConfidenceBadge(
    score: Float,
    modifier: Modifier = Modifier,
) {
    Surface(
        modifier = modifier,    // Apply passed modifier FIRST
        color = when {
            score >= 0.85f -> Color.Green
            score >= 0.70f -> Color.Yellow
            else -> Color.Red
        },
        shape = RoundedCornerShape(8.dp),
    ) {
        Text(
            text = "${(score * 100).toInt()}%",
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
        )
    }
}
```

### 3.4 Theme Usage
```kotlin
// ✅ ALWAYS use MaterialTheme tokens
Text(
    text = "Patient Name",
    style = MaterialTheme.typography.titleMedium,
    color = MaterialTheme.colorScheme.onSurface,
)

// ❌ NEVER hardcode colors or text styles
Text(
    text = "Patient Name",
    fontSize = 18.sp,           // WRONG
    color = Color(0xFF000000),  // WRONG
)
```

---

## 4. Architecture Patterns

### 4.1 ViewModel Event Pattern
```kotlin
// ✅ Single onEvent dispatcher — predictable, traceable
class MyViewModel : ViewModel() {
    sealed interface Event {
        data class ItemClicked(val id: String) : Event
        data object Refresh : Event
    }

    fun onEvent(event: Event) {
        when (event) {
            is Event.ItemClicked -> handleItemClick(event.id)
            Event.Refresh -> handleRefresh()
        }
    }
}
```

### 4.2 Repository Pattern
```kotlin
// ✅ Interface in domain/, implementation in data/
// domain/repository/
interface PatientRepository {
    fun getPatients(wardId: String): Flow<List<Patient>>
    suspend fun getPatientById(id: String): Result<Patient>
}

// data/repository/
class PatientRepositoryImpl(
    private val localDataSource: LocalPatientDataSource,
    private val remoteDataSource: RemotePatientDataSource,
) : PatientRepository {
    override fun getPatients(wardId: String): Flow<List<Patient>> =
        localDataSource.getPatients(wardId)
            .map { entities -> entities.map { it.toDomain() } }

    override suspend fun getPatientById(id: String): Result<Patient> = runCatching {
        localDataSource.getById(id)?.toDomain()
            ?: remoteDataSource.fetchById(id).also { localDataSource.insert(it.toEntity()) }.toDomain()
    }
}
```

### 4.3 Use Case Pattern
```kotlin
// ✅ Single invoke operator, injected deps, returns Result<T>
class GetPriorityTasksUseCase(
    private val taskRepository: TaskRepository,
) {
    operator fun invoke(shiftId: String): Flow<List<Task>> =
        taskRepository.getPendingTasks(shiftId)
            .map { tasks -> tasks.sortedBy { it.priority.ordinal } }
}
```

---

## 5. KMP-Specific Patterns

### 5.1 expect/actual
```kotlin
// commonMain — declare the expectation
expect class AudioRecorder {
    suspend fun start(outputPath: String)
    suspend fun stop(): String
}

// androidMain — provide Android implementation
actual class AudioRecorder(private val context: Context) {
    actual suspend fun start(outputPath: String) { /* MediaRecorder */ }
    actual suspend fun stop(): String { /* ... */ }
}

// iosMain — provide iOS implementation
actual class AudioRecorder {
    actual suspend fun start(outputPath: String) { /* AVAudioRecorder */ }
    actual suspend fun stop(): String { /* ... */ }
}
```

### 5.2 Dependency Injection across platforms
```kotlin
// commonMain
expect fun platformModule(): Module

// androidMain
actual fun platformModule(): Module = module {
    single { AudioRecorder(get()) }           // needs Context
    single { SpeechToText(get()) }
}

// iosMain
actual fun platformModule(): Module = module {
    single { AudioRecorder() }
    single { SpeechToText() }
}
```

---

## 6. Testing

### 6.1 Use Case Tests
```kotlin
class SaveLogEntryUseCaseTest {
    private val fakeLogRepo = FakeLogRepository()
    private val fakePrescriptionRepo = FakePrescriptionRepository()
    private val useCase = SaveLogEntryUseCase(fakeLogRepo, fakePrescriptionRepo)

    @Test
    fun `saves log entry and returns success`() = runTest {
        val result = useCase(
            rawTranscript = "Gave 10mg paracetamol to patient",
            editedTranscript = null,
            audioPath = null,
            shiftId = "shift-1",
            patientId = "patient-1",
            structuredData = StructuredLogData(action = ClinicalAction.MEDICATION, ...),
            confidenceScore = 0.92f,
        )

        assertTrue(result.isSuccess)
        assertEquals(1, fakeLogRepo.savedLogs.size)
    }

    @Test
    fun `flags low confidence logs`() = runTest {
        val result = useCase(
            rawTranscript = "...",
            confidenceScore = 0.55f,
            // ...
        )

        assertTrue(result.getOrNull()!!.flaggedForReview)
    }
}
```

### 6.2 ViewModel Tests with Turbine
```kotlin
class DashboardViewModelTest {
    @Test
    fun `loads patients on init`() = runTest {
        val viewModel = DashboardViewModel(
            getPatients = FakeGetPatientsUseCase(),
            getShift = FakeGetShiftUseCase(),
            getTasks = FakeGetTasksUseCase(),
        )

        viewModel.uiState.test {
            val initial = awaitItem()
            assertEquals(UiState.Loading, initial.patientsState)

            val loaded = awaitItem()
            assertEquals(3, (loaded.patientsState as UiState.Success).data.size)

            cancelAndConsumeRemainingEvents()
        }
    }
}
```

---

## 7. Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Package | lowercase, dot-separated | `exceptionallybad.nursesync.feature.voicelog` |
| Class | PascalCase | `VoiceLogViewModel` |
| Function | camelCase | `saveLogEntry()` |
| Composable | PascalCase | `PatientCard()` |
| Constant | SCREAMING_SNAKE_CASE | `MAX_AUDIO_DURATION_MS` |
| DB table | snake_case | `log_entries` |
| DB column | snake_case | `patient_id` |
| File | PascalCase matching class | `VoiceLogViewModel.kt` |

---

## 8. Prohibited Patterns

| ❌ Never Do | ✅ Do Instead |
|---|---|
| `GlobalScope.launch` | `viewModelScope.launch` |
| `!!` in production code | Safe calls + elvis |
| Hardcoded colours | `MaterialTheme.colorScheme.*` |
| Hardcoded strings | String resources |
| Wildcard imports | Explicit imports |
| Mutable public state | `StateFlow` with private `MutableStateFlow` |
| Business logic in Composables | Use cases + ViewModels |
| Direct DB access from ViewModel | Repository → DataSource → DAO |
| `Thread.sleep()` | `delay()` |
| `println()` for logging | Kermit logger: `Logger.d { "msg" }` |

---

## 9. Performance

- Use `LazyColumn` / `LazyRow` for lists (never `Column` with many items)
- Use `remember` and `derivedStateOf` to avoid recomposition
- Use `key()` in `LazyColumn` items blocks
- Load images with Coil's `AsyncImage` (caching built-in)
- Minimise recomposition scope — extract unstable lambdas with `remember`

---

## 10. Accessibility

- Every `Image` must have a `contentDescription`
- Interactive elements need minimum 48.dp touch target
- Use `semantics { }` blocks for screen reader hints
- Support dynamic text sizing — never use fixed `sp` values below 12
- Test with TalkBack (Android) and VoiceOver (iOS)
