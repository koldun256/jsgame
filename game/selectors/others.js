module.exports = {
    type: 'player',

    name: 'Остальные',

    defenition: 'Выбирает всех игроков игры кроме тебя',

    parameters: [],

    parametersDefault: [],

    validateParameters: () => true,

    selectors: [],

    manaCost: 3,

    create: owner => return { cast: () => returnResult(owner.others) }
}
