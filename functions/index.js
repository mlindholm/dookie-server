'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.removeOldActivities = functions.database.ref('/{petId}/activities/{pushId}').onWrite(event => {
    const moment = require('moment');
    const parentRef = event.data.ref.parent;
    return parentRef.once('value').then(snapshot => {
        const updates = {};
        snapshot.forEach(function(child) {
            var now = moment();
            var date = child.val().date;
            if (now.diff(date, 'days') > 0) {
                updates[child.key] = null;
            }
        });
        return parentRef.update(updates);
    });
});

// return admin.database().ref(`/${event.params.petId}/pet/merge`).once('value').then(snapshot => {
//     var allowedToMerge = snapshot.val();
//     console.log(event.params.pushId, allowedToMerge);
//     return allowedToMerge;
// });
