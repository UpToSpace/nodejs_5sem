const http = require('http');
const url = require('url');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose')

const urlDB = 'mongodb+srv://Valerie:Vv1542139@cluster0.xuqgcrf.mongodb.net/test';
const client = new MongoClient(urlDB);
const dbName = 'BSTU';
const db = client.db(dbName);

http.createServer(async (req, res) => {
    await client.connect().then(console.log('Connected successfully to server')).catch(e => console.log("error connection"));

    let result;
    let path = url.parse(req.url).pathname;
    let collectionFromPath = path.split('/')[2]
    let field = decodeURI(path.split('/')[3]);
    let name;

    collectionFromPath == 'faculties' ?
        name = 'faculty' : collectionFromPath == 'pulpits' ?
            name = 'pulpit' : name = '';
    let collection;
    name != '' ? collection = db.collection(name) : null;
    let data_json = ''

    switch (req.method) {
        case "GET":
            if (field == 'undefined') {
                let query = url.parse(req.url).query
                let arr = []
                if (query == null) {
                    result = await collection.find({}).toArray()
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result))
                } else { 
                        query = decodeURI(query).split('=')[1].split(',');
                        for (let q of query) {
                            arr.push(... await collection.find({ faculty: q }).toArray())
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(arr))
                }
            } else {
                let oneDocument = null;
                if (name == 'faculty') {
                    oneDocument = await collection.findOne({ faculty: field })
                }
                if (name == 'pulpit') {
                    oneDocument = await collection.findOne({ pulpit: field })
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                oneDocument ? res.end(JSON.stringify(oneDocument)) : res.end("value doesnt exist")
            }
            break;
        case "POST":
            if (path == '/transaction') {
                req.on('data', chunk => {
                    data_json += chunk
                })
                req.on('end', async () => {
                    data_json = JSON.parse(data_json)
                    const session = client.startSession();
                    let searchResult;
                    try {
                        session.startTransaction();
                        for(let el of data_json) {
                            searchResult = await db.collection('pulpit').findOne({ pulpit: el.pulpit }, { session: session })
                            if (searchResult) {
                                throw 'element already exist'
                            }
                        }
                        db.collection('pulpit').insertMany(data_json, { session: session });
                        session.commitTransaction()
                        res.end('elements added successfully')
                    } catch (e) {
                        session.abortTransaction()
                        console.log('transaction was aborted because: ' + e)
                        res.end('transaction was aborted because: ' + e)
                    }
                })

            } else {
                req.on('data', chunk => {
                    data_json += chunk
                })
                req.on('end', async () => {
                    data_json = JSON.parse(data_json);
                    let oneDocument = null;
                    if (name == 'faculty') {
                        oneDocument = await collection.findOne({ faculty: data_json.faculty })
                    }
                    if (name == 'pulpit') {
                        oneDocument = await collection.findOne({ pulpit: data_json.pulpit })
                    }
                    if (oneDocument) {
                        res.end("value already exists")
                    } else {
                        result = await collection.insertOne(data_json)
                        res.end(JSON.stringify(data_json));
                    }
                })
            }

            break;
        case "PUT":
            req.on('data', chunk => {
                data_json += chunk
            })
            req.on('end', async () => {
                data_json = JSON.parse(data_json);
                if (name == 'faculty') {
                    result = await collection.updateOne({ faculty: data_json.faculty }, {
                        $set: {
                            faculty_name: data_json.faculty_name
                        }
                    })
                    if (result.matchedCount) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(data_json));
                    } else {
                        res.end("value doesnt exist")
                    }
                }
                if (name == 'pulpit') {
                    result = await collection.updateOne({ pulpit: data_json.pulpit }, {
                        $set: {
                            pulpit_name: data_json.pulpit_name,
                            faculty: data_json.faculty
                        }
                    })
                    if (result.matchedCount) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(data_json));
                    } else {
                        res.end("value doesnt exist")
                    }
                }
            })
            break;
        case "DELETE":
            let oneDocument;
            if (name == 'faculty') {
                oneDocument = await collection.findOne({ faculty: field })
                result = await collection.deleteOne({ faculty: field })
                if (result.deletedCount == 1) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(oneDocument));
                } else {
                    res.end("value doesnt exist")
                }
            }
            if (name == 'pulpit') {
                oneDocument = await collection.findOne({ pulpit: field })
                result = await collection.deleteOne({ pulpit: field })
                if (result.deletedCount) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(oneDocument));
                } else {
                    res.end("value doesnt exist")
                }
            }
            break;
        default:
            res.writeHead(404);
            break;
    }
}).listen(3000)



