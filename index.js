/*

// TODO
* [ ] create adding and removing from lists
    * test with 718 # - 1843249621003

* [x] go through all the texts, not just the last one!
* [ ] be aware of people joining AND leaving in same message
* [ ] be aware of ordering of messages by date? item.created (test this)
* [ ] STOP??? OR LEAVE?
* [ ] try to delete numbers that leave
* [ ] add "since X period" to message
* [ ] figure out how to be sure we know the last time the script was run, we don't miss anyone

// BROADER
* [ ] check how long #s are saved, who has access
* [ ] subpoena-ability of #s

*/

var Swagger = SwaggerClient;
var client;

function main() {
  var creds = prompt('Enter your user ID and secret key, as: "id,key"')
  var uid = creds.split(',')[0];
  var secret = creds.split(',')[1];
  client = new CallfireClient(uid, secret);
  client.ready(function start() {

    $('.btn').removeClass('disabled');

    client.me.getAccount()
      .then(function(response) {
        console.log('account', response.obj);
      })
      .catch(function(err) {
        throw Error('err ' + err + err.data);
      });

  });
}

(function() { main(); })();

// trigger getTexts via button, re-enable when done
function getTextsBtn(el) {
  $(el).addClass('disabled');
  getTexts();
  $(el).removeClass('disabled');
}

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

function processCommands(el, callback) {
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

    addPeople(joiners);
    removePeople(leavers);    

    // report how many joined or stopped
    $(el).html(joiners.length + " joined and " + leavers.length + " left.");
  }

  getTexts(false, callback);
}

// untested
function addPeople(people, callback) {
console.log('addPeople', people)
console.log(idsFromPeople(people))
//  client.contacts.addContactListItems({ ids: idsFromPeople(people) }).then(callback);
}

// untested
function removePeople(people, callback) {
console.log('removePeople', people)
//  client.contacts.removeContactListItems({ ids: idsFromPeople(people) }).then(callback);
}

// untested
function idsFromPeople(people) {
  var keys = Object.keys(people);
  return keys.map(function eachPerson(key) {
    var person = people[key];
    return person.items[0].contact.id
  });
}