import { auth } from "@/auth"

export const SettingsPage = async () => {
  const session = await auth()
  return (
    <div>{JSON.stringify(session)}</div>
  )
}
