exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("settings")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("settings").insert([
        {
          id: 1,
          token: "",
          prefix: "!",
          clientid: "175212409546473474",
          clientsecret: "",
        },
      ]);
    });
};
