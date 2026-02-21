# NurseSync — Low-Level Design Document

> **Version:** 1.0  
> **Package:** `exceptionallybad.nursesync`

---

## 1. Package Structure — Detailed

```
exceptionallybad.nursesync/
│
├── app/
│   ├── App.kt                          # Root @Composable, theme wrapper
│   ├── NurseSyncApp.kt                 # Koin init, global state
│   ├── theme/
│   │   ├── Theme.kt                    # MaterialTheme (light/dark)
│   │   ├── Color.kt                    # Color tokens
│   │   ├── Type.kt                     # Typography scale
│   │   └── Shape.kt                    # Shape tokens
│   └── navigation/
│       ├── NavGraph.kt                 # Root navigation graph
│       ├── Screen.kt                   # Sealed class of all routes
│       └── BottomNavBar.kt             # Bottom navigation bar composable
│
├── core/
│   ├── di/
│   │   ├── AppModule.kt               # Top-level Koin module aggregator
│   │   ├── NetworkModule.kt           # Ktor HttpClient provider
│   │   ├── DatabaseModule.kt          # Room/SQLDelight driver provider
│   │   └── RepositoryModule.kt        # Bind interface→impl
│   ├── network/
│   │   ├── ApiClient.kt               # Ktor HttpClient factory
│   │   ├── ApiRoutes.kt               # Endpoint constants
│   │   ├── AuthInterceptor.kt         # Bearer token plugin
│   │   ├── NetworkResult.kt           # sealed class Success/Error/Loading
│   │   └── dto/                        # All network DTOs
│   │       ├── LoginRequest.kt
│   │       ├── LoginResponse.kt
│   │       ├── LogEntryDto.kt
│   │       ├── PatientDto.kt
│   │       └── ...
│   ├── database/
│   │   ├── NurseSyncDatabase.kt       # Room @Database or SQLDelight driver
│   │   ├── dao/
│   │   │   ├── LogEntryDao.kt
│   │   │   ├── PatientDao.kt
│   │   │   ├── ShiftDao.kt
│   │   │   ├── TaskDao.kt
│   │   │   └── PrescriptionDao.kt
│   │   ├── entity/                     # DB entities (Room @Entity)
│   │   │   ├── LogEntryEntity.kt
│   │   │   ├── PatientEntity.kt
│   │   │   ├── ShiftEntity.kt
│   │   │   ├── TaskEntity.kt
│   │   │   └── PrescriptionEntity.kt
│   │   └── converter/
│   │       └── Converters.kt          # TypeConverters for Instant, enums
│   ├── platform/
│   │   ├── AudioRecorder.kt           # expect class
│   │   ├── SpeechToText.kt            # expect class
│   │   ├── FileManager.kt             # expect class
│   │   ├── PermissionHandler.kt       # expect class
│   │   └── BiometricAuth.kt           # expect class
│   └── util/
│       ├── Constants.kt
│       ├── DateTimeUtil.kt            # Instant formatting helpers
│       ├── StringExt.kt               # Extension functions
│       ├── FlowExt.kt                 # Flow operator extensions
│       └── UiState.kt                 # sealed class Idle/Loading/Success/Error
│
├── domain/
│   ├── model/
│   │   ├── Shift.kt
│   │   ├── Patient.kt
│   │   ├── LogEntry.kt
│   │   ├── StructuredLogData.kt
│   │   ├── Task.kt
│   │   ├── Prescription.kt
│   │   ├── HandoffSummary.kt
│   │   ├── DischargeSummary.kt
│   │   ├── NurseProfile.kt
│   │   └── enums/
│   │       ├── ShiftStatus.kt
│   │       ├── LogStatus.kt
│   │       ├── ClinicalAction.kt
│   │       └── TaskPriority.kt
│   ├── repository/
│   │   ├── AuthRepository.kt          # interface
│   │   ├── ShiftRepository.kt         # interface
│   │   ├── LogRepository.kt           # interface
│   │   ├── PatientRepository.kt       # interface
│   │   ├── TaskRepository.kt          # interface
│   │   ├── PrescriptionRepository.kt  # interface
│   │   └── HandoffRepository.kt       # interface
│   └── usecase/
│       ├── auth/
│       │   ├── LoginUseCase.kt
│       │   └── LogoutUseCase.kt
│       ├── voicelog/
│       │   ├── StartRecordingUseCase.kt
│       │   ├── StopRecordingUseCase.kt
│       │   ├── TranscribeAudioUseCase.kt
│       │   └── SaveLogEntryUseCase.kt
│       ├── logentry/
│       │   ├── GetLogsForShiftUseCase.kt
│       │   ├── UpdateLogEntryUseCase.kt
│       │   └── DeleteLogEntryUseCase.kt
│       ├── handoff/
│       │   ├── GenerateHandoffUseCase.kt
│       │   └── GetPendingTasksUseCase.kt
│       ├── prescription/
│       │   ├── MatchPrescriptionUseCase.kt
│       │   └── UploadPrescriptionUseCase.kt
│       ├── discharge/
│       │   └── GenerateDischargeSummaryUseCase.kt
│       └── task/
│           ├── GetPriorityTasksUseCase.kt
│           └── CompleteTaskUseCase.kt
│
├── data/
│   ├── repository/
│   │   ├── AuthRepositoryImpl.kt
│   │   ├── ShiftRepositoryImpl.kt
│   │   ├── LogRepositoryImpl.kt
│   │   ├── PatientRepositoryImpl.kt
│   │   ├── TaskRepositoryImpl.kt
│   │   ├── PrescriptionRepositoryImpl.kt
│   │   └── HandoffRepositoryImpl.kt
│   ├── local/
│   │   ├── LocalLogDataSource.kt
│   │   ├── LocalPatientDataSource.kt
│   │   ├── LocalShiftDataSource.kt
│   │   └── LocalTaskDataSource.kt
│   ├── remote/
│   │   ├── RemoteAuthDataSource.kt
│   │   ├── RemoteLogDataSource.kt
│   │   ├── RemotePatientDataSource.kt
│   │   └── RemoteLlmDataSource.kt
│   └── mapper/
│       ├── LogEntryMapper.kt          # Entity ↔ Domain ↔ DTO
│       ├── PatientMapper.kt
│       ├── ShiftMapper.kt
│       └── TaskMapper.kt
│
└── feature/
    ├── auth/
    │   ├── ui/
    │   │   ├── LoginScreen.kt
    │   │   └── RoleSelectScreen.kt
    │   └── viewmodel/
    │       └── AuthViewModel.kt
    ├── dashboard/
    │   ├── ui/
    │   │   ├── DashboardScreen.kt
    │   │   ├── PatientCard.kt
    │   │   ├── ShiftStatusBar.kt
    │   │   └── QuickLogFab.kt
    │   └── viewmodel/
    │       └── DashboardViewModel.kt
    ├── voicelog/
    │   ├── ui/
    │   │   ├── VoiceLogScreen.kt
    │   │   ├── RecordingControls.kt
    │   │   ├── TranscriptPreview.kt
    │   │   └── ConfidenceBadge.kt
    │   └── viewmodel/
    │       └── VoiceLogViewModel.kt
    ├── logentry/
    │   ├── ui/
    │   │   ├── LogListScreen.kt
    │   │   ├── LogDetailScreen.kt
    │   │   └── LogEditScreen.kt
    │   └── viewmodel/
    │       └── LogEntryViewModel.kt
    ├── handoff/
    │   ├── ui/
    │   │   ├── HandoffSummaryScreen.kt
    │   │   └── AudioPlaybackCard.kt
    │   └── viewmodel/
    │       └── HandoffViewModel.kt
    ├── discharge/
    │   ├── ui/
    │   │   └── DischargeSummaryScreen.kt
    │   └── viewmodel/
    │       └── DischargeViewModel.kt
    ├── prescription/
    │   ├── ui/
    │   │   ├── PrescriptionUploadScreen.kt
    │   │   └── PrescriptionMatchScreen.kt
    │   └── viewmodel/
    │       └── PrescriptionViewModel.kt
    ├── chat/
    │   ├── ui/
    │   │   ├── ChatScreen.kt
    │   │   ├── ChatBubble.kt
    │   │   └── ChatInputBar.kt
    │   └── viewmodel/
    │       └── ChatViewModel.kt
    ├── tasks/
    │   ├── ui/
    │   │   ├── TaskListScreen.kt
    │   │   └── TaskCard.kt
    │   └── viewmodel/
    │       └── TasksViewModel.kt
    └── settings/
        ├── ui/
        │   └── SettingsScreen.kt
        └── viewmodel/
            └── SettingsViewModel.kt
```

