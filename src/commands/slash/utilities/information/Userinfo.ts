import Emojis from '@constants/Emojis'
import Reply from '@helpers/Reply'
import Client from '@structures/Client'
import ChatCommand from '@structures/commands/ChatCommand'
import { AccessType, CommandCategory, CommandType } from '@structures/commands/Command'
import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, ColorResolvable, ContextMenuCommandInteraction, GuildMember, User, time, userMention } from 'discord.js'

export default class UserinfoCommand extends ChatCommand {
  constructor(client: Client) {
    super(
      client,
      {
        permissions: ['EmbedLinks'],
        category: CommandCategory.Information,
        access: AccessType.Public,
        type: CommandType.Public,
        status: true
      },
      {
        name: 'userinfo',
        description: 'Get information about the server',
        type: ApplicationCommandType.ChatInput,
        dmPermission: false,
        options: [
          {
            name: 'user',
            description: 'User to get information about',
            type: ApplicationCommandOptionType.User,
            required: false
          },
          {
            name: 'target',
            description: 'Mention user to get information for him',
            type: ApplicationCommandOptionType.User,
            required: false
          },
          {
            name: 'private',
            description: 'Send information in private message',
            type: ApplicationCommandOptionType.Boolean,
            required: false
          }
        ]
      }
    )
  }

  public async execute(client: Client, interaction: ChatInputCommandInteraction<'cached'>) {
    const member = interaction.options.getMember('user') ?? interaction.member
    const target = interaction.options.getUser('target')
    const ephemeralStatus = interaction.options.getBoolean('private') ?? false

    UserinfoCommand.getInfo(client, interaction, member, target, ephemeralStatus)
  }

  public static async getInfo(client: Client, interaction: ChatInputCommandInteraction<'cached'> | ContextMenuCommandInteraction<'cached'>, member: GuildMember, target?: User | null, ephemeralStatus?: boolean) {
    await interaction.deferReply({ ephemeral: ephemeralStatus })

    const fetchedUser = await member.user.fetch()
    const fields = []

    const description = `${Emojis.user} User: ${userMention(member.id)} \`${member.id}\`\n` +
      `${Emojis.chain} Hoist role: ${member.roles.hoist}\n` +
      `${Emojis.color} Accent color: \`${member.user.hexAccentColor ?? fetchedUser.hexAccentColor ?? member.displayHexColor ?? 'No color'}\`\n` +
      `${member.avatarURL() ? `${Emojis.image} Server avatar: [open](${member.avatarURL({ size: 4096 })})\n` : ''}` +
      `${Emojis.time} Created at: ${time(member.user.createdAt, 'd')}\n` +
      `${Emojis.time} ${member.joinedAt ? `Joined at: ${time(member.joinedAt, 'd')}\n` : ''}`

    if (member.roles.cache.size > 1) {
      fields.push({
        name: `${Emojis.role} Role${member.roles.cache.size > 2 ? 's' : ''} (${member.roles.cache.size > 1 ? member.roles.cache.size - 1 : 0})`,
        value: `${member.roles.cache.filter(role => role.id != member.guild.id).map(role => role).join(' ')}`,
        inline: false
      })
    }

    Reply.reply({
      client,
      interaction,
      content: target ? `Information for ${userMention(target.id)}` : undefined,
      ephemeral: ephemeralStatus,
      author: `${member.user.tag.replace('#0', '')}`,
      authorImage: member.displayAvatarURL({ size: 4096 }) ?? member.user.avatarURL({ size: 4096 }),
      thumbnail: member.user.avatarURL({ size: 4096 }) ?? undefined,
      image: fetchedUser.bannerURL({ size: 4096 }) ?? undefined,
      color: fetchedUser.accentColor as ColorResolvable,
      fields,
      description
    })
  }
}