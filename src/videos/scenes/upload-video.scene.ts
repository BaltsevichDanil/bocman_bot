import { Command, Ctx, Wizard, WizardStep } from 'nestjs-telegraf'
import { NarrowedContext, Scenes } from 'telegraf'
import { WizardContext } from 'telegraf/typings/scenes'
import { MountMap } from 'telegraf/typings/telegram-types'

import { channelName, maxTextLength } from '../../constants/constants'
import { ControlCommandEnum } from '../../enums/control-command.enum'
import { SceneNameEnum } from '../../enums/scene-name.enum'
import { keyboardRefactor } from '../../helpers/keyboard-refactor'
import { VideosService } from '../videos.service'

const steps = {
    1: 1,
    2: 2,
    3: 3,
}

@Wizard(SceneNameEnum.UPLOAD_VIDEO)
export class UploadVideoScene {
    constructor(private readonly _videosService: VideosService) {}

    @WizardStep(steps['1'])
    async onEnter(@Ctx() ctx: WizardContext): Promise<void> {
        await ctx.reply(
            'Напиши ключевые слова, по которым можно будет найти видео: \n\n Для отмены напиши /cancel',
        )
        await ctx.wizard.next()
    }

    @WizardStep(steps['2'])
    async getText(
        @Ctx() ctx: NarrowedContext<WizardContext, MountMap['text']>,
    ): Promise<void> {
        const { text, message_id, chat } = ctx.message
        if (chat && message_id) {
            const video = await this._videosService.findVideoByText(text)
            if (video) {
                await ctx.reply('Такое видео у меня уже есть')
                await ctx.telegram.copyMessage(
                    chat.id,
                    channelName,
                    video.message_id,
                )
                await ctx.scene.leave()
            } else {
                if (text.length > maxTextLength) {
                    await ctx.reply('Не больше 100 символов')
                    ctx.wizard.selectStep(steps['1'])
                } else {
                    ;(ctx.wizard.state as { text: string }).text = text
                    await ctx.reply('А теперь отправь видео:')
                    ctx.wizard.next()
                }
            }
        }
    }

    @WizardStep(steps['3'])
    async getVideo(
        @Ctx() ctx: NarrowedContext<WizardContext, MountMap['video']>,
    ): Promise<void> {
        const { video, message_id, chat } = ctx.message
        if (chat && message_id && video) {
            const savedMessage = await ctx.telegram.copyMessage(
                channelName,
                chat.id,
                message_id,
            )
            const { text } = ctx.wizard.state as { text: string }
            const result = await this._videosService.saveVideo({
                text,
                message_id: savedMessage.message_id,
                owner_chat_id: chat.id,
            })
            await ctx.replyWithMarkdownV2(
                keyboardRefactor('Вот, что получилось:'),
                {
                    reply_markup: {
                        keyboard: [
                            [
                                { text: 'Поиск' },
                                { text: 'Все видео' },
                                { text: 'Показать избранное' },
                            ],
                        ],
                        resize_keyboard: true,
                    },
                },
            )
            await ctx.telegram.copyMessage(
                chat.id,
                channelName,
                result.message_id,
                {
                    caption: result.text,
                },
            )
        }
        await ctx.scene.leave()
    }

    @Command(ControlCommandEnum.CANCEL)
    async exit(@Ctx() ctx: Scenes.WizardContext): Promise<void> {
        await ctx.replyWithMarkdownV2(keyboardRefactor('Галя, отмена'), {
            reply_markup: {
                keyboard: [
                    [
                        { text: 'Поиск' },
                        { text: 'Все видео' },
                        { text: 'Показать избранное' },
                    ],
                ],
                resize_keyboard: true,
            },
        })
        await ctx.scene.leave()
    }
}