---

## 2. Detailed Class Designs

### 2.1 Domain Models

```kotlin
// ── Enums ──

enum class ShiftStatus { ACTIVE, COMPLETED, HANDED_OFF }

enum class LogStatus { DRAFT, CONFIRMED, AMENDED }

enum class ClinicalAction {
    MEDICATION, VITALS, DRESSING, OBSERVATION, PROCEDURE,
    FEEDING, POSITIONING, ASSESSMENT, DISCHARGE_PREP, OTHER
}

enum class TaskPriority { CRITICAL, HIGH, MEDIUM, LOW }

// ── Core Entities ──

data class NurseProfile(
    val id: String,
    val name: String,
    val employeeId: String,
    val role: String,           // "RN", "LPN", "CNA"
    val ward: String,
    val languagePreference: String,
)

data class MedicationInfo(
    val drugName: String,
    val dosage: String,         // "10mg"
    val route: String,          // "oral", "IV", "IM"
    val administeredAt: Instant,
)

data class VitalsInfo(
    val temperature: Float?,
    val bloodPressureSystolic: Int?,
    val bloodPressureDiastolic: Int?,
    val heartRate: Int?,
    val respiratoryRate: Int?,
    val oxygenSaturation: Float?,
    val painScore: Int?,        // 0–10
)

data class PatientHandoffNote(
    val patientId: String,
    val patientName: String,
    val bed: String,
    val summaryText: String,
    val pendingActions: List<String>,
    val alertFlags: List<String>,
)

data class DischargeSummary(
    val id: String,
    val patientId: String,
    val generatedAt: Instant,
    val admissionSummary: String,
    val treatmentTimeline: List<LogEntry>,
    val medicationsAtDischarge: List<Prescription>,
    val followUpInstructions: String,
    val nurseNotes: String,
)
```

