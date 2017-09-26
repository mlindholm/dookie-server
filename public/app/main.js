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

const loggedOutContent = document.getElementById('logged-out')
const loggedInContent = document.getElementById('logged-in')
const language = window.navigator.userLanguage || window.navigator.language
const params = (new URL(document.location)).searchParams
const ref = firebase.database().ref()

function init() {
  const param = params.get('petId')
  if (param) {
    checkValidPet(param)
  } else if (docCookies.hasItem('petId')) {
    showContent()
    fetchData()
  } else {
    showLogin()
  }
}

function login() {
  const value = document.getElementById('inputPetId').value
  const res = encodeURIComponent(value)
  if (isFirebasePushId(res)) {
    checkValidPet(res)
  } else {
    alert('This is not a valid pet ID. Please check that you’ve entered it correctly.')
  }
}

function logout() {
  docCookies.removeItem('petId')
  clearActivities()
  showLogin()
}

function isFirebasePushId(id) {
  if (id.match('[^-_\a-z0-9]') && id.length === 20) {
    return true
  } else {
    return false
  }
}

function checkValidPet(id) {
  ref.child('pets').child(id).once('value').then(snapshot => {
    const data = snapshot.val()
    if (data) {
      docCookies.setItem('petId', id)
      showContent()
      fetchData()
    } else {
      alert('Couldn’t find any pets matching this ID. Please check that you’ve entered it correctly.')
      logout()
    }
  })
}

function fetchData() {
  const petId = docCookies.getItem('petId')
  const activityRef = ref.child('activities')
  const petRef = ref.child('pets/' + petId)

  window.history.replaceState({}, 'Dookie', '/app/');

  activityRef.orderByChild('pid').equalTo(petId).limitToLast(20).once('value').then(snapshot => {
    var array = []
    snapshot.forEach(child => {
      array.push(child.val())
    })
    sortActivitiesByDay(array)
  })

  petRef.once('value').then(snapshot => {
    const data = snapshot.val()
    const header = document.getElementById('header')
    const replacer = (emoji, name) => {return `<div class='emoji emoji-${name} mr2' title='${emoji}'></div>`}
    const content = `${emojify.replace(data.emoji, replacer)}<h2 class='f3 mv0'>${data.name}</h2>`
    header.insertAdjacentHTML('afterbegin', content)
  })

  petRef.once('child_removed').then(() => {
    alert('It seems that your pet has been deleted. You can recreate it using the app.')
    logout()
  })
}

function sortActivitiesByDay(array) {
  const sortedArray = array.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const todayArray = sortedArray.filter(child => {
    const today = new Date()
    const childDate = new Date(child.date)
    return childDate.setHours(0,0,0,0) === today.setHours(0,0,0,0)
  })
  const yesterdayArray = sortedArray.filter(child => {
    const yesterday = new Date(Date.now() - 86400000)
    const childDate = new Date(child.date)
    return childDate.setHours(0,0,0,0) === yesterday.setHours(0,0,0,0)
  })
  todayArray.length === 0 ? showEmptyMessage('today') : hideLoadingMessage('today')
  todayArray.forEach(child => {
    addActivityElement(child.date, child.type, 'today')
  })
  yesterdayArray.length === 0 ? showEmptyMessage('yesterday') : hideLoadingMessage('yesterday')
  yesterdayArray.forEach(child => {
    addActivityElement(child.date, child.type, 'yesterday')
  })
}

function addActivityElement(date, type, id) {
  const container = document.getElementById(id + '-list')
  const options = { hour12: false, hour: 'numeric', minute: 'numeric' }
  const time = new Date(date).toLocaleTimeString(language, options)
  const emoji = emojify.replace(type.toString().replace(/\,/g,''))
  const test = `<div class='pv3 flex items-center'>
    <div class='time w3'>${time}</div>
    <div class='emojis'>${emoji}</div>
  </div>`
  container.innerHTML += test
}

function clearActivities() {
  document.getElementById('today-list').innerHTML = ''
  document.getElementById('yesterday-list').innerHTML = ''
}

function showLogin() {
  loggedOutContent.className = 'db'
  loggedInContent.className = 'dn'
}

function showContent() {
  loggedOutContent.className = 'dn'
  loggedInContent.className = 'db'
}

function hideLoadingMessage(id) {
  const container = document.getElementById(id)
  container.getElementsByClassName('spinner-container')[0].classList.add('dn')
}

function showEmptyMessage(id) {
  const container = document.getElementById(id)
  container.getElementsByClassName('spinner-container')[0].classList.remove('dn')
  container.getElementsByClassName('spinner-image')[0].classList.add('dn')
  container.getElementsByClassName('spinner-text')[0].innerText = 'No activities'
}

init()
