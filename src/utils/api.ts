import { message_payload } from './components';

const __base_url = 'https://discord.com/api/v10';

/**
 * API response interface
 */
export interface api_response {
  id?    : string;
  error?: boolean;
  [key: string]: unknown;
}

/**
 * Safe JSON parse response
 * @param response Response
 * @return Promise<unknown>
 */
async function __safe_parse_response_json(response: Response): Promise<unknown> {
  const body_text = await response.text();

  if (!body_text) {
    return {};
  }

  try {
    return JSON.parse(body_text);
  } catch {
    return {
      error      : true,
      parse_error: 'invalid_json_response',
      status     : response.status,
      content_type: response.headers.get('content-type') || 'unknown',
      body_preview: body_text.slice(0, 300),
    };
  }
}

/**
 * Ensure API response object
 * @param value unknown
 * @return api_response
 */
function __as_api_response(value: unknown): api_response {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as api_response;
  }

  return {};
}

/**
 * Send components v2 to Discord API
 * @param channel_id string
 * @param token string
 * @param payload message_payload
 * @return Promise<api_response>
 */
export async function send_components_v2(
  channel_id: string,
  token      : string,
  payload    : message_payload
): Promise<api_response> {
  const response = await fetch(`${__base_url}/channels/${channel_id}/messages`, {
    method : 'POST',
    headers: {
      Authorization  : `Bot ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = __as_api_response(await __safe_parse_response_json(response));

  if (!response.ok) {
    return { error: true, ...data };
  }

  return data;
}

/**
 * Edit components v2 via Discord API
 * @param channel_id string
 * @param message_id string
 * @param token string
 * @param payload message_payload
 * @return Promise<api_response>
 */
export async function edit_components_v2(
  channel_id: string,
  message_id : string,
  token      : string,
  payload    : message_payload
): Promise<api_response> {
  const response = await fetch(`${__base_url}/channels/${channel_id}/messages/${message_id}`, {
    method : 'PATCH',
    headers: {
      Authorization  : `Bot ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = __as_api_response(await __safe_parse_response_json(response));

  if (!response.ok) {
    return { error: true, ...data };
  }

  return data;
}

/**
 * Get bot token from environment
 * @return {string} Bot token
 * @throws {Error} if DISCORD_TOKEN not found
 */
export function get_token(): string {
  const token = process.env.DISCORD_TOKEN;

  if (!token) {
    throw new Error('DISCORD_TOKEN not found in environment variables');
  }

  // Type assertion since we've validated it's not null
  return token as string;
}
