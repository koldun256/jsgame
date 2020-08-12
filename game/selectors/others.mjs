export default {
    type: 'player',

    name: 'Остальные',

    defenition: 'Выбирает всех игроков игры кроме тебя',

    parameters: [],

    parametersDefault: [],

    valid: () => true,

    selectors: [],

    manaCost: 3,

    create: owner => {
        return { select: () => new Promise(resolve => resolve(owner.others)), mana: () => 3 }
    }
}
