import { Command, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf'
import { NarrowedContext } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { MountMap } from 'telegraf/typings/telegram-types'

import { channelName } from '../../constants/constants'
import { ControlCommandEnum } from '../../enums/control-command.enum'
import { SceneNameEnum } from '../../enums/scene-name.enum'
import { clearText } from '../../helpers/clearText'
import { VideosService } from '../videos.service'

@Scene(SceneNameEnum.FIND_VIDEO)
export class FindVideoScene {
    constructor(private readonly _videosService: VideosService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: SceneContext): Promise<void> {
        await ctx.reply(
            'Чтобы найти какое-то видео введи ключевые слова из него',
        )
    }

    @On('text')
    async onTextInput(
        @Ctx() ctx: NarrowedContext<SceneContext, MountMap['text']>,
    ): Promise<void> {
        if (ctx.message.text === '/cancel') {
            await ctx.replyWithMarkdownV2('Выхожу-выхожу', {
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
        } else {
            const video = await this._videosService.findVideoByText(
                clearText(ctx.message.text),
            )
            if (!video) {
                await ctx.replyWithMarkdownV2('Ничего не нашлось🥲', {
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
            } else if (video && ctx.chat?.id) {
                await ctx.telegram.copyMessage(
                    ctx.chat.id,
                    channelName,
                    video.message_id,
                )
                await ctx.scene.leave()
            }
        }
    }

    @Command(ControlCommandEnum.CANCEL)
    async onCancel(@Ctx() ctx: SceneContext): Promise<void> {
        await ctx.replyWithMarkdownV2('Отмена', {
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
