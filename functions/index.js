'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.removeOldActivities = functions.database.ref('/{petId}/online').onWrite(event => {
    const parentRef = event.data.ref.parent;
    const activitiesRef = parentRef.parent.child('activities');

    return activitiesRef.once('value').then(snapshot => {
        const toBeRemoved = {};
        snapshot.forEach(function(child) {
            var now = Date.now();
            var date = Date.parse(child.val().date);
            if (now - date > 24 * 60 * 60 * 1000) {
                toBeRemoved[child.key] = null;
            }
        });
        return activitiesRef.update(toBeRemoved);
    });
});