### 2.2 Repository Interfaces

```kotlin
interface LogRepository {
    suspend fun saveLog(entry: LogEntry): Result<LogEntry>
    suspend fun updateLog(entry: LogEntry): Result<LogEntry>
    suspend fun deleteLog(id: String): Result<Unit>
    fun getLogsForShift(shiftId: String): Flow<List<LogEntry>>
    fun getLogsForPatient(patientId: String): Flow<List<LogEntry>>
    fun getFlaggedLogs(): Flow<List<LogEntry>>
}

interface ShiftRepository {
    suspend fun startShift(nurseId: String, wardId: String): Result<Shift>
    suspend fun endShift(shiftId: String): Result<Shift>
    fun getActiveShift(nurseId: String): Flow<Shift?>
    fun getShiftHistory(nurseId: String): Flow<List<Shift>>
}

interface PatientRepository {
    fun getPatients(wardId: String): Flow<List<Patient>>
    suspend fun getPatientById(id: String): Result<Patient>
    suspend fun searchPatients(query: String): List<Patient>
}

interface TaskRepository {
    suspend fun createTask(task: Task): Result<Task>
    suspend fun completeTask(taskId: String): Result<Unit>
    fun getPendingTasks(shiftId: String): Flow<List<Task>>
    fun getOverdueTasks(): Flow<List<Task>>
}

interface HandoffRepository {
    suspend fun generateHandoff(shiftId: String): Result<HandoffSummary>
    suspend fun getHandoffForShift(shiftId: String): Result<HandoffSummary?>
}

interface AuthRepository {
    suspend fun login(employeeId: String, pin: String): Result<NurseProfile>
    suspend fun logout(): Result<Unit>
    fun getCurrentNurse(): Flow<NurseProfile?>
    suspend fun refreshToken(): Result<Unit>
}
```

