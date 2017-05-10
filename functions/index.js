var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.activityAdded = functions.database.ref('/{pet}/activities/{pushId}')
    .onWrite(event => {
        const object = event.data;
        console.log('Object', object.val())
        // console.log('Parent', object.ref.parent)
        // console.log('Data', event.params.pushId, object.val());
    });
