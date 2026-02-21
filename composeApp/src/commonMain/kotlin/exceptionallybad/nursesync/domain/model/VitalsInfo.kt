package exceptionallybad.nursesync.domain.model

data class VitalsInfo(
    val temperature: Float?,
    val bloodPressureSystolic: Int?,
    val bloodPressureDiastolic: Int?,
    val heartRate: Int?,
    val respiratoryRate: Int?,
    val oxygenSaturation: Float?,
    val painScore: Int?,        // 0–10
)
