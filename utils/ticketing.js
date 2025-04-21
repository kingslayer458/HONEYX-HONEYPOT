const axios = require('axios');

async function createJiraTicket(summary, description) {
  if (!process.env.JIRA_URL || !process.env.JIRA_USER || !process.env.JIRA_TOKEN) return null;
  try {
    await axios.post(
      process.env.JIRA_URL + '/rest/api/2/issue',
      {
        fields: {
          project: { key: process.env.JIRA_PROJECT },
          summary,
          description,
          issuetype: { name: 'Task' }
        }
      },
      {
        auth: { username: process.env.JIRA_USER, password: process.env.JIRA_TOKEN },
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      }
    );
    return true;
  } catch {
    return false;
  }
}

async function createServiceNowTicket(short_description, description) {
  if (!process.env.SNOW_URL || !process.env.SNOW_USER || !process.env.SNOW_TOKEN) return null;
  try {
    await axios.post(
      process.env.SNOW_URL + '/api/now/table/incident',
      {
        short_description,
        description
      },
      {
        auth: { username: process.env.SNOW_USER, password: process.env.SNOW_TOKEN },
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      }
    );
    return true;
  } catch {
    return false;
  }
}

module.exports = { createJiraTicket, createServiceNowTicket };
