package exceptionallybad.nursesync.domain.repository

import exceptionallybad.nursesync.domain.model.ChatMessage
import exceptionallybad.nursesync.domain.model.ChatChunk
import kotlinx.coroutines.flow.Flow

interface ChatRepository {
    fun sendChatMessage(message: String, patientId: String?): Flow<ChatChunk>
}
