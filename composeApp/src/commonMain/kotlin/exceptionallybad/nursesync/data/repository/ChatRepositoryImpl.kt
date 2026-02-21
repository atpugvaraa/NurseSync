package exceptionallybad.nursesync.data.repository

import exceptionallybad.nursesync.data.remote.RemoteLlmDataSource
import exceptionallybad.nursesync.domain.model.ChatChunk
import exceptionallybad.nursesync.domain.repository.ChatRepository
import kotlinx.coroutines.flow.Flow

class ChatRepositoryImpl(
    private val remoteLlmDataSource: RemoteLlmDataSource,
) : ChatRepository {
    override fun sendChatMessage(message: String, patientId: String?): Flow<ChatChunk> {
        return remoteLlmDataSource.sendChatMessage(message, patientId)
    }
}