### 2.3 Use Case Pattern

Every use case follows this contract:

```kotlin
/**
 * Base use case pattern.
 * - Single responsibility: one public `invoke` operator.
 * - Injected via Koin.
 * - Returns Result<T> for error handling.
 */
class SaveLogEntryUseCase(
    private val logRepository: LogRepository,
    private val prescriptionRepository: PrescriptionRepository,
) {
    suspend operator fun invoke(
        rawTranscript: String,
        editedTranscript: String?,
        audioPath: String?,
        shiftId: String,
        patientId: String,
        structuredData: StructuredLogData,
        confidenceScore: Float,
    ): Result<LogEntry> {
        // 1. Build LogEntry domain object
        val entry = LogEntry(
            id = uuid(),
            shiftId = shiftId,
            patientId = patientId,
            timestamp = Clock.System.now(),
            rawTranscript = rawTranscript,
            editedTranscript = editedTranscript,
            audioFilePath = audioPath,
            structuredData = structuredData,
            confidenceScore = confidenceScore,
            flaggedForReview = confidenceScore < 0.70f,
            status = if (editedTranscript != null) LogStatus.CONFIRMED else LogStatus.DRAFT,
        )

        // 2. Save to repository
        val result = logRepository.saveLog(entry)

        // 3. If medication, check prescription match
        if (result.isSuccess && structuredData.medication != null) {
            prescriptionRepository.matchAgainstPrescription(
                patientId = patientId,
                medication = structuredData.medication,
            )
        }

        return result
    }
}
```

### 2.4 ViewModel Pattern

```kotlin
class VoiceLogViewModel(
    private val startRecording: StartRecordingUseCase,
    private val stopRecording: StopRecordingUseCase,
    private val transcribeAudio: TranscribeAudioUseCase,
    private val saveLogEntry: SaveLogEntryUseCase,
) : ViewModel() {

    // ── State ──
    private val _uiState = MutableStateFlow(VoiceLogUiState())
    val uiState: StateFlow<VoiceLogUiState> = _uiState.asStateFlow()

    // ── Events ──
    sealed interface Event {
        data object StartRecording : Event
        data object StopRecording : Event
        data class EditTranscript(val text: String) : Event
        data class SelectPatient(val patientId: String) : Event
        data object ConfirmLog : Event
        data object Dismiss : Event
    }

    fun onEvent(event: Event) {
        when (event) {
            Event.StartRecording -> handleStartRecording()
            Event.StopRecording -> handleStopRecording()
            is Event.EditTranscript -> handleEditTranscript(event.text)
            is Event.SelectPatient -> handleSelectPatient(event.patientId)
            Event.ConfirmLog -> handleConfirmLog()
            Event.Dismiss -> handleDismiss()
        }
    }

    private fun handleStartRecording() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRecording = true) }
            startRecording()
        }
    }

    private fun handleStopRecording() {
        viewModelScope.launch {
            val audioPath = stopRecording()
            _uiState.update { it.copy(isRecording = false, isTranscribing = true) }

            transcribeAudio(audioPath)
                .onSuccess { result ->
                    _uiState.update {
                        it.copy(
                            isTranscribing = false,
                            rawTranscript = result.text,
                            confidence = result.confidence,
                            flagged = result.confidence < 0.70f,
                        )
                    }
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(isTranscribing = false, error = error.message)
                    }
                }
        }
    }

    private fun handleConfirmLog() {
        viewModelScope.launch {
            val state = _uiState.value
            _uiState.update { it.copy(isSaving = true) }

            saveLogEntry(
                rawTranscript = state.rawTranscript,
                editedTranscript = state.editedTranscript,
                audioPath = state.audioPath,
                shiftId = state.shiftId,
                patientId = state.selectedPatientId ?: return@launch,
                structuredData = state.structuredData ?: return@launch,
                confidenceScore = state.confidence,
            ).onSuccess {
                _uiState.update { it.copy(isSaving = false, saved = true) }
            }.onFailure { error ->
                _uiState.update { it.copy(isSaving = false, error = error.message) }
            }
        }
    }

    // ... remaining handlers
}

data class VoiceLogUiState(
    val isRecording: Boolean = false,
    val isTranscribing: Boolean = false,
    val isSaving: Boolean = false,
    val rawTranscript: String = "",
    val editedTranscript: String? = null,
    val audioPath: String? = null,
    val confidence: Float = 0f,
    val flagged: Boolean = false,
    val selectedPatientId: String? = null,
    val structuredData: StructuredLogData? = null,
    val shiftId: String = "",
    val saved: Boolean = false,
    val error: String? = null,
)
```

