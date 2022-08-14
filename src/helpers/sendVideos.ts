import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram'
import { SceneContext } from 'telegraf/typings/scenes'

import { commands } from '../constants/constants'
import { VideoDto } from '../videos/dtos/video.dto'

export const sendVideos = async (
    ctx: SceneContext,
    videos: VideoDto[],
): Promise<void> => {
    let message = ''
    const buttons: InlineKeyboardButton[] = []
    videos.forEach((video, i) => {
        message += `${i + 1} – ${video.text} \n`
        buttons.push({
            text: (i + 1).toString(),
            callback_data: video.message_id.toString(),
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
}
