export const ClearText = (text: string): string =>
    text.replace(/(\.|-|\/|\\|)/g, '').toLowerCase()
