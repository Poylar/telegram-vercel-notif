import { Telegraf } from 'telegraf'
import { NextRequest, NextResponse } from 'next/server'

const bot = new Telegraf(process.env.BOT_TOKEN)

export const runtime = 'nodejs'

export async function POST(req, res) {
	const { message } = await req.json()

	await bot.telegram.sendMessage(885984456, message)
	return NextResponse.json({ success: 'kk' })
	return Response.json({ success: true })
}
