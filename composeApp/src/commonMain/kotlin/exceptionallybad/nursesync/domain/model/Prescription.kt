package exceptionallybad.nursesync.domain.model

import kotlinx.datetime.Instant

data class Prescription(
    val id: String,
    val patientId: String,
    val medication: String,
    val dosage: String,
    val frequency: String,
    val prescribedBy: String,
    val startDate: Instant,
    val endDate: Instant?,
)
