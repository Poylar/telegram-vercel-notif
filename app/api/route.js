import { Telegraf, Format } from 'telegraf'
import { NextRequest, NextResponse } from 'next/server'

const bot = new Telegraf(process.env.BOT_TOKEN)

export const runtime = 'nodejs'

export async function POST(req, res) {
	try {
		const { type, payload } = await req.json()

		let formatedType = ''

		const { name, url, meta } = payload.deployment

		switch (type) {
			case 'deployment.succeeded':
				formatedType = '🚀 Deployment success'
				break
			case 'deployment.error':
				formatedType = '🚨 Deployment error'
				break
		}

		console.log(type === 'deployment.succeeded')

		const formatedMessage = `
			${formatedType}
			
			Project name: ${name}
			Url: ${url}
			
			Author: ${meta.githubCommitAuthorName}
			Commit message: ${meta.githubCommitMessage}
		`

		bot.telegram.p

		await bot.telegram.sendMessage(-1001795089761, formatedMessage)

		return NextResponse.json({ success: 'ok' })
	} catch (error) {
		console.error(error)

		return NextResponse.json({ error: error })
	}
}
