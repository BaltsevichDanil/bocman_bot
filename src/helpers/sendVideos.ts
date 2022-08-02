import { Scenes } from 'telegraf'

import { commands } from '../constants/constants'
import { VideoDto } from '../telegram/dtos/video.dto'

interface InlineKeyboardButton {
    text: string
    callback_data: string
}

export const sendVideos = async (
    ctx: Scenes.SceneContext,
    videos: VideoDto[],
    skip: number,
    add: number,
): Promise<void> => {
    let message = ''
    const buttons: InlineKeyboardButton[] = []
    videos.forEach((video, i) => {
        message += `${i + 1} – ${video.text} \n`
        buttons.push({
            text: (i + 1).toString(),
            callback_data: i.toString(),
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
