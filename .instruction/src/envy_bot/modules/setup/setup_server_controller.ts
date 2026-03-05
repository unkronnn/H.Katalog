import { Guild, Role, CategoryChannel, OverwriteResolvable, PermissionOverwrites } from "discord.js"
import { PermissionFlagsBits }                                          from "discord.js"

interface setup_result {
  success         : boolean
  error           : string
  channels_updated: number
  roles_created   : number
}

export async function setup_server_permissions(guild: Guild): Promise<setup_result> {
  try {
    console.log(`[ - SETUP SERVER - ] Starting setup for guild: ${guild.name}`)

    let channels_updated = 0
    let roles_created    = 0

    const everyone_role        = guild.roles.everyone
    let verified_role          = await get_or_create_role(guild, "Verified", 0x57F287)
    let booster_role           = await find_booster_role(guild)

    if (!verified_role) {
      return {
        success: false,
        error  : "Failed to create or find Verified role",
        channels_updated: 0,
        roles_created  : 0,
      }
    }

    if (verified_role.created) {
      roles_created++
      console.log(`[ - SETUP SERVER - ] Created Verified role`)
    }

    const channel_permissions = [
      {
        name           : "verify",
        everyone_perms : {
          ViewChannel            : true,
          SendMessages           : true,
          ReadMessageHistory    : true,
        },
        verified_perms : {
          ViewChannel          : true,
          SendMessages         : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "welcome",
        everyone_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "booster",
        everyone_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
        booster_perms  : {
          ViewChannel          : true,
          SendMessages         : true,
          ReadMessageHistory  : true,
          AddReactions         : true,
        },
      },
      {
        name           : "terms",
        everyone_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "invite",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "server-tag",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "showcase",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "changelogs",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "sneek-peeks",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "pricing",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "features",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "premium",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "free",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "marketplace-rules",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "rekber",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "rekber-log",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          ReadMessageHistory  : true,
        },
      },
      {
        name           : "general",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          SendMessages         : true,
          ReadMessageHistory  : true,
          AddReactions         : true,
        },
      },
      {
        name           : "media",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          SendMessages         : true,
          ReadMessageHistory  : true,
          AddReactions         : true,
          AttachFiles          : true,
        },
      },
      {
        name           : "report-bugs",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          SendMessages         : true,
          ReadMessageHistory  : true,
          AddReactions         : true,
        },
      },
      {
        name           : "suggestions",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          SendMessages         : true,
          ReadMessageHistory  : true,
          AddReactions         : true,
        },
      },
      {
        name           : "marketplace",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel          : true,
          SendMessages         : true,
          ReadMessageHistory  : true,
          AddReactions         : true,
          CreatePublicThreads  : true,
          CreatePrivateThreads : true,
          SendMessagesInThreads : true,
          AttachFiles          : true,
        },
      },
      {
        name           : "ask-staff",
        everyone_perms : {
          ViewChannel          : false,
        },
        verified_perms : {
          ViewChannel           : true,
          SendMessages          : false,
          ReadMessageHistory   : true,
          AddReactions          : true,
          CreatePublicThreads  : false,
          CreatePrivateThreads : false,
          SendMessagesInThreads : true,
        },
      },
    ]

    for (const perm_config of channel_permissions) {
      const channel = guild.channels.cache.find(ch => ch.name === perm_config.name)

      if (!channel) {
        console.log(`[ - SETUP SERVER - ] Channel not found: ${perm_config.name}, skipping...`)
        continue
      }

      await apply_channel_permissions(
        channel,
        everyone_role,
        verified_role.role,
        booster_role,
        perm_config
      )

      channels_updated++
      console.log(`[ - SETUP SERVER - ] Updated permissions for: ${perm_config.name}`)
    }

    console.log(`[ - SETUP SERVER - ] Setup complete! Channels: ${channels_updated}, Roles: ${roles_created}`)

    return {
      success         : true,
      error           : "",
      channels_updated: channels_updated,
      roles_created   : roles_created,
    }
  } catch (error) {
    console.error("[ - SETUP SERVER - ] Error:", error)
    return {
      success: false,
      error  : (error as Error).message,
      channels_updated: 0,
      roles_created   : 0,
    }
  }
}