---

## 3. Platform Abstractions — Detailed

### 3.1 AudioRecorder

```kotlin
// commonMain
expect class AudioRecorder {
    suspend fun start(outputPath: String)
    suspend fun stop(): String       // Returns final file path
    suspend fun pause()
    suspend fun resume()
    fun isRecording(): Boolean
    fun getAmplitude(): Flow<Float>   // For waveform visualisation
}

// androidMain
actual class AudioRecorder(private val context: Context) {
    private var mediaRecorder: MediaRecorder? = null

    actual suspend fun start(outputPath: String) {
        mediaRecorder = MediaRecorder(context).apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            setAudioSamplingRate(44100)
            setAudioEncodingBitRate(128000)
            setOutputFile(outputPath)
            prepare()
            start()
        }
    }
    // ... stop, pause, resume, isRecording, getAmplitude
}

// iosMain
actual class AudioRecorder {
    private var recorder: AVAudioRecorder? = null
    // Uses AVAudioSession + AVAudioRecorder
    // ...
}
```

### 3.2 SpeechToText

```kotlin
// commonMain
data class SttResult(
    val text: String,
    val confidence: Float,
    val language: String,
    val isFinal: Boolean,
)

expect class SpeechToText {
    fun isAvailable(): Boolean
    suspend fun startListening(language: String = "en-US"): Flow<SttResult>
    fun stopListening()
    suspend fun transcribeFile(audioPath: String, language: String = "en-US"): SttResult
}

// androidMain — uses android.speech.SpeechRecognizer
// iosMain    — uses Speech.SFSpeechRecognizer
```

---

## 4. Screen-Level Composable Contracts

### 4.1 DashboardScreen

```kotlin
@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel = koinViewModel(),
    onNavigateToVoiceLog: () -> Unit,
    onNavigateToPatient: (patientId: String) -> Unit,
    onNavigateToHandoff: () -> Unit,
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = { ShiftStatusBar(shift = uiState.activeShift) },
        floatingActionButton = {
            QuickLogFab(onClick = onNavigateToVoiceLog)
        },
        bottomBar = { BottomNavBar(/* ... */) },
    ) { padding ->
        LazyColumn(contentPadding = padding) {
            // Active patients
            item { SectionHeader("Your Patients") }
            items(uiState.patients) { patient ->
                PatientCard(
                    patient = patient,
                    onClick = { onNavigateToPatient(patient.id) },
                )
            }

            // Pending tasks
            item { SectionHeader("Pending Tasks") }
            items(uiState.pendingTasks) { task ->
                TaskCard(task = task, onComplete = { viewModel.onEvent(Event.CompleteTask(it)) })
            }

            // Recent logs
            item { SectionHeader("Recent Logs") }
            items(uiState.recentLogs) { log ->
                LogPreviewCard(log = log)
            }
        }
    }
}
```

### 4.2 VoiceLogScreen

