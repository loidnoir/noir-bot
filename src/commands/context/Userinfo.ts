import UserinfoCommand from '@commands/slash/utilities/information/Userinfo'
import Client from '@structures/Client'
import { AccessType, CommandCategory, CommandType } from '@structures/commands/Command'
import ContextMenuCommand from '@structures/commands/ContextMenuCommand'
import { ApplicationCommandType, ContextMenuCommandInteraction } from 'discord.js'

export default class UserinfoContext extends ContextMenuCommand {
  constructor(client: Client) {
    super(
      client,
      {
        permissions: ['SendMessages'],
        category: CommandCategory.Information,
        access: AccessType.Public,
        type: CommandType.Public,
        status: true
      },
      {
        name: 'get information',
        type: ApplicationCommandType.User,
        dmPermission: false
      }
    )
  }

  public async execute(client: Client, interaction: ContextMenuCommandInteraction<'cached'>) {
    const user = interaction.options.getMember('user')

    if (!user) return

    UserinfoCommand.getInfo(client, interaction, user, undefined, true)
  }
}