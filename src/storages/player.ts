import { atomWithStorage } from 'jotai/utils'

export const playerVolumeAtom = atomWithStorage<number>('playerVolume', 0)

