package exceptionallybad.nursesync.domain.model

import kotlinx.datetime.Instant

data class MedicationInfo(
    val drugName: String,
    val dosage: String,         // "10mg"
    val route: String,          // "oral", "IV", "IM"
    val administeredAt: Instant,
)
