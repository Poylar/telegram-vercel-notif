import { Telegraf, Format } from 'telegraf'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { log } from 'console'

const bot = new Telegraf(process.env.BOT_TOKEN)

export const runtime = 'nodejs'

async function verifySignature(req) {
	const payload = await req.text()
	const signature = crypto
		.createHmac('sha1', process.env.VERCEL_SECRET)
		.update(payload)
		.digest('hex')

	return signature === req.headers.get('x-vercel-signature')
}

export async function POST(req, res) {
	const isVerified = await verifySignature(req)

	if (!isVerified) {
		return NextResponse.json({ error: 'Invalid signature2' })
	}

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
			default:
				formatedType = 'Unknown action'
		}

		const formatedMessage = `
			${formatedType}
			
			Project name: ${name}
			Url: ${url}
			
			Author: ${meta.githubCommitAuthorName}
			Commit message: ${meta.githubCommitMessage}
		`

		// 885984456

		await bot.telegram.sendMessage(885984456, formatedMessage)

		return NextResponse.json({ success: 'ok' })
	} catch (error) {
		console.error(error)

		return NextResponse.json({ error: error })
	}
}