```kotlin
@Composable
fun VoiceLogScreen(
    viewModel: VoiceLogViewModel = koinViewModel(),
    onLogSaved: () -> Unit,
    onDismiss: () -> Unit,
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        // Patient selector dropdown
        PatientSelector(
            selectedPatientId = uiState.selectedPatientId,
            onSelect = { viewModel.onEvent(Event.SelectPatient(it)) },
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Recording controls (mic button, waveform, timer)
        RecordingControls(
            isRecording = uiState.isRecording,
            onStart = { viewModel.onEvent(Event.StartRecording) },
            onStop = { viewModel.onEvent(Event.StopRecording) },
        )

        // Transcript preview + edit
        if (uiState.rawTranscript.isNotEmpty()) {
            TranscriptPreview(
                rawText = uiState.rawTranscript,
                editedText = uiState.editedTranscript,
                onEdit = { viewModel.onEvent(Event.EditTranscript(it)) },
            )

            ConfidenceBadge(score = uiState.confidence, flagged = uiState.flagged)
        }

        // Confirm button
        if (uiState.rawTranscript.isNotEmpty()) {
            Button(
                onClick = { viewModel.onEvent(Event.ConfirmLog) },
                enabled = uiState.selectedPatientId != null && !uiState.isSaving,
            ) {
                Text(if (uiState.isSaving) "Saving..." else "Confirm & Save")
            }
        }
    }

    LaunchedEffect(uiState.saved) {
        if (uiState.saved) onLogSaved()
    }
}
```

---

## 5. Navigation Graph

```kotlin
sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object RoleSelect : Screen("role_select")
    data object Dashboard : Screen("dashboard")
    data object VoiceLog : Screen("voice_log")
    data object LogList : Screen("log_list")
    data class LogDetail(val logId: String) : Screen("log_detail/{logId}") {
        companion object { const val ROUTE = "log_detail/{logId}" }
    }
    data object LogEdit : Screen("log_edit/{logId}") {
        companion object { const val ROUTE = "log_edit/{logId}" }
    }
    data object Handoff : Screen("handoff")
    data object Discharge : Screen("discharge/{patientId}") {
        companion object { const val ROUTE = "discharge/{patientId}" }
    }
    data object PrescriptionUpload : Screen("prescription_upload")
    data object PrescriptionMatch : Screen("prescription_match")
    data object Chat : Screen("chat")
    data object Tasks : Screen("tasks")
    data object Settings : Screen("settings")
}

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Screen.Login.route) {
        composable(Screen.Login.route) {
            LoginScreen(onLoginSuccess = { navController.navigate(Screen.Dashboard.route) })
        }
        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onNavigateToVoiceLog = { navController.navigate(Screen.VoiceLog.route) },
                onNavigateToPatient = { /* ... */ },
                onNavigateToHandoff = { navController.navigate(Screen.Handoff.route) },
            )
        }
        composable(Screen.VoiceLog.route) {
            VoiceLogScreen(
                onLogSaved = { navController.popBackStack() },
                onDismiss = { navController.popBackStack() },
            )
        }
        // ... remaining routes
    }
}
```

---

## 6. Database Schema (Room Entities)

