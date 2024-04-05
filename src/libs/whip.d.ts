export declare class WHIPClient {
    constructor();
    publish(pc: RTCPeerConnection, url: string, token?: string): Promise<void>;
    restart(): void;
    patch(): Promise<void>;
    mute(muted): Promise<void>;
    stop(): Promise<void>;
}