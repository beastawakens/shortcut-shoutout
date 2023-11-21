const { App } = require('@slack/bolt');

const COMPLETED_COLUMN = process.env.COMPLETED_COLUMN || 500001810;

// Initialize your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Define a function to handle incoming webhooks
const handleWebhook = (payload) => {
  // Check if the webhook payload meets the condition
  const workflowStateId = payload.actions[0]?.changes?.workflow_state_id?.new;

  if (workflowStateId === COMPLETED_COLUMN) {
    // Extract information from the webhook payload
    const { name, app_url } = payload.actions[0];

    // Post a message to a Slack channel
    app.client.chat.postMessage({
      channel: process.env.SLACK_CHANNEL,
      text: `Story "${name}" has been completed! Check it out: ${app_url}`,
    });
  }
};

// Set up a route to listen for incoming webhooks
app.event('message', ({ event, say }) => {
  // Call the handleWebhook function with the event payload
  handleWebhook(event);
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
