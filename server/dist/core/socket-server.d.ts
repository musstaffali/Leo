import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Socket } from 'socket.io';
export default class SocketServer {
    private static instance;
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
    constructor();
    init(): Promise<void>;
}
