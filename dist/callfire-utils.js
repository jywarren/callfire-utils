/*

// TODO
* [ ] test removing from lists
* [ ] test joining then leaving then checking if you're enrolled

* [ ] be aware of people joining AND leaving in same message
* [ ] be aware of ordering of messages by date? item.created (test this)
* [ ] STOP??? OR LEAVE?
* [ ] try to delete numbers that leave
* [ ] add "since X period" to message
* [ ] figure out how to be sure we know the last time the script was run, we don't miss anyone
* [ ] try to switch to fetching only ids, not #s

* [x] create adding and removing from lists
* [x] login via form
* [x] go through all the texts, not just the last one!

// BROADER
* [ ] check how long #s are saved, who has access
* [ ] privacy of #s

// EXAMPLE QUERIES
client.contacts.addContactListItems({ id: 3343333003, body: { contactNumbers: [17184966293] }}).then(function(r) {console.log(r)});
client.contacts.getContactList({ id: 3343333003 })

*/

var Swagger = SwaggerClient;
var client;
var contactList = '3343333003';

function login(uid, secret, callback) {
  client = new CallfireClient(uid, secret);
  client.ready(function start() {
    client.me.getAccount()
      .then(function(response) {
        if (callback) callback();
        console.log('account', response.obj);
      })
      .catch(function(err) {
        throw Error('err ' + err + err.data);
      });
  });
}


// Functional

function getTexts(el, callback) {
  el = el || '.output';
  callback = callback || function onResponse(response) {
    console.log('got texts', response);
    var numbers = response.obj.items.map(function(item) { return [item.fromNumber, item.message]; })
    $(el).html(JSON.stringify(numbers));
  }
  console.log('getting texts');
  client.texts.findTexts({toNumber: '16178632018'}).then(callback);
}

function getLeaversAndJoiners(el, callback) {
  el = el || '.output';
  var JOIN = /join|JOIN/;
  var LEAVE = /leave|LEAVE/;

  callback = callback || function onResponse(response) {
    var people = {};
    var leavers = [];
    var joiners = [];

    // sort into collections of messages by person
    response.obj.items.forEach(function(item) {
      if (people[item.fromNumber] === undefined) {
        people[item.fromNumber] = { items: [] }
      }
      people[item.fromNumber].items.push(item);
    });
console.log('people',people);

    // update JOINers and LEAVEers
    // be aware of people joining AND leaving in same message
    Object.keys(people).forEach(function(key) {
       var person = people[key], lastJoin = 0, lastLeave = 0;
       // go through all their texts, find the last JOIN or LEAVE
       person.items.forEach(function(item) {
         if (item.message.match(JOIN) && item.created > lastJoin) lastJoin = item.created;
         else if (item.message.match(LEAVE) && item.created > lastLeave) lastLeave = item.created;
       });
       if (lastJoin >= lastLeave) joiners.push(person);
       else leavers.push(person);
    });
console.log('leavers, joiners', leavers,joiners);

// ORDER!!
    addPeopleToContactList(joiners);
    removePeopleFromContactList(leavers);    

    // report how many joined or stopped
    if ($) $(el).html(joiners.length + " joined and " + leavers.length + " left.");
  }

  getTexts(false, callback);
}

// untested
function addPeopleToContactList(people, callback) {
console.log('addPeople', people)

  client.contacts.addContactListItems({
    id: 3343333003,
    body: {
      contactNumbers: numbersFromPeople(people)
    }
  }).then(function onAddContactComplete(response) {
    callback(response);
    console.log(response);
  });
}

// untested
function removePeopleFromContactList(people, callback) {
console.log('removePeople', people)
  var numbers = numbersFromPeople(people);
  client.contacts.removeContactListItems({
    id: contactList,
    body: {
      contactNumbers: numbers
    }
  }).then(function onRemoveContactComplete(response) {
    callback(response);
    console.log(response);
  });
}

function removePeople() {
}

// untested, unused
function idsFromPeople(people) {
  var keys = Object.keys(people);
  return keys.map(function eachPerson(key) {
    var person = people[key];
    return person.items[0].contact.id
  });
}

// untested
function numbersFromPeople(people) {
  var keys = Object.keys(people);
  return keys.map(function eachPerson(key) {
    var person = people[key];
    return person.items[0].fromNumber
  });
}
