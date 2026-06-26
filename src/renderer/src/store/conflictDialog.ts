import { reactive } from 'vue'

export interface DiffField {
    key: string
    label: string
    group: string
    base: any
    client: any
    server: any
    status: 'unchanged' | 'auto' | 'conflict'
    autoResolved?: 'client' | 'server' | 'both' | null
    resolved?: any
}

interface ConflictState {
    visible: boolean
    title: string
    fields: DiffField[]
    _resolver: ((fields: DiffField[]) => void) | null
    _rejecter: ((reason?: any) => void) | null
}

const state = reactive<ConflictState>({
    visible: false,
    title: '',
    fields: [],
    _resolver: null,
    _rejecter: null,
})

export function showConflictDialog(args: { title: string; fields: DiffField[] }): Promise<DiffField[]> {
    if (state._rejecter) {
        state._rejecter(new Error('SUPERSEDED'))
    }

    state.visible = true
    state.title   = args.title
    state.fields  = args.fields.map(f => ({ ...f, resolved: f.resolved ?? f.client }))

    return new Promise<DiffField[]>((resolve, reject) => {
        state._resolver = resolve
        state._rejecter = reject
    })
}

export function resolveConflict(fields: DiffField[]): void {
    if (state._resolver) state._resolver(fields)
    state._resolver = null
    state._rejecter = null
    state.visible   = false
}

export function cancelConflict(): void {
    if (state._rejecter) state._rejecter(new Error('CANCELED'))
    state._resolver = null
    state._rejecter = null
    state.visible   = false
}

export function getConflictState(): ConflictState {
    return state
}