```kotlin
@Entity(tableName = "log_entries")
data class LogEntryEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "shift_id") val shiftId: String,
    @ColumnInfo(name = "patient_id") val patientId: String,
    val timestamp: Long,                // epochMillis
    @ColumnInfo(name = "raw_transcript") val rawTranscript: String,
    @ColumnInfo(name = "edited_transcript") val editedTranscript: String?,
    @ColumnInfo(name = "audio_file_path") val audioFilePath: String?,
    @ColumnInfo(name = "clinical_action") val clinicalAction: String,
    @ColumnInfo(name = "medication_json") val medicationJson: String?,
    @ColumnInfo(name = "vitals_json") val vitalsJson: String?,
    val notes: String?,
    @ColumnInfo(name = "confidence_score") val confidenceScore: Float,
    @ColumnInfo(name = "flagged_for_review") val flaggedForReview: Boolean,
    val status: String,                 // DRAFT, CONFIRMED, AMENDED
    @ColumnInfo(name = "synced") val synced: Boolean = false,
    @ColumnInfo(name = "created_at") val createdAt: Long,
    @ColumnInfo(name = "updated_at") val updatedAt: Long,
)

@Entity(tableName = "patients")
data class PatientEntity(
    @PrimaryKey val id: String,
    val name: String,
    val bed: String,
    val ward: String,
    @ColumnInfo(name = "admission_date") val admissionDate: Long,
    val diagnosis: String,
    @ColumnInfo(name = "synced") val synced: Boolean = false,
)

@Entity(tableName = "shifts")
data class ShiftEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "nurse_id") val nurseId: String,
    @ColumnInfo(name = "ward_id") val wardId: String,
    @ColumnInfo(name = "start_time") val startTime: Long,
    @ColumnInfo(name = "end_time") val endTime: Long?,
    val status: String,
)

@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "patient_id") val patientId: String,
    val description: String,
    val priority: String,               // CRITICAL, HIGH, MEDIUM, LOW
    @ColumnInfo(name = "due_by") val dueBy: Long?,
    val completed: Boolean,
    @ColumnInfo(name = "source_log_id") val sourceLogId: String?,
    @ColumnInfo(name = "shift_id") val shiftId: String,
)

@Entity(tableName = "prescriptions")
data class PrescriptionEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "patient_id") val patientId: String,
    val medication: String,
    val dosage: String,
    val frequency: String,
    @ColumnInfo(name = "prescribed_by") val prescribedBy: String,
    @ColumnInfo(name = "start_date") val startDate: Long,
    @ColumnInfo(name = "end_date") val endDate: Long?,
)
```

### DAO Example

```kotlin
@Dao
interface LogEntryDao {
    @Query("SELECT * FROM log_entries WHERE shift_id = :shiftId ORDER BY timestamp DESC")
    fun getLogsForShift(shiftId: String): Flow<List<LogEntryEntity>>

    @Query("SELECT * FROM log_entries WHERE patient_id = :patientId ORDER BY timestamp DESC")
    fun getLogsForPatient(patientId: String): Flow<List<LogEntryEntity>>

    @Query("SELECT * FROM log_entries WHERE flagged_for_review = 1 ORDER BY timestamp DESC")
    fun getFlaggedLogs(): Flow<List<LogEntryEntity>>

    @Query("SELECT * FROM log_entries WHERE synced = 0")
    suspend fun getUnsyncedLogs(): List<LogEntryEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLog(log: LogEntryEntity)

    @Update
    suspend fun updateLog(log: LogEntryEntity)

    @Query("DELETE FROM log_entries WHERE id = :id")
    suspend fun deleteLog(id: String)
}
```

---

## 7. Koin DI Module Layout

```kotlin
// AppModule.kt
val appModule = module {
    includes(
        networkModule,
        databaseModule,
        repositoryModule,
        useCaseModule,
        viewModelModule,
        platformModule(),    // expect fun platformModule(): Module
    )
}

// NetworkModule.kt
val networkModule = module {
    single { ApiClient.create() }      // Ktor HttpClient
}

// DatabaseModule.kt
val databaseModule = module {
    single { createDatabase(get()) }   // Room / SQLDelight
    single { get<NurseSyncDatabase>().logEntryDao() }
    single { get<NurseSyncDatabase>().patientDao() }
    single { get<NurseSyncDatabase>().shiftDao() }
    single { get<NurseSyncDatabase>().taskDao() }
}

// RepositoryModule.kt
val repositoryModule = module {
    single<LogRepository> { LogRepositoryImpl(get(), get()) }
    single<ShiftRepository> { ShiftRepositoryImpl(get(), get()) }
    single<PatientRepository> { PatientRepositoryImpl(get(), get()) }
    single<TaskRepository> { TaskRepositoryImpl(get(), get()) }
    single<AuthRepository> { AuthRepositoryImpl(get()) }
    single<HandoffRepository> { HandoffRepositoryImpl(get(), get()) }
}

// UseCaseModule.kt
val useCaseModule = module {
    factory { SaveLogEntryUseCase(get(), get()) }
    factory { GetLogsForShiftUseCase(get()) }
    factory { StartRecordingUseCase(get()) }
    factory { StopRecordingUseCase(get()) }
    factory { TranscribeAudioUseCase(get()) }
    factory { GenerateHandoffUseCase(get(), get()) }
    factory { MatchPrescriptionUseCase(get()) }
    // ...
}

// ViewModelModule.kt
val viewModelModule = module {
    viewModel { AuthViewModel(get(), get()) }
    viewModel { DashboardViewModel(get(), get(), get()) }
    viewModel { VoiceLogViewModel(get(), get(), get(), get()) }
    viewModel { LogEntryViewModel(get(), get()) }
    viewModel { HandoffViewModel(get(), get()) }
    viewModel { TasksViewModel(get(), get()) }
    viewModel { ChatViewModel(get()) }
    viewModel { SettingsViewModel(get()) }
}
```

