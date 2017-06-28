export interface UnsyncedAction {
    type: string,
    payload: any,
    meta: {
        effect: any,
        commit: any,
        rollback: any,
    }
}
