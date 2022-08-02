import { Command, Ctx, Wizard, WizardStep } from 'nestjs-telegraf'
import { Scenes } from 'telegraf'

import { ChannelName, commands } from '../../constants/constants'
import { TelegramService } from '../telegram.service'

import { FindVideoData } from './data/findVideo.data'

@Wizard(FindVideoData.sceneName)
export class FindVideoScene {
    constructor(private readonly _telegramService: TelegramService) {}

    @WizardStep(FindVideoData.introduction.step)
    async step1(@Ctx() ctx: Scenes.WizardContext): Promise<void> {
        await ctx.reply(FindVideoData.introduction.reply)
        await ctx.wizard.next()
    }

    @WizardStep(FindVideoData.nothingFound.step)
    async step2(@Ctx() ctx: Scenes.WizardContext): Promise<void> {
        // @ts-ignore
        const { text, message_id } = ctx.message
        const { chat } = ctx
        if (chat?.id && message_id && typeof text === 'string') {
            const video = await this._telegramService.findVideo(text)
            if (video) {
                await ctx.telegram.copyMessage(
                    chat.id,
                    ChannelName,
                    video.message_id,
                )
            } else {
                await ctx.reply(FindVideoData.nothingFound.reply)
            }
        }
        await ctx.scene.leave()
    }

    @Command(commands.cancel)
    async exit(@Ctx() ctx: Scenes.WizardContext): Promise<void> {
        await ctx.reply(FindVideoData.cancel.reply)
        await ctx.scene.leave()
    }
}
