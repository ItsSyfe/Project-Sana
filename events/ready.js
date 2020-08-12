module.exports = async (client) => {
  client.logger.info(`
    .....           .....
    ,ad8PPPP88b,     ,d88PPPP8ba,
   d8P"      "Y8b, ,d8P"      "Y8b
  dP'           "8a8"           \`Yd
  8(              "              )8
  I8                             8I
   Yb,          Sana           ,dP
    "8a,                     ,a8"
      "8a,                 ,a8"
        "Yba             adP"
          \`Y8a         a8P'
            \`88,     ,88'
              "8b   d8"
               "8b d8"
                \`888'
                  "
    `);

  await client.user.setActivity(`your music <3`, {
    type: "LISTENING",
  });
  await client.user.setStatus("dnd");
};
