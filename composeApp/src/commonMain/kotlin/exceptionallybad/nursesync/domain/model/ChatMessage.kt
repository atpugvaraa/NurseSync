package exceptionallybad.nursesync.domain.model

import kotlinx.datetime.Instant

data class ChatMessage(
    val id: String,
    val role: ChatRole,          // USER, ASSISTANT, SYSTEM
    val content: String,
    val timestamp: Instant,
    val isStreaming: Boolean = false,
)

enum class ChatRole { USER, ASSISTANT, SYSTEM }

data class ChatChunk(
    val text: String,
    val isFinal: Boolean,
)
