const bcrypt = require("bcryptjs");

const passwords = [
  "I@mABas1cCl!3nt",
  "I@mAnEmpl0y33",
  "I@mAnAdm!n1strat0r"
];

async function hashPasswords() {
  for (let pw of passwords) {
    const hash = await bcrypt.hash(pw, 10);
    console.log(`${pw} => ${hash}`);
  }
}

hashPasswords();