---

## 8. Error Handling Strategy

```kotlin
// NetworkResult for remote calls
sealed class NetworkResult<out T> {
    data class Success<T>(val data: T) : NetworkResult<T>()
    data class Error(val code: Int, val message: String) : NetworkResult<Nothing>()
    data object Loading : NetworkResult<Nothing>()
}

// UiState for screen-level states
sealed class UiState<out T> {
    data object Idle : UiState<Nothing>()
    data object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String, val retry: (() -> Unit)? = null) : UiState<Nothing>()
}

// Repository-level: always returns kotlin.Result<T>
// ViewModel catches and maps to UiState
```

---

## 9. Mapper Pattern

```kotlin
object LogEntryMapper {
    fun LogEntryEntity.toDomain(): LogEntry = LogEntry(
        id = id,
        shiftId = shiftId,
        patientId = patientId,
        timestamp = Instant.fromEpochMilliseconds(timestamp),
        rawTranscript = rawTranscript,
        editedTranscript = editedTranscript,
        audioFilePath = audioFilePath,
        structuredData = StructuredLogData(
            action = ClinicalAction.valueOf(clinicalAction),
            medication = medicationJson?.let { Json.decodeFromString(it) },
            vitals = vitalsJson?.let { Json.decodeFromString(it) },
            notes = notes,
        ),
        confidenceScore = confidenceScore,
        flaggedForReview = flaggedForReview,
        status = LogStatus.valueOf(status),
    )

    fun LogEntry.toEntity(): LogEntryEntity = LogEntryEntity(
        id = id,
        shiftId = shiftId,
        patientId = patientId,
        timestamp = timestamp.toEpochMilliseconds(),
        rawTranscript = rawTranscript,
        editedTranscript = editedTranscript,
        audioFilePath = audioFilePath,
        clinicalAction = structuredData.action.name,
        medicationJson = structuredData.medication?.let { Json.encodeToString(it) },
        vitalsJson = structuredData.vitals?.let { Json.encodeToString(it) },
        notes = structuredData.notes,
        confidenceScore = confidenceScore,
        flaggedForReview = flaggedForReview,
        status = status.name,
        synced = false,
        createdAt = Clock.System.now().toEpochMilliseconds(),
        updatedAt = Clock.System.now().toEpochMilliseconds(),
    )

    fun LogEntryDto.toDomain(): LogEntry = /* ... */

    fun LogEntry.toDto(): LogEntryDto = /* ... */
}
```

---

## 10. File-to-Agent Assignment Matrix

Each file cluster is assigned to exactly **one agent** to prevent merge conflicts.

| Agent | Feature Ownership | File Cluster |
|---|---|---|
| **Aarav** | Core infra + Auth + Dashboard | `core/`, `app/`, `feature/auth/`, `feature/dashboard/` |
| **ArnavSharma** | Voice Log + Log Entry + STT | `feature/voicelog/`, `feature/logentry/`, `core/platform/` (audio & STT) |
| **Ishaan** | Handoff + Tasks + Discharge | `feature/handoff/`, `feature/tasks/`, `feature/discharge/` |
| **Anshuman** | Prescription + Chat + Settings | `feature/prescription/`, `feature/chat/`, `feature/settings/` |

> **Shared files** (domain models, repository interfaces, DI modules) are initially scaffolded by **Aarav** and then only modified via PROGRESS.md coordination.
