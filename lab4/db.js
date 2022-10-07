const events = require("events")

let db_data = [
    { id: 1, name: "lera", bday: "30/12/2002" },
    { id: 2, name: "katya", bday: "22/04/2003" },
    { id: 3, name: "tonya", bday: "09/07/2002" },
]

module.exports = class DB extends events.EventEmitter {
    select = () => db_data
    insert = (element) => {
        let index = db_data.findIndex(el => el.id == element.id)
        index == -1 ? db_data.push(element) : null
        return db_data
    }
    update = (element) => {
        let index = db_data.findIndex(el => el.id == element.id);
        index != -1 ? db_data.splice(index, 1, element) : null
        return db_data
    }
    delete = (id) => {
        let index = db_data.findIndex(el => el.id == id);
        index != -1 ? db_data.splice(index, 1) : null
        return db_data
    }
}
