module.exports = function() {
  function removePeople() {}

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

  return {
    idsFromPeople: idsFromPeople,
    numbersFromPeople: numbersFromPeople
  }
}
