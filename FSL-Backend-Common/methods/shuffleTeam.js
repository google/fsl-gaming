exports.shuffleArray = (arr) => {
    let retArray = arr.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    return retArray
}