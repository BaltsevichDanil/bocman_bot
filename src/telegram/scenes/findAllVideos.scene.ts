import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Scenes } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import { channelName, commands, findLimit } from '../../constants/constants'
import { VideoEntity } from '../entities/video.entity'
import { TelegramService } from '../telegram.service'

interface InlineKeyboardButton {
    text: string
    callback_data: string
}

@Scene('find_all_videos')
export class FindAllVideosScene {
    constructor(private readonly _telegramService: TelegramService) {}

    private async _sendVideos(
        ctx: Scenes.SceneContext,
        videos: VideoEntity[],
        skip: number,
        add: number,
    ): Promise<void> {
        let message = ''
        const buttons: InlineKeyboardButton[] = []
        videos.forEach((video, i) => {
            message += `${i + 1} – ${video.text} \n`
            buttons.push({
                text: (i + 1).toString(),
                callback_data: (i + 1).toString(),
            })
        })
        await ctx.replyWithMarkdownV2(message, {
            reply_markup: {
                inline_keyboard: [
                    buttons,
                    [
                        { text: '⬅️', callback_data: 'prev' },
                        { text: '❌️', callback_data: commands.cancel },
                        { text: '➡️', callback_data: 'next' },
                    ],
                ],
            },
        })
        // @ts-ignore
        ctx.scene.state.videos = videos
        // @ts-ignore
        ctx.scene.state.skip = skip + add
    }

    @SceneEnter()
    async onStart(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        const skip = 0
        const videos = await this._telegramService.findAllVideos(skip)
        if (videos.length) {
            await this._sendVideos(ctx, videos, skip, videos.length)
        } else {
            ctx.reply(
                'Пока видосов совсем нет, если у тебя есть какие-то смешные видосы, то отправь  мне их, пожалуйста',
            )
            ctx.scene.leave()
        }
    }

    @Action(/1|2|3|4|5|6|7|8|9|10/)
    async onSelect(
        @Ctx()
        ctx: Scenes.SceneContext & { update: Update.CallbackQueryUpdate },
    ): Promise<void> {
        const cbQuery = ctx.update.callback_query
        const userAnswer = 'data' in cbQuery ? cbQuery.data : null
        const parsedUserAnswer = parseInt(userAnswer as string, 10)

        // @ts-ignore
        const { videos }: { videos: VideoEntity[] } = ctx.scene.state
        if (userAnswer && ctx.chat?.id && !videos.length) {
            if (typeof videos[parsedUserAnswer - 1] !== 'undefined') {
                await ctx.telegram.copyMessage(
                    ctx.chat.id,
                    channelName,
                    // @ts-ignore
                    videos[parsedUserAnswer - 1].message_id,
                )
                await ctx.replyWithMarkdownV2('Как тебе?', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '❤️',
                                    callback_data: 'add_to_favourite',
                                },
                                { text: 'Бан', callback_data: 'ban' },
                            ],
                        ],
                    },
                })
            }
        }
    }

    @Action('next')
    async onNext(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        // @ts-ignore
        const { skip }: { skip: number } = ctx.scene.state
        const videos = await this._telegramService.findAllVideos(skip)

        if (!videos.length) {
            ctx.reply('Походу все')
        } else {
            await this._sendVideos(ctx, videos, skip, videos.length)
        }
    }

    @Action('prev')
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
                await this._sendVideos(ctx, videos, skip, -findLimit)
            }
        }
    }

    @Action(commands.cancel)
    async onCancel(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.reply('Эээээээ')
        await ctx.scene.leave()
    }
}
