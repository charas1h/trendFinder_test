import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function sendDraftToDiscord(draft_post: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('DISCORD_WEBHOOK_URL is not configured in .env file');
  }
  
  if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    throw new Error(`Invalid Discord webhook URL format: ${webhookUrl}`);
  }

  try {
    const response = await axios.post(
      webhookUrl,
      {
        content: draft_post,
        flags: 4 // SUPPRESS_EMBEDS
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return `Success sending draft to Discord webhook at ${new Date().toISOString()}`;
  } catch (error) {
    console.error('Error sending draft to Discord webhook. Please check your DISCORD_WEBHOOK_URL in .env file.');
    console.error(error);
    return `Failed to send draft to Discord webhook: ${error}`;
  }
}

async function sendDraftToSlack(draft_post: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('SLACK_WEBHOOK_URL is not configured in .env file');
  }
  
  if (!webhookUrl.startsWith('https://hooks.slack.com/services/')) {
    throw new Error(`Invalid Slack webhook URL format: ${webhookUrl}`);
  }

  try {
    const response = await axios.post(
      webhookUrl,
      {
        text: draft_post,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return `Success sending draft to webhook at ${new Date().toISOString()}`;
  } catch (error) {
    console.error('Error sending draft to Slack webhook. Please check your SLACK_WEBHOOK_URL in .env file.');
    console.error(error);
    return `Failed to send draft to Slack webhook: ${error}`;
  }
}

export async function sendDraft(draft_post: string) {
  const notificationDriver = process.env.NOTIFICATION_DRIVER?.toLowerCase();

  if (!notificationDriver) {
    throw new Error('NOTIFICATION_DRIVER is not configured in .env file. Set it to "slack" or "discord"');
  }

  switch (notificationDriver) {
    case 'slack':
      return sendDraftToSlack(draft_post);
    case 'discord':
      return sendDraftToDiscord(draft_post);
    default:
      throw new Error(`Unsupported notification driver: ${notificationDriver}`);
  }
}