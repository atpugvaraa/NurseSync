package exceptionallybad.nursesync.data.remote

import exceptionallybad.nursesync.domain.model.ChatChunk
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf

class RemoteLlmDataSource {
    fun sendChatMessage(message: String, patientId: String?): Flow<ChatChunk> {
        // TODO: Implement Ktor SSE/WebSocket streaming
        return flowOf(ChatChunk("AI Assistant: Matching not implemented yet", true))
    }
}
