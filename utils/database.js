const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let _db;

const mongoDBConnect = (callback) => {
    mongoClient.connect(
        'mongodb+srv://node_course_DB_user:node_course_DB_user@nodecourseprojectdb.sd1jx.mongodb.net/NodeCourseProjectDB?retryWrites=true&w=majority',
        { useUnifiedTopology: true }
    )
        .then(client => {
            _db = client.db();
            callback();
        })
        .catch(err => console.log(err));
}

const getDB = () => {
    if (_db) {
        return _db;
    } else {
        throw "No Database Found!";
    }
}

module.exports.mongoDBConnect = mongoDBConnect;
module.exports.getDB = getDB;