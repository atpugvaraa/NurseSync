package exceptionallybad.nursesync.domain.model

data class PrescriptionMatchResult(
    val status: MatchStatus,
    val prescription: Prescription?,
    val logEntry: LogEntry,
    val details: String,
)

enum class MatchStatus {
    MATCH,              // Drug + dose match
    DOSE_MISMATCH,      // Same drug, different dose
    NOT_FOUND,          // No prescription for this drug
    FREQUENCY_ALERT,    // Administered outside expected frequency
}
