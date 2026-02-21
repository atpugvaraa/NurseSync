package exceptionallybad.nursesync.domain.repository

import exceptionallybad.nursesync.domain.model.Prescription
import exceptionallybad.nursesync.domain.model.PrescriptionMatchResult
import exceptionallybad.nursesync.domain.model.MedicationInfo
import kotlinx.coroutines.flow.Flow

interface PrescriptionRepository {
    fun getPrescriptionsForPatient(patientId: String): Flow<List<Prescription>>
    suspend fun uploadPrescription(patientId: String, imagePath: String): Result<Prescription>
    suspend fun matchAgainstPrescription(patientId: String, medication: MedicationInfo): PrescriptionMatchResult
}
