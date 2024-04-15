export declare class WHEPClient extends EventTarget {
    constructor();
    view(pc: RTCPeerConnection, url: string, token?: string, signal?: AbortSignal): Promise<void>;
    restart(): void;
    patch(): Promise<void>;
    mute(muted): Promise<void>;
    stop(): Promise<void>;
    selectLayer(): Promise<void>;
    unselectLayer(): Promise<void>;
}