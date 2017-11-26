export const getCommandsRegExp = (commands) => 
    new RegExp(
        `${commands.map(item => `${item}|`).join('')}@|\\s`,
        'g'
    )