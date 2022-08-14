import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { SceneContext } from 'telegraf/typings/scenes'

import { channelName, findLimit } from '../../constants/constants'
import { ControlCommandEnum } from '../../enums/control-command.enum'
import { SceneNameEnum } from '../../enums/scene-name.enum'
import { FavouriteService } from '../../favourite/favourite.service'
import { sendVideos } from '../../helpers/sendVideos'
import { SuspectsService } from '../../suspects/suspects.service'
import { SelectedVideoInterface } from '../interfaces/selected-video.interface'
import { SkipVideoInterface } from '../interfaces/skip-video.interface'
import { VideosService } from '../videos.service'

@Scene(SceneNameEnum.SHOW_VIDEOS)
export class ShowVideosScene {
    constructor(
        private readonly _videosService: VideosService,
        private readonly _favouriteService: FavouriteService,
        private readonly _suspectsService: SuspectsService,
    ) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: SceneContext): Promise<void> {
        const videos = await this._videosService.findAllVideos(0)
        if (videos.length) {
            await sendVideos(ctx, videos)
            ;(ctx.scene.state as SkipVideoInterface).skip = 0
        } else {
            await ctx.reply(
                'Я чего-то не понял, а где все мои видео?\nНу ка загурузил в меня что-нибудь по бырому',
            )
            await ctx.scene.leave()
        }
    }

    @Action(ControlCommandEnum.NEXT)
    async onNext(@Ctx() ctx: SceneContext): Promise<void> {
        const { skip } = ctx.scene.state as SkipVideoInterface
        const newSkip = skip + findLimit
        const videos = await this._videosService.findAllVideos(newSkip)

        if (videos.length) {
            await sendVideos(ctx, videos)
            ;(ctx.scene.state as SkipVideoInterface).skip = newSkip
        } else {
            await ctx.reply('Походу все')
        }
    }

    @Action(ControlCommandEnum.PREV)
    async onPrev(@Ctx() ctx: SceneContext): Promise<void> {
        const { skip } = ctx.scene.state as SkipVideoInterface
        const newSkip = skip - findLimit
        if (newSkip < 0) {
            await ctx.reply('Куда еще назад то?')
        } else {
            const videos = await this._videosService.findAllVideos(newSkip)
            if (videos.length) {
                await sendVideos(ctx, videos)
                ;(ctx.scene.state as SkipVideoInterface).skip = newSkip
            }
        }
    }

    @Action(/^\d+$/)
    async onSelect(
        @Ctx() ctx: SceneContext & { update: Update.CallbackQueryUpdate },
    ): Promise<void> {
        const cbQuery = ctx.update.callback_query
        const userAnswer = 'data' in cbQuery ? cbQuery.data : null
        const parsedUserAnswer = parseInt(userAnswer as string, 10)
        const video = await this._videosService.findVideo(parsedUserAnswer)
        if (video && ctx.chat?.id) {
            ;(ctx.scene.state as SelectedVideoInterface).selectedVideo =
                video.message_id
            await ctx.telegram.copyMessage(
                ctx.chat.id,
                channelName,
                video.message_id,
            )
            await ctx.replyWithMarkdownV2('Как тебе?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '❤️',
                                callback_data: ControlCommandEnum.LIKE,
                            },
                            {
                                text: 'Бан',
                                callback_data: ControlCommandEnum.BAN,
                            },
                        ],
                    ],
                },
            })
        }
    }

    @Action(ControlCommandEnum.LIKE)
    async onLike(@Ctx() ctx: SceneContext): Promise<void> {
        const { selectedVideo } = ctx.scene.state as SelectedVideoInterface
        if (!selectedVideo) {
            await ctx.reply('Что-то как-то не так')
        } else if (selectedVideo && ctx.chat?.id) {
            try {
                await this._favouriteService.addToFavourite({
                    message_id: selectedVideo,
                    chat_owner_id: ctx.chat.id,
                })
                await ctx.reply('Добавлено в избранное')
            } catch (e) {
                await ctx.reply(e.message)
            }
        }
    }

    @Action(ControlCommandEnum.BAN)
    async onBan(@Ctx() ctx: SceneContext): Promise<void> {
        const { selectedVideo } = ctx.scene.state as SelectedVideoInterface
        if (!selectedVideo) {
            await ctx.reply('Что-то как-то не так')
        } else if (selectedVideo && ctx.chat?.id) {
            try {
                await this._suspectsService.makeSuspect({
                    message_id: selectedVideo,
                    who_complained: ctx.chat.id,
                })
                await ctx.reply(
                    'Спасибо за бдительность😎\nВидео отправлено на рассмотрение',
                )
            } catch (e) {
                await ctx.reply(e.message)
            }
        }
    }
}
