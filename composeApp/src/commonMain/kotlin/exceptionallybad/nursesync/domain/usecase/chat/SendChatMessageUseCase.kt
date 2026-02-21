package exceptionallybad.nursesync.domain.usecase.chat

import exceptionallybad.nursesync.domain.model.ChatChunk
import exceptionallybad.nursesync.domain.repository.ChatRepository
import kotlinx.coroutines.flow.Flow

class SendChatMessageUseCase(
    private val chatRepository: ChatRepository,
) {
    operator fun invoke(
        message: String,
        patientId: String? = null,
    ): Flow<ChatChunk> {
        return chatRepository.sendChatMessage(message, patientId)
    }
}
