package exceptionallybad.nursesync.domain.usecase.prescription

import exceptionallybad.nursesync.domain.model.*
import exceptionallybad.nursesync.domain.repository.PrescriptionRepository
import kotlinx.coroutines.flow.first

class MatchPrescriptionUseCase(
    private val prescriptionRepository: PrescriptionRepository,
) {
    suspend operator fun invoke(
        logEntry: LogEntry,
    ): PrescriptionMatchResult {
        val medication = logEntry.structuredData.medication ?: return PrescriptionMatchResult(
            status = MatchStatus.NOT_FOUND,
            prescription = null,
            logEntry = logEntry,
            details = "No medication data in log entry",
        )

        return prescriptionRepository.matchAgainstPrescription(logEntry.patientId, medication)
    }
}
