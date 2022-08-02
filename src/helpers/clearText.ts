export const ClearText = (text: string): string =>
    text.replace(/[^a-zA-ZА-Яа-я\d ]/g, '').toLowerCase()
