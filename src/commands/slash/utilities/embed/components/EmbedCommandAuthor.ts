import { ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, ModalMessageModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js'
import NoirClient from '../../../../../structures/Client'
import EmbedCommand from '../EmbedCommand'
import EmbedCommandUtils from '../EmbedCommandUtils'

export default class EmbedCommandAuthor {
  public static async request(client: NoirClient, interaction: ButtonInteraction, id: string): Promise<void> {
    const messageData = client.embeds.get(id)

    const authorInput = new TextInputBuilder()
      .setCustomId(EmbedCommandUtils.generateComponentId(id, 'author', 'input'))
      .setLabel('Embed author text')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Enter embed author text')
      .setValue(messageData?.data.embed.author ?? '')
      .setRequired(true)
      .setMaxLength(2000)
      .setMinLength(1)
    const authorImageInput = new TextInputBuilder()
      .setCustomId(EmbedCommandUtils.generateComponentId(id, 'authorImage', 'input'))
      .setLabel('Embed author image')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Image URL or server, user, client')
      .setValue(messageData?.data.embed.authorImage ?? '')
      .setRequired(false)
      .setMaxLength(2000)
      .setMinLength(1)

    const actionRows = [
      new ActionRowBuilder<ModalActionRowComponentBuilder>()
        .addComponents(authorInput),
      new ActionRowBuilder<ModalActionRowComponentBuilder>()
        .addComponents(authorImageInput)
    ]

    const modal = new ModalBuilder()
      .setCustomId(EmbedCommandUtils.generateComponentId(id, 'author', 'modal'))
      .setTitle('Embed author builder')
      .addComponents(actionRows)

    await interaction.showModal(modal)
  }

  public static async response(client: NoirClient, interaction: ModalMessageModalSubmitInteraction, id: string): Promise<void> {
    const messageData = client.embeds.get(id)

    const authorInput = interaction.fields.getTextInputValue(EmbedCommandUtils.generateComponentId(id, 'author', 'input'))
    const authorImageInput = interaction.fields.getTextInputValue(EmbedCommandUtils.generateComponentId(id, 'authorImage', 'modal'))

    messageData?.setEmbedAuthor(authorInput, authorImageInput)

    await EmbedCommand.initialMessage(client, interaction, id)
  }
}