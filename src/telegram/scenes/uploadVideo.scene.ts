import { Command, Ctx, Wizard, WizardStep } from 'nestjs-telegraf'
import { Scenes } from 'telegraf'

import { channelName, commands, maxTextLength } from '../../constants/constants'
import { ClearText } from '../../helpers/clearText'
import { TelegramService } from '../telegram.service'

import { UploadVideoData } from './data/uploadVideo.data'

@Wizard(UploadVideoData.sceneName)
export class UploadVideoScene {
    constructor(private readonly _telegramService: TelegramService) {}

    @WizardStep(UploadVideoData.introduction.step)
    async step1(@Ctx() ctx: Scenes.WizardContext): Promise<void> {
        await ctx.reply(UploadVideoData.introduction.reply)
        await ctx.wizard.next()
    }

    @WizardStep(UploadVideoData.sendVideo.step)
    async step2(@Ctx() ctx: Scenes.WizardContext): Promise<void> {
        // @ts-ignore
        const { text, message_id, chat } = ctx.message
        if (chat && message_id && typeof text === 'string') {
            const video = await this._telegramService.findVideo(text)
            if (video) {
                await ctx.reply(UploadVideoData.haveThisVideo.reply)
                await ctx.telegram.copyMessage(
                    chat.id,
                    channelName,
                    video.message_id,
                )
                await ctx.scene.leave()
            } else {
                if (text.length > maxTextLength) {
                    await ctx.reply(UploadVideoData.maxTextLengthError.reply)
                    ctx.wizard.selectStep(UploadVideoData.introduction.step)
                } else {
                    // @ts-ignore
                    ctx.wizard.state.text = text
                    await ctx.reply(UploadVideoData.sendVideo.reply)
                    ctx.wizard.next()
                }
            }
        }
    }

    @WizardStep(UploadVideoData.result.step)
    async step3(@Ctx() ctx: Scenes.WizardContext): Promise<void> {
        // @ts-ignore
        const { video, message_id, chat } = ctx.message
        if (chat && message_id && video) {
            const savedMessage = await ctx.telegram.copyMessage(
                channelName,
                chat.id,
                message_id,
            )
            // @ts-ignore
            const { text } = ctx.wizard.state
            const result = await this._telegramService.saveVideo({
                text: ClearText(text),
                message_id: savedMessage.message_id,
                owner_chat_id: chat.id,
            })
            await ctx.reply(UploadVideoData.result.reply)
            await ctx.telegram.copyMessage(
                chat.id,
                channelName,
                result.message_id,
                { caption: result.text },
            )
        }
        await ctx.scene.leave()
    }

    @Command(commands.cancel)
    async exit(@Ctx() ctx: Scenes.WizardContext): Promise<void> {
        await ctx.reply(UploadVideoData.cancel.reply)
        await ctx.scene.leave()
    }
}
