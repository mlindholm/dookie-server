'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.removeOldActivities = functions.database.ref('/{petId}/activities/{pushId}').onWrite(event => {
    const activitiesRef = event.data.ref.parent;
    const lastmodifiedRef = activitiesRef.parent.child('lastmodified');

    return lastmodifiedRef.once('value').then(snapshot => {
        if (Date.now() - snapshot.val() < 1 * 60 * 60 * 1000) return null;
        return activitiesRef.once('value').then(snapshot => {
            const toBeRemoved = {};
            snapshot.forEach(function(child) {
                var now = Date.now();
                var date = Date.parse(child.val().date);
                if (now - date > 24 * 60 * 60 * 1000) {
                    toBeRemoved[child.key] = null;
                }
            });
            admin.database().ref(`/${event.params.petId}/lastmodified`).set(Date.now());
            return activitiesRef.update(toBeRemoved);
        });
    });
});
