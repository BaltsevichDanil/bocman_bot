import { Command, Ctx, Hears, Start, Update } from 'nestjs-telegraf'
import { Context, Scenes } from 'telegraf'

import { EnterSceneCommandEnum } from '../enums/enter-scene-command.enum'
import { SceneNameEnum } from '../enums/scene-name.enum'
import { UsersService } from '../users/users.service'

@Update()
export class TelegramUpdate {
    constructor(private readonly _usersService: UsersService) {}

    @Start()
    async start(@Ctx() ctx: Context): Promise<void> {
        if (ctx.from) {
            const { username, id } = ctx.from
            await this._usersService.createUser({ username, chat_id: id })
        }
        await ctx.reply(
            `Привет! Если у тебя сейчас идет важная переписка и тебе срочно понадобился смешной видос, который отбразит твои чувства в данный момент, то этот бот создан для тебя`,
        )
        await ctx.replyWithMarkdownV2(
            `Просто введи фразу, которая звучала в видосе и бот пересмотрит всю свою базу ради того, чтобы найти это видео для тебя😎`,
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
    }

    @Command(EnterSceneCommandEnum.UPLOAD)
    async uploadVideo(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter(SceneNameEnum.UPLOAD_VIDEO)
    }

    @Hears('Поиск')
    @Command(EnterSceneCommandEnum.SEARCH)
    async findVideo(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter(SceneNameEnum.FIND_VIDEO)
    }

    @Hears('Показать избранное')
    @Command(EnterSceneCommandEnum.FAVOURITE)
    async showFavourite(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter(SceneNameEnum.SHOW_FAVOURITE)
    }

    @Hears('Все видео')
    @Command(EnterSceneCommandEnum.VIDEOS)
    async findVideos(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter(SceneNameEnum.SHOW_VIDEOS)
    }

    @Command(EnterSceneCommandEnum.SUSPECTS)
    async showSuspects(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
        await ctx.scene.enter(SceneNameEnum.SHOW_SUSPECTS)
    }
}
