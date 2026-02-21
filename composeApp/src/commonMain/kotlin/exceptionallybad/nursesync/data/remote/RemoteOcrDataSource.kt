package exceptionallybad.nursesync.data.remote

import exceptionallybad.nursesync.domain.model.Prescription

class RemoteOcrDataSource {
    suspend fun uploadPrescription(patientId: String, imagePath: String): Result<Prescription> {
        // TODO: Implement Ktor multipart upload and OCR processing
        return Result.failure(Exception("OCR processing not implemented yet"))
    }
}
