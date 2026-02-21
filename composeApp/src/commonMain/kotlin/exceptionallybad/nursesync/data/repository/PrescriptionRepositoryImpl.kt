package exceptionallybad.nursesync.data.repository

import exceptionallybad.nursesync.domain.model.*
import exceptionallybad.nursesync.domain.repository.PrescriptionRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf

class PrescriptionRepositoryImpl : PrescriptionRepository {
    override fun getPrescriptionsForPatient(patientId: String): Flow<List<Prescription>> {
        // TODO: Implement with local/remote data source
        return flowOf(emptyList())
    }

    override suspend fun uploadPrescription(patientId: String, imagePath: String): Result<Prescription> {
        // TODO: Implement with RemoteOcrDataSource
        return Result.failure(Exception("Not implemented"))
    }

    override suspend fun matchAgainstPrescription(patientId: String, medication: MedicationInfo): PrescriptionMatchResult {
        // TODO: Implement matching logic with local prescriptions
        return PrescriptionMatchResult(
            status = MatchStatus.NOT_FOUND,
            prescription = null,
            logEntry = LogEntry(
                id = "",
                shiftId = "",
                patientId = patientId,
                timestamp = medication.administeredAt,
                rawTranscript = "",
                editedTranscript = null,
                audioFilePath = null,
                structuredData = StructuredLogData(
                    action = exceptionallybad.nursesync.domain.model.enums.ClinicalAction.MEDICATION,
                    medication = medication,
                    vitals = null,
                    notes = null
                ),
                confidenceScore = 1.0f,
                flaggedForReview = false,
                status = LogStatus.CONFIRMED
            ),
            details = "Matching not implemented yet"
        )
    }
}
