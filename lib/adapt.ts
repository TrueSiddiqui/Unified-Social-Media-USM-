import { getPlatform } from '@/lib/platforms'

export interface AdaptedDraft {
  platform: string
  content: string
  aiModified: boolean
  note?: string
}

/**
 * Adapt one piece of source content into per-platform versions using the LLM.
 *
 * Guardrails baked into the prompt (matches the product promise to the user):
 *  - The AI MUST NOT invent facts, add claims, or change the meaning/context.
 *  - It only reshapes formatting for each platform (length, line breaks,
 *    hashtag conventions) while preserving every link, number, name and fact.
 *  - When a platform needs no change, it returns the text unchanged and marks
 *    aiModified=false so the UI can be fully transparent about what AI touched.
 */
export async function adaptForPlatforms(
  source: string,
  platformIds: string[]
): Promise<AdaptedDraft[]> {
  const apiKey = process.env.ABACUSAI_API_KEY
  if (!apiKey) {
    throw new Error('AI service is not configured')
  }

  const targets = platformIds
    .map((id) => getPlatform(id))
    .filter((p): p is NonNullable<ReturnType<typeof getPlatform>> => !!p)

  if (targets.length === 0) {
    return []
  }

  const platformSpec = targets
    .map(
      (p) =>
        `- ${p.id} (${p.name}): recommended max ${p.maxChars} characters.`
    )
    .join('\n')

  const systemPrompt = [
    'You are a careful social-media formatting assistant for a unified posting tool called The Deeds Book (TDB).',
    'Your ONLY job is to reshape the user\'s single message into a version suited to each target platform.',
    'STRICT RULES:',
    '1. NEVER invent, add, exaggerate, or remove facts, claims, opinions, numbers, names, or links. Preserve the exact meaning and context.',
    '2. You may only adjust formatting: trimming to fit length limits, line breaks, and light platform-appropriate hashtag/emoji conventions ONLY if clearly implied by the original. Do not add new hashtags with new claims.',
    '3. If the original already fits a platform and needs no change, return it verbatim and set "modified" to false for that platform.',
    '4. If you must shorten to respect a length limit, keep the core message and all essential facts; set "modified" to true.',
    '5. Never fabricate. If something cannot be shortened without losing meaning, shorten as little as possible and keep meaning intact.',
    'Target platforms and their limits:',
    platformSpec,
  ].join('\n')

  const userPrompt = [
    'Here is the original message the user wrote once:',
    '"""',
    source,
    '"""',
    '',
    'Return a JSON object with this exact shape (raw JSON only, no markdown):',
    '{',
    '  "versions": [',
    '    { "platform": "<platform id>", "content": "<adapted text>", "modified": <true|false> }',
    '  ]',
    '}',
    `Include exactly one entry for each of these platform ids: ${targets
      .map((p) => p.id)
      .join(', ')}.`,
  ].join('\n')

  const res = await fetch('https://apps.abacus.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-5.4-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`AI adaptation request failed (${res.status}): ${text.slice(0, 300)}`)
  }

  const data = await res.json()
  const raw = data?.choices?.[0]?.message?.content
  if (!raw) {
    throw new Error('AI adaptation returned an empty response')
  }

  let parsed: any
  try {
    parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    throw new Error('AI adaptation returned malformed data')
  }

  const versions: any[] = Array.isArray(parsed?.versions) ? parsed.versions : []

  // Map back to our target list, guaranteeing one entry per requested platform.
  return targets.map((p) => {
    const match = versions.find((v) => v?.platform === p.id)
    const content: string =
      typeof match?.content === 'string' && match.content.trim().length > 0
        ? match.content
        : source
    const changedFromSource = content.trim() !== source.trim()
    const aiModified =
      typeof match?.modified === 'boolean' ? match.modified : changedFromSource
    return {
      platform: p.id,
      content,
      aiModified,
    }
  })
}
