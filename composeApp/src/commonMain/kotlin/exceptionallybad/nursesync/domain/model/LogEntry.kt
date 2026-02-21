package exceptionallybad.nursesync.domain.model

import exceptionallybad.nursesync.domain.model.enums.ClinicalAction
import kotlinx.datetime.Instant

// -- LogEntry (the core unit) --
data class LogEntry(
    val id: String,
    val shiftId: String,
    val patientId: String,
    val timestamp: Instant,
    val rawTranscript: String,
    val editedTranscript: String?,
    val audioFilePath: String?,
    val structuredData: StructuredLogData,
    val confidenceScore: Float,         // 0.0–1.0
    val flaggedForReview: Boolean,
    val status: LogStatus,              // DRAFT, CONFIRMED, AMENDED
)

data class StructuredLogData(
    val action: ClinicalAction,         // MEDICATION, VITALS, DRESSING, OBSERVATION…
    val medication: MedicationInfo?,
    val vitals: VitalsInfo?,
    val notes: String?,
)

enum class LogStatus { DRAFT, CONFIRMED, AMENDED }
