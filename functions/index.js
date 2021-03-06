// Copyright 2017 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// var functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);

// exports.daily_job =
//   functions.pubsub.topic('daily-tick').onPublish((event) => {
//     const activitiesRef = admin.database().ref('activities')
//     return activitiesRef.once('value').then(snapshot => {
//       var toRemove = {}
//       snapshot.forEach(child => {
//         var now = Date.now()
//         var date = Date.parse(child.val().date)
//         if (now - date > 40 * 60 * 60 * 1000) {
//          toRemove[child.key] = null
//         }
//       })
//       console.log("Daily cleanup, old activities removed: ", Object.keys(toRemove).length)
//       return activitiesRef.update(toRemove)
//     })
//   });
