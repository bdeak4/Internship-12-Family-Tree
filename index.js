// seed

const tree = [
  {
    id: 1,
    firstName: "Vito",
    lastName: "Corleone",
    gender: "M",
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
    gender: "F",
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
    gender: "M",
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
    gender: "M",
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
    gender: "M",
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
    gender: "F",
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
    gender: "F",
    birthYear: 1934,
    deathYear: null,
    motherId: null,
    fatherId: null,
    spouseId: 5,
  },
];

// helpers

function findById(id) {
  return tree.find((p) => p.id === id);
}

function formatPerson(p) {
  let lastName = p.lastName;
  const spouse = findById(p.spouseId);
  if (p.gender === "F" && spouse && spouse.gender === "M") {
    lastName = `${spouse.lastName} (${p.lastName})`;
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

  const ids = tree.filter(filter).map((p) => p.id);

  const id = choose(
    `
${prompt}
${tree.filter(filter).map(formatPerson).join("\n")}
    `,
    (v) => ids.includes(parseInt(v))
  );
  return findById(parseInt(id));
}

function pairBorn(person, year) {
  const personBorn = person.birthYear < year;
  const spouse = findById(person.spouseId);
  const spouseBorn = spouse.birthYear < year;
  return personBorn && spouseBorn;
}

function pairDead(person, year) {
  const personDead = person.deathYear !== null && person.deathYear < year;
  const spouse = findById(person.spouseId);
  const spouseDead = spouse.deathYear !== null && spouse.deathYear < year;
  return personDead || spouseDead;
}

function updatePerson(id, key, value) {
  const idx = tree.findIndex((p) => p.id === id);
  if (idx !== -1) {
    tree[idx][key] = value;
  }
}

function newId() {
  return tree.slice(0).sort((a, b) => a.id < b.id)[0].id + 1;
}

function countAncestors(person, count) {
  const spouse = findById(person.spouseId);
  if (
    person.gender === "F" &&
    person.fatherId === null &&
    spouse &&
    spouse.gender === "M"
  ) {
    person = spouse;
  }

  if (person.fatherId === null) {
    return count;
  }
  return countAncestors(findById(person.fatherId), ++count);
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
  gender = choose("Unesi spol (M/F):", (v) => v === "F" || v === "M");

  father = choosePerson(
    "Odaberi oca:",
    (p) =>
      p.gender === "M" &&
      p.spouseId !== null &&
      findById(p.spouseId).gender === "F" &&
      pairBorn(p, birthYear) &&
      !pairDead(p, birthYear),
    `Čini se da su svi kandidati za oca umrli ili se još nisu rodili :/
Hint: smanjite/povećajte godinu rođenja`
  );
  if (father === null) {
    return addBirth();
  }

  tree.push({
    id: newId(),
    firstName: firstName,
    lastName: father.lastName,
    gender: gender,
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
  gender = choose("Unesi spol (M/F):", (v) => v === "F" || v === "M");

  spouse = choosePerson(
    `Odaberi partnera/icu:`,
    (p) => p.spouseId === null && p.deathYear === null,
    "Čini se da su trenutno svi zauzeti... ili su svi umrli"
  );
  if (spouse === null) {
    return mainMenu();
  }

  const id = newId();
  tree.push({
    id: id,
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    birthYear: birthYear,
    deathYear: null,
    motherId: null,
    fatherId: null,
    spouseId: spouse.id,
  });
  updatePerson(spouse.id, "spouseId", id);

  alert("Ženidba uspješno upisana");
  return mainMenu();
}

function addDeath() {
  person = choosePerson(
    `Odaberi osobu:`,
    (p) => p.deathYear === null,
    "Čini se da su svi već umrli :/"
  );
  if (person === null) {
    return mainMenu();
  }

  deathYear = parseInt(
    choose(`Unesi godinu smrti (${person.birthYear}-2022):`, (v) =>
      valueBetween(v, person.birthYear, 2022)
    )
  );

  updatePerson(person.id, "deathYear", deathYear);

  alert("Smrt uspješno upisana");
  return mainMenu();
}

function statsMenu() {
  const i = choose(
    `
1 - Koliko razina predaka postoji od određenog člana stabla do vrhovnog pretka
2 - Ispis imena sve braće i sestara koju određeni član ima
3 - Prosječna životna dob članova obitelji za pojedini spol
4 - Tablica učestalosti imena u obitelji
5 - Ispis obiteljskog stabla
  `,
    (v) => valueBetween(v, 1, 5)
  );
  const next = [
    showNumOfAncestors,
    showSiblings,
    showAvgAgeByGender,
    showFirstNameFrequency,
    showFamilyTree,
  ];
  return next[i - 1]();
}

function showNumOfAncestors() {
  person = choosePerson(
    `Odaberi osobu:`,
    () => true,
    "Nema osoba u obiteljskom stablu"
  );
  if (person === null) {
    return mainMenu();
  }

  alert(`Broj predaka: ${countAncestors(person, 0)}`);

  return statsMenu();
}

function showSiblings() {
  alert("todo");
  return statsMenu();
}

function showAvgAgeByGender() {
  alert("todo");
  return statsMenu();
}

function showFirstNameFrequency() {
  alert("todo");
  return statsMenu();
}

function showFamilyTree() {
  alert("todo");
  return statsMenu();
}

mainMenu();
