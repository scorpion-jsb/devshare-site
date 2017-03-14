/* eslint-disable consistent-return */
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const nodemailer = require('nodemailer')
const algoliasearch = require('algoliasearch')

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
const gmailEmail = encodeURIComponent(functions.config().gmail.email)
const gmailPassword = encodeURIComponent(functions.config().gmail.password)
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`)

// Your company name to include in the emails
const APP_NAME = 'Devshare'
const from = `${APP_NAME} <noreply@devshare.io>`

/**
 * @description Sends a welcome email to new user.
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {
  const user = event.data // The Firebase user.
  console.log('user created:', user)

  const email = user.email // The email of the user.
  const displayName = user.displayName // The display name of the user.

  const mailOptions = {
    from,
    to: email
  }
  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Welcome to ${APP_NAME}!`
  mailOptions.text = `Hey ${displayName}!, Welcome to ${APP_NAME}. I hope you will enjoy our service.`
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email)
  })
})

/**
 * @description Send an account deleted email confirmation to users who delete their accounts.
 */
exports.sendByeEmail = functions.auth.user().onDelete(event => {
  const user = event.data
  const email = user.email
  const displayName = user.displayName

  const mailOptions = {
    from,
    to: email
  }

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Bye!`
  mailOptions.text = `Hey ${displayName}!, We confirm that we have deleted your ${APP_NAME} account.`
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Account deletion confirmation email sent to:', email)
  })
})

/**
 * @description Updates the search index when user entries are created or updated
 */
exports.searchIndex = functions.database.ref('/users/{userid}').onWrite(event => {
  // Exit when the data is deleted.
  if (!event.data.exists()) {
    return
  }
  console.log('index entry:', event.data.val(), event.data.key)
  // Watch for any relevant children parameters to have changed
  // TODO: Make this work for multiple parameters in list form
  if (event.child('username').changed()) {
    const client = algoliasearch(functions.config().algolia.key, functions.config().algolia.secret)
    const index = client.initIndex('users')
    const firebaseObject = event.data.val()
    firebaseObject.objectID = event.data.key
    index.setSettings({ searchableAttributes: ['username'] })
    return index.saveObject(firebaseObject)
  }
})

/**
 * @description Starts a search query whenever a query is requested (by adding one to the `/search/queries`
 * element. Search results are then written under `/search/results`.
 * @param {String} query - String query to send to algolia
 */
exports.searchQuery = functions.database.ref('/search/queries/{queryid}').onWrite(event => {
  console.log('search:', event.data.val())
  const client = algoliasearch(functions.config().algolia.key, functions.config().algolia.secret)
  const index = client.initIndex('users')

  const query = event.data.val().query
  const key = event.data.key
  console.log('index entry:', event.data.val(), event.data.key)

  return index.search(query).then(content => {
    const updates = {
      '/last_query': event.timestamp
    }
    updates[`/search/results/${key}`] = content
    return admin.database().ref().update(updates)
  })
})
