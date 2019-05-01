const patternDict = [
    {
        pattern: '\\b(?<greeting>Hi|Hello|Hey)\\b',
        intent: 'Hello'
    },{
        pattern: '\\b(bye|exit)\\b',
        intent: 'Exit'
    },{
        pattern:'like\\sin\\s\\b(?<city>.+)',
        intent:'CurrentWeather'
    }
]

module.exports = patternDict;