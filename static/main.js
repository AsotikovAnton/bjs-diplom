class Profile {
    constructor ({username, name: {firstName, lastName}, password}) {
        this.username = username;
        this.name = {firstName, lastName};
        this.password = password;
    }

    // Добавление нового пользователя
    createUser(callback) {
        return ApiConnector.createUser(
            {
                username: this.username,
                name: this.name,
                password: this.password
            }, (err, data) => {
            console.log(`Создание нового пользователя ${this.username}...`);
            callback(err, data);
            }
        );
    }

    // Авторизация
    performLogin(callback) {
        return ApiConnector.performLogin(
            {
                username: this.username,
                name: this.name,
                password: this.password
            }, (err, data) => {
            console.log(`Авторизация пользователя ${this.username}...`);
            callback(err, data);
            }
        );
    }

    // Добавление денег в личный кошелек
    addMoney({currency, amount}, callback) {
        return ApiConnector.addMoney({currency, amount}, (err, data) => {
            console.log(`Добавление ${amount} ${currency} пользователю ${this.username}...`);
            callback(err, data);
        });
    }

    // Конвертация валют
    convertMoney({fromCurrency, targetCurrency, targetAmount}, callback) {
        return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
            console.log(`Конвертация из ${fromCurrency} в ${targetCurrency}...`);
            callback(err, data);
        });
    }

    // Перевод токенов другому пользователю
    transferMoney({to, amount}, callback) {
        return ApiConnector.transferMoney({to, amount}, (err, data) => {
            console.log(`Перевод ${amount} пользователю ${to}...`);
            callback(err, data);
        });
    }
}

// Функция получения курса валют с сервера
const exchangeRate = (callback) => {
    return ApiConnector.getStocks((err, data) => {
        console.log(`Получение курса валют с сервера...`);
        callback(err, data);
    });
}

function main() {
    const Conor = new Profile({
        username: "TheNotorious",
        name: {firstName: "Conor", lastName: "McGregor"},
        password: 'conorpass',
    });

    const Anton = new Profile({
        username: "Grudge",
        name: {firstName: "Anton", lastName: "Asotikov"},
        password: 'pass',
    });

    Conor.createUser((err, data) => {
        if (err) {
            console.error("Ошибка создания нового пользователя.");
        } else {
            console.log(`Пользователь ${Conor.username} создан.`);
            Conor.performLogin((err, data) => {
                if (err) {
                    console.error("Ошибка авторизации пользователя.");
                } else {
                    console.log(`Пользователь ${Conor.username} авторизован.`);
                    const money = {currency: "USD", amount: 1000000};
                    Conor.addMoney(money, (err, data) => {
                        if (err) {
                            console.error("Ошибка добавления денег пользователю.");
                        } else {
                            console.log(`Зачислено ${money.amount} ${money.currency} пользователю ${Conor.username}.`);
                            exchangeRate((err, data) => {
                                if (err) {
                                    console.error("Ошибка при выявлении курса.");
                                } else {
                                    let result = data[7].USD_NETCOIN;
                                    const convert = {
                                        fromCurrency: money.currency,
                                        targetCurrency: "NETCOIN",
                                        targetAmount: result * money.amount
                                    }
                                    Conor.convertMoney(convert, (err, data) => {
                                        if (err) {
                                            console.error("Ошибка конвертации денег.");
                                        } else {
                                            console.log(`Конвертировано ${money.amount} ${convert.fromCurrency} в ${convert.targetAmount} ${convert.targetCurrency}.`);
                                            Anton.createUser((err, data) => {
                                                if (err) {
                                                    console.error("Ошибка создания нового пользователя.");
                                                } else {
                                                    console.log(`Пользователь ${Anton.username} создан.`);
                                                    const transfer = {to: "Grudge", amount: convert.targetAmount};
                                                    Conor.transferMoney(transfer, (err, data) => {
                                                        if (err) {
                                                            console.error("Ошибка перевода денег.");
                                                        } else {
                                                            console.log(`Переведено ${transfer.amount} пользователю ${transfer.to}.`);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

main();