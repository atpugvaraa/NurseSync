package exceptionallybad.nursesync

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform