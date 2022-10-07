const events = require("events")

let db_data = [
    { id: 1, name: "lera", bday: "30/12/2002" },
    { id: 2, name: "katya", bday: "22/04/2003" },
    { id: 3, name: "tonya", bday: "09/07/2002" },
]

module.exports = class DB extends events.EventEmitter {
    message = ''
    select = () => db_data
    insert = (element) => {
        let index = db_data.findIndex(el => el.id == element.id);
        if (index == -1) {
            db_data.push(element);
            this.message = '';
         } else {
            this.message = 'cannot ADD: element already exists'
         }
        return db_data
    }
    update = (element) => {
        let index = db_data.findIndex(el => el.id == element.id);
        if (index != -1) {
            db_data.splice(index, 1, element)
            this.message = ''
        } else {
            this.message = 'cannot CHANGE: element not found'
        }
        return db_data
    }
    delete = (id) => {
        let index = db_data.findIndex(el => el.id == id);
        if (index != -1) {
            db_data.splice(index, 1)
            this.message = ''
        } else {
            this.message = 'cannot DELETE: element not found'
        }
        return db_data
    }
    commit = () => {}
}
