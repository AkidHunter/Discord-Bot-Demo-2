const {
  Client,
  MessageContextMenuCommandInteraction,
  EmbedBuilder,
  RoleSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuOptionBuilder,
  ContextMenuCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Add Role to Menu")
    .setType(ApplicationCommandType.Message),
  /**
     *
     * @param {Client} client
     * @param {MessageContextMenuCommandInteraction} interaction
     * @returns

     */
  async execute(interaction, client) {
    const { targetMessage, member, createdTimestamp, user, guild } =
      interaction;
    const targetMenu =
      targetMessage.components[0]?.components[0].type ===
      ComponentType.StringSelect
        ? new StringSelectMenuBuilder(
            targetMessage.components[0].components[0].toJSON()
          )
        : undefined;

    const selectRoleAddition = {
      content: `${member} **Select the role you would like to add to the Menu!**`,
      ephemeral: true,
      components: [
        new ActionRowBuilder().addComponents([
          new RoleSelectMenuBuilder()
            .setMinValues(0)
            .setMaxValues(1)
            .setPlaceholder("Select the new role to add to this Menu!")
            .setCustomId(`${user.id}add${createdTimestamp}`),
        ]),
      ],
    };
    let reply = [false];

    const additionHandler = async (message) =>
      await message
        .awaitMessageComponent({
          filter: (i) => i.customId == `${user.id}add${createdTimestamp}`,
          componentType: ComponentType.RoleSelect,
          time: 60000,
          max: 1,
        })
        .then(async (interaction) => {
          const newRoleOption = new StringSelectMenuOptionBuilder({
            label: interaction.roles.first().name,
            value: interaction.roles.first().id,
          });
          const brandNewRoleSelectMenu = [
            new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setMinValues(0)
                .setMaxValues(1)
                .setPlaceholder("Select your roles...")
                .setCustomId(`rolemenu${interaction.createdTimestamp}`)
                .addOptions(newRoleOption)
            ),
          ];
          if (targetMenu) {
            const findById = targetMenu.options.find(
              (opt) => opt.data.value == newRoleOption.data.value
            );
            const role = await guild.roles
              .fetch(newRoleOption.data.value)
              .catch(console.error);
            if (role.position > guild.members.me.roles.highest.position)
              return interaction
                .update({
                  embeds: [
                    new EmbedBuilder()
                      .setTimestamp()
                      .setColor("Red")
                      .setTitle("Error")
                      .setDescription(
                        `<@&${newRoleOption.data.value}> is higher than the bot's highest role!`
                      ),
                  ],
                  content: "",
                  components: [],
                  ephemeral: true,
                })
                .catch(console.error);
            if (
              newRoleOption.data.label == findById?.data?.label &&
              newRoleOption.data.value == findById?.data?.value
            )
              return interaction
                .update({
                  embeds: [
                    new EmbedBuilder()
                      .setTimestamp()
                      .setColor("Red")
                      .setTitle("Error")
                      .setDescription(
                        `<@&${newRoleOption.data.value}> is already part of this menu!`
                      ),
                  ],
                  content: "",
                  components: [],
                  ephemeral: true,
                })
                .catch(console.error);
            else if (
              newRoleOption.data.label != findById?.data?.label &&
              newRoleOption.data.value == findById?.data?.value
            )
              targetMenu.options.splice(
                targetMenu.options.findIndex(
                  (e) => e.data?.value == newRoleOption.data.value
                ),
                1
              );

            return (
              interaction
                .update({
                  embeds: [
                    new EmbedBuilder()
                      .setTimestamp()
                      .setColor("Green")
                      .setTitle("Added!")
                      .setDescription(
                        `<@&${newRoleOption.data.value}> has been added to this menu!`
                      ),
                  ],
                  content: "",
                  components: [],
                  ephemeral: true,
                })
                .catch(console.error) &&
              targetMessage
                .edit({
                  components: [
                    new ActionRowBuilder().addComponents(
                      targetMenu.addOptions(newRoleOption)
                    ),
                  ],
                })
                .catch(console.error)
            );
          } else if (reply[0] == true)
            return (
              interaction
                .update({
                  embeds: [
                    new EmbedBuilder()
                      .setTimestamp()
                      .setColor("Green")
                      .setTitle("Created!")
                      .setDescription(`Your new Role Menu has been created!`),
                  ],
                  content: "",
                  components: [],
                  ephemeral: true,
                })
                .catch(console.error) &&
              targetMessage
                .reply({ components: brandNewRoleSelectMenu })
                .catch(console.error)
            );
          else
            return (
              interaction
                .update({
                  embeds: [
                    new EmbedBuilder()
                      .setTimestamp()
                      .setColor("Green")
                      .setTitle("Created!")
                      .setDescription(`Your new Role Menu has been created!`),
                  ],
                  content: "",
                  components: [],
                  ephemeral: true,
                })
                .catch(console.error) &&
              targetMessage.channel
                .send({ components: brandNewRoleSelectMenu })
                .catch(console.error)
            );
        })
        .catch(console.error);

    if (targetMessage.author.id != client.user?.id || !targetMenu) {
      const customIds = [
        `${user.id}yes${createdTimestamp}`,
        `${user.id}reply${createdTimestamp}`,
        `${user.id}no${createdTimestamp}`,
      ];
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel("Create New")
          .setEmoji("✔️")
          .setCustomId(customIds[0]),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel("Reply New")
          .setEmoji("↩️")
          .setCustomId(customIds[1]),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel("Cancel")
          .setEmoji("✖️")
          .setCustomId(customIds[2])
      );
      await interaction
        .reply({
          content: `${member} This is not a Role Menu from <@${client.user?.id}>!\nWould you like to add one here?`,
          components: [buttons],
          ephemeral: true,
        })
        .then((interactionResponse) => {
          const collector = interactionResponse.createMessageComponentCollector(
            {
              filter: (i) => customIds.includes(i.customId),
              componentType: ComponentType.Button,
              time: 55000,
              max: 1,
            }
          );
          collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.customId.includes("no"))
              return buttonInteraction
                .update({
                  content: "",
                  embeds: [
                    new EmbedBuilder()
                      .setTimestamp()
                      .setColor("Red")
                      .setTitle("Cancelled")
                      .setDescription("No changes have been made!"),
                  ],
                  components: [
                    new ActionRowBuilder().setComponents(
                      ...buttons.components.map((button) =>
                        button?.setDisabled()
                      )
                    ),
                  ],
                })
                .catch(console.error);
            reply[0] = buttonInteraction.customId.includes("reply");
            return await buttonInteraction
              .update(selectRoleAddition)
              .then(additionHandler)
              .catch(console.error);
          });
        });
    } else {
      return await interaction
        .reply(selectRoleAddition)
        .then(additionHandler)
        .catch(console.error);
    }
  },
};
