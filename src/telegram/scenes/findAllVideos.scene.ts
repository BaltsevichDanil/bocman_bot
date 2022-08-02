import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Scenes } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import { channelName, commands, findLimit } from '../../constants/constants'
import { sendVideos } from '../../helpers/sendVideos'
import { VideoEntity } from '../entities/video.entity'
import { TelegramService } from '../telegram.service'

import { FindAllVideosData } from './data/findAllVideosData'

@Scene(FindAllVideosData.sceneName)
export class FindAllVideosScene {
    constructor(private readonly _telegramService: TelegramService) {}

    @SceneEnter()
    async onStart(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        const skip = 0
        const videos = await this._telegramService.findAllVideos(skip)
        if (videos.length) {
            await sendVideos(ctx, videos, skip, videos.length)
        } else {
            ctx.reply(FindAllVideosData.introduction.nothingFound)
            ctx.scene.leave()
        }
    }

    @Action(/0|1|2|3|4|5|6|7|8|9/)
    async onSelect(
        @Ctx()
        ctx: Scenes.SceneContext & { update: Update.CallbackQueryUpdate },
    ): Promise<void> {
        const cbQuery = ctx.update.callback_query
        const userAnswer = 'data' in cbQuery ? cbQuery.data : null
        const parsedUserAnswer = parseInt(userAnswer as string, 10)
        // @ts-ignore
        const { videos }: { videos: VideoEntity[] } = ctx.scene.state
        if (parsedUserAnswer >= 0 && ctx.chat?.id && videos.length) {
            if (typeof videos[parsedUserAnswer] !== 'undefined') {
                await ctx.telegram.copyMessage(
                    ctx.chat.id,
                    channelName,
                    // @ts-ignore
                    videos[parsedUserAnswer].message_id,
                )
                await ctx.replyWithMarkdownV2('Как тебе?', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '❤️',
                                    callback_data: commands.favourite,
                                },
                                { text: 'Бан', callback_data: 'ban' },
                            ],
                        ],
                    },
                })
                // @ts-ignore
                ctx.scene.state.message_id = videos[parsedUserAnswer].message_id
            }
        }
    }

    @Action(commands.next)
    async onNext(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        // @ts-ignore
        const { skip }: { skip: number } = ctx.scene.state
        const videos = await this._telegramService.findAllVideos(skip)

        if (!videos.length) {
            ctx.reply('Походу все')
        } else {
            await sendVideos(ctx, videos, skip, videos.length)
        }
    }

    @Action(commands.favourite)
    async addToFavourite(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        // @ts-ignore
        const { message_id } = ctx.scene.state

        if (message_id && ctx.chat?.id) {
            await this._telegramService.addToFavourite({
                chat_owner_id: ctx.chat.id,
                message_id,
            })
        }

        await ctx.reply('Добавлено в избранное')
    }

    @Action(commands.ban)
    async addToBan(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        // @ts-ignore
        const { message_id } = ctx.scene.state

        if (message_id && ctx.chat?.id) {
            await this._telegramService.makeSuspect(ctx.chat.id, message_id)
        }

        await ctx.reply(
            'Отправлено на рассмотрение🧐\nНарушители не останутся безнаказанными🤡',
        )
    }

    @Action(commands.prev)
    async onPrev(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        // @ts-ignore
        const { skip }: { skip: number } = ctx.scene.state

        if (skip - findLimit <= 0) {
            ctx.reply('Куда еще назад то?')
        } else {
            const videos = await this._telegramService.findAllVideos(
                skip - findLimit,
            )
            if (!videos.length) {
                ctx.reply('Чего-то ты намудрил, что у меня все сломалось')
            } else {
                await sendVideos(ctx, videos, skip, -findLimit)
            }
        }
    }

    @Action(commands.cancel)
    async onCancel(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.replyWithMarkdownV2('Эээээээ', {
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
