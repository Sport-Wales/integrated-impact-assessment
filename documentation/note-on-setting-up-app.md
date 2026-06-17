Instructions for setting up the prod (live) App:

For apps that require organisation-wide access to all users (i.e. all SW colleagues) Tech Solutions will need to create the application in the main tenant.

Configuration settings for the app registration:
 
- Platform: Web
- Redirect URI (this URI is the current dev SWA one, will need to be changed to the live one when ready):
https://ashy-desert-065fb6403.7.azurestaticapps.net/.auth/login/aad/callback
- API permissions: Microsoft Graph → User.Read
- Grant admin consent
- Set Enterprise Application → User assignment required = NO

IMPORTANT NOTE: make sure ID tokens is clicked ON under Manage > Authentication 