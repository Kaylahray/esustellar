"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Users, CheckCircle, Plus, Loader2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useSavingsContract } from "@/context/savingsContract"
import { fetchRecentActivity, Activity } from "@/lib/activityFeed"

export function RecentActivity() {
  const { publicKey } = useWallet()
  const { getGroupById } = useSavingsContract()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadActivities() {
      if (!publicKey) {
        setActivities([])
        return
      }
      setLoading(true)
      try {
        const data = await fetchRecentActivity(publicKey, getGroupById)
        setActivities(data)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [publicKey, getGroupById])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {publicKey ? "No recent activity found" : "Connect wallet to view activity"}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <ActivityIcon type={activity.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    {/* If the activity has a groupId, make the group name a clickable link */}
                    {activity.groupId && activity.groupName
                      ? renderDescriptionWithLink(activity)
                      : activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    {activity.txHash && (
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-stellar hover:underline font-mono"
                      >
                        {activity.txHash.slice(0, 4)}...{activity.txHash.slice(-4)}
                      </a>
                    )}
                  </div>
                </div>
                {activity.amount && (
                  <span
                    className={`text-sm font-medium shrink-0 ${
                      activity.type === "payout" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {activity.type === "payout" ? "+" : ""}
                    {activity.amount}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Renders the activity description, turning the group name into a clickable link.
 * e.g. "Contributed to Lagos Professionals" → "Contributed to [Lagos Professionals↗]"
 */
function renderDescriptionWithLink(activity: Activity) {
  const { description, groupId, groupName } = activity
  if (!groupId || !groupName) return <>{description}</>

  // Find where the group name appears in the description and wrap it
  const idx = description.indexOf(groupName)
  if (idx === -1) return <>{description}</>

  const before = description.slice(0, idx)
  const after = description.slice(idx + groupName.length)

  return (
    <>
      {before}
      <Link
        href={`/groups/${groupId}`}
        className="text-stellar hover:underline font-medium"
      >
        {groupName}
      </Link>
      {after}
    </>
  )
}

function ActivityIcon({ type }: { type: string }) {
  const icons = {
    contribution: {
      icon: ArrowUpRight,
      bg: "bg-warning/10",
      color: "text-warning",
    },
    payout: {
      icon: ArrowDownLeft,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    joined: {
      icon: Users,
      bg: "bg-stellar/10",
      color: "text-stellar",
    },
    created: {
      icon: Plus,
      bg: "bg-blue-500/10",
      color: "text-blue-500",
    },
    round_end: {
      icon: CheckCircle,
      bg: "bg-muted",
      color: "text-muted-foreground",
    },
  }

  const config = icons[type as keyof typeof icons] || icons.contribution
  const Icon = config.icon

  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${config.bg}`}>
      <Icon className={`h-4 w-4 ${config.color}`} />
    </div>
  )
}