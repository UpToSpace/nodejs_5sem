const database = require('./database');
const url = require('url');
const http = require('http');
const fs = require('fs');

let DB = new database();

http.createServer((req, res) => {

    let path = url.parse(req.url).pathname;
    let data_json = '';

    let alreadyExists = () => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('value already exists');
        data_json = '';
    }

    let notFound = () => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('value not found');
        data_json = '';
    }

    let answer = () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data_json));
        data_json = '';
    }

    switch (req.method) {
        case 'GET': {
            switch (path) {
                case '/':
                    res.end(fs.readFileSync('D:/University/cross/labs/lab14/index.html'));
                    break;
                case '/api/faculties':
                    DB.getFaculties(result => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result))
                    })
                    break;
                case '/api/pulpits':
                    DB.getPulpits(result => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result))
                    })
                    break;
                case '/api/subjects':
                    DB.getSubjects(result => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result))
                    })
                    break;
                case '/api/auditoriumstypes':
                    DB.getAuditoriumsTypes(result => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result))
                    })
                    break;
                case '/api/auditorims':
                    DB.getAuditoriums(result => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result))
                    })
                    break;
                default:
                    res.writeHead(404);
                    res.end()
                    break;
            }
        }
            break;
        case 'POST':
            switch (path) {
                case '/api/faculties':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getFaculty(result => {
                            if (result.length == 0) {
                                DB.postFaculties(data_json.FACULTY, data_json.FACULTY_NAME);
                                answer();
                            } else {
                                alreadyExists();
                            }
                        }, data_json.FACULTY)
                    });
                    break;
                case '/api/pulpits':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getPulpit(result => {
                            if (result.length == 0) {
                                DB.postPulpits(data_json.PULPIT, data_json.FACULTY, data_json.PULPIT_NAME);
                                answer();
                            } else {
                                alreadyExists();
                            }
                        }, data_json.PULPIT)
                    });
                    break;
                case '/api/subjects':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getSubject(result => {
                            if (result.length == 0) {
                                DB.postSubjects(data_json.SUBJECT, data_json.PULPIT, data_json.SUBJECT_NAME);
                                answer();
                            } else {
                                alreadyExists();
                            }
                        }, data_json.SUBJECT)
                    });
                    break;
                case '/api/auditoriumstypes':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getAuditoriumsType(result => {
                            if (result.length == 0) {
                                DB.postAuditoriumsTypes(data_json.AUDITORIUM_TYPE, data_json.AUDITORIUM_TYPENAME);
                                answer();
                            } else {
                                alreadyExists();
                            }
                        }, data_json.AUDITORIUM_TYPE)
                    });
                    break;
                case '/api/auditorims':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getAuditorium(result => {
                            if (result.length == 0) {
                                DB.postAuditoriums(data_json.AUDITORIUM, data_json.AUDITORIUM_TYPE, data_json.AUDITORIUM_CAPACITY, data_json.AUDITORIUM_NAME);
                                answer();
                            } else {
                                alreadyExists();
                            }
                        }, data_json.AUDITORIUM)
                    });
                    break;
                default:
                    res.writeHead(404);
                    res.end()
                    break;
            }
            break;
        case 'PUT':
            switch (path) {
                case '/api/faculties':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getFaculty(result => {
                            if (result.length != 0) {
                                DB.putFaculties(data_json.FACULTY, data_json.FACULTY_NAME);
                                answer();
                            } else {
                                notFound();
                            }
                        }, data_json.FACULTY)
                    });
                    break;
                case '/api/pulpits':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getPulpit(result => {
                            if (result.length != 0) {
                                DB.putPulpits(data_json.PULPIT, data_json.FACULTY, data_json.PULPIT_NAME);
                                answer();
                            } else {
                                notFound();
                            }
                        }, data_json.PULPIT)
                    });
                    break;
                case '/api/subjects':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getSubject(result => {
                            if (result.length != 0) {
                                DB.putSubjects(data_json.SUBJECT, data_json.PULPIT, data_json.SUBJECT_NAME);
                                answer();
                            } else {
                                notFound();
                            }
                        }, data_json.SUBJECT)
                    });
                    break;
                case '/api/auditoriumstypes':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getAuditoriumsType(result => {
                            if (result.length != 0) {
                                DB.putAuditoriumsTypes(data_json.AUDITORIUM_TYPE, data_json.AUDITORIUM_TYPENAME);
                                answer();
                            } else {
                                notFound();
                            }
                        }, data_json.AUDITORIUM_TYPE)
                    });
                    break;
                case '/api/auditoriums':
                    req.on('data', chunk => {
                        data_json += chunk;
                    });
                    req.on('end', () => {
                        data_json = JSON.parse(data_json);
                        DB.getAuditorium(result => {
                            if (result.length != 0) {
                                DB.putAuditoriums(data_json.AUDITORIUM, data_json.AUDITORIUM_TYPE, data_json.AUDITORIUM_CAPACITY, data_json.AUDITORIUM_NAME);
                                answer();
                            } else {
                                notFound();
                            }
                        }, data_json.AUDITORIUM)
                    });
                    break;
                default:
                    res.writeHead(404);
                    res.end()
                    break;
            }
            break;
        case 'DELETE':
            let field = decodeURI(path.split('/')[3]);
            switch (path.split('/')[2]) {
                case 'faculties':
                    DB.getFaculty(result => {
                        if (result.length != 0) {
                            DB.deleteFaculties(field);
                            res.end(JSON.stringify(result))
                        } else {
                            notFound();
                        }
                    }, field)
                    break;
                case 'pulpits':
                    DB.getPulpit(result => {
                        if (result.length != 0) {
                            DB.deletePulpits(field);
                            res.end(JSON.stringify(result))
                        } else {
                            notFound();
                        }
                    }, field)
                    break;
                case 'subjects':
                    DB.getSubject(result => {
                        if (result.length != 0) {
                            DB.deleteSubjects(field);
                            res.end(JSON.stringify(result))
                        } else {
                            notFound();
                        }
                    }, field)
                    break;
                case 'auditoriumtypes':
                    DB.getAuditoriumsType(result => {
                        if (result.length != 0) {
                            DB.deleteAuditoriumsTypes(field);
                            res.end(JSON.stringify(result))
                        } else {
                            notFound();
                        }
                    }, field)
                    break;
                case 'auditoriums':
                    DB.getAuditorium(result => {
                        if (result.length != 0) {
                            DB.deleteAuditoriums(field);
                            res.end(JSON.stringify(result))
                        } else {
                            notFound();
                        }
                    }, field)
                    break;
                default:
                    res.writeHead(404);
                    res.end()
                    break;
            }
            break;
    }
}).listen(5000);