import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

interface SocketProps {
    onMessage: (param: string) => void;
}
const callSocket = () => {
    let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    return io('http://localhost:8084', { withCredentials: true });
}
export default callSocket;