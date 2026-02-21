package exceptionallybad.nursesync.domain.usecase.prescription

import exceptionallybad.nursesync.domain.model.Prescription
import exceptionallybad.nursesync.domain.repository.PrescriptionRepository

class UploadPrescriptionUseCase(
    private val prescriptionRepository: PrescriptionRepository,
) {
    suspend operator fun invoke(
        patientId: String,
        imagePath: String,
    ): Result<Prescription> {
        return prescriptionRepository.uploadPrescription(patientId, imagePath)
    }
}
