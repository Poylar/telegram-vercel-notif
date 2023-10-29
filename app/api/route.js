import { Telegraf, Format } from 'telegraf'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { log } from 'console'

const bot = new Telegraf(process.env.BOT_TOKEN)

export async function POST(req, res) {
	const { VERCEL_SECRET } = process.env

	if (typeof VERCEL_SECRET != 'string') {
		throw new Error('No integration secret found')
	}

	const rawBody = await req.text()
	const rawBodyBuffer = Buffer.from(rawBody, 'utf-8')
	const bodySignature = sha1(rawBodyBuffer, VERCEL_SECRET)

	if (bodySignature !== req.headers.get('x-vercel-signature')) {
		return Response.json({
			code: 'invalid_signature',
			error: "signature didn't match",
		})
	}

	const json = JSON.parse(rawBodyBuffer.toString('utf-8'))

	try {
		const { type, payload } = await req.json()

		let formattedType = ''

		const { name, url, meta } = payload.deployment

		switch (type) {
			case 'deployment.succeeded':
				formattedType = '🚀 Deployment success'
				break
			case 'deployment.error':
				formattedType = '🚨 Deployment error'
				break
			default:
				formattedType = 'Unknown action'
		}

		const formatedMessage = `
			${formattedType}
			
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

function sha1(data, secret) {
	return crypto.createHmac('sha1', secret).update(data).digest('hex')
}