async function get_or_create_role(
  guild: Guild,
  name: string,
  color: number
): Promise<{ role: Role; created: boolean } | null> {
  try {
    let role = guild.roles.cache.find(r => r.name === name)

    if (!role) {
      role = await guild.roles.create({
        name       : name,
        color      : color,
        reason     : `Auto-created by /setup-server command`,
        permissions: [],
      })
      console.log(`[ - SETUP SERVER - ] Created role: ${name}`)
      return { role, created: true }
    }

    return { role, created: false }
  } catch (error) {
    console.error(`[ - SETUP SERVER - ] Failed to create role ${name}:`, error)
    return null
  }
}

async function find_booster_role(guild: Guild): Promise<Role | null> {
  const booster_role = guild.roles.cache.find(r =>
    r.name.toLowerCase().includes("booster") ||
    r.tags?.premiumSubscriberRole === true
  )

  return booster_role || null
}

async function apply_channel_permissions(
  channel: any,
  everyone_role: Role,
  verified_role: Role,
  booster_role: Role | null,
  config: any
): Promise<void> {
  const overwrites: OverwriteResolvable[] = []

  const everyone_allow = build_permission_allow(config.everyone_perms || {})
  const everyone_deny  = build_permission_deny(config.everyone_perms || {})

  overwrites.push({
    id   : everyone_role.id,
    allow: everyone_allow,
    deny : everyone_deny,
  })

  const verified_allow = build_permission_allow(config.verified_perms || {})
  const verified_deny  = build_permission_deny(config.verified_perms || {})

  overwrites.push({
    id   : verified_role.id,
    allow: verified_allow,
    deny : verified_deny,
  })

  if (booster_role && config.booster_perms) {
    const booster_allow = build_permission_allow(config.booster_perms)

    overwrites.push({
      id   : booster_role.id,
      allow: booster_allow,
      deny : BigInt(0),
    })
  }

  await channel.permissionOverwrites.set(overwrites, { reason: "Auto-setup by /setup-server command" })
}

function build_permission_allow(perms: Record<string, boolean>): bigint {
  let allow = BigInt(0)

  if (perms.ViewChannel)          allow |= PermissionFlagsBits.ViewChannel
  if (perms.SendMessages)         allow |= PermissionFlagsBits.SendMessages
  if (perms.ReadMessageHistory)   allow |= PermissionFlagsBits.ReadMessageHistory
  if (perms.AddReactions)         allow |= PermissionFlagsBits.AddReactions
  if (perms.AttachFiles)          allow |= PermissionFlagsBits.AttachFiles
  if (perms.CreatePublicThreads)  allow |= PermissionFlagsBits.CreatePublicThreads
  if (perms.CreatePrivateThreads) allow |= PermissionFlagsBits.CreatePrivateThreads
  if (perms.SendMessagesInThreads) allow |= PermissionFlagsBits.SendMessagesInThreads

  return allow
}

function build_permission_deny(perms: Record<string, boolean>): bigint {
  const all_permissions = [
    "ViewChannel",
    "SendMessages",
    "ReadMessageHistory",
    "AddReactions",
    "AttachFiles",
    "CreatePublicThreads",
    "CreatePrivateThreads",
    "SendMessagesInThreads",
  ]

  let deny = BigInt(0)

  for (const perm of all_permissions) {
    if (perms[perm] === false) {
      switch (perm) {
        case "ViewChannel":
          deny |= PermissionFlagsBits.ViewChannel
          break
        case "SendMessages":
          deny |= PermissionFlagsBits.SendMessages
          break
        case "ReadMessageHistory":
          deny |= PermissionFlagsBits.ReadMessageHistory
          break
        case "AddReactions":
          deny |= PermissionFlagsBits.AddReactions
          break
        case "AttachFiles":
          deny |= PermissionFlagsBits.AttachFiles
          break
        case "CreatePublicThreads":
          deny |= PermissionFlagsBits.CreatePublicThreads
          break
        case "CreatePrivateThreads":
          deny |= PermissionFlagsBits.CreatePrivateThreads
          break
        case "SendMessagesInThreads":
          deny |= PermissionFlagsBits.SendMessagesInThreads
          break
      }
    }
  }

  return deny
}
