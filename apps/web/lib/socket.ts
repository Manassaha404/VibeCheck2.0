import { io } from 'socket.io-client'
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
const socket = io(socketUrl, {
  autoConnect: false,
})

export default socket