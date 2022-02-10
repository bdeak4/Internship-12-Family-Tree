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
  while (!validate(value)) {
    value = prompt(message + "\nPogreška. Pokušaj ponovo:");
    if (value === "exit") throw new Error("exit");
  }
  return value;
}

function valueBetween(value, min, max) {
  return parseInt(value) >= min && parseInt(value) <= max;
}

function choosePerson(prompt, filter) {
  const minId = tree.slice(0).sort((a, b) => a.id > b.id)[0].id;
  const maxId = tree.slice(0).sort((a, b) => a.id < b.id)[0].id;
  return choose(
    `
${prompt}
${tree.filter(filter).map(formatPerson).join("\n")}
    `,
    (v) => valueBetween(v, minId, maxId)
  );
}

function chooseYear(prompt, minYear, maxYear) {
  return choose(
    `
${prompt}
Odaberi godinu (${minYear}-${maxYear}):
    `,
    (v) => valueBetween(v, minYear, maxYear)
  );
}

// screens

function mainMenu() {
  choose(
    `
1 - Upis rođenja
2 - Upis ženidbe
3 - Upis smrti
4 - Statistika
exit - izlaz iz programa (radi u svim menijima)
  `,
    (v) => valueBetween(v, 1, 4)
  );
}

mainMenu();
