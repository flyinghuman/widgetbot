const Messages = {
  NO_SERVER: `Please specify a valid server!`,
  NO_CHANNEL: `Please specify a valid channel!`,

  BAD_SERVER: `WidgetBot is not in this server 😟`,
  BAD_CHANNEL: `Missing channel 🤔\nEither it doesn't exist, or hasn't been made public`,
  BAD_PERMISSIONS: `Misconfigured Discord permissions 👿\nEnsure WidgetBot (or @everyone) has sufficient permission`,

  BAD_MEMBER: `Couldn't find member with the specified ID`,

  CHANNEL_NOT_TEXT: `Specified channel is not a text channel`,

  COULDNT_FIND_CHANNEL: (channelID: string) =>
    `Couldn't find channel "${channelID}"!`
}

export default Messages
