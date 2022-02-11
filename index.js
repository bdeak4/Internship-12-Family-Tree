// seed

const tree = [
  {
    id: 1,
    firstName: "Vito",
    lastName: "Corleone",
    sex: "M",
    birthYear: 1892,
    deathYear: 1954,
    motherId: null,
    fatherId: null,
    spouseId: 2,
  },
  {
    id: 2,
    firstName: "Carmella",
    lastName: "Not-Corleone", // ???
    sex: "F",
    birthYear: 1897,
    deathYear: 1959,
    motherId: null,
    fatherId: null,
    spouseId: 1,
  },
  {
    id: 3,
    firstName: "Sonny",
    lastName: "Corleone",
    sex: "M",
    birthYear: 1916,
    deathYear: 1948,
    motherId: 2,
    fatherId: 1,
    spouseId: null,
  },
  {
    id: 4,
    firstName: "Fredo",
    lastName: "Corleone",
    sex: "M",
    birthYear: 1919,
    deathYear: 1959,
    motherId: 2,
    fatherId: 1,
    spouseId: null,
  },
  {
    id: 5,
    firstName: "Michael",
    lastName: "Corleone",
    sex: "M",
    birthYear: 1920,
    deathYear: 1997,
    motherId: 2,
    fatherId: 1,
    spouseId: 7,
  },
  {
    id: 6,
    firstName: "Connie",
    lastName: "Corleone",
    sex: "F",
    birthYear: 1927,
    deathYear: null,
    motherId: 2,
    fatherId: 1,
    spouseId: null,
  },
  {
    id: 7,
    firstName: "Kay",
    lastName: "Adams",
    sex: "F",
    birthYear: 1934,
    deathYear: null,
    motherId: null,
    fatherId: null,
    spouseId: 5,
  },
];

// helpers

function formatPerson(p) {
  let lastName = p.lastName;
  if (p.sex === "F" && p.spouseId !== null) {
    const spouseLastName = tree.find((s) => s.id === p.spouseId).lastName;
    lastName = `${spouseLastName} (${p.lastName})`;
  }
  return `${p.id} - ${p.firstName} ${lastName}`;
}

function choose(message, validate) {
  let value = prompt(message);
  if (value === "exit") throw new Error("exit");
  while (!validate(value || "")) {
    value = prompt(message + "\nPogreška. Pokušaj ponovo:");
    if (value === "exit") throw new Error("exit");
  }
  return value;
}

function valueBetween(value, min, max) {
  return parseInt(value) >= min && parseInt(value) <= max;
}

function choosePerson(prompt, filter, filterMessage) {
  if (tree.filter(filter).length === 0) {
    alert(filterMessage);
    return null;
  }

  const minId = tree.slice(0).sort((a, b) => a.id > b.id)[0].id;
  const maxId = tree.slice(0).sort((a, b) => a.id < b.id)[0].id;
  const id = choose(
    `
${prompt}
${tree.filter(filter).map(formatPerson).join("\n")}
    `,
    (v) => valueBetween(v, minId, maxId)
  );
  return tree.find((p) => p.id === parseInt(id));
}

function pairBorn(person, year) {
  const personBorn = person.birthYear < year;
  const spouse = tree.find((s) => s.id === person.spouseId);
  const spouseBorn = spouse.birthYear < year;
  return personBorn && spouseBorn;
}

function pairDead(person, year) {
  const personDead = person.deathYear !== null && person.deathYear < year;
  const spouse = tree.find((s) => s.id === person.spouseId);
  const spouseDead = spouse.deathYear !== null && spouse.deathYear < year;
  return personDead || spouseDead;
}

function updatePerson(id, key, value) {
  const idx = tree.findIndex((p) => p.id === id);
  if (idx !== -1) {
    tree[idx][key] = value;
  }
}

// screens

function mainMenu() {
  const i = choose(
    `
1 - Upis rođenja
2 - Upis ženidbe
3 - Upis smrti
4 - Statistika
exit - izlaz iz programa (radi u svim menijima)
  `,
    (v) => valueBetween(v, 1, 4)
  );
  const next = [addBirth, addMarriage, addDeath, statsMenu];
  return next[i - 1]();
}

function addBirth() {
  firstName = choose("Unesi ime:", (v) => v.length > 0);
  birthYear = parseInt(
    choose("Unesi godinu rođenja (1900-2022):", (v) =>
      valueBetween(v, 1900, 2022)
    )
  );
  sex = choose("Unesi spol (M/F):", (v) => v === "F" || v === "M");

  father = choosePerson(
    "Odaberi oca:",
    (p) =>
      p.sex === "M" &&
      p.spouseId !== null &&
      pairBorn(p, birthYear) &&
      !pairDead(p, birthYear),
    `Čini se da su svi kandidati za oca umrli ili se još nisu rodili :/
Hint: smanjite/povećajte godinu rođenja`
  );
  if (father === null) {
    return addBirth();
  }

  const maxId = tree.slice(0).sort((a, b) => a.id < b.id)[0].id;

  tree.push({
    id: maxId + 1,
    firstName: firstName,
    lastName: father.lastName,
    sex: sex,
    birthYear: birthYear,
    deathYear: null,
    motherId: father.spouseId,
    fatherId: father.id,
    spouseId: null,
  });

  alert("Rođenje uspješno upisano");
  return mainMenu();
}

function addMarriage() {
  firstName = choose("Unesi ime:", (v) => v.length > 0);
  lastName = choose("Unesi prezime:", (v) => v.length > 0);
  birthYear = parseInt(
    choose("Unesi godinu rođenja (1900-2022):", (v) =>
      valueBetween(v, 1900, 2022)
    )
  );
  sex = choose("Unesi spol (M/F):", (v) => v === "F" || v === "M");

  spouse = choosePerson(
    `Odaberi partnera/icu:`,
    (p) => p.spouseId === null && p.deathYear === null,
    "Čini se da su trenutno svi zauzeti... ili su svi umrli"
  );
  if (spouse === null) {
    return mainMenu();
  }

  const maxId = tree.slice(0).sort((a, b) => a.id < b.id)[0].id;

  tree.push({
    id: maxId + 1,
    firstName: firstName,
    lastName: lastName,
    sex: sex,
    birthYear: birthYear,
    deathYear: null,
    motherId: null,
    fatherId: null,
    spouseId: spouse.id,
  });

  updatePerson(spouse.id, "spouseId", maxId + 1);

  alert("Ženidba uspješno upisana");
  return mainMenu();
}

function addDeath() {
  alert("todo");
}

function statsMenu() {
  alert("todo");
}

mainMenu();
