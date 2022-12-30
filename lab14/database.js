var mysql = require('mysql2');
var config = {
    host: 'localhost',
    user: 'root',
    password: 'Vv1542139',
    database: 'lab14'
};

class database {
    constructor() {
        this.connectionPool = new mysql.createPool(config)
    }

    getFaculty(callback, value) {
        this.connectionPool.query('Select * FROM FACULTY where FACULTY = ?', value, (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    getPulpit(callback, value) {
        this.connectionPool.query('Select * FROM PULPIT where PULPIT = ?', value, (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    getAuditoriumsType(callback, value) {
        this.connectionPool.query('Select * FROM AUDITORIUM_TYPE where AUDITORIUM_TYPE = ?', value, (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    getAuditorium(callback, value) {
        this.connectionPool.query('Select * FROM AUDITORIUM where AUDITORIUM = ?', value, (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    getSubject(callback, value) {
        this.connectionPool.query('Select * FROM SUBJECT where SUBJECT = ?', value, (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    getFaculties(callback) {
        this.connectionPool.query('Select * FROM FACULTY', (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    getPulpits(callback) {
        this.connectionPool.query('Select * FROM PULPIT', (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    getAuditoriumsTypes(callback) {
        this.connectionPool.query('Select * FROM AUDITORIUM_TYPE', (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    getAuditoriums(callback) {
        this.connectionPool.query('Select * FROM AUDITORIUM', (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    getSubjects(callback) {
        this.connectionPool.query('Select * FROM SUBJECT', (err, results) => {
            if(err) return console.log(err)
            return callback(results);
        })
    }

    postFaculties(faculty, facultyName) {
        this.connectionPool.query('INSERT FACULTY(FACULTY, FACULTY_NAME) values (? , ?)', [faculty, facultyName], (err) => {
            if(err) return console.log(err)
        })
    }

    postPulpits(pulpit, faculty, pulpitName) {
        this.connectionPool.query('INSERT INTO PULPIT (PULPIT, FACULTY,PULPIT_NAME) VALUES (?, ?, ?)', [pulpit, faculty, pulpitName], (err) => {
            if(err) return console.log(err)
        })
    }

    postAuditoriumsTypes(auditoriumType, auditoriumTypeName) {
        this.connectionPool.query('INSERT INTO AUDITORIUM_TYPE (AUDITORIUM_TYPE,AUDITORIUM_TYPENAME) VALUES (?,?)', [auditoriumType, auditoriumTypeName], (err) => {
            if(err) return console.log(err)
        })
    }

    postAuditoriums(auditorium, auditoriumType, auditoriumCapacity, auditoriumName) {
        this.connectionPool.query('INSERT INTO AUDITORIUM (AUDITORIUM, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY, AUDITORIUM_NAME) VALUES (?, ?, ?, ?)', [auditorium, auditoriumType, auditoriumCapacity, auditoriumName], (err) => {
            if(err) return console.log(err)
        })
    }

    postSubjects(subject, pulpit, subjectName) {
        this.connectionPool.query('INSERT INTO SUBJECT (SUBJECT, PULPIT, SUBJECT_NAME) VALUES (?, ?, ?)', [subject, pulpit, subjectName], (err) => {
            if(err) return console.log(err)
        })
    }

    putFaculties(faculty, facultyName) {
        this.connectionPool.query('UPDATE FACULTY SET FACULTY_NAME = ? WHERE FACULTY = ?', [facultyName, faculty], (err) => {
            if(err) return console.log(err)
        })
    }

    putPulpits(pulpit, faculty, pulpitName) {
        this.connectionPool.query('UPDATE PULPIT SET FACULTY=?,PULPIT_NAME=? WHERE PULPIT=?', [faculty, pulpitName, pulpit], (err, results) => {
            if(err) return console.log(err)
        })
    }

    putAuditoriumsTypes(auditoriumType, auditoriumTypeName) {
        this.connectionPool.query('UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME=? WHERE AUDITORIUM_TYPE=?', [auditoriumTypeName, auditoriumType], (err) => {
            if(err) return console.log(err)
        })
    }

    putAuditoriums(auditorium, auditoriumType, auditoriumCapacity, auditoriumName) {
        this.connectionPool.query('UPDATE AUDITORIUM SET AUDITORIUM_TYPE = ?,AUDITORIUM_CAPACITY = ?,AUDITORIUM_NAME = ? WHERE AUDITORIUM = ?', [auditoriumType, auditoriumCapacity, auditoriumName, auditorium], (err) => {
            if(err) return console.log(err)
        })
    }

    putSubjects(subject, pulpit, subjectName) {
        this.connectionPool.query('UPDATE SUBJECT SET PULPIT = ?, SUBJECT_NAME = ? WHERE SUBJECT = ?', [pulpit, subjectName, subject], (err) => {
            if(err) return console.log(err)
        })
    }

    deleteFaculties(faculty) {
        this.connectionPool.query('DELETE FROM FACULTY WHERE FACULTY = ?', faculty, (err) => {
            if(err) return console.log(err)
        })
    }

    deletePulpits(pulpit) {
        this.connectionPool.query('DELETE FROM PULPIT WHERE PULPIT=?', pulpit, (err) => {
            if(err) return console.log(err)
        })
    }

    deleteAuditoriumsTypes(auditoriumType) {
        this.connectionPool.query('DELETE FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE=?', auditoriumType, (err) => {
            if(err) return console.log(err)
        })
    }

    deleteAuditoriums(auditorium) {
        this.connectionPool.query('DELETE FROM AUDITORIUM WHERE AUDITORIUM = ?', auditorium, (err) => {
            if(err) return console.log(err)
        })
    }

    deleteSubjects(subject) {
        this.connectionPool.query('DELETE FROM SUBJECT WHERE SUBJECT = ?', subject, (err) => {
            if(err) return console.log(err)
        })
    }
}

module.exports = database