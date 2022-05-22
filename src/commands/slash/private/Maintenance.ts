import NoirCommand from '../../../libs/structures/Command'
import NoirClient from '../../../libs/structures/Client'
import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord-api-types/v10'
import { ActivityType, ChatInputCommandInteraction } from 'discord.js'
import { activity, status } from '../../../config/config'

export default class MaintenanceCommand extends NoirCommand {
	constructor(client: NoirClient) {
		super(
			client,
			{
				permissions: 'SendMessages',
				category: 'utility',
				access: 'private',
				status: true,
				type: 'private'
			},
			{
				name: 'maintenance',
				description: 'Enable premium features for user',
				type: ApplicationCommandType.ChatInput,
				options: [
					{
						name: 'status',
						description: 'Maintenance mode status',
						type: ApplicationCommandOptionType.Boolean,
						required: true
					}
				]
			}
		)
	}

	public async execute(client: NoirClient, interaction: ChatInputCommandInteraction) {
		const status = interaction.options.getBoolean('status', true)
		client.noirMaintenance = status
		this.presence(client, status)

		await client.noirReply.success({
			interaction: interaction,
			author: 'Maintenance mode',
			description: `Maintenance mode ${status ? 'enabled' : 'disabled'}`
		})
	}

	public presence(client: NoirClient, _status: boolean) {
		if (_status) {
			client.user?.setActivity({
				name: 'Maintenance mode',
				type: ActivityType.Watching
			})

			client.user?.setStatus('idle')
			return
		} else {
			client.user?.setActivity({
				name: activity,
				type: ActivityType.Listening
			})

			client.user?.setStatus(status)
			return
		}
	}
}