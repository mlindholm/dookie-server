var config = {
  apiKey: 'AIzaSyCrgy5YdO8wPdSgCeeBN-RMcY5qVoutLm8',
  authDomain: 'dookie-1a65d.firebaseapp.com',
  databaseURL: 'https://dookie-1a65d.firebaseio.com',
  projectId: 'dookie-1a65d',
  storageBucket: 'dookie-1a65d.appspot.com',
  messagingSenderId: '790651845353'
}
firebase.initializeApp(config)

emojify.setConfig({
  ignore_emoticons: true,
  mode: 'data-uri'
})

const loginContent = document.getElementById('login')
const loggedInContent = document.getElementById('logged-in')
const language = window.navigator.userLanguage || window.navigator.language
const ref = firebase.database().ref()

if (docCookies.hasItem('petId')) {
  console.log('has cookie, logging in')
  var petId = docCookies.getItem('petId')
  checkValidPetId(petId)
} else {
  console.log('not logged in')
  showLogin()
}

function login() {
  var value = document.getElementById('inputPetId').value
  var res = encodeURIComponent(value)
  checkValidPetId(value)
}

function logout() {
  docCookies.removeItem('petId')
  showLogin()
}

function checkValidPetId(id) {
  if (id !== '') {
    ref.child('pets').child(id).once('value').then(function(snapshot) {
      var data = snapshot.val()
      if (data) {
        console.log('pet exists')
        docCookies.setItem('petId', id)
        showContent()
        fetchData()
      } else {
        console.log('pet does not exists')
        alert('The pet ID you entered doesn’t match any existing pet. Please check that you’ve entered the pet ID correctly.')
      }
    })
  }
}

function fetchData() {
  var petId = docCookies.getItem('petId')
  var activityRef = ref.child('activities')
  var petRef = ref.child('pets/' + petId)

  activityRef.orderByChild('pid').equalTo(petId).limitToLast(20).once('value').then(function(snapshot) {
    var array = []
    snapshot.forEach(function(child) {
      array.push(child.val())
    })
    sortActivitiesByDay(array.reverse())
  })

  petRef.once('value').then(function(snapshot) {
    var data = snapshot.val()
    var name = document.getElementById('name')
    var icon = document.getElementById('icon')
    name.innerText = data.name
    icon.className = (data.emoji !== '') ? 'pr2' : ''
    icon.innerHTML = emojify.replace(data.emoji)
  })
}

function sortActivitiesByDay(array) {
  var sortedArray = array.sort(function(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  var todayArray = sortedArray.filter(function(child) {
    var today = new Date()
    var childDate = new Date(child.date)
    return childDate.setHours(0,0,0,0) === today.setHours(0,0,0,0)
  })
  var yesterdayArray = sortedArray.filter(function(child) {
    var yesterday = new Date(Date.now() - 86400000)
    var childDate = new Date(child.date)
    return childDate.setHours(0,0,0,0) === yesterday.setHours(0,0,0,0)
  })
  if (todayArray.length > 0) {
    hideLoadingMessage('today')
    todayArray.forEach(function(child) {
      addActivityElement(child.date, child.type, 'today')
    })
  } else {
    showEmptyMessage('today')
  }
  if (yesterdayArray.length > 0) {
    hideLoadingMessage('yesterday')
    yesterdayArray.forEach(function(child) {
      addActivityElement(child.date, child.type, 'yesterday')
    })
  } else {
    showEmptyMessage('yesterday')
  }
}

function addActivityElement(date, type, id) {
  var container = document.getElementById(id)
  var activity = document.createElement('div')
  var date = new Date(date)
  var options = { hour12: false, hour: 'numeric', minute: 'numeric' }
  var timeString = date.toLocaleTimeString(language, options)
  var emoji = emojify.replace(type.toString().replace(/\,/g,''))
  activity.className = 'pv3 flex items-center'
  activity.innerHTML = '<div class="time w3"></div><div class="emojis"></div>'
  activity.getElementsByClassName('time')[0].innerText = timeString
  activity.getElementsByClassName('emojis')[0].innerHTML = emoji
  container.appendChild(activity)
}

function showLogin() {
  loginContent.className = 'db'
  loggedInContent.className = 'dn'
}

function showContent() {
  loginContent.className = 'dn'
  loggedInContent.className = 'db'
}

function hideLoadingMessage(id) {
  var container = document.getElementById(id)
  container.getElementsByClassName('silver')[0].className += ' dn'
}

function showEmptyMessage(id) {
  var container = document.getElementById(id)
  container.getElementsByClassName('silver')[0].innerText = 'No activities'
}
