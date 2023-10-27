import { Telegraf } from 'telegraf'
import { NextRequest, NextResponse } from 'next/server'

const bot = new Telegraf(process.env.BOT_TOKEN)

export const runtime = 'nodejs'

export async function POST(req, res) {
	try {
		const { message } = await req.json()

		// Проверяем, является ли message строкой, если нет, преобразуем его
		const messageText =
			typeof message === 'string' ? message : JSON.stringify(message)

		await bot.telegram.sendMessage(885984456, messageText)
		return NextResponse.json({ success: 'kk' })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'An error occurred' })
	}
}
